/**
 * Calendário anual com os feriados do estado escolhido (e, se quiser, da capital) e os pontos facultativos federais.
 * Semana de domingo a sábado, como nos calendários brasileiros. Pronto para imprimir.
 * Primeiro render = valores padrão do build; o endereço compartilhado é lido depois da montagem (RECETTE §17.5).
 */
import { useEffect, useMemo, useState } from 'react';
import SelectField from '../ui/SelectField';
import { ResultCard, Rows, ShareRow } from '../calc/parts';
import { readParams, updateURL } from '../../lib/url-state';
import { feriados, UFS, UF_NOME, CAPITAL, fromIso, dayNum, isWeekend, PORTARIA, type UF } from '../../lib/engine/feriados';
import { diasUteis } from '../../lib/engine/emendas';
import { dLong, nomeFeriado, esferaLabel, temCapital, TAG } from '../../lib/tool-specs';
import { t } from '../../i18n/ui';
import type { Lang } from '../../lib/format';

interface Props { lang: Lang; year: number; uf?: string; methodHref?: string; idPrefix?: string }

export default function Kalender({ lang, year, uf: uf0 = 'SP', methodHref, idPrefix = 'k' }: Props) {
  const ui = t(lang), T = (pt: string, en: string) => (lang === 'pt' ? pt : en);
  const [uf, setUf] = useState<UF>(uf0 as UF);
  const [cap, setCap] = useState('nao');
  useEffect(() => {
    const u = readParams(window.location.search);
    const x = u.get('uf') as UF | null;
    if (x && UFS.includes(x)) { setUf(x); if (u.get('cap') === 'sim' && temCapital(x)) setCap('sim'); }
  }, []);
  const c = cap === 'sim' && temCapital(uf);
  useEffect(() => updateURL({ uf, cap: c ? 'sim' : 'nao' }), [uf, c]);
  const list = useMemo(() => feriados(year, { uf, capital: c, facultativos: true }), [year, uf, c]);
  const hol = useMemo(() => new Map(list.map((f) => [f.date, f])), [list]);
  const fol = list.filter((f) => f.esfera !== 'facultativo');
  const du = useMemo(() => diasUteis(year, { uf, capital: c }).reduce((a, b) => a + b, 0), [year, uf, c]);
  const wk = fol.filter((f) => !isWeekend(fromIso(f.date))).length;
  const wdHead = Array.from({ length: 7 }, (_, i) => new Date(Date.UTC(2027, 1, 7 + i)).toLocaleDateString(TAG(lang), { weekday: 'narrow', timeZone: 'UTC' }));
  const months = Array.from({ length: 12 }, (_, m) => {
    const first = dayNum(year, m + 1, 1), last = dayNum(year, m + 2, 1) - 1;
    const lead = new Date(first * 864e5).getUTCDay();
    const cells: Array<number | null> = [...Array(lead).fill(null)];
    for (let d = first; d <= last; d++) cells.push(d);
    while (cells.length % 7) cells.push(null);
    const weeks: Array<Array<number | null>> = []; for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
    return { name: new Date(first * 864e5).toLocaleDateString(TAG(lang), { month: 'long', timeZone: 'UTC' }), weeks };
  });
  const iso = (d: number) => new Date(d * 864e5).toISOString().slice(0, 10);
  const capOpts = temCapital(uf)
    ? [{ value: 'nao', label: T('Só nacionais e estaduais', 'National and state only') }, { value: 'sim', label: T(`Com os municipais de ${CAPITAL[uf]}`, `Including ${CAPITAL[uf]} city holidays`) }]
    : [{ value: 'nao', label: T(`Só nacionais e estaduais (lei municipal de ${CAPITAL[uf]} não conferida)`, `National and state only (${CAPITAL[uf]} municipal law not verified)`) }];
  return (
    <div className="rounded-xl border border-navy-200 bg-white p-4 sm:p-5">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,23rem)]">
        <form className="grid content-start grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
          <SelectField id={`${idPrefix}-uf`} label={T('Estado', 'State')} value={uf} onChange={(v) => { setUf(v as UF); setCap('nao'); }} options={[...UFS].sort((a, b) => UF_NOME[a].localeCompare(UF_NOME[b], 'pt-BR')).map((x) => ({ value: x, label: `${UF_NOME[x]} (${x})` }))} />
          <SelectField id={`${idPrefix}-cap`} label={T('Feriados da capital', 'State capital holidays')} value={c ? 'sim' : 'nao'} onChange={setCap} options={capOpts} />
        </form>
        <ResultCard label={T(`Calendário ${year}, ${c ? CAPITAL[uf] : UF_NOME[uf]}`, `Calendar ${year}, ${c ? CAPITAL[uf] : UF_NOME[uf]}`)} value={T(`${fol.length} feriados`, `${fol.length} holidays`)} sub={T(`${du} dias úteis de segunda a sexta`, `${du} working days, Monday to Friday`)}>
          <Rows rows={[[T('Feriados em dia útil', 'Holidays on weekdays'), String(wk)], [T('Pontos facultativos federais', 'Federal optional days off'), PORTARIA(year)?.publicada ? String(list.length - fol.length) : T('portaria não publicada', 'ordinance not published')]]} />
          <ShareRow methodHref={methodHref} labels={ui} />
        </ResultCard>
      </div>
      <div className="kal-grid mt-6">
        {months.map((mo) => (
          <table key={mo.name}>
            <caption className="mb-1 text-left text-sm font-semibold capitalize text-navy-900">{mo.name} {year}</caption>
            <thead><tr>{wdHead.map((h, i) => <th key={i} scope="col" className="font-medium text-navy-700">{h}</th>)}</tr></thead>
            <tbody>{mo.weeks.map((w, i) => (
              <tr key={i}>
                {w.map((d, j) => {
                  if (d === null) return <td key={j} />;
                  const f = hol.get(iso(d));
                  const cls = f ? (f.esfera === 'facultativo' ? 'tf' : 'ft') : j === 0 || j === 6 ? 'we' : '';
                  return <td key={j} className={cls} title={f ? f.nome[lang] : undefined}>{new Date(d * 864e5).getUTCDate()}</td>;
                })}
              </tr>
            ))}</tbody>
          </table>
        ))}
      </div>
      <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-navy-700"><span><span className="mr-1 inline-block h-3 w-3 rounded bg-accent-100 align-middle" aria-hidden="true" />{T('feriado', 'public holiday')}</span><span><span className="mr-1 inline-block h-3 w-3 rounded bg-navy-100 align-middle" aria-hidden="true" />{T('ponto facultativo federal', 'federal optional day off')}</span></p>
      <ul className="mt-4 grid gap-x-6 gap-y-1 text-sm text-navy-800 sm:grid-cols-2">
        {list.map((f) => <li key={f.id + f.date}><span className="tabular-nums">{dLong(f.date, lang)}</span> · {nomeFeriado(f, lang)} <span className="text-navy-600">({esferaLabel(f, lang)})</span></li>)}
      </ul>
    </div>
  );
}
