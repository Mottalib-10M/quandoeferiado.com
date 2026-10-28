/**
 * Contagem regressiva ao vivo (dias, horas, minutos, segundos) até a meia-noite de uma data, no fuso do visitante.
 * Primeiro render = dia do build (__BUILD_DAY__) e meia-noite de Brasília, iguais no servidor e no navegador (RECETTE §17.5);
 * o relógio do aparelho assume depois da montagem. Nada é enviado: o cálculo é feito no navegador.
 */
import { useEffect, useState } from 'react';
import { t } from '../../i18n/ui';
import type { Lang } from '../../lib/format';

interface Props { at: string; date: string; label: string; dateText: string; lang: Lang }
const part = (ms: number) => { const s = Math.max(0, Math.floor(ms / 1000)); return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 }; };

export default function Countdown({ at, date, label, dateText, lang }: Props) {
  const ui = t(lang);
  const [target, setTarget] = useState<number>(() => Date.parse(at));
  const [now, setNow] = useState<number>(() => Date.parse(`${__BUILD_DAY__}T03:00:00Z`));
  const [tz, setTz] = useState('');
  useEffect(() => {
    const [y, m, d] = date.split('-').map(Number);
    setTarget(new Date(y, m - 1, d).getTime());
    setNow(Date.now());
    try { setTz(Intl.DateTimeFormat().resolvedOptions().timeZone); } catch { /* sem fuso */ }
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [date]);
  const left = target - now, p = part(left);
  const nf = new Intl.NumberFormat(lang === 'pt' ? 'pt-BR' : 'en-GB');
  const cell = (v: number, u: string) => <span className="inline-flex items-baseline gap-1"><span className="tabular-nums text-2xl font-bold text-navy-900">{nf.format(v)}</span><span className="text-sm text-navy-600">{u}</span></span>;
  return (
    <div data-chrome className="rounded-lg border border-accent-200 bg-accent-50 px-4 py-3">
      <p className="text-sm font-medium text-navy-700">{ui.countdownTo} {label}, {dateText}</p>
      {left > 0
        ? <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1" aria-live="off">{cell(p.d, ui.days)}{cell(p.h, ui.hours)}{cell(p.m, ui.minutes)}{cell(p.s, ui.seconds)}</p>
        : <p className="mt-1 text-sm text-navy-800">{ui.passed}</p>}
      {tz && <p className="mt-1 text-xs text-navy-600">{ui.tzNote} {tz}.</p>}
    </div>
  );
}
