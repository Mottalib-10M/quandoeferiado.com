/**
 * As ferramentas do site. Cada número e cada data vêm do motor (engine/feriados.ts, engine/emendas.ts); nada é digitado.
 * Uma spec lista seus campos (visíveis primeiro, `adv` recolhidos) e uma função `run`, que devolve o cartão de resultado.
 * Próximo feriado, contagem regressiva e calendário anual são componentes próprios (components/br).
 */
import type { ToolSpec, V, ToolOut, Opt } from './tool-types';
import { resolve } from './tool-types';
import { formatNumber, formatDecimal, type Lang } from './format';
import {
  feriados, folgas, pascoa, nthWeekday, fromIso, toIso, weekday, isWeekend, UFS, UF_NOME, CAPITAL, ESTADUAIS, MUNICIPAIS, BLOCO_CAPITAL,
  PORTARIA, FACULTATIVOS, carnavalTerca, corpusChristi, dataDaRegra, type UF, type Local, type Feriado, type Esfera,
} from './engine/feriados';
import { otimiza, pontes, diasUteis, segASex } from './engine/emendas';
import P from '../data/params-2026.json';

export type Args = Record<string, number | string>;
const T = (l: Lang, pt: string, en: string) => (l === 'pt' ? pt : en);
const n = (v: V, k: string) => Number(v[k]) || 0;
const s = (v: V, k: string) => String(v[k] ?? '');
const num = (x: number, l: Lang) => formatNumber(x, 0, l);
export const TAG = (l: Lang) => (l === 'pt' ? 'pt-BR' : 'en-GB');
const fmt = (iso: string, l: Lang, o: Intl.DateTimeFormatOptions) => new Date(`${iso}T12:00:00Z`).toLocaleDateString(TAG(l), { ...o, timeZone: 'UTC' });
/** « 9 de fevereiro de 2027 » / « 9 February 2027 » */
export const dLong = (iso: string, l: Lang) => fmt(iso, l, { day: 'numeric', month: 'long', year: 'numeric' });
/** « terça-feira, 9 de fevereiro de 2027 » */
export const dWeek = (iso: string, l: Lang) => fmt(iso, l, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
/** « ter., 9 de fevereiro » / « Tue 9 February » */
export const dShort = (iso: string, l: Lang) => fmt(iso, l, { weekday: 'short', day: 'numeric', month: 'long' });
/** « terça-feira » / « Tuesday » */
export const dName = (iso: string, l: Lang) => fmt(iso, l, { weekday: 'long' });
const span = (a: string, b: string, l: Lang) => (a === b ? dShort(a, l) : `${dShort(a, l)} – ${dShort(b, l)}`);
const dias = (x: number, l: Lang) => `${num(x, l)} ${x === 1 ? T(l, 'dia', 'day') : T(l, 'dias', 'days')}`;
const off = (iso: string, d: number) => toIso(fromIso(iso) + d);
const yearRange = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

/* ------------------------------------------------------------------ rótulos */
export const ESFERA: Record<Esfera, { pt: string; en: string }> = {
  nacional: { pt: 'nacional', en: 'national' },
  religioso: { pt: 'nacional (Sexta-feira da Paixão)', en: 'national (Good Friday)' },
  estadual: { pt: 'estadual', en: 'state' },
  municipal: { pt: 'municipal (capital)', en: 'municipal (state capital)' },
  facultativo: { pt: 'ponto facultativo federal', en: 'federal optional day off' },
};
export const esferaLabel = (f: Feriado, l: Lang) => ESFERA[f.esfera][l] + (f.meio === 'manha' ? T(l, ', até as 14 h', ', until 2 pm') : f.meio === 'tarde' ? T(l, ', após as 13 h', ', from 1 pm') : '');
/** Nome do feriado, com a data da lei quando a comemoração foi adiada (Acre). */
export const nomeFeriado = (f: Feriado, l: Lang) => f.nome[l] + (f.original ? T(l, ` (data da lei: ${dShort(f.original, l)})`, ` (statutory date: ${dShort(f.original, l)})`) : '');

/* ------------------------------------------------------------------ campos */
export const ANOS = (P as unknown as { anos: number[] }).anos;
const ufOpts = (): Opt[] => [...UFS].sort((a, b) => UF_NOME[a].localeCompare(UF_NOME[b], 'pt-BR')).map((u) => ({ value: u, label: `${UF_NOME[u]} (${u})` }));
const anoOpts = (ys: number[]): Opt[] => ys.map((y) => ({ value: String(y), label: String(y) }));
const fUF = (l: Lang, def: string) => ({ kind: 'select' as const, id: 'uf', label: T(l, 'Estado', 'State'), def, options: ufOpts() });
const fAno = (l: Lang, def: number, ys = ANOS) => ({ kind: 'select' as const, id: 'ano', label: T(l, 'Ano', 'Year'), def: String(def), options: anoOpts(ys) });
export const temCapital = (uf: UF) => MUNICIPAIS(uf).length > 0;
const capOpts = (l: Lang) => (v: V): Opt[] => {
  const uf = s(v, 'uf') as UF;
  return temCapital(uf)
    ? [{ value: 'nao', label: T(l, 'Só nacionais e estaduais', 'National and state only') }, { value: 'sim', label: T(l, `Com os municipais de ${CAPITAL[uf]}`, `Including ${CAPITAL[uf]} city holidays`) }]
    : [{ value: 'nao', label: T(l, `Só nacionais e estaduais (lei municipal de ${CAPITAL[uf]} não conferida)`, `National and state only (${CAPITAL[uf]} municipal law not verified)`) }];
};
const fCap = (l: Lang, def = 'nao', adv = false) => ({ kind: 'select' as const, id: 'cap', label: T(l, 'Feriados da capital', 'State capital holidays'), def, options: capOpts(l), adv, help: T(l, 'Feriado municipal vale só na cidade.', 'A municipal holiday applies in that city only.') });
const fCarn = (l: Lang) => ({ kind: 'choice' as const, id: 'carn', label: T(l, 'Segunda e terça de Carnaval', 'Carnival Monday and Tuesday'), def: 'trabalho', adv: true, options: [{ value: 'trabalho', label: T(l, 'Dias de trabalho', 'Working days') }, { value: 'folga', label: T(l, 'Folga', 'Days off') }] });
const loc = (v: V): Local => ({ uf: s(v, 'uf') as UF, capital: s(v, 'cap') === 'sim' });
const lugar = (v: V, l: Lang) => { const L = loc(v); return L.capital ? `${CAPITAL[L.uf]} (${L.uf})` : UF_NOME[L.uf]; };
const fname = (id: string, list: Feriado[], l: Lang) => (id === 'carnaval' ? T(l, 'Carnaval', 'Carnival') : list.find((f) => f.id === id)?.nome[l] ?? id);

/* ------------------------------------------------------------------ emendas (feriados prolongados) */
function emSpec(l: Lang, a: Args = {}): ToolSpec {
  return {
    inputs: [fUF(l, String(a.uf ?? 'SP')), fAno(l, Number(a.ano ?? 2027)), { id: 'folga', label: T(l, 'Dias de folga que você quer usar', 'Days off you want to spend'), def: Number(a.folga ?? 10), unit: T(l, 'dias', 'days'), max: 60 }, fCap(l, String(a.cap ?? 'nao')), fCarn(l)],
    run: (v) => {
      const L = loc(v), y = n(v, 'ano'), o = { carnaval: s(v, 'carn') === 'folga' };
      const p = otimiza(y, L, Math.round(n(v, 'folga')), o);
      const all = pontes(y, L, o);
      const lista = [...folgas(y - 1, L), ...folgas(y, L), ...folgas(y + 1, L)];
      const fator = p.folga ? p.livre / p.folga : 0;
      return {
        label: T(l, `${lugar(v, l)} ${y}: com ${dias(p.folga, l)} de folga`, `${lugar(v, l)} ${y}: spending ${dias(p.folga, l)} off`),
        value: T(l, `${num(p.livre, l)} dias livres`, `${num(p.livre, l)} days off`),
        sub: p.folga ? T(l, `Cada dia de folga rende ${formatDecimal(fator, 1, l)} dias livres seguidos.`, `Each day off buys ${formatDecimal(fator, 1, l)} consecutive free days.`) : T(l, 'Informe pelo menos um dia de folga.', 'Enter at least one day off.'),
        rows: p.blocos.slice(0, 6).map((b) => [span(b.livreDe, b.livreAte, l), T(l, `${num(b.folga, l)} → ${num(b.livre, l)} dias`, `${num(b.folga, l)} → ${num(b.livre, l)} days`), b.livre] as [string, string, number]),
        table: p.blocos.length ? {
          caption: T(l, `Seu plano para ${y}: folgas e dias livres`, `Your plan for ${y}: days off and free days`),
          headers: [T(l, 'Pedir folga', 'Take off'), T(l, 'Dias de folga', 'Days off used'), T(l, 'Livre seguido', 'Free in a row'), T(l, 'Dias livres', 'Free days'), T(l, 'Graças a', 'Thanks to')],
          rows: p.blocos.map((b) => [span(b.folgaDe, b.folgaAte, l), num(b.folga, l), span(b.livreDe, b.livreAte, l), num(b.livre, l), b.feriados.map((id) => fname(id, lista, l)).join(', ')]),
          align: ['l', 'r', 'l', 'r', 'l'],
        } : undefined,
        tables: all.length ? [{
          caption: T(l, `Todas as emendas de ${y} em ${lugar(v, l)}, da melhor para a pior`, `Every bridge in ${lugar(v, l)} in ${y}, best first`),
          headers: [T(l, 'Pedir folga', 'Take off'), T(l, 'Dias de folga', 'Days off used'), T(l, 'Livre seguido', 'Free in a row'), T(l, 'Dias livres', 'Free days'), T(l, 'Feriado', 'Holiday')],
          rows: all.map((b) => [span(b.folgaDe, b.folgaAte, l), num(b.folga, l), span(b.livreDe, b.livreAte, l), num(b.livre, l), b.feriados.map((id) => fname(id, lista, l)).join(', ')]),
          align: ['l', 'r', 'l', 'r', 'l'],
        }] : undefined,
        note: p.resto > 0 ? T(l, `${dias(p.resto, l)} não aumentam mais nenhuma emenda: ficam livres para as férias.`, `${dias(p.resto, l)} no longer extend any bridge: keep them for a holiday.`) : undefined,
      };
    },
  };
}

/* ------------------------------------------------------------------ feriados de um lugar num ano */
function ftSpec(l: Lang, a: Args = {}): ToolSpec {
  return {
    inputs: [fUF(l, String(a.uf ?? 'SP')), fAno(l, Number(a.ano ?? 2027)), fCap(l, String(a.cap ?? 'nao')), { kind: 'choice', id: 'fac', label: T(l, 'Pontos facultativos federais', 'Federal optional days off'), def: String(a.fac ?? 'nao'), adv: true, options: [{ value: 'nao', label: T(l, 'Ocultar', 'Hide') }, { value: 'sim', label: T(l, 'Mostrar', 'Show') }] }],
    run: (v) => {
      const L = loc(v), y = n(v, 'ano');
      const list = feriados(y, { ...L, facultativos: s(v, 'fac') === 'sim' });
      const fol = list.filter((f) => f.esfera !== 'facultativo');
      const wk = fol.filter((f) => !isWeekend(fromIso(f.date)));
      const em = pontes(y, L, {}, 1).length;
      const du = diasUteis(y, L).reduce((x, z) => x + z, 0);
      const port = PORTARIA(y);
      return {
        label: T(l, `Feriados de ${y} em ${lugar(v, l)}`, `Public holidays ${y} in ${lugar(v, l)}`),
        value: T(l, `${num(fol.length, l)} feriados`, `${num(fol.length, l)} holidays`),
        sub: T(l, `${num(wk.length, l)} caem de segunda a sexta.`, `${num(wk.length, l)} fall on a weekday.`),
        rows: [
          [T(l, 'Feriados em dia útil', 'Holidays on weekdays'), num(wk.length, l)],
          [T(l, 'Feriados no fim de semana', 'Holidays at weekends'), num(fol.length - wk.length, l)],
          [T(l, 'Emendas de um dia só', 'One-day bridges'), num(em, l)],
          [T(l, 'Dias úteis (segunda a sexta)', 'Working days (Mon–Fri)'), num(du, l)],
        ],
        table: {
          caption: T(l, `Feriados de ${y} em ${lugar(v, l)}`, `Holidays ${y} in ${lugar(v, l)}`),
          headers: [T(l, 'Data', 'Date'), T(l, 'Dia da semana', 'Weekday'), T(l, 'Feriado', 'Holiday'), T(l, 'Tipo', 'Type')],
          rows: list.map((f) => [dLong(f.date, l), dName(f.date, l), nomeFeriado(f, l), esferaLabel(f, l)]),
          align: ['l', 'l', 'l', 'l'],
        },
        note: s(v, 'fac') === 'sim' && !port?.publicada ? T(l, `A portaria de pontos facultativos de ${y} ainda não foi publicada.`, `The ${y} optional-days-off ordinance has not been published yet.`) : undefined,
      };
    },
  };
}

/* ------------------------------------------------------------------ dias úteis */
export const MESES = (l: Lang) => Array.from({ length: 12 }, (_, i) => new Date(Date.UTC(2027, i, 15)).toLocaleDateString(TAG(l), { month: 'long', timeZone: 'UTC' }));
function duSpec(l: Lang, a: Args = {}): ToolSpec {
  return {
    inputs: [fUF(l, String(a.uf ?? 'SP')), fAno(l, Number(a.ano ?? 2027)), { kind: 'choice', id: 'sab', label: T(l, 'Sábado conta como dia útil?', 'Does Saturday count?'), def: 'nao', options: [{ value: 'nao', label: T(l, 'Não', 'No') }, { value: 'sim', label: T(l, 'Sim', 'Yes') }] }, fCap(l, String(a.cap ?? 'nao'), true), fCarn(l)],
    run: (v) => {
      const L = loc(v), y = n(v, 'ano'), sab = s(v, 'sab') === 'sim', carn = s(v, 'carn') === 'folga';
      const m = diasUteis(y, L, { sabado: sab, carnaval: carn }), sum = m.reduce((x, z) => x + z, 0);
      const bruto = segASex(y);
      const fer = folgas(y, L).filter((f) => !isWeekend(fromIso(f.date))).length;
      return {
        label: T(l, `Dias úteis de ${y} em ${lugar(v, l)}`, `Working days ${y} in ${lugar(v, l)}`),
        value: num(sum, l),
        sub: sab ? T(l, 'Segunda a sábado, sem domingos nem feriados.', 'Monday to Saturday, Sundays and holidays excluded.') : T(l, 'Segunda a sexta, sem feriados.', 'Monday to Friday, holidays excluded.'),
        rows: [
          [T(l, 'Segundas a sextas no ano', 'Mondays to Fridays in the year'), num(bruto, l)],
          [T(l, 'Feriados de segunda a sexta', 'Holidays on weekdays'), num(fer, l)],
          [T(l, '1º semestre', 'First half'), num(m.slice(0, 6).reduce((x, z) => x + z, 0), l)],
          [T(l, '2º semestre', 'Second half'), num(m.slice(6).reduce((x, z) => x + z, 0), l)],
        ],
        table: { caption: T(l, `Dias úteis por mês, ${y}`, `Working days per month, ${y}`), headers: [T(l, 'Mês', 'Month'), T(l, 'Dias úteis', 'Working days')], rows: MESES(l).map((mn, i) => [mn, num(m[i], l)]), align: ['l', 'r'] },
        note: carn ? T(l, 'Segunda e terça de Carnaval contadas como folga.', 'Carnival Monday and Tuesday counted as days off.') : T(l, 'Carnaval contado como dia útil: no setor privado, é dia de trabalho salvo lei local, acordo ou convenção.', 'Carnival counted as working days: in the private sector it is a working day unless a local law or agreement says otherwise.'),
      };
    },
  };
}

/* ------------------------------------------------------------------ feriados de um mês */
function mesSpec(l: Lang, a: Args = {}): ToolSpec {
  return {
    inputs: [fUF(l, String(a.uf ?? 'SP')), fAno(l, Number(a.ano ?? 2026)), { kind: 'select', id: 'mes', label: T(l, 'Mês', 'Month'), def: String(a.mes ?? 11), options: MESES(l).map((mn, i) => ({ value: String(i + 1), label: mn })) }, fCap(l, String(a.cap ?? 'nao'), true)],
    run: (v) => {
      const L = loc(v), y = n(v, 'ano'), m = n(v, 'mes');
      const pre = `${y}-${String(m).padStart(2, '0')}`;
      const list = feriados(y, { ...L, facultativos: true }).filter((f) => f.date.startsWith(pre));
      const fol = list.filter((f) => f.esfera !== 'facultativo');
      const mn = MESES(l)[m - 1];
      const du = diasUteis(y, L)[m - 1];
      const longos = fol.filter((f) => [1, 5].includes(weekday(fromIso(f.date)))).length;
      const emendas = fol.filter((f) => [2, 4].includes(weekday(fromIso(f.date)))).length;
      return {
        label: T(l, `Feriados de ${mn} de ${y} em ${lugar(v, l)}`, `Holidays in ${mn} ${y} in ${lugar(v, l)}`),
        value: fol.length ? T(l, `${num(fol.length, l)} ${fol.length === 1 ? 'feriado' : 'feriados'}`, `${num(fol.length, l)} ${fol.length === 1 ? 'holiday' : 'holidays'}`) : T(l, 'Nenhum feriado', 'No holidays'),
        sub: T(l, `${num(du, l)} dias úteis no mês.`, `${num(du, l)} working days in the month.`),
        rows: [
          [T(l, 'Feriados prolongados (segunda ou sexta)', 'Long weekends (Monday or Friday)'), num(longos, l)],
          [T(l, 'Feriados com emenda (terça ou quinta)', 'Holidays with a bridge (Tuesday or Thursday)'), num(emendas, l)],
          [T(l, 'Pontos facultativos federais', 'Federal optional days off'), PORTARIA(y)?.publicada ? num(list.length - fol.length, l) : T(l, 'portaria não publicada', 'ordinance not published')],
        ],
        table: list.length ? { caption: T(l, `${mn} de ${y}: feriados e pontos facultativos`, `${mn} ${y}: holidays and optional days off`), headers: [T(l, 'Data', 'Date'), T(l, 'Dia da semana', 'Weekday'), T(l, 'Feriado', 'Holiday'), T(l, 'Tipo', 'Type')], rows: list.map((f) => [dLong(f.date, l), dName(f.date, l), nomeFeriado(f, l), esferaLabel(f, l)]), align: ['l', 'l', 'l', 'l'] } : undefined,
      };
    },
  };
}

/* ------------------------------------------------------------------ pontos facultativos */
function pfSpec(l: Lang, a: Args = {}): ToolSpec {
  return {
    inputs: [fAno(l, Number(a.ano ?? 2027))],
    run: (v) => {
      const y = n(v, 'ano'), p = PORTARIA(y);
      if (p?.publicada) {
        const list = FACULTATIVOS.filter((d) => !d.anos || d.anos.includes(y)).map((d) => ({ d, date: dataDaRegra(d.regra, y)! })).filter((x) => x.date).sort((a2, b) => a2.date.localeCompare(b.date));
        return {
          label: T(l, `Pontos facultativos federais de ${y}`, `Federal optional days off in ${y}`),
          value: T(l, `${num(list.length, l)} pontos facultativos`, `${num(list.length, l)} optional days`),
          sub: p.numero ?? '',
          rows: [
            [T(l, 'Dias inteiros', 'Full days'), num(list.filter((x) => !x.d.meio).length, l)],
            [T(l, 'Meio expediente', 'Half days'), num(list.filter((x) => !!x.d.meio).length, l)],
            [T(l, 'Valem para', 'Apply to'), T(l, 'órgãos federais', 'federal bodies')],
          ],
          table: { caption: T(l, `Pontos facultativos de ${y} (portaria do Ministério da Gestão)`, `Optional days off in ${y} (Ministry of Management ordinance)`), headers: [T(l, 'Data', 'Date'), T(l, 'Dia da semana', 'Weekday'), T(l, 'Ponto facultativo', 'Optional day off')], rows: list.map((x) => [dLong(x.date, l), dName(x.date, l), x.d.nome[l]]), align: ['l', 'l', 'l'] },
        };
      }
      const t = carnavalTerca(y), cc = corpusChristi(y);
      return {
        label: T(l, `Pontos facultativos federais de ${y}`, `Federal optional days off in ${y}`),
        value: T(l, 'Portaria não publicada', 'Ordinance not published'),
        sub: T(l, `Conferido em ${dLong(p?.verificado_em ?? '2026-10-28', l)}. A portaria costuma sair no fim de dezembro do ano anterior.`, `Checked on ${dLong(p?.verificado_em ?? '2026-10-28', l)}. The ordinance usually comes out at the end of December of the year before.`),
        rows: [
          [T(l, 'Carnaval (calculado)', 'Carnival (computed)'), `${dShort(off(t, -1), l)} – ${dShort(t, l)}`],
          [T(l, 'Quarta-feira de Cinzas (calculada)', 'Ash Wednesday (computed)'), dShort(off(t, 1), l)],
          [T(l, 'Corpus Christi (calculado)', 'Corpus Christi (computed)'), dShort(cc, l)],
        ],
        note: T(l, 'Datas móveis calculadas pela Páscoa; se serão ponto facultativo, só a portaria dirá.', 'Movable dates computed from Easter; only the ordinance will say whether they are optional days off.'),
      };
    },
  };
}

/* ------------------------------------------------------------------ Páscoa */
export function gaussPassos(x: number) {
  const K = Math.floor(x / 100), M = 15 + Math.floor((3 * K + 3) / 4) - Math.floor((8 * K + 13) / 25), S = 2 - Math.floor((3 * K + 3) / 4);
  const A = x % 19, D = (19 * A + M) % 30, R = Math.floor((D + Math.floor(A / 11)) / 29), OG = 21 + D - R;
  const SZ = 7 - ((x + Math.floor(x / 4) + S) % 7), OE = 7 - ((((OG - SZ) % 7) + 7) % 7);
  return { K, M, S, A, D, R, OG, SZ, OE, OS: OG + OE };
}
function pcSpec(l: Lang, a: Args = {}): ToolSpec {
  return {
    inputs: [fAno(l, Number(a.ano ?? 2027), yearRange(2000, 2060))],
    run: (v) => {
      const y = n(v, 'ano'), ps = pascoa(y), g = gaussPassos(y);
      return {
        label: T(l, `Domingo de Páscoa de ${y}`, `Easter Sunday ${y}`),
        value: dLong(ps, l),
        sub: T(l, `Sexta-feira da Paixão, feriado em todo o país: ${dLong(off(ps, -2), l)}.`, `Good Friday, a holiday across Brazil: ${dLong(off(ps, -2), l)}.`),
        rows: [
          [T(l, 'Carnaval (terça-feira)', 'Carnival Tuesday'), dShort(off(ps, -47), l)],
          [T(l, 'Quarta-feira de Cinzas', 'Ash Wednesday'), dShort(off(ps, -46), l)],
          [T(l, 'Sexta-feira da Paixão', 'Good Friday'), dShort(off(ps, -2), l)],
          [T(l, 'Corpus Christi', 'Corpus Christi'), dShort(off(ps, 60), l)],
        ],
        table: {
          caption: T(l, `Fórmula de Gauss para ${y}, passo a passo`, `Gauss's Easter formula for ${y}, step by step`),
          headers: [T(l, 'Grandeza', 'Quantity'), T(l, 'Significado', 'Meaning'), T(l, 'Valor', 'Value')],
          rows: [
            ['K', T(l, 'século', 'century number'), String(g.K)], ['M', T(l, 'correção lunar do século', 'lunar correction'), String(g.M)], ['S', T(l, 'correção solar do século', 'solar correction'), String(g.S)],
            ['A', T(l, 'posição no ciclo lunar de 19 anos', 'place in the 19-year lunar cycle'), String(g.A)], ['D', T(l, 'semente da primeira lua cheia da primavera do hemisfério norte', 'seed for the first full moon of the northern spring'), String(g.D)], ['R', T(l, 'correção do calendário', 'calendar correction'), String(g.R)],
            ['OG', T(l, 'lua cheia pascal (dia de março)', 'paschal full moon (day of March)'), String(g.OG)], ['SZ', T(l, 'primeiro domingo de março', 'first Sunday in March'), String(g.SZ)], ['OE', T(l, 'dias até o domingo de Páscoa', 'days to Easter Sunday'), String(g.OE)],
            ['OS', T(l, 'Páscoa como dia de março (32 = 1º de abril)', 'Easter as a day of March (32 = 1 April)'), String(g.OS)],
          ],
          align: ['l', 'l', 'r'],
        },
        tables: [{ caption: T(l, 'Páscoa nos próximos anos', 'Easter in the coming years'), headers: [T(l, 'Ano', 'Year'), T(l, 'Sexta-feira da Paixão', 'Good Friday'), T(l, 'Domingo de Páscoa', 'Easter Sunday')], rows: yearRange(y, y + 7).map((z) => [String(z), dLong(off(pascoa(z), -2), l), dLong(pascoa(z), l)]), align: ['l', 'l', 'l'] }],
      };
    },
  };
}

/* ------------------------------------------------------------------ Carnaval */
/** Estados e capitais onde algum dia de Carnaval é feriado por lei local (regra da Páscoa −48 ou −47). */
export function carnavalLocal(): Array<{ uf: UF; esfera: 'estadual' | 'municipal'; nome: { pt: string; en: string }; offset: number; fonte: string }> {
  const out: Array<{ uf: UF; esfera: 'estadual' | 'municipal'; nome: { pt: string; en: string }; offset: number; fonte: string }> = [];
  for (const uf of UFS) for (const [esf, defs] of [['estadual', ESTADUAIS(uf)], ['municipal', MUNICIPAIS(uf)]] as const)
    for (const d of defs) if (d.regra.tipo === 'pascoa' && (d.regra.offset === -47 || d.regra.offset === -48)) out.push({ uf, esfera: esf, nome: d.nome, offset: d.regra.offset, fonte: d.fonte });
  return out;
}
function cvSpec(l: Lang, a: Args = {}): ToolSpec {
  return {
    inputs: [fAno(l, Number(a.ano ?? 2027), yearRange(2020, 2040))],
    run: (v) => {
      const y = n(v, 'ano'), t = carnavalTerca(y);
      const locais = carnavalLocal();
      return {
        label: T(l, `Carnaval ${y}: terça-feira`, `Carnival ${y}: Tuesday`),
        value: dLong(t, l),
        sub: T(l, `Sábado ${dShort(off(t, -3), l)} a Quarta-feira de Cinzas, ${dShort(off(t, 1), l)}.`, `Saturday ${dShort(off(t, -3), l)} to Ash Wednesday, ${dShort(off(t, 1), l)}.`),
        rows: [
          [T(l, 'Segunda-feira de Carnaval', 'Carnival Monday'), dShort(off(t, -1), l)],
          [T(l, 'Quarta-feira de Cinzas', 'Ash Wednesday'), dShort(off(t, 1), l)],
          [T(l, 'Domingo de Páscoa', 'Easter Sunday'), dShort(pascoa(y), l)],
          [T(l, 'Feriado nacional?', 'National holiday?'), T(l, 'não, ponto facultativo', 'no, optional day off')],
        ],
        table: { caption: T(l, 'Carnaval nos próximos anos', 'Carnival in the coming years'), headers: [T(l, 'Ano', 'Year'), T(l, 'Segunda-feira', 'Monday'), T(l, 'Terça-feira', 'Tuesday'), T(l, 'Cinzas', 'Ash Wednesday')], rows: yearRange(y, y + 7).map((z) => { const tz = carnavalTerca(z); return [String(z), dLong(off(tz, -1), l), dLong(tz, l), dLong(off(tz, 1), l)]; }), align: ['l', 'l', 'l', 'l'] },
        tables: locais.length ? [{ caption: T(l, 'Onde o Carnaval é feriado por lei local', 'Where Carnival is a holiday under local law'), headers: [T(l, 'Lugar', 'Place'), T(l, 'Dia', 'Day'), T(l, 'Tipo', 'Type')], rows: locais.map((x) => [x.esfera === 'municipal' ? `${CAPITAL[x.uf]} (${x.uf})` : UF_NOME[x.uf], dLong(off(pascoa(y), x.offset), l), ESFERA[x.esfera][l]]), align: ['l', 'l', 'l'] }] : undefined,
      };
    },
  };
}

/* ------------------------------------------------------------------ Corpus Christi */
export function corpusLocal(): Array<{ uf: UF; esfera: 'estadual' | 'municipal'; fonte: string }> {
  const out: Array<{ uf: UF; esfera: 'estadual' | 'municipal'; fonte: string }> = [];
  for (const uf of UFS) for (const [esf, defs] of [['estadual', ESTADUAIS(uf)], ['municipal', MUNICIPAIS(uf)]] as const)
    for (const d of defs) if (d.regra.tipo === 'pascoa' && d.regra.offset === 60) out.push({ uf, esfera: esf, fonte: d.fonte });
  return out;
}
function ccSpec(l: Lang, a: Args = {}): ToolSpec {
  return {
    inputs: [fAno(l, Number(a.ano ?? 2027), yearRange(2020, 2040))],
    run: (v) => {
      const y = n(v, 'ano'), cc = corpusChristi(y), locais = corpusLocal();
      return {
        label: T(l, `Corpus Christi ${y}`, `Corpus Christi ${y}`),
        value: dLong(cc, l),
        sub: T(l, `Sempre numa quinta-feira, 60 dias depois da Páscoa. Emenda: sexta, ${dShort(off(cc, 1), l)}.`, `Always a Thursday, 60 days after Easter. Bridge: Friday ${dShort(off(cc, 1), l)}.`),
        rows: [
          [T(l, 'Domingo de Páscoa', 'Easter Sunday'), dShort(pascoa(y), l)],
          [T(l, 'Sexta-feira da emenda', 'Bridge Friday'), dShort(off(cc, 1), l)],
          [T(l, 'Feriado nacional?', 'National holiday?'), T(l, 'não, ponto facultativo federal', 'no, federal optional day off')],
          [T(l, 'Capitais com feriado municipal conferido', 'Capitals with a verified municipal holiday'), num(locais.filter((x) => x.esfera === 'municipal').length, l)],
        ],
        table: { caption: T(l, 'Corpus Christi nos próximos anos', 'Corpus Christi in the coming years'), headers: [T(l, 'Ano', 'Year'), T(l, 'Corpus Christi', 'Corpus Christi'), T(l, 'Sexta da emenda', 'Bridge Friday')], rows: yearRange(y, y + 7).map((z) => { const c = corpusChristi(z); return [String(z), dLong(c, l), dLong(off(c, 1), l)]; }), align: ['l', 'l', 'l'] },
        tables: locais.length ? [{ caption: T(l, 'Onde Corpus Christi é feriado por lei local conferida', 'Where Corpus Christi is a holiday under a verified local law'), headers: [T(l, 'Lugar', 'Place'), T(l, 'Tipo', 'Type')], rows: locais.map((x) => [x.esfera === 'municipal' ? `${CAPITAL[x.uf]} (${x.uf})` : UF_NOME[x.uf], ESFERA[x.esfera][l]]), align: ['l', 'l'] }] : undefined,
      };
    },
  };
}

/* ------------------------------------------------------------------ datas comemorativas */
export const diaDasMaes = (y: number) => nthWeekday(y, 5, 0, 2);
export const diaDosPais = (y: number) => nthWeekday(y, 8, 0, 2);
function dcSpec(l: Lang, a: Args = {}): ToolSpec {
  return {
    inputs: [{ kind: 'choice', id: 'qual', label: T(l, 'Data', 'Date'), def: String(a.qual ?? 'maes'), options: [{ value: 'maes', label: T(l, 'Dia das Mães', "Mother's Day") }, { value: 'pais', label: T(l, 'Dia dos Pais', "Father's Day") }] }, fAno(l, Number(a.ano ?? 2027), yearRange(2020, 2040))],
    run: (v) => {
      const y = n(v, 'ano'), maes = s(v, 'qual') !== 'pais';
      const d = maes ? diaDasMaes(y) : diaDosPais(y);
      const nome = maes ? T(l, 'Dia das Mães', "Mother's Day") : T(l, 'Dia dos Pais', "Father's Day");
      return {
        label: `${nome} ${y}`,
        value: dLong(d, l),
        sub: maes ? T(l, 'Segundo domingo de maio. Não é feriado: é domingo.', 'Second Sunday in May. Not a public holiday: it is a Sunday.') : T(l, 'Segundo domingo de agosto. Não é feriado: é domingo.', 'Second Sunday in August. Not a public holiday: it is a Sunday.'),
        rows: [
          [T(l, 'Dia das Mães', "Mother's Day"), dShort(diaDasMaes(y), l)],
          [T(l, 'Dia dos Namorados', "Valentine's Day (Brazil)"), dShort(`${y}-06-12`, l)],
          [T(l, 'Dia dos Pais', "Father's Day"), dShort(diaDosPais(y), l)],
          [T(l, 'Dia das Crianças (e Nossa Senhora Aparecida)', "Children's Day (and Our Lady of Aparecida)"), dShort(`${y}-10-12`, l)],
        ],
        table: { caption: T(l, `${nome} nos próximos anos`, `${nome} in the coming years`), headers: [T(l, 'Ano', 'Year'), T(l, 'Dia das Mães', "Mother's Day"), T(l, 'Dia dos Pais', "Father's Day")], rows: yearRange(y, y + 7).map((z) => [String(z), dLong(diaDasMaes(z), l), dLong(diaDosPais(z), l)]), align: ['l', 'l', 'l'] },
      };
    },
  };
}

/* ------------------------------------------------------------------ feriados estaduais: panorama */
function estSpec(l: Lang, a: Args = {}): ToolSpec {
  return {
    inputs: [fAno(l, Number(a.ano ?? 2027))],
    run: (v) => {
      const y = n(v, 'ano');
      const rows = [...UFS].sort((x, z) => UF_NOME[x].localeCompare(UF_NOME[z], 'pt-BR')).map((uf) => {
        const est = feriados(y, { uf }).filter((f) => f.esfera === 'estadual');
        return { uf, est, wk: est.filter((f) => !isWeekend(fromIso(f.date))).length };
      });
      const total = rows.reduce((x, r) => x + r.est.length, 0);
      const max = rows.reduce((m, r) => (r.est.length > m.est.length ? r : m), rows[0]);
      return {
        label: T(l, `Feriados estaduais de ${y} nas 27 UFs`, `State holidays ${y} in the 27 federative units`),
        value: T(l, `${num(total, l)} feriados estaduais`, `${num(total, l)} state holidays`),
        sub: T(l, `Mais feriados estaduais: ${UF_NOME[max.uf]}, com ${num(max.est.length, l)}.`, `Most state holidays: ${UF_NOME[max.uf]}, with ${num(max.est.length, l)}.`),
        rows: [
          [T(l, 'UFs com um só feriado estadual', 'Units with a single state holiday'), num(rows.filter((r) => r.est.length === 1).length, l)],
          [T(l, 'UFs sem feriado estadual em dia útil', 'Units with no state holiday on a weekday'), num(rows.filter((r) => r.wk === 0).length, l)],
          [T(l, 'Feriados estaduais em dia útil', 'State holidays on weekdays'), num(rows.reduce((x, r) => x + r.wk, 0), l)],
        ],
        table: { caption: T(l, `Feriados estaduais de ${y}, por UF`, `State holidays ${y}, by federative unit`), headers: [T(l, 'UF', 'Unit'), T(l, 'Feriados estaduais', 'State holidays'), T(l, 'Datas', 'Dates')], rows: rows.map((r) => [`${UF_NOME[r.uf]} (${r.uf})`, num(r.est.length, l), r.est.map((f) => `${dShort(f.date, l)}: ${f.nome[l]}`).join('<br>') || '–']), align: ['l', 'r', 'l'] },
      };
    },
  };
}

export const SPECS: Record<string, (l: Lang, arg?: Args) => ToolSpec> = { em: emSpec, ft: ftSpec, du: duSpec, mes: mesSpec, pf: pfSpec, pc: pcSpec, cv: cvSpec, cc: ccSpec, dc: dcSpec, est: estSpec };
export const TOOL_KINDS = [...Object.keys(SPECS), 'proximo', 'faltam', 'calendario'];
export function getTool(kind: string, l: Lang, arg?: Args): ToolSpec {
  const f = SPECS[kind]; if (!f) throw new Error(`simulateur inconnu : ${kind}`);
  return f(l, arg);
}
/** Lance un simulateur avec ses valeurs par défaut (ou celles données) : sert aux pages et aux tests. */
export function runTool(kind: string, l: Lang, arg?: Args, values?: V): ToolOut {
  const spec = getTool(kind, l, arg);
  const v = Object.fromEntries(spec.inputs.map((i) => [i.id, i.def])) as V;
  return spec.run(resolve(spec.inputs, { ...v, ...(values ?? {}) }));
}
export { formatNumber, BLOCO_CAPITAL };
