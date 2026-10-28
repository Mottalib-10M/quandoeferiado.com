/**
 * Emendas de feriado e dias úteis.
 *
 * O ano vira uma sequência de blocos: blocos livres (fim de semana, feriado, e se quiser o Carnaval) e blocos de trabalho
 * (segunda a sexta sem feriado). Quem tira todos os dias de um bloco de trabalho junta os dois blocos livres vizinhos.
 * - `pontes`: cada bloco de trabalho de até quatro dias ao lado de um feriado, com o rendimento (dias livres seguidos por
 *   dia de folga usado), do melhor para o pior.
 * - `otimiza`: a melhor escolha para um saldo de dias de folga, por programação dinâmica sobre os blocos de trabalho
 *   ordenados. Maximiza os dias livres seguidos; empate: a solução com menos dias usados. Exata, não é aproximação.
 */
import { folgas, fromIso, toIso, isWeekend, dayNum, carnavalTerca, type Local } from './feriados';

export interface Opcoes { /** segunda e terça de Carnaval como folga (ponto facultativo federal, folga em muitas empresas) */ carnaval?: boolean }
interface Bloco { livre: boolean; start: number; len: number; feriado: boolean }

function feriadosSet(y: number, loc: Local, o: Opcoes) {
  const hol = new Map<number, string>();
  for (const yy of [y - 1, y, y + 1]) {
    for (const f of folgas(yy, loc)) hol.set(fromIso(f.date), f.id);
    if (o.carnaval) { const t = fromIso(carnavalTerca(yy)); hol.set(t - 1, 'carnaval'); hol.set(t, 'carnaval'); }
  }
  return hol;
}
/** Blocos livres e de trabalho de 1º de dezembro do ano anterior a 31 de janeiro do seguinte. */
export function blocos(y: number, loc: Local, o: Opcoes = {}): Bloco[] {
  const hol = feriadosSet(y, loc, o);
  const a = dayNum(y - 1, 12, 1), b = dayNum(y + 1, 1, 31);
  const out: Bloco[] = [];
  for (let d = a; d <= b; d++) {
    const isHol = hol.has(d), livre = isHol || isWeekend(d);
    const conta = isHol && !isWeekend(d);
    const last = out[out.length - 1];
    if (last && last.livre === livre) { last.len++; last.feriado ||= conta; }
    else out.push({ livre, start: d, len: 1, feriado: conta });
  }
  return out;
}

export interface Ponte {
  folgaDe: string; folgaAte: string; folga: number;
  livreDe: string; livreAte: string; livre: number;
  feriados: string[];
}
const mk = (bl: Bloco[], i: number, j: number, hol: Map<number, string>): Ponte => {
  const pre = bl[i - 1], post = bl[j + 1];
  const de = pre ? pre.start : bl[i].start, ate = post ? post.start + post.len - 1 : bl[j].start + bl[j].len - 1;
  let folga = 0; for (let k = i; k <= j; k++) if (!bl[k].livre) folga += bl[k].len;
  const ids = new Set<string>(); for (let d = de; d <= ate; d++) { const id = hol.get(d); if (id) ids.add(id); }
  return { folgaDe: toIso(bl[i].start), folgaAte: toIso(bl[j].start + bl[j].len - 1), folga, livreDe: toIso(de), livreAte: toIso(ate), livre: ate - de + 1, feriados: [...ids] };
};
const noAno = (b: Bloco, y: number) => b.start >= dayNum(y, 1, 1) && b.start + b.len - 1 <= dayNum(y, 12, 31);

/** Todas as pontes do ano: blocos de trabalho de até `max` dias ao lado de um feriado, a melhor primeiro. */
export function pontes(y: number, loc: Local, o: Opcoes = {}, max = 4): Ponte[] {
  const bl = blocos(y, loc, o), hol = feriadosSet(y, loc, o), out: Ponte[] = [];
  for (let i = 1; i < bl.length - 1; i++) {
    const b = bl[i];
    if (b.livre || b.len > max || !noAno(b, y)) continue;
    if (!bl[i - 1].feriado && !bl[i + 1].feriado) continue;
    out.push(mk(bl, i, i, hol));
  }
  return out.sort((a, b) => b.livre / b.folga - a.livre / a.folga || b.livre - a.livre || a.folgaDe.localeCompare(b.folgaDe));
}
/** Emendas de um dia só (a segunda antes de um feriado na terça, a sexta depois de um feriado na quinta). */
export const emendas = (y: number, loc: Local, o: Opcoes = {}) => pontes(y, loc, o, 1);

