/** Feriados de novembro, de dezembro de 2026, pontos facultativos, feriados estaduais. Datas: motor. */
import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { tabelaUFs } from '../../lib/bausteine';
import { dLong, dName, dShort } from '../../lib/tool-specs';

type L = 'pt' | 'en';
const d = (iso: string, l: L) => dLong(iso, l);
const w = (iso: string, l: L) => dName(iso, l);
const lista = (x: string[], l: L) => (x.length > 1 ? `${x.slice(0, -1).join(', ')} ${l === 'pt' ? 'e' : 'and'} ${x[x.length - 1]}` : x[0] ?? '');
const capNome = (uf: string) => K.CAPITAL[uf as keyof typeof K.CAPITAL];
/** capitais com feriado municipal numa data */
const capsEm = (iso: string) => K.UFS.filter((u) => K.feriados(Number(iso.slice(0, 4)), { uf: u, capital: true }).some((f) => f.date === iso && f.esfera === 'municipal')).map(capNome);
const fac26 = K.feriados(2026, { uf: 'MT', facultativos: true }).filter((f) => f.esfera === 'facultativo');
const nEst = K.UFS.filter((u) => K.ESTADUAIS(u).length > 0).length;
const semEst = K.UFS.filter((u) => K.ESTADUAIS(u).length === 0).map((u) => K.UF_NOME[u]);
const maisEst = [...K.UFS].sort((a, b) => K.ESTADUAIS(b).length - K.ESTADUAIS(a).length)[0];

