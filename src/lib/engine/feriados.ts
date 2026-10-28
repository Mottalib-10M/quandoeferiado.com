/**
 * Feriados do Brasil, calculados e nunca digitados.
 *
 * - Nacionais: Lei 662/1949 (redação da Lei 10.607/2002), Lei 6.802/1980 (12 de outubro), Lei 14.759/2023 (20 de novembro).
 * - Sexta-feira da Paixão: feriado religioso (Lei 9.093/1995, art. 2º), em vigor em todo o país; data = Páscoa − 2.
 * - Estaduais e municipais das capitais: src/data/locais.json, cada data com a lei que a cria (params-2026.json > sources).
 * - Pontos facultativos federais: portaria anual do Ministério da Gestão (src/data/locais.json > facultativos), só nos anos
 *   em que a portaria foi publicada.
 * - Páscoa: fórmula de Gauss na versão de Lichtenberg, conferida pelo algoritmo de Meeus/Jones/Butcher nos testes.
 * - No Brasil, um feriado que cai no sábado ou no domingo não é transferido por lei federal.
 */
import L from '../../data/locais.json';

export type UF = 'AC' | 'AL' | 'AP' | 'AM' | 'BA' | 'CE' | 'DF' | 'ES' | 'GO' | 'MA' | 'MT' | 'MS' | 'MG' | 'PA' | 'PB' | 'PR' | 'PE' | 'PI' | 'RJ' | 'RN' | 'RS' | 'RO' | 'RR' | 'SC' | 'SP' | 'SE' | 'TO';
export const UFS: UF[] = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];
export const UF_NOME: Record<UF, string> = {
  AC: 'Acre', AL: 'Alagoas', AP: 'Amapá', AM: 'Amazonas', BA: 'Bahia', CE: 'Ceará', DF: 'Distrito Federal', ES: 'Espírito Santo', GO: 'Goiás',
  MA: 'Maranhão', MT: 'Mato Grosso', MS: 'Mato Grosso do Sul', MG: 'Minas Gerais', PA: 'Pará', PB: 'Paraíba', PR: 'Paraná', PE: 'Pernambuco',
  PI: 'Piauí', RJ: 'Rio de Janeiro', RN: 'Rio Grande do Norte', RS: 'Rio Grande do Sul', RO: 'Rondônia', RR: 'Roraima', SC: 'Santa Catarina',
  SP: 'São Paulo', SE: 'Sergipe', TO: 'Tocantins',
};
export const CAPITAL: Record<UF, string> = {
  AC: 'Rio Branco', AL: 'Maceió', AP: 'Macapá', AM: 'Manaus', BA: 'Salvador', CE: 'Fortaleza', DF: 'Brasília', ES: 'Vitória', GO: 'Goiânia',
  MA: 'São Luís', MT: 'Cuiabá', MS: 'Campo Grande', MG: 'Belo Horizonte', PA: 'Belém', PB: 'João Pessoa', PR: 'Curitiba', PE: 'Recife',
  PI: 'Teresina', RJ: 'Rio de Janeiro', RN: 'Natal', RS: 'Porto Alegre', RO: 'Porto Velho', RR: 'Boa Vista', SC: 'Florianópolis',
  SP: 'São Paulo', SE: 'Aracaju', TO: 'Palmas',
};