export interface Plano { blocos: Ponte[]; folga: number; livre: number; /** dias que não aumentam mais nenhuma ponte */ resto: number }
/** Melhor distribuição de `saldo` dias de folga no ano y (só os dias do ano y gastam saldo). */
export function otimiza(y: number, loc: Local, saldo: number, o: Opcoes = {}): Plano {
  const B = Math.max(0, Math.min(60, Math.floor(saldo)));
  const bl = blocos(y, loc, o), hol = feriadosSet(y, loc, o);
  const runs: number[] = []; for (let i = 0; i < bl.length; i++) if (!bl[i].livre) runs.push(i);
  const n = runs.length, NEG = -1e9;
  const ok = (r: number) => { const i = runs[r]; return i > 0 && i < bl.length - 1 && noAno(bl[i], y) && bl[i].len <= 10; };
  const fr = (i: number) => (bl[i] && bl[i].livre ? bl[i].len : 0);
  // dp[r][s][c]: melhor valor após o bloco r com c dias gastos. s = 0: bloco r não escolhido; 1: escolhido e a cadeia já
  // encosta num feriado; 2: escolhido, ainda sem feriado (não pode terminar assim). Valor = 100·livre − folga.
  const dp: Float64Array[][] = [], from: Int32Array[][] = [];
  for (let r = 0; r <= n; r++) { dp.push([0, 1, 2].map(() => new Float64Array(B + 1).fill(NEG))); from.push([0, 1, 2].map(() => new Int32Array(B + 1).fill(-1))); }
  dp[0][0][0] = 0;
  const temFeriado = (i: number) => !!(bl[i] && bl[i].livre && bl[i].feriado);
  for (let r = 0; r < n; r++) {
    const i = runs[r], cost = bl[i].len;
    for (let c = 0; c <= B; c++) for (let s = 0; s < 3; s++) {
      const v = dp[r][s][c]; if (v <= NEG / 2) continue;
      if (s !== 2 && v > dp[r + 1][0][c]) { dp[r + 1][0][c] = v; from[r + 1][0][c] = s; }
      if (ok(r) && c + cost <= B) {
        const gain = s ? cost + fr(i + 1) : fr(i - 1) + cost + fr(i + 1);
        const has = s === 1 || (s === 0 && temFeriado(i - 1)) || temFeriado(i + 1);
        const t = has ? 1 : 2, nv = v + 100 * gain - cost;
        if (nv > dp[r + 1][t][c + cost]) { dp[r + 1][t][c + cost] = nv; from[r + 1][t][c + cost] = s; }
      }
    }
  }
  let best = 0, bc = 0, bs = 0;
  for (let c = 0; c <= B; c++) for (let s = 0; s < 2; s++) if (dp[n][s][c] > best) { best = dp[n][s][c]; bc = c; bs = s; }
  const chosen: boolean[] = new Array(n).fill(false);
  for (let r = n, c = bc, s = bs; r > 0; r--) { const p = from[r][s][c]; if (s) { chosen[r - 1] = true; c -= bl[runs[r - 1]].len; } s = p < 0 ? 0 : p; }
  const plano: Ponte[] = [];
  for (let r = 0; r < n; r++) {
    if (!chosen[r]) continue;
    let e = r; while (e + 1 < n && chosen[e + 1]) e++;
    plano.push(mk(bl, runs[r], runs[e], hol)); r = e;
  }
  const folga = plano.reduce((a, b) => a + b.folga, 0);
  return { blocos: plano, folga, livre: plano.reduce((a, b) => a + b.livre, 0), resto: B - folga };
}

/* ------------------------------------------------------------------ dias úteis */
/** Dias úteis por mês: segunda a sexta (ou a sábado) menos os feriados do lugar; Carnaval à escolha. */
export function diasUteis(y: number, loc: Local, o: Opcoes & { sabado?: boolean } = {}): number[] {
  const hol = new Set(folgas(y, loc).map((f) => fromIso(f.date)));
  if (o.carnaval) { const t = fromIso(carnavalTerca(y)); hol.add(t - 1); hol.add(t); }
  const out: number[] = [];
  for (let m = 1; m <= 12; m++) {
    let c = 0;
    for (let d = dayNum(y, m, 1); d < dayNum(y, m + 1, 1); d++) { const w = new Date(d * 864e5).getUTCDay(); if (w === 0 || (w === 6 && !o.sabado) || hol.has(d)) continue; c++; }
    out.push(c);
  }
  return out;
}
/** Dias de segunda a sexta num ano, sem descontar feriados. */
export const segASex = (y: number) => { let c = 0; for (let d = dayNum(y, 1, 1); d <= dayNum(y, 12, 31); d++) if (!isWeekend(d)) c++; return c; };
/** Dias úteis entre duas datas (inclusive), segunda a sexta, sem os feriados do lugar. */
export function uteisEntre(a: string, b: string, loc: Local): number {
  let x = fromIso(a), z = fromIso(b); if (z < x) [x, z] = [z, x];
  const hol = new Set<number>(); for (let y = Number(toIso(x).slice(0, 4)); y <= Number(toIso(z).slice(0, 4)); y++) for (const f of folgas(y, loc)) hol.add(fromIso(f.date));
  let c = 0; for (let d = x; d <= z; d++) if (!isWeekend(d) && !hol.has(d)) c++;
  return c;
}
