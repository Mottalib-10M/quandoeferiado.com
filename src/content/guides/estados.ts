/** Uma página por UF: feriados 2026 a 2028, datas que não são feriado, capital, emendas de 2027. Datas: motor; texto próprio de cada UF. */
import { defineGuide, type GuideDef, type FAQ, type Helpers } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { tabelaLugar, tabelaPontes, tabelaSimples } from '../../lib/bausteine';
import { dShort, dName, MESES } from '../../lib/tool-specs';
import type { UF } from '../../lib/engine/feriados';
import LOCAIS from '../../data/locais.json';

type L = 'pt' | 'en';
interface Txt { lead: string; nota: string; faq: FAQ }
interface Def { pt: Txt; en: Txt; related: string[] }
const Y = 2027;
const T = (l: L, pt: string, en: string) => (l === 'pt' ? pt : en);
const lista = (x: string[], l: L) => (x.length > 1 ? `${x.slice(0, -1).join(', ')} ${l === 'pt' ? 'e' : 'and'} ${x[x.length - 1]}` : x[0] ?? '');
type Pend = { nome: string; motivo: string; mes_dia: [number, number] | null };
const PEND = (uf: UF): Pend[] => ((LOCAIS as unknown as { estados: Record<string, { pendentes: Pend[] }> }).estados[uf]?.pendentes ?? []);
const MOTIVO: Record<string, { pt: string; en: string }> = {
  adi: { pt: 'lei derrubada pelo Supremo Tribunal Federal', en: 'law struck down by the Supreme Court' },
  revogado: { pt: 'deixou de ser feriado por lei posterior', en: 'no longer a holiday under a later law' },
  facultativo: { pt: 'é ponto facultativo, não feriado', en: 'an optional day off, not a holiday' },
  municipal: { pt: 'feriado municipal, não estadual', en: 'a municipal holiday, not a state one' },
  'sem-fonte': { pt: 'não confirmado em texto oficial', en: 'not confirmed in an official text' },
  servidores: { pt: 'vale só para os servidores públicos', en: 'applies to civil servants only' },
  'nao-feriado': { pt: 'data comemorativa, não feriado', en: 'an observance, not a holiday' },
  projeto: { pt: 'só projeto de lei, sem aprovação', en: 'a bill only, not passed' },
};
const est = (uf: UF, y = Y) => K.folgas(y, { uf }).filter((f) => f.esfera === 'estadual');
const du = (uf: UF, y = Y) => K.diasUteis(y, { uf }).reduce((a, b) => a + b, 0);
const ART: Record<string, 'o' | 'a' | ''> = { AC: 'o', AP: 'o', AM: 'o', CE: 'o', DF: 'o', ES: 'o', MA: 'o', MT: 'o', MS: 'o', PA: 'o', PR: 'o', PI: 'o', RJ: 'o', RN: 'o', RS: 'o', TO: 'o', BA: 'a', PB: 'a' };
/** "do Acre", "da Bahia", "de Goiás" / "no Acre", "na Bahia", "em Goiás". */
const DE = (uf: UF) => `${ART[uf] === 'o' ? 'do' : ART[uf] === 'a' ? 'da' : 'de'} ${K.UF_NOME[uf]}`;
const EM = (uf: UF) => `${ART[uf] === 'o' ? 'no' : ART[uf] === 'a' ? 'na' : 'em'} ${K.UF_NOME[uf]}`;
const nomeUF = (uf: UF, l: L) => (l === 'en' && uf === 'DF' ? 'the Federal District' : K.UF_NOME[uf]);

/** Compõe um texto com partes opcionais (1) até caber entre min e max; fica com a variante mais completa. */
const compor = (min: number, max: number, parts: Array<[string, number]>, what: string) => {
  const opt = parts.map((p, i) => (p[1] ? i : -1)).filter((i) => i >= 0);
  let best: string | null = null, bestN = -1;
  for (let m = 0; m < 1 << opt.length; m++) {
    const on = new Set(opt.filter((_, k) => m & (1 << k)));
    const t = parts.filter((p, i) => !p[1] || on.has(i)).map((p) => p[0]).join('');
    if (t.length >= min && t.length <= max && on.size > bestN) { best = t; bestN = on.size; }
  }
  if (!best) throw new Error(`${what}: nenhuma combinação entre ${min} e ${max} caracteres`);
  return best;
};