/** Segmento de URL de cada UF (minúsculas, sem acento). */
export const UF_SLUG: Record<UF, string> = {
  AC: 'acre', AL: 'alagoas', AP: 'amapa', AM: 'amazonas', BA: 'bahia', CE: 'ceara', DF: 'distrito-federal', ES: 'espirito-santo', GO: 'goias',
  MA: 'maranhao', MT: 'mato-grosso', MS: 'mato-grosso-do-sul', MG: 'minas-gerais', PA: 'para', PB: 'paraiba', PR: 'parana', PE: 'pernambuco',
  PI: 'piaui', RJ: 'rio-de-janeiro', RN: 'rio-grande-do-norte', RS: 'rio-grande-do-sul', RO: 'rondonia', RR: 'roraima', SC: 'santa-catarina',
  SP: 'sao-paulo', SE: 'sergipe', TO: 'tocantins',
};
/** Região do IBGE de cada UF. */
export const REGIAO: Record<UF, 'N' | 'NE' | 'CO' | 'SE' | 'S'> = {
  AC: 'N', AL: 'NE', AP: 'N', AM: 'N', BA: 'NE', CE: 'NE', DF: 'CO', ES: 'SE', GO: 'CO', MA: 'NE', MT: 'CO', MS: 'CO', MG: 'SE', PA: 'N', PB: 'NE',
  PR: 'S', PE: 'NE', PI: 'NE', RJ: 'SE', RN: 'NE', RS: 'S', RO: 'N', RR: 'N', SC: 'S', SP: 'SE', SE: 'NE', TO: 'N',
};
export const ufPageId = (uf: UF) => `feriados-${UF_SLUG[uf]}`;

/* ------------------------------------------------------------------ dias como inteiros (UTC) */
const MS = 86400000;
export const dayNum = (y: number, m: number, d: number) => Date.UTC(y, m - 1, d) / MS;
export const fromIso = (iso: string) => { const [y, m, d] = iso.split('-').map(Number); return dayNum(y, m, d); };
export const toIso = (n: number) => new Date(n * MS).toISOString().slice(0, 10);
/** 0 = domingo … 6 = sábado */
export const weekday = (n: number) => new Date(n * MS).getUTCDay();
export const isWeekend = (n: number) => { const w = weekday(n); return w === 0 || w === 6; };
export const addDays = (iso: string, d: number) => toIso(fromIso(iso) + d);

/* ------------------------------------------------------------------ Páscoa */
/** Domingo de Páscoa pela fórmula de Gauss (versão de Lichtenberg, 1997). */
export function pascoa(x: number): string {
  const K = Math.floor(x / 100);
  const M = 15 + Math.floor((3 * K + 3) / 4) - Math.floor((8 * K + 13) / 25);
  const S = 2 - Math.floor((3 * K + 3) / 4);
  const A = x % 19;
  const D = (19 * A + M) % 30;
  const R = Math.floor((D + Math.floor(A / 11)) / 29);
  const OG = 21 + D - R;
  const SZ = 7 - ((x + Math.floor(x / 4) + S) % 7);
  const OE = 7 - ((((OG - SZ) % 7) + 7) % 7);
  return toIso(dayNum(x, 3, 1) + OG + OE - 1);
}
/** Segundo cálculo, independente (Meeus/Jones/Butcher), usado nos testes. */
export function pascoaMeeus(y: number): string {
  const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4;
  const f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31), day = ((h + l - 7 * m + 114) % 31) + 1;
  return toIso(dayNum(y, month, day));
}
/** n-ésimo dia da semana do mês (n = −1: o último). wd 0 = domingo. */
export function nthWeekday(y: number, m: number, wd: number, n: number): string {
  if (n > 0) { const first = dayNum(y, m, 1); return toIso(first + ((wd - weekday(first) + 7) % 7) + 7 * (n - 1)); }
  const last = dayNum(y, m + 1, 1) - 1; return toIso(last - ((weekday(last) - wd + 7) % 7));
}
/** Datas móveis ligadas à Páscoa. */
export const carnavalTerca = (y: number) => addDays(pascoa(y), -47);
export const cinzas = (y: number) => addDays(pascoa(y), -46);
export const paixao = (y: number) => addDays(pascoa(y), -2);
export const corpusChristi = (y: number) => addDays(pascoa(y), 60);