export default [
  defineGuide({
    id: 'feriados-de-novembro', group: 'feriados', order: 23, tool: 'mes', toolArg: { ano: 2026, mes: 11 },
    related: ['feriados-2026', 'feriados-prolongados-2027', 'feriados-acre', 'feriados-distrito-federal'],
    sources: ['lei-662', 'lei-14759', 'ac-lei-2126', 'ac-tratado-de-petropolis', 'df-dia-do-evangelico'],
    pt: {
      slug: 'feriados-de-novembro', nav: 'Feriados de novembro', card: 'Finados, Proclamação e Consciência Negra: os feriados de novembro',
      title: 'Feriados de novembro de 2026: datas e feriados prolongados',
      description: 'Feriados de novembro de 2026: Finados numa segunda, Proclamação da República num domingo e Consciência Negra numa sexta. Os prolongados e os de 2027 também.',
      h1: 'Feriados de novembro: 2026 e 2027',
      intro: 'Escolha o estado e o mês: a ferramenta lista os feriados de novembro, os fins de semana prolongados e quantos dias úteis o mês tem no seu estado.',
      resume: `Novembro é o mês com mais feriados nacionais: três. Em 2026, Finados cai numa ${w('2026-11-02', 'pt')}, 2 de novembro, e forma um fim de semana de três dias, de 31 de outubro a 2 de novembro. A Proclamação da República, 15 de novembro, cai num domingo e não rende folga. O Dia Nacional de Zumbi e da Consciência Negra, 20 de novembro, feriado nacional desde a Lei 14.759/2023, cai numa ${w('2026-11-20', 'pt')} e forma outro fim de semana de três dias. No Acre, o Tratado de Petrópolis, 17 de novembro, cai numa terça e é comemorado na quinta, dia 19, pela regra estadual que leva os feriados para perto da sexta: com a Consciência Negra na sexta, são quatro dias livres. No Distrito Federal, o Dia do Evangélico, 30 de novembro, cai numa segunda e dá mais um fim de semana de três dias. Em 2027, Finados cai numa terça, a Proclamação numa segunda e a Consciência Negra num sábado.`,
      faqs: [
        { q: 'Quantos feriados tem novembro de 2026?', a: 'Três nacionais: Finados (segunda, 2), Proclamação da República (domingo, 15) e Consciência Negra (sexta, 20). Dois caem em dia útil e formam fins de semana de três dias. O Acre e o Distrito Federal têm um feriado estadual a mais no mês.' },
        { q: '20 de novembro é feriado nacional?', a: 'Sim, desde a Lei 14.759, de 21 de dezembro de 2023, que declarou feriado nacional o Dia Nacional de Zumbi e da Consciência Negra. Antes, era feriado só em alguns estados e cidades. 2024 foi o primeiro ano com o feriado em todo o país.' },
        { q: 'Novembro de 2027 tem feriado prolongado?', a: 'Sim, dois: Finados cai numa terça, 2 de novembro, e pede a emenda da segunda, 1º; a Proclamação da República cai numa segunda, 15, e forma um fim de semana de três dias sem gastar folga. A Consciência Negra cai num sábado.' },
      ],
      body: (h) => `<h2>Novembro em 2026 e 2027</h2>
${h.table([h.T('Feriado', 'Holiday'), '2026', '2027'], [
  [h.T('Finados', "All Souls' Day"), `${w('2026-11-02', h.lang)}, 2/11`, `${w('2027-11-02', h.lang)}, 2/11`],
  [h.T('Proclamação da República', 'Proclamation of the Republic'), `${w('2026-11-15', h.lang)}, 15/11`, `${w('2027-11-15', h.lang)}, 15/11`],
  [h.T('Consciência Negra', 'Black Consciousness Day'), `${w('2026-11-20', h.lang)}, 20/11`, `${w('2027-11-20', h.lang)}, 20/11`],
], h.T('Feriados nacionais de novembro', 'National holidays in November'))}
<h2>Estados com feriado a mais em novembro</h2>
<p>No ${h.a('feriados-acre', 'Acre')}, a Lei 2.126/2009 leva para a sexta os feriados estaduais que caem de terça a quinta. Em 2026, a sexta 20 já é a Consciência Negra, então o Tratado de Petrópolis fica na quinta, 19: quem trabalha no Acre tem quatro dias seguidos, de 19 a 22 de novembro. Em 2027 acontece o mesmo, porque o dia 17 cai numa quarta e a sexta 19 está livre. No ${h.a('feriados-distrito-federal', 'Distrito Federal')}, o Dia do Evangélico, 30 de novembro, é feriado distrital. Em Natal, a padroeira Nossa Senhora da Apresentação, 21 de novembro, é feriado municipal; em 2026 cai num sábado.</p>
${h.mini('ft', { p: ['uf'], c: 'Todos os feriados do ano no estado' })}
<h2>Outubro e o Dia do Servidor</h2>
<p>Logo antes de novembro, o Dia do Servidor Público, 28 de outubro, é ponto facultativo para os órgãos federais. Em 2026, o Ministério da Gestão transferiu o ponto facultativo para a sexta, 30 de outubro, o que dá aos servidores federais um fim de semana de quatro dias, de 30 de outubro a 2 de novembro. No setor privado, 30 de outubro é dia útil comum.</p>`,
    },
    en: {
      slug: 'november-holidays-brazil', nav: 'November holidays', card: "All Souls', Republic and Black Consciousness: November's holidays",
      title: 'November 2026 holidays in Brazil: dates and long weekends',
      description: "November 2026 holidays in Brazil: All Souls' Day on a Monday, the Republic on a Sunday and Black Consciousness Day on a Friday, plus long weekends and 2027.",
      h1: 'November holidays in Brazil: 2026 and 2027',
      intro: 'Pick the state and month: the tool lists November\'s holidays, the long weekends and how many working days the month has in your state.',
      resume: `November is the month with the most national holidays: three. In 2026, All Souls' Day falls on a ${w('2026-11-02', 'en')}, 2 November, making a three-day weekend from 31 October to 2 November. Proclamation of the Republic, 15 November, falls on a Sunday and gives no day off. Zumbi and Black Consciousness Day, 20 November, a national holiday since Law 14,759/2023, falls on a ${w('2026-11-20', 'en')} and makes another three-day weekend. In Acre, the Treaty of Petrópolis holiday, 17 November, falls on a Tuesday and is observed on Thursday the 19th under the state rule that moves holidays towards Friday: with Black Consciousness Day on the Friday, that makes four free days. In the Federal District, Evangelical Day, 30 November, falls on a Monday and gives yet another three-day weekend. In 2027, All Souls' Day falls on a Tuesday, the Republic holiday on a Monday and Black Consciousness Day on a Saturday.`,
      faqs: [
        { q: 'How many holidays are there in Brazil in November 2026?', a: "Three national ones: All Souls' Day (Monday 2nd), Proclamation of the Republic (Sunday 15th) and Black Consciousness Day (Friday 20th). Two fall on weekdays and make three-day weekends. Acre and the Federal District have one more state holiday that month." },
        { q: 'Is 20 November a national holiday in Brazil?', a: 'Yes, since Law 14,759 of 21 December 2023 declared Zumbi and Black Consciousness Day a national holiday. Before, it was a holiday only in some states and cities. 2024 was the first year it applied nationwide. In 2026 it fell on a Friday, and in 2027 it falls on a Saturday.' },
        { q: 'Does November 2027 have long weekends?', a: "Yes, two: All Souls' Day falls on Tuesday 2 November and needs Monday the 1st as a bridge; Proclamation of the Republic falls on Monday the 15th, a three-day weekend with no leave. Black Consciousness Day falls on a Saturday." },
      ],
      body: (h) => `<h2>November in 2026 and 2027</h2>
${h.table([h.T('Feriado', 'Holiday'), '2026', '2027'], [
  [h.T('Finados', "All Souls' Day"), `${w('2026-11-02', h.lang)}, 2/11`, `${w('2027-11-02', h.lang)}, 2/11`],
  [h.T('Proclamação da República', 'Proclamation of the Republic'), `${w('2026-11-15', h.lang)}, 15/11`, `${w('2027-11-15', h.lang)}, 15/11`],
  [h.T('Consciência Negra', 'Black Consciousness Day'), `${w('2026-11-20', h.lang)}, 20/11`, `${w('2027-11-20', h.lang)}, 20/11`],
], h.T('Feriados nacionais de novembro', 'National holidays in November'))}
<h2>States with an extra holiday in November</h2>
<p>In ${h.a('feriados-acre', 'Acre')}, Law 2,126/2009 moves state holidays falling Tuesday to Thursday to the Friday. In 2026, Friday the 20th is already Black Consciousness Day, so the Treaty of Petrópolis holiday stays on Thursday the 19th: people working in Acre get four days in a row, 19 to 22 November. The same happens in 2027, because the 17th falls on a Wednesday and Friday the 19th is free. In the ${h.a('feriados-distrito-federal', 'Federal District')}, Evangelical Day, 30 November, is a district holiday. In Natal, the patron saint Our Lady of the Presentation, 21 November, is a municipal holiday; in 2026 it falls on a Saturday.</p>
${h.mini('ft', { p: ['uf'], c: "All the state's holidays this year" })}
<h2>October and Public Servants' Day</h2>
<p>Just before November, Public Servants' Day, 28 October, is an optional day off for federal bodies. In 2026, the Ministry of Management moved that optional day off to Friday 30 October, giving federal staff a four-day weekend from 30 October to 2 November. In the private sector, 30 October is an ordinary working day.</p>`,
    },
  }),
  defineGuide({
    id: 'pontos-facultativos', group: 'feriados', order: 25, tool: 'pf', toolArg: { ano: 2027 },
    related: ['feriados-2026', 'feriados-2027', 'carnaval-2027', 'corpus-christi-2027'],
    sources: ['portaria-mgi-2026', 'mgi-calendario-2026', 'mgi-servidor-2026', 'mgi-noticias', 'lei-662'],
    pt: {
      slug: 'pontos-facultativos', nav: 'Pontos facultativos', card: 'Pontos facultativos federais de 2026 e o que se sabe de 2027',
      title: 'Ponto facultativo 2027 e 2026: datas federais e o que valem',
      description: 'Pontos facultativos de 2026 pela Portaria MGI 11.460/2025 e a situação de 2027: Carnaval, Cinzas, Corpus Christi, vésperas e Dia do Servidor. O que vale.',
      h1: 'Pontos facultativos federais: 2026 e 2027',
      intro: 'Escolha o ano: a ferramenta mostra os pontos facultativos da portaria federal publicada ou, se ela ainda não saiu, as datas que costumam entrar, calculadas.',
      resume: `Ponto facultativo não é feriado. É um dia em que o órgão público pode dispensar o expediente, por decisão do governo. Os pontos facultativos federais saem todo ano numa portaria do Ministério da Gestão e da Inovação em Serviços Públicos. Para 2026, a Portaria MGI 11.460, de 29 de dezembro de 2025, declarou ${fac26.length} pontos facultativos: segunda e terça de Carnaval, 16 e 17 de fevereiro; Quarta-feira de Cinzas até as 14 horas; a segunda-feira 20 de abril, véspera de Tiradentes; Corpus Christi, 4 de junho, e a sexta seguinte; o Dia do Servidor Público, transferido para 30 de outubro; e as vésperas de Natal e de Ano-Novo depois das 13 horas. A portaria de 2027 ainda não tinha sido publicada em 28 de outubro de 2026. Para o setor privado, ponto facultativo é dia útil: a folga depende de acordo, convenção coletiva ou costume. Estados e prefeituras publicam os próprios decretos, que podem ser diferentes.`,
      faqs: [
        { q: 'Qual a diferença entre feriado e ponto facultativo?', a: 'Feriado é criado por lei e vale para todos, no setor público e no privado. Ponto facultativo é decidido pelo governo para os seus próprios órgãos; no setor privado, é dia útil comum, salvo acordo. Os pontos facultativos federais de cada ano saem numa portaria do Ministério da Gestão e da Inovação; a de 2026 é a Portaria MGI 11.460/2025.' },
        { q: 'Quando sai a portaria dos pontos facultativos de 2027?', a: 'A de 2026 saiu em 29 de dezembro de 2025, no fim do ano anterior, como é costume. Em 28 de outubro de 2026 a de 2027 ainda não tinha saído. Até lá, a ferramenta mostra as datas que costumam entrar, calculadas, marcadas como previsão.' },
        { q: 'Empresa privada precisa dar folga no ponto facultativo?', a: 'Não. A portaria federal vale para os órgãos da administração federal. Uma empresa só precisa dar folga nesses dias se houver acordo, convenção coletiva ou lei local que faça do dia um feriado. Vale conferir a convenção coletiva da categoria, que pode incluir o Carnaval ou a Quarta-feira de Cinzas como folga.' },
      ],
      body: (h) => `<h2>Os pontos facultativos de 2026</h2>
${h.table([h.T('Data', 'Date'), h.T('Dia', 'Day'), h.T('Ponto facultativo', 'Optional day off')], fac26.map((f) => [d(f.date, h.lang), w(f.date, h.lang), f.nome[h.lang]]), h.T('Portaria MGI 11.460/2025 e transferência do Dia do Servidor', 'MGI ordinance 11,460/2025 and the Public Servants\' Day move'))}
<p>O Dia do Servidor Público é 28 de outubro, uma quarta-feira em 2026. O ${h.src('mgi-servidor-2026', 'Ministério da Gestão transferiu')} o ponto facultativo para a sexta, 30 de outubro. Fonte de toda a lista: ${h.src('portaria-mgi-2026')}.</p>
<h2>2027: o que esperar</h2>
<p>Enquanto a portaria de 2027 não sai, a ferramenta mostra as datas que se repetem todo ano, calculadas: Carnaval em 8 e 9 de fevereiro, Quarta-feira de Cinzas em 10 de fevereiro, Corpus Christi em 27 de maio, Dia do Servidor em 28 de outubro, uma quinta, e as vésperas de Natal e de Ano-Novo, que em 2027 caem em sextas. Pontes como a de Tiradentes em 2026 dependem do calendário de cada ano e só se conhecem com a portaria.</p>
${h.mini('ft', { p: ['uf'], c: 'Feriados do ano no estado' })}
<h2>Quem segue a portaria</h2>
<p>A portaria federal vale para os órgãos e entidades da administração pública federal. Cada órgão pode manter serviços essenciais funcionando. Governos estaduais e prefeituras decidem os seus pontos facultativos por decreto, e muitas vezes seguem datas parecidas. Bancos têm calendário próprio. Para o trabalhador do setor privado, ponto facultativo é dia de trabalho, a não ser que o contrato, a convenção coletiva ou a empresa digam outra coisa.</p>`,
    },
    en: {
      slug: 'optional-days-off-brazil', nav: 'Optional days off', card: 'Federal optional days off in 2026 and what is known for 2027',
      title: 'Optional days off in Brazil 2026 and 2027: ponto facultativo',
      description: 'Federal optional days off (ponto facultativo) in Brazil for 2026 under MGI ordinance 11,460/2025, and 2027\'s status: Carnival, Corpus Christi, the eves.',
      h1: 'Federal optional days off in Brazil: 2026 and 2027',
      intro: 'Pick a year: the tool shows the optional days off of the published federal ordinance or, if it is not out yet, the dates usually included, computed.',
      resume: `An optional day off (ponto facultativo) is not a public holiday. It is a day on which a public body may close, by government decision. The federal ones come out every year in an ordinance of the Ministry of Management and Innovation in Public Services. For 2026, MGI ordinance 11,460 of 29 December 2025 declared ${fac26.length} optional days off: Carnival Monday and Tuesday, 16 and 17 February; Ash Wednesday until 2 pm; Monday 20 April, the day before Tiradentes; Corpus Christi, 4 June, and the following Friday; Public Servants' Day, moved to 30 October; and Christmas Eve and New Year's Eve from 1 pm. The 2027 ordinance had not been published by 28 October 2026. For the private sector, an optional day off is a working day: time off depends on an agreement, collective agreement or custom. States and city halls publish their own decrees, which may differ.`,
      faqs: [
        { q: 'What is the difference between a holiday and an optional day off?', a: 'A holiday is created by law and applies to everyone, public and private sectors alike. An optional day off is decided by a government for its own bodies; in the private sector it is an ordinary working day unless agreed otherwise.' },
        { q: 'When does the 2027 optional days off ordinance come out?', a: 'The 2026 one came out on 29 December 2025, at the end of the previous year, as is usual. On 28 October 2026 the 2027 one had not been published. Until then, the tool shows the dates usually included, computed and marked as a forecast.' },
        { q: 'Do private employers have to give optional days off?', a: 'No. The federal ordinance applies to federal administration bodies. A company only has to give those days off if an agreement, collective agreement or local law makes the day a holiday. Employees should check their category\'s collective agreement, which may include Carnival or Ash Wednesday as days off.' },
      ],
      body: (h) => `<h2>The 2026 optional days off</h2>
${h.table([h.T('Data', 'Date'), h.T('Dia', 'Day'), h.T('Ponto facultativo', 'Optional day off')], fac26.map((f) => [d(f.date, h.lang), w(f.date, h.lang), f.nome[h.lang]]), h.T('Portaria MGI 11.460/2025 e transferência do Dia do Servidor', 'MGI ordinance 11,460/2025 and the Public Servants\' Day move'))}
<p>Public Servants' Day is 28 October, a Wednesday in 2026. The ${h.src('mgi-servidor-2026', 'Ministry of Management moved')} the optional day off to Friday 30 October. Source for the whole list: ${h.src('portaria-mgi-2026')}.</p>
<h2>2027: what to expect</h2>
<p>Until the 2027 ordinance is out, the tool shows the dates that recur every year, computed: Carnival on 8 and 9 February, Ash Wednesday on 10 February, Corpus Christi on 27 May, Public Servants' Day on 28 October, a Thursday, and Christmas Eve and New Year's Eve, which fall on Fridays in 2027. Bridges such as Tiradentes in 2026 depend on each year's calendar and are known only once the ordinance is out.</p>
${h.mini('ft', { p: ['uf'], c: "The state's holidays this year" })}
<h2>Who follows the ordinance</h2>
<p>The federal ordinance applies to federal public administration bodies. Each body may keep essential services running. State governments and city halls decide their own optional days off by decree, often with similar dates. Banks have their own calendar. For private-sector workers, an optional day off is a working day unless the contract, collective agreement or employer says otherwise.</p>`,
    },
  }),
];