/* ------------------------------------------------------------------ texto próprio de cada UF */
const D: Record<UF, Def> = {
  AC: {
    related: ['feriados-amazonas', 'feriados-rondonia', 'feriados-de-novembro', 'feriados-2027'],
    pt: {
      lead: 'O Acre é o estado com mais feriados estaduais do Brasil, seis, e o único que leva para a sexta-feira os feriados estaduais que caem no meio da semana, para que o descanso emende com o fim de semana.',
      nota: 'Os seis feriados vêm de leis diferentes: o Dia do Católico, 20 de janeiro, da Lei 3.137/2016; o Dia do Evangélico, 23 de janeiro, da Lei 1.538/2004; o Dia Internacional da Mulher, 8 de março, da Lei 1.411/2001; o aniversário do estado, 15 de junho, da Lei 14/1964; o Dia da Amazônia, 5 de setembro, da Lei 243/1968; e o Tratado de Petrópolis, 17 de novembro, da Lei 57/1965. A Lei 2.126/2009, alterada em 2009, manda comemorar na sexta os que caem de terça a quinta, menos o 15 de junho. Se dois caem na mesma semana, ocupam dias seguidos: em 2027, o 20 de janeiro passa para a sexta, 22, véspera do Dia do Evangélico. O 6 de agosto, início da Revolução Acreana, é data comemorativa, não feriado.',
      faq: { q: 'Por que no Acre o feriado muda de dia?', a: 'Por causa da Lei estadual 2.126/2009: feriado estadual que cai numa terça, quarta ou quinta é comemorado na sexta-feira da mesma semana, menos o aniversário do estado, 15 de junho. Os feriados nacionais não mudam de dia.' },
    },
    en: {
      lead: 'Acre has more state holidays than any other Brazilian state, six, and is the only one that moves state holidays falling mid-week to the Friday, so that the rest joins up with the weekend.',
      nota: "The six holidays come from different laws: Catholics' Day, 20 January, from Law 3,137/2016; Evangelicals' Day, 23 January, from Law 1,538/2004; International Women's Day, 8 March, from Law 1,411/2001; Statehood Day, 15 June, from Law 14/1964; Amazon Day, 5 September, from Law 243/1968; and the Treaty of Petrópolis, 17 November, from Law 57/1965. Law 2,126/2009, amended the same year, moves those falling Tuesday to Thursday to the Friday, except 15 June. If two fall in the same week they take consecutive days: in 2027, 20 January moves to Friday the 22nd, the day before Evangelicals' Day. 6 August, the start of the Acre Revolution, is an observance, not a holiday.",
      faq: { q: 'Why do holidays move to another day in Acre?', a: 'Because of State Law 2,126/2009: a state holiday falling on a Tuesday, Wednesday or Thursday is observed on the Friday of the same week, except Statehood Day, 15 June. National holidays do not move.' },
    },
  },
  AL: {
    related: ['feriados-pernambuco', 'feriados-sergipe', 'feriados-2027', 'feriados-2027'],
    pt: {
      lead: 'Alagoas tem três feriados estaduais, dois deles nas festas juninas: São João, 24 de junho, e São Pedro, 29 de junho, ambos por leis de 1993, além da Emancipação Política em 16 de setembro.',
      nota: 'São João e São Pedro são feriados pelas Leis 5.508 e 5.509, de 7 de julho de 1993. A Emancipação Política, que lembra a separação de Pernambuco em 1817, virou feriado estadual com a Lei 9.358, de agosto de 2024. O Dia Estadual do Evangélico, 30 de novembro, existe como data comemorativa, mas o artigo que fazia dele um feriado foi vetado, então não há folga. Em Maceió, a lei municipal soma a Sexta-feira da Paixão, Corpus Christi, um feriado em 29 de junho, a padroeira Nossa Senhora dos Prazeres em 27 de agosto e Nossa Senhora da Conceição em 8 de dezembro.',
      faq: { q: 'São João é feriado em Alagoas?', a: 'Sim, em todo o estado, pela Lei estadual 5.508/1993. São Pedro, 29 de junho, também, pela Lei 5.509/1993. Em 2027, São João cai numa quinta-feira e São Pedro numa terça.' },
    },
    en: {
      lead: "Alagoas has three state holidays, two of them during the June festivals: Saint John's Day, 24 June, and Saint Peter's Day, 29 June, both under laws from 1993, plus Political Emancipation Day on 16 September.",
      nota: "Saint John's and Saint Peter's days are holidays under Laws 5,508 and 5,509 of 7 July 1993. Political Emancipation Day, marking the split from Pernambuco in 1817, became a state holiday under Law 9,358 of August 2024. State Evangelical Day, 30 November, exists as an observance, but the article making it a holiday was vetoed, so there is no day off. In Maceió, municipal law adds Good Friday, Corpus Christi, a holiday on 29 June, the patron saint Our Lady of Prazeres on 27 August and Our Lady of the Conception on 8 December.",
      faq: { q: "Is Saint John's Day a holiday in Alagoas?", a: "Yes, statewide, under State Law 5,508/1993. Saint Peter's Day, 29 June, too, under Law 5,509/1993. In 2027, Saint John's Day falls on a Thursday and Saint Peter's on a Tuesday." },
    },
  },
  AP: {
    related: ['feriados-para', 'feriados-2027', 'feriados-2027', 'pontos-facultativos'],
    pt: {
      lead: 'O Amapá tem dois feriados estaduais confirmados: São José, padroeiro do estado, em 19 de março, e o Dia de Cabralzinho, em 15 de maio, que lembra o herói da defesa do território contra os franceses em 1895.',
      nota: 'Os dois aparecem como feriados estaduais na Portaria SJAP-Diref 4/2023 da Justiça Federal no Amapá, que cita a Lei 667/2002 para São José e a Lei 2.213/2017 para Cabralzinho; o governo do estado anunciou o feriado de Cabralzinho em 2026. O texto das leis não pôde ser aberto no site da Assembleia. O 13 de setembro, criação do Território Federal em 1943, aparece em listas oficiais da Justiça Federal, mas não achamos lei estadual que o crie, então fica fora da conta. O Dia de São Tiago, 25 de julho, foi feriado por uma lei de 2012 que o Supremo derrubou na ADI 4.820. Os feriados de Macapá não estão no site: a lei municipal não pôde ser lida.',
      faq: { q: 'O Dia de Cabralzinho é feriado no Amapá?', a: 'Sim, é feriado estadual em 15 de maio, criado pela Lei 2.213/2017 e comemorado desde 2018. Lembra Francisco Xavier da Veiga Cabral, o Cabralzinho, que liderou a resistência ao ataque francês no Amapá em 1895.' },
    },
    en: {
      lead: "Amapá has two confirmed state holidays: Saint Joseph's Day, the state's patron saint, on 19 March, and Cabralzinho Day, on 15 May, honouring the hero who defended the territory against the French in 1895.",
      nota: "Both appear as state holidays in Federal Court ordinance SJAP-Diref 4/2023 for Amapá, which cites Law 667/2002 for Saint Joseph and Law 2,213/2017 for Cabralzinho; the state government announced the Cabralzinho holiday in 2026. The laws themselves could not be opened on the assembly's site. 13 September, the creation of the Federal Territory in 1943, appears on official Federal Court lists, but we found no state law creating it, so it is left out of the count. Saint James's Day, 25 July, was a holiday under a 2012 law that the Supreme Court struck down in ADI 4,820. Macapá's holidays are not on the site: the municipal law could not be read.",
      faq: { q: 'Is Cabralzinho Day a holiday in Amapá?', a: 'Yes, it is a state holiday on 15 May, created by Law 2,213/2017 and observed since 2018. It honours Francisco Xavier da Veiga Cabral, known as Cabralzinho, who led resistance to the French attack in Amapá in 1895.' },
    },
  },
  AM: {
    related: ['feriados-acre', 'feriados-roraima', 'feriados-para', 'carnaval-2027'],
    pt: {
      lead: 'O Amazonas tem um feriado estadual, 5 de setembro, que lembra a elevação do Amazonas à categoria de província, em 1850. Em Manaus, a lista municipal é longa e inclui até a terça-feira de Carnaval.',
      nota: 'O feriado de 5 de setembro vem da Lei estadual 25, de 21 de dezembro de 1977, que "declara feriado estadual o dia 05 de setembro". O 20 de novembro, que uma lei estadual de 2010 já tornava feriado, hoje é feriado nacional. Manaus tem seis feriados municipais na lei: a terça de Carnaval, a Sexta-feira da Paixão, Corpus Christi, o próprio 5 de setembro, o aniversário da cidade em 24 de outubro e Nossa Senhora da Conceição em 8 de dezembro. É uma das poucas capitais onde o Carnaval é feriado de fato, e não só ponto facultativo.',
      faq: { q: 'Carnaval é feriado em Manaus?', a: 'A terça-feira de Carnaval é feriado municipal em Manaus, pela Lei 448/1998. A segunda-feira não é. No resto do Amazonas, Carnaval depende do decreto de cada prefeitura.' },
    },
    en: {
      lead: 'Amazonas has one state holiday, 5 September, marking the elevation of Amazonas to the rank of province in 1850. In Manaus the municipal list is long and even includes Carnival Tuesday.',
      nota: 'The 5 September holiday comes from State Law 25 of 21 December 1977, which "declares 5 September a state holiday". 20 November, which a 2010 state law had already made a holiday, is now a national holiday. Manaus has six municipal holidays in law: Carnival Tuesday, Good Friday, Corpus Christi, 5 September itself, the city anniversary on 24 October and Our Lady of the Conception on 8 December. It is one of the few capitals where Carnival is a real holiday and not just an optional day off.',
      faq: { q: 'Is Carnival a holiday in Manaus?', a: 'Carnival Tuesday is a municipal holiday in Manaus under Law 448/1998. Monday is not. Elsewhere in Amazonas, Carnival depends on each city hall\'s decree.' },
    },
  },
  BA: {
    related: ['feriados-sergipe', 'feriados-pernambuco', 'feriados-2027', 'carnaval-2027'],
    pt: {
      lead: 'A Bahia tem um feriado estadual, o Dois de Julho, que comemora a Independência da Bahia em 1823, quando as tropas portuguesas deixaram Salvador. Ele está na própria Constituição do estado.',
      nota: 'O artigo 6º, parágrafo 3º, da Constituição da Bahia de 1989 fixa o 2 de julho como data magna; a data já era feriado por lei estadual de 1936. Duas datas que costumam aparecer em listas não contam: a sexta-feira de Carnaval, que vem de um decreto de 1981 e não de lei, e o Dia do Servidor Público, 28 de outubro, que vale só para os servidores. Em Salvador, o Carnaval e outras datas são decididos por decreto da prefeitura a cada ano; como não conseguimos ler a lei municipal, os feriados da capital não estão no site.',
      faq: { q: 'O Dois de Julho é feriado em toda a Bahia?', a: 'Sim. A Constituição estadual faz do 2 de julho a data magna da Bahia, feriado em todo o estado. Em 2027 cai numa sexta-feira e forma um fim de semana de três dias.' },
    },
    en: {
      lead: 'Bahia has one state holiday, Dois de Julho, celebrating Bahia\'s Independence in 1823, when Portuguese troops left Salvador. It is written into the state constitution itself.',
      nota: 'Article 6, paragraph 3, of the 1989 Bahia Constitution sets 2 July as the state day; it had already been a holiday under a 1936 state law. Two dates often found on lists do not count: Carnival Friday, which comes from a 1981 decree rather than a law, and Public Servants\' Day, 28 October, which applies to civil servants only. In Salvador, Carnival and other dates are set by city hall decree each year; since we could not read the municipal law, the capital\'s holidays are not on the site.',
      faq: { q: 'Is 2 July a holiday across Bahia?', a: 'Yes. The state constitution makes 2 July Bahia\'s state day, a holiday throughout the state. In 2027 it falls on a Friday and makes a three-day weekend.' },
    },
  },
  CE: {
    related: ['feriados-piaui', 'feriados-rio-grande-do-norte', 'feriados-2027', 'feriados-2027'],
    pt: {
      lead: 'O Ceará tem um feriado estadual, 25 de março, a data magna que lembra a abolição da escravidão no estado em 1884, quatro anos antes da Lei Áurea. Em Fortaleza, São José e a padroeira também são feriado.',
      nota: 'A data magna está no artigo 18, parágrafo único, da Constituição do Ceará, acrescentado pela Emenda 73 de 2011. A emenda não diz "feriado"; quem transforma a data magna estadual em feriado civil é a Lei federal 9.093/1995. O 19 de março, São José, padroeiro do Ceará, é ponto facultativo no estado, mas feriado em Fortaleza pela Lei municipal 8.796/2003, que também inclui Nossa Senhora da Assunção em 15 de agosto, a Sexta-feira Santa e Corpus Christi.',
      faq: { q: '19 de março é feriado no Ceará?', a: 'Em Fortaleza, sim: São José é feriado municipal pela Lei 8.796/2003. No estado como um todo, é ponto facultativo. O feriado estadual de março é o dia 25, data magna da abolição.' },
    },
    en: {
      lead: 'Ceará has one state holiday, 25 March, the state day marking the abolition of slavery in Ceará in 1884, four years before the national Golden Law. In Fortaleza, Saint Joseph and the patron saint are holidays too.',
      nota: 'The state day is in article 18, sole paragraph, of the Ceará Constitution, added by Amendment 73 of 2011. The amendment does not say "holiday"; what makes a state day a civil holiday is federal Law 9,093/1995. 19 March, Saint Joseph, patron saint of Ceará, is an optional day off in the state but a holiday in Fortaleza under municipal Law 8,796/2003, which also includes Our Lady of the Assumption on 15 August, Good Friday and Corpus Christi.',
      faq: { q: 'Is 19 March a holiday in Ceará?', a: 'In Fortaleza, yes: Saint Joseph is a municipal holiday under Law 8,796/2003. Statewide it is an optional day off. The state holiday in March is the 25th, the abolition state day.' },
    },
  },
  DF: {
    related: ['corpus-christi-2027', 'feriados-goias', 'feriados-de-novembro', 'pontos-facultativos'],
    pt: {
      lead: 'O Distrito Federal tem três feriados distritais: o aniversário de Brasília em 21 de abril, que coincide com Tiradentes, Corpus Christi, e o Dia do Evangélico em 30 de novembro. Como não tem municípios, não há feriado municipal à parte.',
      nota: 'O aniversário de Brasília e Corpus Christi vêm da Lei distrital 72, de 27 de dezembro de 1989; o Dia do Evangélico, da Lei 963/1995. Por isso Corpus Christi, que no resto do país é em geral ponto facultativo, é feriado de verdade em Brasília e em todas as regiões administrativas. Os órgãos federais sediados em Brasília seguem a portaria do Ministério da Gestão, que trata Corpus Christi como ponto facultativo; para quem trabalha no setor privado no DF, vale a lei distrital. Em 2027, Corpus Christi cai em 27 de maio, uma quinta, e o Dia do Evangélico numa terça.',
      faq: { q: 'Corpus Christi é feriado em Brasília?', a: 'Sim. A Lei distrital 72/1989 faz de Corpus Christi feriado no Distrito Federal inteiro. Em 2027 cai na quinta-feira 27 de maio, e a sexta 28 vira uma emenda de um dia.' },
    },
    en: {
      lead: 'The Federal District has three district holidays: Brasília\'s anniversary on 21 April, which coincides with Tiradentes Day, Corpus Christi, and Evangelical Day on 30 November. As it has no municipalities, there are no separate municipal holidays.',
      nota: "Brasília's anniversary and Corpus Christi come from District Law 72 of 27 December 1989; Evangelical Day from Law 963/1995. That is why Corpus Christi, usually an optional day off elsewhere, is a real holiday in Brasília and every administrative region. Federal bodies based in Brasília follow the Ministry of Management's ordinance, which treats Corpus Christi as an optional day off; for private-sector workers in the district, the district law applies. In 2027, Corpus Christi falls on Thursday 27 May and Evangelical Day on a Tuesday.",
      faq: { q: 'Is Corpus Christi a holiday in Brasília?', a: 'Yes. District Law 72/1989 makes Corpus Christi a holiday throughout the Federal District. In 2027 it falls on Thursday 27 May, and Friday the 28th becomes a one-day bridge.' },
    },
  },
  ES: {
    related: ['feriados-minas-gerais', 'feriados-rio-de-janeiro', 'pascoa-2027', 'feriados-2027'],
    pt: {
      lead: 'O Espírito Santo tem um feriado estadual móvel: o dia de Nossa Senhora da Penha, padroeira do estado, comemorado na segunda-feira oito dias depois da Páscoa. É a data magna capixaba desde 2019.',
      nota: 'A Lei estadual 11.010, de 3 de julho de 2019, declarou data magna o dia dedicado à padroeira, que a Festa da Penha celebra no Convento da Penha, em Vila Velha. A data depende da Páscoa: em 2026 foi 13 de abril, como confirmou o Decreto 124-S/2026 do governo, e em 2027 é 5 de abril. Muitas listas dizem que o Espírito Santo não tem feriado estadual; isso valia antes de 2019. Os feriados municipais de Vitória não estão no site: não conseguimos ler a lei municipal.',
      faq: { q: 'Quando é o feriado de Nossa Senhora da Penha?', a: 'Na segunda-feira oito dias depois do domingo de Páscoa. Em 2027 cai em 5 de abril e em 2028 em 24 de abril. É feriado em todo o Espírito Santo pela Lei estadual 11.010/2019.' },
    },
    en: {
      lead: "Espírito Santo has one movable state holiday: the day of Our Lady of Penha, the state's patron saint, observed on the Monday eight days after Easter. It has been the state day since 2019.",
      nota: 'State Law 11,010 of 3 July 2019 declared the patron saint\'s day the state day; the Penha Festival celebrates it at the Penha Convent in Vila Velha. The date follows Easter: in 2026 it was 13 April, as confirmed by government Decree 124-S/2026, and in 2027 it is 5 April. Many lists say Espírito Santo has no state holiday; that was true before 2019. Vitória\'s municipal holidays are not on the site: we could not read the municipal law.',
      faq: { q: 'When is the Our Lady of Penha holiday?', a: 'On the Monday eight days after Easter Sunday. In 2027 it falls on 5 April and in 2028 on 24 April. It is a holiday throughout Espírito Santo under State Law 11,010/2019.' },
    },
  },
  GO: {
    related: ['feriados-distrito-federal', 'feriados-mato-grosso', 'pontos-facultativos', 'feriados-2027'],
    pt: {
      lead: 'Goiás não tem feriado estadual civil. As três datas que aparecem nas listas, 26 de julho, 24 de outubro e 28 de outubro, estão no estatuto dos servidores e valem só para o serviço público estadual.',
      nota: 'A Lei estadual 20.756/2020, o estatuto dos servidores, diz no artigo 269 que são feriados do serviço público estadual a fundação da Cidade de Goiás, 26 de julho, o lançamento da pedra fundamental de Goiânia, 24 de outubro, e o Dia do Servidor, 28 de outubro. O governador pode mudar a data por decreto: em 2026, o 26 de julho foi para 20 de julho. Para empresas privadas, esses dias são úteis, e por isso as calculadoras não os descontam. Os feriados municipais de Goiânia não estão no site: a lei municipal não pôde ser lida.',
      faq: { q: '24 de outubro é feriado em Goiás?', a: 'Não para todos. O 24 de outubro, pedra fundamental de Goiânia, é feriado só para o serviço público estadual, pelo estatuto dos servidores. No setor privado é dia útil, salvo lei municipal ou decreto da prefeitura.' },
    },
    en: {
      lead: 'Goiás has no civil state holiday. The three dates found on lists, 26 July, 24 October and 28 October, are in the civil service statute and apply only to the state civil service.',
      nota: 'State Law 20,756/2020, the civil service statute, says in article 269 that the state civil service has holidays on the founding of the City of Goiás, 26 July, the laying of Goiânia\'s foundation stone, 24 October, and Public Servants\' Day, 28 October. The governor may move the date by decree: in 2026, 26 July went to 20 July. For private employers these are working days, which is why the calculators do not remove them. Goiânia\'s municipal holidays are not on the site: the municipal law could not be read.',
      faq: { q: 'Is 24 October a holiday in Goiás?', a: 'Not for everyone. 24 October, Goiânia\'s foundation stone day, is a holiday for the state civil service only, under the civil service statute. In the private sector it is a working day unless a municipal law or city decree says otherwise.' },
    },
  },
  MA: {
    related: ['feriados-piaui', 'feriados-para', 'feriados-2027', 'feriados-2027'],
    pt: {
      lead: 'No Maranhão, o 28 de julho, adesão do Maranhão à Independência em 1823, é citado como feriado estadual em muitas listas. Não conseguimos ler o texto oficial que o cria, então ele ainda não entra na conta deste site.',
      nota: 'Procuramos a lei do 28 de julho no site da Assembleia Legislativa e no portal de legislação do estado, que não responderam, e o calendário do Tribunal de Justiça para 2026 só existe em imagem, sem a base legal. Pela nossa regra, uma data só entra na contagem depois de lida num texto oficial. Por isso a página mostra o Maranhão só com os feriados nacionais e deixa o 28 de julho na lista de datas não confirmadas, com a data. Assim que o texto for lido, a data entra em todas as calculadoras. Os feriados de São Luís também não estão no site, pelo mesmo motivo.',
      faq: { q: '28 de julho é feriado no Maranhão?', a: 'É citado como feriado estadual, a adesão do Maranhão à Independência. Ainda não lemos o texto oficial que o cria, por isso as calculadoras do site não o descontam. Confira o decreto de calendário do governo do estado para o ano.' },
    },
    en: {
      lead: "In Maranhão, 28 July, the state's adherence to Independence in 1823, is cited as a state holiday on many lists. We could not read the official text creating it, so it does not yet count on this site.",
      nota: "We looked for the 28 July law on the Legislative Assembly's site and the state legislation portal, which did not respond, and the Court of Justice's 2026 calendar exists only as an image, without its legal basis. Under our rule, a date counts only once it has been read in an official text. So the page shows Maranhão with national holidays only and keeps 28 July on the list of unconfirmed dates, with its date. As soon as the text is read, the date will enter every calculator. São Luís's holidays are not on the site either, for the same reason.",
      faq: { q: 'Is 28 July a holiday in Maranhão?', a: "It is cited as a state holiday, Maranhão's adherence to Independence. We have not yet read the official text creating it, so the site's calculators do not remove it. Check the state government's calendar decree for the year." },
    },
  },
  MT: {
    related: ['feriados-mato-grosso-do-sul', 'feriados-goias', 'corpus-christi-2027', 'feriados-2027'],
    pt: {
      lead: 'Mato Grosso não tem feriado estadual: o decreto do governo com o calendário de 2026 lista só os feriados nacionais. Em Cuiabá, a capital, há três feriados municipais, entre eles Corpus Christi.',
      nota: 'O Decreto estadual 1.787/2025, que fixa os feriados e pontos facultativos de 2026, não traz nenhuma data estadual. O 20 de novembro, que já foi feriado estadual, hoje é nacional. Cuiabá tem a fundação da cidade em 8 de abril, Corpus Christi e Nossa Senhora da Conceição em 8 de dezembro, pelo Decreto municipal 11.585/2025, que cita as leis municipais de 1968, 2000 e 2012. A prefeitura pode antecipar o 8 de dezembro por decreto, como já fez em outros anos.',
      faq: { q: 'Qual é o feriado de Cuiabá em abril?', a: 'O 8 de abril, aniversário da fundação de Cuiabá, em 1719. É feriado municipal na capital; no resto de Mato Grosso é dia útil. Em 2027 cai numa quinta-feira.' },
    },
    en: {
      lead: 'Mato Grosso has no state holiday: the government decree with the 2026 calendar lists national holidays only, so outside the capital the calendar is the national one. In Cuiabá, the capital, there are three municipal holidays, Corpus Christi among them.',
      nota: 'State Decree 1,787/2025, setting the 2026 holidays and optional days off, contains no state date. 20 November, once a state holiday, is now national. Cuiabá has the city\'s founding on 8 April, Corpus Christi and Our Lady of the Conception on 8 December, under municipal Decree 11,585/2025, which cites municipal laws from 1968, 2000 and 2012. The city hall may bring 8 December forward by decree, as it has done in other years.',
      faq: { q: "What is Cuiabá's April holiday?", a: "8 April, the anniversary of Cuiabá's founding in 1719. It is a municipal holiday in the capital; elsewhere in Mato Grosso it is a working day. In 2027 it falls on a Thursday." },
    },
  },
  MS: {
    related: ['feriados-mato-grosso', 'feriados-parana', 'feriados-2027', 'feriados-2027'],
    pt: {
      lead: 'Mato Grosso do Sul tem um feriado estadual, 11 de outubro, aniversário da criação do estado, separado de Mato Grosso em 1977. Em 2027 ele cai numa segunda-feira, véspera de Nossa Senhora Aparecida.',
      nota: 'O decreto do governo com os feriados de 2026, publicado no Diário Oficial, chama o 11 de outubro de "feriado estadual"; a lei de origem é a Lei estadual 10, de 1979. Em 2027 a combinação é rara: o 11 de outubro numa segunda e o 12, Aparecida, numa terça, dão quatro dias livres seguidos sem gastar nenhuma folga. Em Campo Grande, a prefeitura confirma dois feriados municipais, Santo Antônio, padroeiro, em 13 de junho, e o aniversário da cidade, 26 de agosto; Corpus Christi é só ponto facultativo na capital.',
      faq: { q: 'O feriado de 11 de outubro emenda com o 12 em Mato Grosso do Sul?', a: 'Em 2027, sim, e sem gastar folga: o 11 cai numa segunda e o 12, Nossa Senhora Aparecida, numa terça. Com o fim de semana, são quatro dias livres, de 9 a 12 de outubro.' },
    },
    en: {
      lead: 'Mato Grosso do Sul has one state holiday, 11 October, the anniversary of the state\'s creation, split from Mato Grosso in 1977. In 2027 it falls on a Monday, the day before Our Lady of Aparecida.',
      nota: 'The government decree with the 2026 holidays, published in the Official Gazette, calls 11 October a "state holiday"; the original law is State Law 10 of 1979. In 2027 the combination is rare: 11 October on a Monday and the 12th, Aparecida, on a Tuesday give four free days in a row without any leave. In Campo Grande, city hall confirms two municipal holidays, Saint Anthony, the patron saint, on 13 June, and the city anniversary, 26 August; Corpus Christi is only an optional day off in the capital.',
      faq: { q: 'Does the 11 October holiday join up with the 12th in Mato Grosso do Sul?', a: 'In 2027, yes, with no leave needed: the 11th falls on a Monday and the 12th, Our Lady of Aparecida, on a Tuesday. With the weekend, that is four free days, 9 to 12 October.' },
    },
  },
  MG: {
    related: ['feriados-sao-paulo', 'feriados-espirito-santo', 'feriados-goias', 'corpus-christi-2027'],
    pt: {
      lead: 'Minas Gerais tem uma data magna, 21 de abril, que coincide com Tiradentes, feriado nacional: o estado não ganha nenhum dia de folga a mais. Em Belo Horizonte, a lei municipal soma quatro feriados religiosos.',
      nota: 'O artigo 256 da Constituição mineira fixa o 21 de abril, dia da morte de Tiradentes, como data magna do estado. Como o dia já é feriado nacional pela Lei 662/1949, o calendário de Minas é igual ao nacional. O 16 de julho e o 8 de dezembro são datas comemorativas estaduais, sem folga. Belo Horizonte, pela Lei municipal 11.397/2022, tem como feriados a Sexta-feira da Paixão, Corpus Christi, a Assunção de Nossa Senhora em 15 de agosto e a Imaculada Conceição em 8 de dezembro, além do 20 de novembro, hoje nacional.',
      faq: { q: 'Minas Gerais tem feriado estadual?', a: 'Tem a data magna, 21 de abril, que é o mesmo dia de Tiradentes, feriado nacional. Na prática, não há dia de folga a mais no estado. Os feriados extras são municipais, como os quatro de Belo Horizonte.' },
    },
    en: {
      lead: 'Minas Gerais has a state day, 21 April, which coincides with Tiradentes Day, a national holiday: the state gains no extra day off. In Belo Horizonte, municipal law adds four religious holidays.',
      nota: "Article 256 of the Minas Gerais Constitution sets 21 April, the day Tiradentes was executed, as the state day. As the day is already a national holiday under Law 662/1949, the Minas calendar matches the national one. 16 July and 8 December are state observances without a day off. Belo Horizonte, under municipal Law 11,397/2022, has Good Friday, Corpus Christi, the Assumption on 15 August and the Immaculate Conception on 8 December as holidays, plus 20 November, now national.",
      faq: { q: 'Does Minas Gerais have a state holiday?', a: 'It has a state day, 21 April, the same day as Tiradentes, a national holiday. In practice there is no extra day off in the state. The extra holidays are municipal, such as Belo Horizonte\'s four.' },
    },
  },
  PA: {
    related: ['feriados-amapa', 'feriados-maranhao', 'feriados-amazonas'],
    pt: {
      lead: 'O Pará tem um feriado estadual, 15 de agosto, que lembra a adesão do Grão-Pará à Independência do Brasil em 1823, quase um ano depois do Grito do Ipiranga. É o único feriado de agosto no estado.',
      nota: 'O decreto do governo do Pará com o calendário de 2026, Decreto 5.122 de dezembro de 2025, lista o 15 de agosto, "Adesão do Pará à Independência do Brasil", como feriado estadual. Em 2027 ele cai num domingo, sem efeito sobre os dias úteis; em 2028, numa terça, com emenda na segunda 14. O Círio de Nazaré, em outubro, é a maior festa religiosa do estado, mas acontece num domingo e não é feriado estadual. Os feriados municipais de Belém não estão no site: os portais oficiais da cidade e do tribunal não puderam ser lidos.',
      faq: { q: 'O Círio de Nazaré é feriado no Pará?', a: 'O Círio acontece sempre num domingo, o segundo de outubro, então não precisa de feriado. A segunda-feira seguinte não é feriado estadual. O feriado do Pará é 15 de agosto.' },
    },
    en: {
      lead: "Pará has one state holiday, 15 August, marking Grão-Pará's adherence to Brazilian Independence in 1823, almost a year after the Cry of Ipiranga. It is the state's only holiday in August.",
      nota: "The Pará government's decree with the 2026 calendar, Decree 5,122 of December 2025, lists 15 August, \"Pará's Adherence to Brazilian Independence\", as a state holiday. In 2027 it falls on a Sunday, with no effect on working days; in 2028 on a Tuesday, with a bridge on Monday the 14th. The Círio de Nazaré in October is the state's biggest religious festival, but it takes place on a Sunday and is not a state holiday. Belém's municipal holidays are not on the site: the official city and court portals could not be read.",
      faq: { q: 'Is the Círio de Nazaré a holiday in Pará?', a: 'The Círio always takes place on a Sunday, the second in October, so it needs no holiday. The following Monday is not a state holiday. Pará\'s holiday is 15 August.' },
    },
  },
  PB: {
    related: ['feriados-pernambuco', 'feriados-rio-grande-do-norte', 'feriados-2027'],
    pt: {
      lead: 'A Paraíba tem um feriado estadual, 5 de agosto, fundação do estado e data magna, que é também o dia da padroeira de João Pessoa, Nossa Senhora das Neves. Duas datas que já foram feriado estadual deixaram de ser.',
      nota: 'A Lei estadual 10.601, de 16 de dezembro de 2015, confirmou o 5 de agosto como data magna e feriado civil. A mesma lei revogou o feriado de 26 de julho, em memória do ex-presidente João Pessoa, que vinha de 1967. O Dia dos Bancários, 28 de agosto, criado como feriado estadual em 2009, foi derrubado pelo Supremo na ADI 5.566. João Pessoa tem, pela Lei municipal 13.768/2019, a Sexta-feira da Paixão, São João em 24 de junho, Nossa Senhora das Neves em 5 de agosto e Nossa Senhora da Conceição em 8 de dezembro.',
      faq: { q: '26 de julho ainda é feriado na Paraíba?', a: 'Não. O feriado em memória de João Pessoa foi revogado pela Lei estadual 10.601/2015, que manteve só o 5 de agosto como feriado estadual. O 26 de julho é hoje um dia útil comum.' },
    },
    en: {
      lead: "Paraíba has one state holiday, 5 August, the state's founding and state day, which is also the day of João Pessoa's patron saint, Our Lady of the Snows. Two dates that used to be state holidays no longer are.",
      nota: 'State Law 10,601 of 16 December 2015 confirmed 5 August as the state day and a civil holiday. The same law repealed the 26 July holiday in memory of former president João Pessoa, dating from 1967. Bank Workers\' Day, 28 August, created as a state holiday in 2009, was struck down by the Supreme Court in ADI 5,566. João Pessoa has, under municipal Law 13,768/2019, Good Friday, Saint John\'s Day on 24 June, Our Lady of the Snows on 5 August and Our Lady of the Conception on 8 December.',
      faq: { q: 'Is 26 July still a holiday in Paraíba?', a: 'No. The holiday in memory of João Pessoa was repealed by State Law 10,601/2015, which kept only 5 August as a state holiday. 26 July is now an ordinary working day.' },
    },
  },
  PR: {
    related: ['feriados-santa-catarina', 'feriados-sao-paulo', 'corpus-christi-2027', 'feriados-2027'],
    pt: {
      lead: 'O Paraná não tem feriado estadual. O 19 de dezembro, emancipação política do estado, deixou de ser feriado em 2014, e a lei diz isso com todas as letras. Em Curitiba há dois feriados municipais.',
      nota: 'A Lei estadual 18.384/2014 mantém o 19 de dezembro como data comemorativa, "não se constituindo em feriado civil", e revogou a lei de 1962 que o criava. O decreto do governo com o calendário de 2026 confirma: nenhum feriado estadual. Em Curitiba, a Câmara Municipal confirma Corpus Christi, pela Lei 3.015/1967, e Nossa Senhora da Luz dos Pinhais, padroeira da cidade, em 8 de setembro. Em 2027 o 8 de setembro cai numa quarta, logo depois da Independência na terça: quem folga na segunda 6 emenda de sábado a quarta.',
      faq: { q: '19 de dezembro é feriado no Paraná?', a: 'Não desde 2014. A Lei estadual 18.384/2014 diz que a emancipação política do Paraná é data comemorativa e não feriado civil. Bancos, comércio e repartições funcionam normalmente.' },
    },
    en: {
      lead: 'Paraná has no state holiday. 19 December, the state\'s political emancipation, stopped being a holiday in 2014, and the law says so in plain words. Curitiba has two municipal holidays.',
      nota: "State Law 18,384/2014 keeps 19 December as an observance, \"not constituting a civil holiday\", and repealed the 1962 law that created it. The government decree with the 2026 calendar confirms it: no state holiday. In Curitiba, the City Council confirms Corpus Christi, under Law 3,015/1967, and Our Lady of Light of the Pines, the city's patron saint, on 8 September. In 2027, 8 September falls on a Wednesday, right after Independence Day on the Tuesday: taking Monday the 6th off gives Saturday to Wednesday.",
      faq: { q: 'Is 19 December a holiday in Paraná?', a: 'Not since 2014. State Law 18,384/2014 says the political emancipation of Paraná is an observance and not a civil holiday. Banks, shops and public offices open as usual.' },
    },
  },
  PE: {
    related: ['feriados-paraiba', 'feriados-alagoas', 'feriados-2027', 'carnaval-2027'],
    pt: {
      lead: 'Pernambuco tem um feriado estadual, 6 de março, data magna que lembra a Revolução Pernambucana de 1817, o movimento republicano que governou a capitania por mais de dois meses. No Recife, São João e a padroeira são feriado.',
      nota: 'O 6 de março é feriado pela Lei estadual 16.241/2017, a lei do calendário oficial de eventos de Pernambuco, sempre na data fixa. Em 2027 cai num sábado; em 2028, numa segunda. No Recife, a Justiça Federal da 5ª Região lista como feriados municipais de 2026 São João, 24 de junho, e Nossa Senhora do Carmo, padroeira da cidade, 16 de julho, com base na Lei municipal 9.777/1967; o texto da lei não pôde ser aberto no site da Câmara. O Carnaval do Recife e de Olinda depende de decreto a cada ano.',
      faq: { q: 'Por que 6 de março é feriado em Pernambuco?', a: 'Porque é a data magna do estado: em 6 de março de 1817 começou a Revolução Pernambucana, que proclamou uma república em Recife. A Lei estadual 16.241/2017 faz da data um feriado em todo o estado.' },
    },
    en: {
      lead: 'Pernambuco has one state holiday, 6 March, the state day marking the Pernambuco Revolution of 1817, the republican movement that ran the captaincy for over two months. In Recife, Saint John and the patron saint are holidays.',
      nota: "6 March is a holiday under State Law 16,241/2017, Pernambuco's official events calendar law, always on the fixed date. In 2027 it falls on a Saturday; in 2028 on a Monday. In Recife, the Federal Court of the 5th Region lists Saint John's Day, 24 June, and Our Lady of Mount Carmel, the city's patron saint, 16 July, as 2026 municipal holidays, based on municipal Law 9,777/1967; the law could not be opened on the council's site. Carnival in Recife and Olinda depends on a decree each year.",
      faq: { q: 'Why is 6 March a holiday in Pernambuco?', a: 'Because it is the state day: on 6 March 1817 the Pernambuco Revolution began, proclaiming a republic in Recife. State Law 16,241/2017 makes the date a holiday throughout the state.' },
    },
  },
  PI: {
    related: ['feriados-ceara', 'feriados-maranhao', 'feriados-2027', 'feriados-2027'],
    pt: {
      lead: 'O Piauí tem um feriado estadual, 19 de outubro, o Dia do Piauí, criado por uma lei de 1937 que continua em vigor. A Batalha do Jenipapo, em 13 de março, é muito lembrada no estado, mas não é feriado.',
      nota: 'A Lei estadual 176, de 30 de agosto de 1937, diz que "19 de Outubro será feriado estadual", em memória da adesão de Parnaíba à Independência em 1822. Ela continua valendo: leis de 2020 e 2021 só anteciparam o feriado, durante a pandemia, "por força da Lei 176/1937". O 13 de março, Batalha do Jenipapo, não tem lei estadual de feriado. Teresina tem, pela Lei municipal 2.275/1994, a Sexta-feira da Paixão, Corpus Christi, o aniversário da cidade em 16 de agosto, Finados e Nossa Senhora da Conceição em 8 de dezembro.',
      faq: { q: 'A Batalha do Jenipapo é feriado no Piauí?', a: 'Não. O 13 de março é data histórica muito lembrada, mas não há lei estadual que faça dele um feriado. O feriado estadual do Piauí é o 19 de outubro.' },
    },
    en: {
      lead: 'Piauí has one state holiday, 19 October, Piauí Day, created by a 1937 law that is still in force. The Battle of Jenipapo, on 13 March, is widely remembered in the state but is not a holiday.',
      nota: 'State Law 176 of 30 August 1937 says "19 October shall be a state holiday", in memory of Parnaíba\'s adherence to Independence in 1822. It is still in force: laws in 2020 and 2021 only brought the holiday forward during the pandemic "by virtue of Law 176/1937". 13 March, the Battle of Jenipapo, has no state holiday law. Teresina has, under municipal Law 2,275/1994, Good Friday, Corpus Christi, the city anniversary on 16 August, All Souls\' Day and Our Lady of the Conception on 8 December.',
      faq: { q: 'Is the Battle of Jenipapo a holiday in Piauí?', a: 'No. 13 March is a widely remembered historical date, but no state law makes it a holiday. Piauí\'s state holiday is 19 October.' },
    },
  },
  RJ: {
    related: ['carnaval-2027', 'corpus-christi-2027', 'feriados-sao-paulo', 'feriados-espirito-santo'],
    pt: {
      lead: 'O Rio de Janeiro tem três feriados estaduais: a terça-feira de Carnaval, São Jorge em 23 de abril e, desde 2026, Corpus Christi. É o único estado onde o Carnaval é feriado por lei estadual.',
      nota: 'A terça de Carnaval é feriado pela Lei estadual 5.243/2008 e São Jorge pela Lei 5.198/2008, que o Supremo declarou constitucional na ADI 4.092, em 2023. Corpus Christi entrou com a Lei 11.002, de 22 de outubro de 2025; a ação contra ela, ADI 7.898, foi julgada improcedente em 2026. Duas leis estaduais foram derrubadas pelo Supremo: a que fazia da Quarta-feira de Cinzas feriado bancário (ADI 6.083) e a que fazia do Dia das Mães feriado (ADI 6.133). Os feriados municipais da cidade do Rio, como São Sebastião em 20 de janeiro, não estão no site: os portais da prefeitura e da Câmara não puderam ser lidos.',
      faq: { q: 'Corpus Christi é feriado no Rio de Janeiro?', a: 'Sim, desde a Lei estadual 11.002/2025, em todo o estado. O primeiro foi em 4 de junho de 2026; em 2027 cai em 27 de maio, uma quinta-feira. O Supremo manteve a lei ao julgar a ADI 7.898.' },
    },
    en: {
      lead: 'Rio de Janeiro has three state holidays: Carnival Tuesday, Saint George\'s Day on 23 April and, since 2026, Corpus Christi. It is the only state where Carnival is a holiday under state law.',
      nota: "Carnival Tuesday is a holiday under State Law 5,243/2008 and Saint George's Day under Law 5,198/2008, which the Supreme Court held constitutional in ADI 4,092 in 2023. Corpus Christi came in with Law 11,002 of 22 October 2025; the challenge to it, ADI 7,898, was dismissed in 2026. Two state laws were struck down by the Supreme Court: one making Ash Wednesday a bank holiday (ADI 6,083) and one making Mother's Day a holiday (ADI 6,133). The city of Rio's municipal holidays, such as Saint Sebastian on 20 January, are not on the site: the city hall and council portals could not be read.",
      faq: { q: 'Is Corpus Christi a holiday in Rio de Janeiro?', a: 'Yes, since State Law 11,002/2025, throughout the state. The first one was on 4 June 2026; in 2027 it falls on 27 May, a Thursday. The Supreme Court upheld the law in ADI 7,898.' },
    },
  },
  RN: {
    related: ['feriados-paraiba', 'feriados-ceara', 'feriados-2027', 'feriados-de-novembro'],
    pt: {
      lead: 'No Rio Grande do Norte, o 3 de outubro, dia dos Mártires de Cunhaú e Uruaçu, é citado como feriado estadual. Ainda não lemos o texto oficial que o cria; em Natal, a lei municipal de feriados foi conferida.',
      nota: 'Os mártires de Cunhaú e Uruaçu, mortos em 1645, foram canonizados em 2017, e a data é lembrada em todo o estado. Os portais da Assembleia, do governo e do Tribunal de Justiça não deixaram ler a lei, e por isso o 3 de outubro aparece aqui como "não confirmado" e não é descontado das contas. Em Natal, a Lei municipal 1.617/1967 traz Santos Reis em 6 de janeiro, a Sexta-feira da Paixão, Corpus Christi e Nossa Senhora da Apresentação, padroeira, em 21 de novembro, um dia depois da Consciência Negra.',
      faq: { q: 'Santos Reis é feriado em Natal?', a: 'Sim, o 6 de janeiro é feriado municipal em Natal pela Lei 1.617/1967, ligado à fundação da cidade e ao Forte dos Reis Magos. No resto do Rio Grande do Norte é dia útil. Em 2027 cai numa quarta-feira.' },
    },
    en: {
      lead: 'In Rio Grande do Norte, 3 October, the day of the Martyrs of Cunhaú and Uruaçu, is cited as a state holiday. We have not yet read the official text creating it; in Natal, the municipal holiday law has been checked.',
      nota: 'The martyrs of Cunhaú and Uruaçu, killed in 1645, were canonised in 2017, and the date is remembered across the state. The assembly, government and Court of Justice portals would not let us read the law, so 3 October appears here as "not confirmed" and is not removed from the counts. In Natal, municipal Law 1,617/1967 gives Epiphany (Santos Reis) on 6 January, Good Friday, Corpus Christi and Our Lady of the Presentation, the patron saint, on 21 November, one day after Black Consciousness Day.',
      faq: { q: 'Is Epiphany a holiday in Natal?', a: 'Yes, 6 January is a municipal holiday in Natal under Law 1,617/1967, linked to the city\'s founding and the Reis Magos Fort. Elsewhere in Rio Grande do Norte it is a working day. In 2027 it falls on a Wednesday.' },
    },
  },
  RS: {
    related: ['feriados-santa-catarina', 'feriados-parana', 'feriados-2027', 'feriados-2027'],
    pt: {
      lead: 'O Rio Grande do Sul tem um feriado estadual, 20 de setembro, data magna que lembra o início da Revolução Farroupilha, em 1835. Em Porto Alegre, Nossa Senhora dos Navegantes, em 2 de fevereiro, também é feriado.',
      nota: 'O 20 de setembro está no artigo 6º da Constituição do estado, desde a Emenda 11 de 1995, e o Decreto estadual 58.607/2026 o lista como "Feriado Estadual: 20 de setembro". Em 2027 cai numa segunda, logo depois de um fim de semana, e forma três dias livres sem folga. Em Porto Alegre, a Lei municipal 3.033/1967, com as mudanças de 2015 e 2023, traz Nossa Senhora dos Navegantes e Iemanjá em 2 de fevereiro, a Sexta-feira da Paixão, Corpus Christi e Finados, além do 20 de novembro.',
      faq: { q: '2 de fevereiro é feriado em Porto Alegre?', a: 'Sim, é feriado municipal de Nossa Senhora dos Navegantes e, desde a Lei 13.591/2023, também de Iemanjá. Vale só na capital. Em 2027 cai numa terça-feira.' },
    },
    en: {
      lead: 'Rio Grande do Sul has one state holiday, 20 September, the state day marking the start of the Ragamuffin War (Revolução Farroupilha) in 1835. In Porto Alegre, Our Lady of Navigators on 2 February is also a holiday.',
      nota: "20 September is in article 6 of the state constitution, since Amendment 11 of 1995, and State Decree 58,607/2026 lists it as \"State Holiday: 20 September\". In 2027 it falls on a Monday, right after a weekend, giving three free days with no leave. In Porto Alegre, municipal Law 3,033/1967, as amended in 2015 and 2023, gives Our Lady of Navigators and Iemanjá on 2 February, Good Friday, Corpus Christi and All Souls' Day, plus 20 November.",
      faq: { q: 'Is 2 February a holiday in Porto Alegre?', a: 'Yes, it is a municipal holiday for Our Lady of Navigators and, since Law 13,591/2023, also for Iemanjá. It applies in the capital only. In 2027 it falls on a Tuesday.' },
    },
  },
  RO: {
    related: ['feriados-acre', 'feriados-amazonas', 'feriados-2027', 'carnaval-2027'],
    pt: {
      lead: 'Rondônia tem um feriado estadual, 4 de janeiro, data magna da instalação do estado, em 1982. Dois outros feriados estaduais deixaram de existir: o Dia do Evangélico e a segunda-feira de Carnaval.',
      nota: 'A Lei estadual 2.291/2010 "declara o dia 4 de janeiro data magna e feriado civil estadual". O Dia do Evangélico, 18 de junho, criado por lei de 2001, foi derrubado pelo Supremo na ADI 3.940, em 2020. A segunda de Carnaval, como Dia do Comerciário, foi revogada pela Lei 3.979/2017. Porto Velho tem, pela Lei municipal 190/1980, São Francisco de Sales em 24 de janeiro, Nossa Senhora Auxiliadora em 24 de maio, Santa Terezinha e a criação do município em 2 de outubro, e a Sexta-feira da Paixão.',
      faq: { q: 'O Dia do Evangélico ainda é feriado em Rondônia?', a: 'Não. A lei estadual que fazia do 18 de junho um feriado foi julgada inconstitucional pelo Supremo Tribunal Federal na ADI 3.940, em 2020. O dia é útil em todo o estado.' },
    },
    en: {
      lead: "Rondônia has one state holiday, 4 January, the state day marking the state's installation in 1982. Two other state holidays no longer exist: Evangelical Day and Carnival Monday.",
      nota: 'State Law 2,291/2010 "declares 4 January the state day and a state civil holiday". Evangelical Day, 18 June, created by a 2001 law, was struck down by the Supreme Court in ADI 3,940 in 2020. Carnival Monday, as Shop Workers\' Day, was repealed by Law 3,979/2017. Porto Velho has, under municipal Law 190/1980, Saint Francis de Sales on 24 January, Our Lady Help of Christians on 24 May, Saint Thérèse and the town\'s creation on 2 October, and Good Friday.',
      faq: { q: 'Is Evangelical Day still a holiday in Rondônia?', a: 'No. The state law making 18 June a holiday was ruled unconstitutional by the Federal Supreme Court in ADI 3,940 in 2020. The day is a working day throughout the state.' },
    },
  },
  RR: {
    related: ['feriados-amazonas', 'feriados-para', 'feriados-2027', 'feriados-2027'],
    pt: {
      lead: 'Roraima tem um feriado estadual, 5 de outubro, aniversário da criação do estado pela Constituição de 1988. Em Boa Vista, a capital, a lista municipal começa cedo, com São Sebastião em 20 de janeiro.',
      nota: 'O 5 de outubro aparece como feriado em todas as comarcas na portaria do Tribunal de Justiça de Roraima com o calendário de 2026 e numa portaria do Ministério Público Federal; o texto da lei estadual não pôde ser aberto no site da Assembleia. Em 2027 cai numa terça, uma semana antes de Aparecida, também numa terça. Boa Vista tem, pelas Leis municipais 104/1984 e 227/1990, São Sebastião em 20 de janeiro, a Sexta-feira da Paixão, São Pedro em 29 de junho, o aniversário da cidade em 9 de julho e Nossa Senhora da Conceição em 8 de dezembro.',
      faq: { q: 'Quando é o aniversário de Boa Vista?', a: 'Em 9 de julho, feriado municipal pela Lei 227/1990. Vale só na capital. Em 2027 cai numa sexta-feira e forma um fim de semana de três dias para quem trabalha em Boa Vista.' },
    },
    en: {
      lead: 'Roraima has one state holiday, 5 October, the anniversary of the state\'s creation by the 1988 Constitution. In Boa Vista, the capital, the municipal list starts early, with Saint Sebastian on 20 January.',
      nota: "5 October appears as a holiday in every district in the Roraima Court of Justice's ordinance with the 2026 calendar and in a Federal Prosecution Service ordinance; the state law itself could not be opened on the assembly's site. In 2027 it falls on a Tuesday, a week before Aparecida, also a Tuesday. Boa Vista has, under municipal Laws 104/1984 and 227/1990, Saint Sebastian on 20 January, Good Friday, Saint Peter on 29 June, the city anniversary on 9 July and Our Lady of the Conception on 8 December.",
      faq: { q: "When is Boa Vista's anniversary?", a: 'On 9 July, a municipal holiday under Law 227/1990. It applies in the capital only. In 2027 it falls on a Friday, making a three-day weekend for people working in Boa Vista.' },
    },
  },
  SC: {
    related: ['feriados-parana', 'feriados-rio-grande-do-sul', 'feriados-2027', 'feriados-2027'],
    pt: {
      lead: 'Santa Catarina tem uma data magna, 11 de agosto, mas ela é comemorada sempre no domingo seguinte: na prática, o estado não tem dia útil de folga a mais. O 25 de novembro, padroeira, ainda é só projeto de lei.',
      nota: 'Segundo a Secretaria da Fazenda do estado, por força da Lei 17.335/2017 "o feriado de 11 de agosto, Dia do Estado de Santa Catarina (Data Magna), e os eventos alusivos à data ficam transferidos para o domingo subsequente". Em 2026 foi 16 de agosto, em 2027 é 15 de agosto e em 2028, 13 de agosto. Em 2026 o governo enviou à Assembleia um projeto para fazer de 25 de novembro, Santa Catarina de Alexandria, um feriado; até 28 de outubro de 2026 não encontramos a lei aprovada. Os feriados de Florianópolis não estão no site: os portais da cidade não puderam ser lidos.',
      faq: { q: 'Santa Catarina tem feriado estadual em dia útil?', a: 'Não. A data magna, 11 de agosto, é transferida para o domingo seguinte, então nunca cai em dia útil. O 25 de novembro, Santa Catarina de Alexandria, é só um projeto de lei até agora.' },
    },
    en: {
      lead: 'Santa Catarina has a state day, 11 August, but it is always observed the following Sunday: in practice the state has no extra weekday off. 25 November, the patron saint\'s day, is still only a bill.',
      nota: 'According to the state Finance Department, under Law 17,335/2017 "the 11 August holiday, Santa Catarina State Day, and related events are moved to the following Sunday". In 2026 that was 16 August, in 2027 it is 15 August and in 2028, 13 August. In 2026 the government sent the assembly a bill to make 25 November, Saint Catherine of Alexandria, a holiday; by 28 October 2026 we had found no law passed. Florianópolis\'s holidays are not on the site: the city\'s portals could not be read.',
      faq: { q: 'Does Santa Catarina have a state holiday on a weekday?', a: 'No. The state day, 11 August, is moved to the following Sunday, so it never falls on a weekday. 25 November, Saint Catherine of Alexandria, is only a bill so far.' },
    },
  },
  SP: {
    related: ['feriados-rio-de-janeiro', 'feriados-minas-gerais', 'corpus-christi-2027', 'dias-uteis-2027'],
    pt: {
      lead: 'São Paulo tem um feriado estadual, 9 de julho, que lembra a Revolução Constitucionalista de 1932. Na cidade de São Paulo, a lei municipal soma o aniversário, 25 de janeiro, a Sexta-feira da Paixão e Corpus Christi.',
      nota: 'O 9 de julho é feriado estadual pela Lei 9.497, de 5 de março de 1997. Não há lei estadual de Carnaval ou de Corpus Christi: no estado, os dois dependem de cada município. A capital tem os seus feriados na Lei municipal 14.485/2007, artigo 10: aniversário da cidade em 25 de janeiro, Sexta-feira da Paixão, Corpus Christi, Finados e o 20 de novembro, que entrou em 2004 e hoje é nacional. Em 2027, o 9 de julho cai numa sexta e Corpus Christi numa quinta, 27 de maio: quem trabalha na capital pode emendar a sexta 28 e ter quatro dias.',
      faq: { q: '9 de julho é feriado em todo o estado de São Paulo?', a: 'Sim, pela Lei estadual 9.497/1997, em todos os municípios paulistas. Ele lembra a Revolução Constitucionalista de 1932. Em 2027 cai numa sexta-feira, com fim de semana de três dias.' },
    },
    en: {
      lead: 'São Paulo has one state holiday, 9 July, marking the Constitutionalist Revolution of 1932. In the city of São Paulo, municipal law adds the city anniversary on 25 January, Good Friday and Corpus Christi.',
      nota: "9 July is a state holiday under Law 9,497 of 5 March 1997. There is no state law for Carnival or Corpus Christi: in the state, both depend on each municipality. The capital's holidays are in municipal Law 14,485/2007, article 10: the city anniversary on 25 January, Good Friday, Corpus Christi, All Souls' Day and 20 November, added in 2004 and now national. In 2027, 9 July falls on a Friday and Corpus Christi on Thursday 27 May: people working in the capital can bridge Friday the 28th and have four days.",
      faq: { q: 'Is 9 July a holiday throughout São Paulo state?', a: 'Yes, under State Law 9,497/1997, in every municipality of the state. It marks the Constitutionalist Revolution of 1932. In 2027 it falls on a Friday, making a three-day weekend.' },
    },
  },
  SE: {
    related: ['feriados-alagoas', 'feriados-bahia', 'feriados-2027', 'feriados-2027'],
    pt: {
      lead: 'Sergipe tem um feriado estadual, 8 de julho, emancipação política do estado, separado da Bahia em 1820. Está na própria Constituição estadual. O 24 de outubro, que já foi feriado, deixou de ser em 2000.',
      nota: 'O artigo 269 da Constituição de Sergipe fixa o 8 de julho como feriado; a Emenda Constitucional 20 de 2000 retirou o 24 de outubro, que lembrava a independência em outra data e continua como comemoração popular. Aracaju tem, pela Lei municipal 1.358/1988, o aniversário da cidade em 17 de março, que lembra a mudança da capital de São Cristóvão para Aracaju em 1855, Corpus Christi, São João em 24 de junho e Nossa Senhora da Conceição em 8 de dezembro. A lei chama esses feriados de "fixos e intransferíveis".',
      faq: { q: 'O 24 de outubro ainda é feriado em Sergipe?', a: 'Não. A Emenda Constitucional estadual 20/2000 retirou o 24 de outubro da lista de feriados. O feriado estadual de Sergipe é o 8 de julho, emancipação política.' },
    },
    en: {
      lead: 'Sergipe has one state holiday, 8 July, the state\'s political emancipation, split from Bahia in 1820. It is in the state constitution itself. 24 October, once a holiday, stopped being one in 2000.',
      nota: "Article 269 of the Sergipe Constitution sets 8 July as a holiday; Constitutional Amendment 20 of 2000 removed 24 October, which marked independence on another date and remains a popular celebration. Aracaju has, under municipal Law 1,358/1988, the city anniversary on 17 March, marking the move of the capital from São Cristóvão to Aracaju in 1855, Corpus Christi, Saint John's Day on 24 June and Our Lady of the Conception on 8 December. The law calls these holidays \"fixed and non-transferable\".",
      faq: { q: 'Is 24 October still a holiday in Sergipe?', a: 'No. State Constitutional Amendment 20/2000 removed 24 October from the list of holidays. Sergipe\'s state holiday is 8 July, political emancipation.' },
    },
  },
  TO: {
    related: ['feriados-goias', 'feriados-para', 'feriados-2027'],
    pt: {
      lead: 'O Tocantins tem três feriados estaduais, o mais novo deles desde 2025: o Senhor do Bonfim em 15 de agosto, Nossa Senhora da Natividade, padroeira, em 8 de setembro, e a criação do estado em 5 de outubro.',
      nota: 'A criação do estado, 5 de outubro de 1988, é feriado pela Lei 98/1989; a padroeira, pela Lei 627/1993; e o Senhor do Bonfim, festa tradicional de Natividade, pela Lei 4.509, de setembro de 2024, com efeito a partir de 2025. O Dia da Autonomia, 18 de março, não aparece mais nos calendários oficiais e fica fora da conta. Em 2027, o 8 de setembro cai numa quarta, logo depois da Independência na terça. Palmas tem, pela Lei municipal 577/1996, São José em 19 de março, a Sexta-feira Santa, o aniversário em 20 de maio e Finados.',
      faq: { q: 'O Senhor do Bonfim é feriado no Tocantins?', a: 'Sim, desde 2025, pela Lei estadual 4.509/2024, em 15 de agosto. Em 2027 cai num domingo; em 2028, numa terça-feira, com emenda possível na segunda 14.' },
    },
    en: {
      lead: 'Tocantins has three state holidays, the newest since 2025: Lord of Bonfim on 15 August, Our Lady of the Nativity, the patron saint, on 8 September, and the state\'s creation on 5 October.',
      nota: "The state's creation, 5 October 1988, is a holiday under Law 98/1989; the patron saint under Law 627/1993; and Lord of Bonfim, a traditional festival of Natividade, under Law 4,509 of September 2024, in effect from 2025. Autonomy Day, 18 March, no longer appears on official calendars and is left out of the count. In 2027, 8 September falls on a Wednesday, right after Independence Day on the Tuesday. Palmas has, under municipal Law 577/1996, Saint Joseph on 19 March, Good Friday, the city anniversary on 20 May and All Souls' Day.",
      faq: { q: 'Is Lord of Bonfim Day a holiday in Tocantins?', a: 'Yes, since 2025, under State Law 4,509/2024, on 15 August. In 2027 it falls on a Sunday; in 2028 on a Tuesday, with a possible bridge on Monday the 14th.' },
    },
  },
};