/* ------------------------------------------------------------------ regras */
export type Regra = { tipo: 'fixo'; mes: number; dia: number } | { tipo: 'pascoa'; offset: number } | { tipo: 'nth'; mes: number; weekday: number; n: number } | { tipo: 'data'; datas: string[] };
export const dataDaRegra = (r: Regra, y: number): string | null => {
  if (r.tipo === 'fixo') return toIso(dayNum(y, r.mes, r.dia));
  if (r.tipo === 'pascoa') return addDays(pascoa(y), r.offset);
  if (r.tipo === 'nth') return nthWeekday(y, r.mes, r.weekday, r.n);
  return r.datas.find((d) => d.startsWith(`${y}-`)) ?? null;
};
/** nacional: lei federal · religioso: Sexta-feira da Paixão · estadual · municipal (capital) · facultativo: ponto facultativo federal. */
export type Esfera = 'nacional' | 'religioso' | 'estadual' | 'municipal' | 'facultativo';
export interface Def {
  id: string; nome: { pt: string; en: string }; regra: Regra; esfera: Esfera;
  /** chave de params-2026.json > sources */
  fonte: string;
  desde?: number | null; ate?: number | null;
  /** ponto facultativo de meio expediente: 'manha' = folga até as 14 h (Cinzas), 'tarde' = folga após as 13 h (24 e 31/12) */
  meio?: 'manha' | 'tarde';
  /** anos em que a regra está confirmada (portaria publicada) */
  anos?: number[];
}

export const NACIONAIS: Def[] = [
  { id: 'confraternizacao', nome: { pt: 'Confraternização Universal', en: "New Year's Day" }, regra: { tipo: 'fixo', mes: 1, dia: 1 }, esfera: 'nacional', fonte: 'lei-662' },
  { id: 'paixao', nome: { pt: 'Sexta-feira da Paixão', en: 'Good Friday' }, regra: { tipo: 'pascoa', offset: -2 }, esfera: 'religioso', fonte: 'lei-9093' },
  { id: 'tiradentes', nome: { pt: 'Tiradentes', en: 'Tiradentes Day' }, regra: { tipo: 'fixo', mes: 4, dia: 21 }, esfera: 'nacional', fonte: 'lei-662' },
  { id: 'trabalho', nome: { pt: 'Dia do Trabalho', en: 'Labour Day' }, regra: { tipo: 'fixo', mes: 5, dia: 1 }, esfera: 'nacional', fonte: 'lei-662' },
  { id: 'independencia', nome: { pt: 'Independência do Brasil', en: 'Independence Day' }, regra: { tipo: 'fixo', mes: 9, dia: 7 }, esfera: 'nacional', fonte: 'lei-662' },
  { id: 'aparecida', nome: { pt: 'Nossa Senhora Aparecida', en: 'Our Lady of Aparecida' }, regra: { tipo: 'fixo', mes: 10, dia: 12 }, esfera: 'nacional', fonte: 'lei-6802' },
  { id: 'finados', nome: { pt: 'Finados', en: "All Souls' Day" }, regra: { tipo: 'fixo', mes: 11, dia: 2 }, esfera: 'nacional', fonte: 'lei-662' },
  { id: 'republica', nome: { pt: 'Proclamação da República', en: 'Proclamation of the Republic' }, regra: { tipo: 'fixo', mes: 11, dia: 15 }, esfera: 'nacional', fonte: 'lei-662' },
  { id: 'consciencia-negra', nome: { pt: 'Dia Nacional de Zumbi e da Consciência Negra', en: 'Black Consciousness Day' }, regra: { tipo: 'fixo', mes: 11, dia: 20 }, esfera: 'nacional', fonte: 'lei-14759', desde: 2024 },
  { id: 'natal', nome: { pt: 'Natal', en: 'Christmas Day' }, regra: { tipo: 'fixo', mes: 12, dia: 25 }, esfera: 'nacional', fonte: 'lei-662' },
];

