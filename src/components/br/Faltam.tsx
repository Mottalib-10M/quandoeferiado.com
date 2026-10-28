/**
 * Quantos dias faltam: Natal, Ano-Novo, Carnaval, Páscoa, Dia das Mães, Dia dos Pais ou o próximo feriado nacional.
 * Conta a partir de hoje (data do aparelho), com dias, semanas e dias úteis no estado escolhido. Contagem ao vivo até
 * a meia-noite no fuso do visitante. Primeiro render = dia do build (RECETTE §17.5).
 */
import { useEffect, useMemo, useState } from 'react';
import SelectField from '../ui/SelectField';
import { ResultCard, Rows, ShareRow } from '../calc/parts';
import Countdown from './Countdown';
import { readParams, updateURL } from '../../lib/url-state';
import { pascoa, carnavalTerca, proximos, fromIso, toIso, UFS, UF_NOME, type UF } from '../../lib/engine/feriados';
import { uteisEntre } from '../../lib/engine/emendas';
import { dLong, dName, diaDasMaes, diaDosPais } from '../../lib/tool-specs';
import { brasiliaInstant } from '../../lib/zeit';
import { t } from '../../i18n/ui';
import type { Lang } from '../../lib/format';

interface Props { lang: Lang; evento?: string; methodHref?: string; idPrefix?: string }
const hojeLocal = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
export const EVENTOS: Record<string, { pt: string; en: string; data: (y: number) => string }> = {
  natal: { pt: 'Natal', en: 'Christmas', data: (y) => `${y}-12-25` },
  'ano-novo': { pt: 'Ano-Novo', en: "New Year's Day", data: (y) => `${y}-01-01` },
  carnaval: { pt: 'Carnaval (terça-feira)', en: 'Carnival Tuesday', data: carnavalTerca },
  pascoa: { pt: 'Páscoa', en: 'Easter', data: pascoa },
  maes: { pt: 'Dia das Mães', en: "Mother's Day", data: diaDasMaes },
  pais: { pt: 'Dia dos Pais', en: "Father's Day", data: diaDosPais },
};
/** A próxima ocorrência (hoje incluído) de um evento. */
export const proxima = (ev: string, hoje: string) => { const y = Number(hoje.slice(0, 4)); for (const z of [y, y + 1, y + 2]) { const d = EVENTOS[ev].data(z); if (d >= hoje) return d; } return EVENTOS[ev].data(y + 1); };

export default function Faltam({ lang, evento = 'natal', methodHref, idPrefix = 'fa' }: Props) {
  const ui = t(lang), T = (pt: string, en: string) => (lang === 'pt' ? pt : en);
  const [ev, setEv] = useState(evento);
  const [uf, setUf] = useState<UF>('SP');
  const [hoje, setHoje] = useState<string>(__BUILD_DAY__);
  useEffect(() => {
    setHoje(hojeLocal());
    const u = readParams(window.location.search);
    const e = u.get('evento'); if (e && EVENTOS[e]) setEv(e);
    const x = u.get('uf') as UF | null; if (x && UFS.includes(x)) setUf(x);
  }, []);
  useEffect(() => updateURL({ evento: ev, uf }), [ev, uf]);
  const alvo = useMemo(() => proxima(ev, hoje), [ev, hoje]);
  const dias = fromIso(alvo) - fromIso(hoje);
  const uteis = dias > 0 ? uteisEntre(toIso(fromIso(hoje) + 1), toIso(fromIso(alvo) - 1), { uf }) : 0;
  const fer = proximos(toIso(fromIso(hoje) + 1), { uf }, 40).filter((f) => f.date < alvo).length;
  const nome = EVENTOS[ev][lang];
  return (
    <div className="rounded-xl border border-navy-200 bg-white p-4 sm:p-5">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,23rem)]">
        <form className="grid content-start grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
          <SelectField id={`${idPrefix}-ev`} label={T('Data', 'Date')} value={ev} onChange={setEv} options={Object.entries(EVENTOS).map(([k, x]) => ({ value: k, label: x[lang] }))} />
          <SelectField id={`${idPrefix}-uf`} label={T('Estado (para os dias úteis)', 'State (for working days)')} value={uf} onChange={(v) => setUf(v as UF)} options={[...UFS].sort((a, b) => UF_NOME[a].localeCompare(UF_NOME[b], 'pt-BR')).map((x) => ({ value: x, label: `${UF_NOME[x]} (${x})` }))} />
          <div className="sm:col-span-2"><Countdown at={brasiliaInstant(alvo)} date={alvo} label={nome} dateText={dLong(alvo, lang)} lang={lang} /></div>
        </form>
        <ResultCard label={T(`Quantos dias faltam para ${nome}`, `Days until ${nome}`)} value={dias === 0 ? T('É hoje', 'Today') : T(`${dias} ${dias === 1 ? 'dia' : 'dias'}`, `${dias} ${dias === 1 ? 'day' : 'days'}`)} sub={`${dName(alvo, lang)}, ${dLong(alvo, lang)}`}>
          <Rows rows={[
            [T('Semanas e dias', 'Weeks and days'), T(`${Math.floor(dias / 7)} semanas e ${dias % 7} dias`, `${Math.floor(dias / 7)} weeks and ${dias % 7} days`)],
            [T(`Dias úteis no meio (${uf})`, `Working days in between (${uf})`), String(uteis)],
            [T(`Feriados no meio (${uf})`, `Holidays in between (${uf})`), String(fer)],
            [T('Contando a partir de', 'Counting from'), dLong(hoje, lang)],
          ]} />
          <ShareRow methodHref={methodHref} labels={ui} />
        </ResultCard>
      </div>
    </div>
  );
}