/* ------------------------------------------------------------------ montagem */
function build(uf: UF, order: number): GuideDef {
  const def = D[uf];
  const caps = K.MUNICIPAIS(uf).length > 0;
  const cap = K.CAPITAL[uf];
  const mun = K.MUNICIPAIS(uf);
  const fontes = [...new Set([...K.ESTADUAIS(uf).map((f) => f.fonte), ...mun.map((f) => f.fonte), 'lei-662', ...(uf === 'AC' ? ['ac-lei-2126'] : [])])];
  const page = (l: L) => {
    const nome = nomeUF(uf, l), Nome = nome.charAt(0).toUpperCase() + nome.slice(1);
    const e = est(uf), tot = K.folgas(Y, { uf }).length, wk = K.folgas(Y, { uf }).filter((f) => !K.isWeekend(K.fromIso(f.date))).length, p10 = K.otimiza(Y, { uf }, 10);
    const estTxt = e.length ? lista(e.map((f) => `${f.nome[l]} (${dShort(f.date, l)})`), l) : '';
    const resume = [
      def[l].lead,
      T(l, `Em ${Y} são ${tot} feriados nacionais e estaduais, ${wk} em dia útil, e ${du(uf)} dias úteis.`, `${Y}: ${tot} national and state holidays, ${wk} on weekdays, and ${du(uf)} working days.`),
      def[l].nota,
    ].join(' ');
    const sigla = l === 'pt' ? `${K.UF_NOME[uf]}` : nome;
    const Tit = nome.replace(/^the /, '').replace(/^./, (c) => c.toUpperCase());
    const title = compor(50, 60, l === 'pt' ? [
      [`Feriados ${sigla} 2027`, 0], [' e 2026', 1], [': datas', 0], [', leis', 1], [caps ? `, ${cap}` : '', 1], [' e emendas', 1], [' do ano', 1],
    ] : [
      [`${Tit} public holidays 2027`, 0], [' and 2026', 1], [': dates', 0], [', laws', 1], [caps ? `, ${cap}` : '', 1], [' and bridges', 1],
    ], `${uf} ${l} title`);
    const C = caps ? (l === 'pt' ? `, os de ${cap}` : `, ${cap}'s`) : '';
    const description = compor(150, 160, l === 'pt' ? [
      [`Feriados ${sigla} 2027`, 0], [', 2026 e 2028', 1], [': nacionais e estaduais com data', 0], [', dia da semana', 1], [' e lei', 0], [C, 0], [', as melhores emendas do ano', 1], [' e os dias úteis', 1], ['. Grátis, no seu navegador', 1], ['.', 0],
    ] : [
      [`${Tit} public holidays 2027`, 0], [', 2026 and 2028', 1], [': national and state holidays with date', 0], [', weekday', 1], [' and law', 0], [C, 0], [', the best bridges of the year', 1], [' and working days', 1], ['. Free, in your browser', 1], ['.', 0],
    ], `${uf} ${l} description`);
    const e26 = est(uf, 2026), e28 = est(uf, 2028);
    const ano = (x: typeof e) => lista(x.map((f) => dShort(f.date, l)), l);
    const pt1 = K.pontes(Y, { uf })[0];
    const wc = (t: string) => t.trim().split(/\s+/).length;
    const tabela = T(l, ` A tabela acima traz essa data e as demais ${DE(uf)} em 2026, 2027 e 2028, com o dia da semana e a lei de cada uma.`, ` The table above lists this date and the other ${nome} holidays for 2026, 2027 and 2028, with the weekday and the law behind each one.`);
    const v = K.UFS.indexOf(uf) % 3, v3 = (K.UFS.indexOf(uf) + Math.floor(K.UFS.indexOf(uf) / 5)) % 5;
    const fn = (id: string) => K.folgas(Y, { uf }).find((f) => f.id === id)?.nome[l] ?? K.folgas(Y + 1, { uf }).find((f) => f.id === id)?.nome[l] ?? '';
    const ponteFaq = (p: NonNullable<typeof pt1>) => {
      const fer = lista(p.feriados.map(fn).filter(Boolean), l);
      const per = (de: string, ate: string) => T(l, `de ${dShort(de, l)} a ${dShort(ate, l)}`, `from ${dShort(de, l)} to ${dShort(ate, l)}`);
      const fol = p.folga > 1 ? per(p.folgaDe, p.folgaAte) : T(l, `em ${dShort(p.folgaDe, l)}`, `on ${dShort(p.folgaDe, l)}`);
      const pt = [
        `A de ${fer}: com ${p.folga} ${p.folga > 1 ? 'dias' : 'dia'} de folga ${fol}, você emenda ${p.livre} dias livres, ${per(p.livreDe, p.livreAte)}. Distribuindo 10 dias de folga pelo ano inteiro, o planejador chega a ${p10.livre} dias livres. Feriados municipais e pontos facultativos ficam fora da conta, porque dependem da cidade e do empregador.`,
        `É a emenda de ${fer}. Basta ${p.folga > 1 ? `tirar ${p.folga} dias` : 'tirar um dia'} ${fol} para ficar ${p.livre} dias sem trabalhar, ${per(p.livreDe, p.livreAte)}. Se você tem 10 dias para gastar, o melhor plano do ano rende ${p10.livre} dias de descanso. O cálculo considera só os feriados nacionais e estaduais.`,
        `${EM(uf).replace(/^./, (c) => c.toUpperCase())}, a emenda mais rentável de 2027 é a de ${fer}: ${p.folga} ${p.folga > 1 ? 'dias' : 'dia'} de folga ${fol} viram ${p.livre} dias de descanso seguidos, ${per(p.livreDe, p.livreAte)}. Para 10 dias de folga, o planejador encontra um plano de ${p10.livre} dias livres. Os feriados da sua cidade podem render ainda mais.`,
        `Olhando o calendário de 2027 ${EM(uf)}, nenhuma folga rende tanto quanto a de ${fer}. ${p.folga > 1 ? `São ${p.folga} dias` : 'Um único dia'} ${fol}, e o descanso vai ${per(p.livreDe, p.livreAte)}: ${p.livre} dias corridos. Quem tem 10 dias de férias para encaixar consegue, no total, ${p10.livre} dias longe do trabalho.`,
        `${fer.replace(/^./, (c) => c.toUpperCase())} oferece a melhor troca do ano: ${p.livre} dias corridos de descanso, ${per(p.livreDe, p.livreAte)}, pelo preço de ${p.folga > 1 ? `${p.folga} dias` : 'um dia'} de folga ${fol}. Com um saldo de 10 dias, o melhor arranjo de 2027 soma ${p10.livre} dias livres no estado.`,
      ];
      const en = [
        `The ${fer} one: with ${p.folga} ${p.folga > 1 ? 'days' : 'day'} off ${fol}, you get ${p.livre} free days in a row, ${per(p.livreDe, p.livreAte)}. Spreading 10 days off across the whole year, the planner reaches ${p10.livre} free days. Municipal holidays and optional days off are left out, because they depend on the city and the employer.`,
        `It is the ${fer} bridge. Taking ${p.folga > 1 ? `${p.folga} days` : 'one day'} off ${fol} gives you ${p.livre} days away from work, ${per(p.livreDe, p.livreAte)}. If you have 10 days to spend, the best plan of the year yields ${p10.livre} days of rest. The count only uses national and state holidays.`,
        `In ${nome}, the most rewarding bridge of 2027 is around ${fer}: ${p.folga} ${p.folga > 1 ? 'days' : 'day'} off ${fol} turn into ${p.livre} days of rest in a row, ${per(p.livreDe, p.livreAte)}. For 10 days off, the planner finds a plan with ${p10.livre} free days. Your own city's holidays may give even more.`,
        `Looking at the 2027 calendar in ${nome}, no day off pays back as well as the one around ${fer}. ${p.folga > 1 ? `${p.folga} days` : 'A single day'} ${fol}, and the break runs ${per(p.livreDe, p.livreAte)}: ${p.livre} days in a row. With 10 days of leave to place, you can reach ${p10.livre} days away from work in total.`,
        `${fer.replace(/^./, (c) => c.toUpperCase())} offers the best trade of the year: ${p.livre} days of rest in a row, ${per(p.livreDe, p.livreAte)}, for ${p.folga > 1 ? `${p.folga} days` : 'one day'} off ${fol}. With a balance of 10 days, the best arrangement of 2027 adds up to ${p10.livre} free days in the state.`,
      ];
      return T(l, pt[v3], en[v3]);
    };
    const faq1 = () => {
      const li = lista(e.map((f) => `${f.nome[l]}, ${dShort(f.date, l)}`), l);
      const base = T(l, [
        `${li}. Somados aos nacionais, são ${tot} feriados no ano, ${wk} em dia útil, e sobram ${du(uf)} dias úteis.`,
        `São ${e.length}: ${li}. Com os nacionais, o ano tem ${tot} feriados, dos quais ${wk} caem de segunda a sexta, e ${du(uf)} dias úteis.`,
        `${li}. Juntando os feriados nacionais, ${nomeUF(uf, l)} tem ${tot} folgas legais em 2027; ${wk} tiram um dia de trabalho e restam ${du(uf)} dias úteis.`,
      ][v], [
        `${li}. With the national ones, that is ${tot} holidays in the year, ${wk} on weekdays, leaving ${du(uf)} working days.`,
        `There ${e.length > 1 ? 'are' : 'is'} ${e.length}: ${li}. Adding the national holidays, the year has ${tot}, of which ${wk} fall Monday to Friday, and ${du(uf)} working days.`,
        `${li}. Together with the national holidays, ${nome} has ${tot} statutory days off in 2027; ${wk} cost a working day, leaving ${du(uf)} working days.`,
      ][v]);
      if (wc(base) >= 42) return base;
      return base + (e.length <= 3
        ? T(l, ` Em 2026 ${e26.length > 1 ? 'essas datas caíram' : 'a data caiu'} em ${ano(e26)}; em 2028 ${e28.length > 1 ? 'caem' : 'cai'} em ${ano(e28)}.`, ` In 2026 ${e26.length > 1 ? 'these dates fell' : 'the date fell'} on ${ano(e26)}; in 2028 ${e28.length > 1 ? 'they fall' : 'it falls'} on ${ano(e28)}.`)
        : T(l, ' As datas de 2026 e de 2028 estão na tabela acima.', ' The 2026 and 2028 dates are in the table above.'));
    };
    const faqs: FAQ[] = [
      e.length
        ? { q: T(l, `Quais são os feriados estaduais ${DE(uf)} em 2027?`, `What are the state holidays in ${nome} in 2027?`), a: faq1() }
        : { q: T(l, `${K.UF_NOME[uf]} tem feriado estadual em 2027?`, `Does ${nome} have a state holiday in 2027?`), a: T(l,
            `Nenhum confirmado em texto oficial. Valem os ${tot} feriados nacionais, ${wk} deles em dia útil, o que deixa ${du(uf)} dias úteis no ano. Somam-se os feriados municipais de cada cidade, fixados por lei municipal. As datas citadas como feriado estadual e que não entram na conta estão listadas abaixo, com o motivo.`,
            `None confirmed in an official text. The ${tot} national holidays apply, ${wk} of them on weekdays, which leaves ${du(uf)} working days in the year. Each city adds its own municipal holidays, set by municipal law. Dates cited as state holidays that are left out of the count are listed below, with the reason.`) },
      { q: def[l].faq.q, a: def[l].faq.a + (wc(def[l].faq.a) < 42 ? tabela : '') },
      ...(pt1 ? [{ q: T(l, `Qual é a melhor emenda de 2027 ${EM(uf)}?`, `What is the best bridge of 2027 in ${nome}?`), a: ponteFaq(pt1) }] : []),
    ];
    const body = (h: Helpers) => {
      const pend = PEND(uf);
      const mes = (md: [number, number] | null) => (md ? `${md[1]} ${T(l, 'de', '')} ${MESES(l)[md[0] - 1]}`.replace('  ', ' ') : T(l, 'data móvel', 'movable date'));
      return `<h2>${T(l, `Feriados ${EM(uf)}, 2026 a 2028`, `Public holidays in ${nome}, 2026 to 2028`)}</h2>
${tabelaLugar(h, { uf })}
${pend.length ? `<h2>${T(l, 'Datas que não entram na conta', 'Dates left out of the count')}</h2>
${h.table([T(l, 'Data', 'Date'), T(l, 'Nome', 'Name'), T(l, 'Por quê', 'Why')], pend.map((p) => [mes(p.mes_dia), p.nome, MOTIVO[p.motivo]?.[l] ?? p.motivo]), T(l, `Datas citadas como feriado ${EM(uf)} que não são feriado estadual`, `Dates cited as holidays in ${nome} that are not state holidays`), ['l', 'l', 'l'])}` : ''}
${caps ? `<h2>${T(l, `${cap}: feriados de ${Y} com os municipais`, `${cap}: ${Y} holidays including municipal ones`)}</h2>
${tabelaSimples(h, Y, { uf, capital: true })}` : ''}
<h2>${T(l, `Emendas de ${Y} ${EM(uf)}`, `Bridges in ${nome} in ${Y}`)}</h2>
${tabelaPontes(h, Y, { uf }, 6)}
${h.mini('em', { p: ['folga'], d: { uf }, c: T(l, `Planejar as folgas ${EM(uf)}`, `Plan days off in ${nome}`) })}`;
    };
    return {
      slug: l === 'pt' ? `feriados-${K.UF_SLUG[uf]}` : `public-holidays-${K.UF_SLUG[uf]}`,
      nav: K.UF_NOME[uf], card: e.length ? T(l, `${e.length} ${e.length > 1 ? 'feriados estaduais' : 'feriado estadual'}${caps ? ` e os de ${cap}` : ''}`, `${e.length} state ${e.length > 1 ? 'holidays' : 'holiday'}${caps ? ` plus ${cap}'s` : ''}`) : T(l, `Sem feriado estadual${caps ? `; os de ${cap}` : ''}`, `No state holiday${caps ? `; ${cap}'s` : ''}`),
      title, description,
      h1: T(l, `Feriados de ${Y} ${EM(uf)}`, `Public holidays in ${nome} in ${Y}`),
      intro: T(l, `Com a lei de cada data${caps ? ` e os feriados de ${cap}` : ''}.`, `With the law behind each date${caps ? ` and ${cap}'s holidays` : ''}.`),
      resume, faqs, body,
    };
  };
  return defineGuide({ id: K.ufPageId(uf), group: 'estados', order, tool: 'ft', toolArg: { uf, ano: Y }, related: def.related, sources: fontes, pt: page('pt'), en: page('en') });
}

export default [...K.UFS].sort((a, b) => K.UF_NOME[a].localeCompare(K.UF_NOME[b], 'pt-BR')).map((uf, i) => build(uf, 60 + i));