/** Data que já foi apresentada como feriado mas não entra na conta: motivo e dia (mês, dia) quando fixo. */
export interface Pendente { nome: string; motivo: 'adi' | 'revogado' | 'facultativo' | 'municipal' | 'sem-fonte' | 'servidores' | 'nao-feriado' | 'projeto'; mes_dia: [number, number] | null }
/** Regra estadual de adiamento: no Acre, feriados estaduais de terça a quinta são comemorados na sexta (Lei 2.126/2009). */
export interface Transfere { regra: 'sexta'; exceto: string[]; fonte: string }
interface Bloco { nome: string; feriados: Def[]; pendentes?: Pendente[]; transfere?: Transfere }
const DADOS = L as unknown as { lido_em: string; estados: Record<UF, Bloco>; capitais: Record<UF, Bloco & { municipio?: string }>; facultativos: Def[]; portarias: Record<string, { publicada: boolean; fonte: string; numero?: string; verificado_em?: string }> };
export const LIDO_EM = DADOS.lido_em;
export const BLOCO_ESTADO = (uf: UF): Bloco | undefined => DADOS.estados[uf];
export const BLOCO_CAPITAL = (uf: UF): (Bloco & { municipio?: string }) | undefined => DADOS.capitais[uf];
/** UFs cuja capital tem pelo menos um feriado municipal confirmado em lei lida. */
export const UFS_COM_CAPITAL = (): UF[] => UFS.filter((u) => (DADOS.capitais[u]?.feriados.length ?? 0) > 0);
export const PORTARIA = (y: number) => DADOS.portarias[String(y)];
export const ESTADUAIS = (uf: UF): Def[] => DADOS.estados[uf]?.feriados ?? [];
export const MUNICIPAIS = (uf: UF): Def[] => DADOS.capitais[uf]?.feriados ?? [];
export const FACULTATIVOS: Def[] = DADOS.facultativos;
/** A portaria de pontos facultativos do ano já saiu? */
export const portariaPublicada = (y: number) => !!DADOS.portarias[String(y)]?.publicada;

export interface Feriado { id: string; date: string; nome: { pt: string; en: string }; esfera: Esfera; fonte: string; meio?: 'manha' | 'tarde'; /** data da lei, quando a comemoração foi adiada (Acre) */ original?: string }
export interface Local { uf: UF; /** inclui os feriados municipais da capital */ capital?: boolean; /** inclui os pontos facultativos federais */ facultativos?: boolean }
const vale = (d: Def, y: number) => (!d.desde || y >= d.desde) && (!d.ate || y <= d.ate) && (!d.anos || d.anos.includes(y));
function push(out: Feriado[], defs: Def[], y: number) {
  for (const d of defs) {
    if (!vale(d, y)) continue;
    const date = dataDaRegra(d.regra, y); if (!date) continue;
    out.push({ id: d.id, date, nome: d.nome, esfera: d.esfera, fonte: d.fonte, ...(d.meio ? { meio: d.meio } : {}) });
  }
}
/**
 * Adiamento para a sexta-feira (Acre, Lei 2.126/2009, art. 1º e parágrafo único): o feriado estadual que cai de terça a
 * quinta é comemorado na sexta da mesma semana; se a sexta já é feriado, no dia útil livre imediatamente anterior, para
 * que o descanso fique contínuo. Assim se lê o Decreto 11.809/2025 (20/01/2026 comemorado em 22/01, véspera do Dia do
 * Evangélico) e a Portaria TJAC 6.569/2025 (17/11/2026 em 19/11, véspera do 20 de novembro).
 */
function adia(list: Feriado[], t: Transfere): Feriado[] {
  const taken = new Set(list.map((f) => f.date));
  const out: Feriado[] = [];
  const mov = list.filter((f) => f.esfera === 'estadual' && !t.exceto.includes(f.id) && [2, 3, 4].includes(weekday(fromIso(f.date))))
    .sort((a, b) => b.date.localeCompare(a.date));
  const moved = new Map<string, string>();
  for (const f of mov) {
    const n = fromIso(f.date), fri = n + (5 - weekday(n));
    taken.delete(f.date);
    let d = fri; while (d > n && taken.has(toIso(d))) d--;
    moved.set(f.id, toIso(d)); taken.add(toIso(d));
  }
  for (const f of list) { const m = moved.get(f.id); out.push(m && m !== f.date ? { ...f, date: m, original: f.date } : f); }
  return out;
}
/**
 * Os feriados de um lugar num ano, por data. Duas datas iguais (ex. 21 de abril em Minas, que é Tiradentes e data magna)
 * aparecem uma vez só, com a esfera mais ampla.
 */
