/** Blocos de conteúdo calculados, partilhados por várias páginas (tabelas: fora do controle de unicidade). */
import type { Helpers } from './page-types';
import { panorama, feriados, folgas, UFS, UF_NOME, CAPITAL, isWeekend, fromIso, type UF, type Local } from './engine/feriados';
import { pontes, diasUteis } from './engine/emendas';
import { dLong, dShort, dName, ESFERA, nomeFeriado, esferaLabel } from './tool-specs';

/** Todos os feriados nacionais e estaduais de um ano, com as UFs de cada data estadual. */
export function tabelaAno(h: Helpers, y: number) {
  const rows = panorama(y).map((r) => [dLong(r.date, h.lang), h.wd(r.date), r.nome[h.lang], r.esfera === 'estadual' ? r.ufs.join(', ') : h.T('todo o Brasil', 'all of Brazil')]);
  return h.table([h.T('Data', 'Date'), h.T('Dia da semana', 'Weekday'), h.T('Feriado', 'Holiday'), h.T('Onde vale', 'Where it applies')], rows, h.T(`Feriados nacionais e estaduais de ${y} (siglas das UFs)`, `National and state holidays in ${y} (state abbreviations)`));
}
/** Por UF: feriados, quantos em dia útil, dias úteis. */
export function tabelaUFs(h: Helpers, y: number) {
  const rows = [...UFS].sort((a, b) => UF_NOME[a].localeCompare(UF_NOME[b], 'pt-BR')).map((uf) => {
    const f = folgas(y, { uf }); const wk = f.filter((x) => !isWeekend(fromIso(x.date))).length;
    return [`${UF_NOME[uf]} (${uf})`, f.length, wk, diasUteis(y, { uf }).reduce((a, b) => a + b, 0)];
  });
  return h.table([h.T('Estado', 'State'), h.T('Feriados', 'Holidays'), h.T('De segunda a sexta', 'On weekdays'), h.T('Dias úteis', 'Working days')], rows, h.T(`Feriados nacionais e estaduais e dias úteis de ${y}, por UF (sem feriados municipais)`, `National and state holidays and working days in ${y}, by state (municipal holidays excluded)`), ['l', 'r', 'r', 'r']);
}
/** As melhores emendas de um lugar. */
export function tabelaPontes(h: Helpers, y: number, loc: Local, max = 8) {
  const rows = pontes(y, loc).slice(0, max).map((b) => [b.folgaDe === b.folgaAte ? dShort(b.folgaDe, h.lang) : `${dShort(b.folgaDe, h.lang)} – ${dShort(b.folgaAte, h.lang)}`, b.folga, `${dShort(b.livreDe, h.lang)} – ${dShort(b.livreAte, h.lang)}`, b.livre]);
  const lugar = loc.capital ? CAPITAL[loc.uf] : UF_NOME[loc.uf];
  return h.table([h.T('Pedir folga', 'Take off'), h.T('Dias de folga', 'Days off used'), h.T('Livre seguido', 'Free in a row'), h.T('Dias livres', 'Free days')], rows, h.T(`As melhores emendas de ${y} em ${lugar}`, `Best bridges ${y} in ${lugar}`), ['l', 'r', 'l', 'r']);
}
/** Os feriados de um lugar em vários anos, uma linha por feriado. */
export function tabelaLugar(h: Helpers, loc: Local, anos = [2026, 2027, 2028]) {
  const ids: Array<{ id: string; nome: string; tipo: string }> = [];
  const by = anos.map((y) => new Map(feriados(y, loc).map((f) => { if (!ids.some((x) => x.id === f.id)) ids.push({ id: f.id, nome: nomeFeriado({ ...f, original: undefined }, h.lang), tipo: ESFERA[f.esfera][h.lang] }); return [f.id, f.date]; })));
  const order = (id: string) => { for (const m of by) { const d = m.get(id); if (d) return d.slice(5); } return '99'; };
  ids.sort((a, b) => order(a.id).localeCompare(order(b.id)));
  const cell = (d?: string) => (d ? dShort(d, h.lang) : '–');
  const rows = ids.map((x) => [x.nome, x.tipo, ...by.map((m) => cell(m.get(x.id)))]);
  rows.push([h.T('<strong>Total de feriados</strong>', '<strong>Total holidays</strong>'), '', ...by.map((m) => `<strong>${m.size}</strong>`)]);
  const lugar = loc.capital ? CAPITAL[loc.uf] : UF_NOME[loc.uf];
  return h.table([h.T('Feriado', 'Holiday'), h.T('Tipo', 'Type'), ...anos.map(String)], rows, h.T(`Feriados em ${lugar}, ${anos[0]} a ${anos[anos.length - 1]}`, `Public holidays in ${lugar}, ${anos[0]} to ${anos[anos.length - 1]}`));
}
/** Lista simples dos feriados de um ano num lugar, com o tipo. */
export function tabelaSimples(h: Helpers, y: number, loc: Local) {
  const rows = feriados(y, loc).map((f) => [dLong(f.date, h.lang), dName(f.date, h.lang), nomeFeriado(f, h.lang), esferaLabel(f, h.lang)]);
  const lugar = loc.capital ? CAPITAL[loc.uf] : UF_NOME[loc.uf];
  return h.table([h.T('Data', 'Date'), h.T('Dia da semana', 'Weekday'), h.T('Feriado', 'Holiday'), h.T('Tipo', 'Type')], rows, h.T(`Feriados de ${y} em ${lugar}`, `Holidays ${y} in ${lugar}`));
}
export type { UF };
