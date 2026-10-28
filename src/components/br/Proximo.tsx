/**
 * Próximo feriado: a partir de hoje (data do aparelho), o próximo feriado do estado escolhido, quantos dias faltam,
 * se forma feriado prolongado, se amanhã é feriado e os feriados desta semana. Primeiro render = dia do build
 * (__BUILD_DAY__), igual no servidor e no navegador; depois da montagem vale a data do aparelho (RECETTE §17.5).
 */
import { useEffect, useMemo, useState } from 'react';
import SelectField from '../ui/SelectField';
import { ResultCard, Rows, ShareRow } from '../calc/parts';
import { readParams, updateURL } from '../../lib/url-state';
import { proximos, prolongado, folgas, UFS, UF_NOME, CAPITAL, fromIso, toIso, weekday, type UF, type Feriado } from '../../lib/engine/feriados';
import { dLong, dShort, dName, nomeFeriado, esferaLabel, temCapital } from '../../lib/tool-specs';
import { t } from '../../i18n/ui';
import type { Lang } from '../../lib/format';

interface Props { lang: Lang; uf?: string; methodHref?: string; idPrefix?: string }
const hojeLocal = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };

export function tipoProlongado(f: Feriado, lang: Lang): string {
  const T = (pt: string, en: string) => (lang === 'pt' ? pt : en);
  const p = prolongado(f.date);
  if (p.tipo === 'prolongado') return T(`feriado prolongado de 3 dias (${dShort(p.de, lang)} a ${dShort(p.ate, lang)})`, `3-day long weekend (${dShort(p.de, lang)} to ${dShort(p.ate, lang)})`);
  if (p.tipo === 'emenda') return T(`emenda na ${dName(p.emenda!, lang)}: 4 dias (${dShort(p.de, lang)} a ${dShort(p.ate, lang)})`, `bridge on ${dName(p.emenda!, lang)}: 4 days (${dShort(p.de, lang)} to ${dShort(p.ate, lang)})`);
  if (p.tipo === 'meio-semana') return T('no meio da semana', 'midweek');
  return T('cai no fim de semana', 'falls on a weekend');
}