export function feriados(y: number, loc: Local): Feriado[] {
  const raw: Feriado[] = [];
  push(raw, NACIONAIS, y);
  push(raw, ESTADUAIS(loc.uf), y);
  const t = DADOS.estados[loc.uf]?.transfere;
  if (t) { const ad = adia(raw, t); raw.length = 0; raw.push(...ad); }
  if (loc.capital) push(raw, MUNICIPAIS(loc.uf), y);
  if (loc.facultativos) push(raw, FACULTATIVOS, y);
  const ordem: Esfera[] = ['nacional', 'religioso', 'estadual', 'municipal', 'facultativo'];
  const by = new Map<string, Feriado>();
  for (const f of raw) { const o = by.get(f.date); if (!o || ordem.indexOf(f.esfera) < ordem.indexOf(o.esfera)) by.set(f.date, f); }
  return [...by.values()].sort((a, b) => a.date.localeCompare(b.date));
}
/** Só os dias de folga legal (sem pontos facultativos). */
export const folgas = (y: number, loc: Local) => feriados(y, { ...loc, facultativos: false });
/** Feriados que caem de segunda a sexta. */
export const emDiaUtil = (list: Feriado[]) => list.filter((f) => !isWeekend(fromIso(f.date)));

/** Próximos feriados a partir de uma data (inclusive), em todos os anos necessários. */
export function proximos(iso: string, loc: Local, n = 6): Feriado[] {
  const y = Number(iso.slice(0, 4)), out: Feriado[] = [];
  for (let yy = y; yy <= y + 2 && out.length < n; yy++) for (const f of folgas(yy, loc)) if (f.date >= iso && out.length < n) out.push(f);
  return out;
}
/**
 * Feriado prolongado: o fim de semana que o feriado forma. Segunda ou sexta: 3 dias sem emenda. Terça ou quinta:
 * uma emenda (segunda ou sexta) dá 4 dias. Quarta: precisa de dois dias. Sábado e domingo: nada a ganhar.
 */
export interface Prolongado { tipo: 'prolongado' | 'emenda' | 'meio-semana' | 'fim-de-semana'; emenda?: string; de: string; ate: string; dias: number }
export function prolongado(iso: string): Prolongado {
  const n = fromIso(iso), w = weekday(n);
  if (w === 1) return { tipo: 'prolongado', de: toIso(n - 2), ate: iso, dias: 3 };
  if (w === 5) return { tipo: 'prolongado', de: iso, ate: toIso(n + 2), dias: 3 };
  if (w === 2) return { tipo: 'emenda', emenda: toIso(n - 1), de: toIso(n - 3), ate: iso, dias: 4 };
  if (w === 4) return { tipo: 'emenda', emenda: toIso(n + 1), de: iso, ate: toIso(n + 3), dias: 4 };
  if (w === 3) return { tipo: 'meio-semana', de: iso, ate: iso, dias: 1 };
  return { tipo: 'fim-de-semana', de: iso, ate: iso, dias: 0 };
}
/** Visão do ano: cada data com as UFs onde é feriado estadual e as capitais onde é municipal. */
export interface Linha { id: string; date: string; nome: { pt: string; en: string }; esfera: Esfera; ufs: UF[] }
export function panorama(y: number): Linha[] {
  const rows = new Map<string, Linha>();
  const add = (defs: Def[], uf?: UF) => { for (const d of defs) { if (!vale(d, y)) continue; const date = dataDaRegra(d.regra, y); if (!date) continue; const k = `${d.esfera}|${date}|${d.nome.pt}`; const r = rows.get(k) ?? { id: d.id, date, nome: d.nome, esfera: d.esfera, ufs: [] }; if (uf && !r.ufs.includes(uf)) r.ufs.push(uf); rows.set(k, r); } };
  add(NACIONAIS);
  for (const uf of UFS) add(ESTADUAIS(uf), uf);
  return [...rows.values()].sort((a, b) => a.date.localeCompare(b.date));
}