export default function Proximo({ lang, uf: uf0 = 'SP', methodHref, idPrefix = 'px' }: Props) {
  const ui = t(lang), T = (pt: string, en: string) => (lang === 'pt' ? pt : en);
  const [uf, setUf] = useState<UF>(uf0 as UF);
  const [cap, setCap] = useState('nao');
  const [hoje, setHoje] = useState<string>(__BUILD_DAY__);
  useEffect(() => {
    setHoje(hojeLocal());
    const u = readParams(window.location.search);
    const x = u.get('uf') as UF | null;
    if (x && UFS.includes(x)) { setUf(x); if (u.get('cap') === 'sim' && temCapital(x)) setCap('sim'); }
  }, []);
  const c = cap === 'sim' && temCapital(uf);
  useEffect(() => updateURL({ uf, cap: c ? 'sim' : 'nao' }), [uf, c]);
  const loc = { uf, capital: c };
  const prox = useMemo(() => proximos(hoje, loc, 8), [hoje, uf, c]);
  const f = prox[0];
  const faltam = f ? fromIso(f.date) - fromIso(hoje) : 0;
  const amanha = toIso(fromIso(hoje) + 1);
  const y = Number(hoje.slice(0, 4));
  const ano = folgas(y, loc);
  const isHol = (d: string) => ano.find((x) => x.date === d) ?? folgas(y + 1, loc).find((x) => x.date === d);
  const dom = fromIso(hoje) - weekday(fromIso(hoje));
  const semana = [...ano, ...folgas(y + 1, loc)].filter((x) => fromIso(x.date) >= dom && fromIso(x.date) <= dom + 6);
  const restam = ano.filter((x) => x.date >= hoje).length;
  const lugar = c ? CAPITAL[uf] : UF_NOME[uf];
  const capOpts = temCapital(uf)
    ? [{ value: 'nao', label: T('Só nacionais e estaduais', 'National and state only') }, { value: 'sim', label: T(`Com os municipais de ${CAPITAL[uf]}`, `Including ${CAPITAL[uf]} city holidays`) }]
    : [{ value: 'nao', label: T(`Só nacionais e estaduais (lei municipal de ${CAPITAL[uf]} não conferida)`, `National and state only (${CAPITAL[uf]} municipal law not verified)`) }];
  const hojeF = isHol(hoje);
  const amanhaF = isHol(amanha);
  return (
    <div className="rounded-xl border border-navy-200 bg-white p-4 sm:p-5">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,23rem)]">
        <form className="grid content-start grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
          <SelectField id={`${idPrefix}-uf`} label={T('Estado', 'State')} value={uf} onChange={(v) => { setUf(v as UF); setCap('nao'); }} options={[...UFS].sort((a, b) => UF_NOME[a].localeCompare(UF_NOME[b], 'pt-BR')).map((x) => ({ value: x, label: `${UF_NOME[x]} (${x})` }))} />
          <SelectField id={`${idPrefix}-cap`} label={T('Feriados da capital', 'State capital holidays')} value={c ? 'sim' : 'nao'} onChange={setCap} options={capOpts} />
          <p className="text-sm text-navy-700 sm:col-span-2">{T('Hoje', 'Today')}: <strong>{dLong(hoje, lang)}</strong>{hojeF ? T(` · hoje é feriado: ${hojeF.nome.pt}`, ` · today is a holiday: ${hojeF.nome.en}`) : ''}</p>
        </form>
        {f ? (
          <ResultCard label={T(`Próximo feriado em ${lugar}`, `Next holiday in ${lugar}`)} value={nomeFeriado(f, lang)} sub={T(`${dName(f.date, lang)}, ${dLong(f.date, lang)} · ${faltam === 0 ? 'é hoje' : faltam === 1 ? 'falta 1 dia' : `faltam ${faltam} dias`}`, `${dName(f.date, lang)}, ${dLong(f.date, lang)} · ${faltam === 0 ? 'today' : faltam === 1 ? '1 day to go' : `${faltam} days to go`}`)}>
            <Rows rows={[
              [T('Amanhã é feriado?', 'Is tomorrow a holiday?'), amanhaF ? T(`sim: ${amanhaF.nome.pt}`, `yes: ${amanhaF.nome.en}`) : T('não', 'no')],
              [T('Feriados nesta semana', 'Holidays this week'), semana.length ? semana.map((x) => `${dShort(x.date, lang)}`).join(', ') : T('nenhum', 'none')],
              [T('Prolongado?', 'Long weekend?'), tipoProlongado(f, lang)],
              [T(`Feriados até o fim de ${y}`, `Holidays left in ${y}`), String(restam)],
            ]} />
            <ShareRow methodHref={methodHref} labels={ui} />
          </ResultCard>
        ) : null}
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <caption className="mb-2 text-left text-sm text-navy-700">{T(`Os próximos ${prox.length} feriados em ${lugar}`, `The next ${prox.length} holidays in ${lugar}`)}</caption>
          <thead><tr>{[T('Data', 'Date'), T('Feriado', 'Holiday'), T('Tipo', 'Type'), T('Faltam', 'Days to go'), T('Prolongado?', 'Long weekend?')].map((h, i) => <th key={h} scope="col" className={`border-b border-navy-300 px-2 py-1.5 font-semibold text-navy-900 ${i === 3 ? 'text-right' : 'text-left'}`}>{h}</th>)}</tr></thead>
          <tbody>{prox.map((x) => (
            <tr key={x.id + x.date}>
              <td className="tabular-nums border-b border-navy-100 px-2 py-1.5 text-navy-800">{dShort(x.date, lang)} {x.date.slice(0, 4)}</td>
              <td className="border-b border-navy-100 px-2 py-1.5 text-navy-800">{nomeFeriado(x, lang)}</td>
              <td className="border-b border-navy-100 px-2 py-1.5 text-navy-800">{esferaLabel(x, lang)}</td>
              <td className="tabular-nums border-b border-navy-100 px-2 py-1.5 text-right text-navy-800">{fromIso(x.date) - fromIso(hoje)}</td>
              <td className="border-b border-navy-100 px-2 py-1.5 text-navy-800">{tipoProlongado(x, lang)}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
