/** Feriados 2026, 2027, 2028: um calendário por ano, nacionais e estaduais. Datas: motor. */
import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { tabelaAno, tabelaUFs } from '../../lib/bausteine';
import { dLong, dName } from '../../lib/tool-specs';

type L = 'pt' | 'en';
const d = (iso: string, l: L) => dLong(iso, l);
const w = (iso: string, l: L) => dName(iso, l);
const nac = (y: number) => K.folgas(y, { uf: 'DF' }).filter((f) => f.esfera === 'nacional' || f.esfera === 'religioso');
const uteis = (y: number) => nac(y).filter((f) => !K.isWeekend(K.fromIso(f.date)));
const fds = (y: number) => nac(y).filter((f) => K.isWeekend(K.fromIso(f.date)));
const prolong = (y: number) => nac(y).filter((f) => [1, 5].includes(K.weekday(K.fromIso(f.date))));
const emendas = (y: number) => nac(y).filter((f) => [2, 4].includes(K.weekday(K.fromIso(f.date))));
const nomes = (list: Array<{ nome: { pt: string; en: string } }>, l: L) => { const x = list.map((f) => f.nome[l]); return x.length > 1 ? `${x.slice(0, -1).join(', ')} ${l === 'pt' ? 'e' : 'and'} ${x[x.length - 1]}` : x[0] ?? ''; };
const SRC = ['lei-662', 'lei-6802', 'lei-9093', 'lei-14759', 'portaria-mgi-2026'];
const du = (y: number, uf: Parameters<typeof K.diasUteis>[1]['uf']) => K.diasUteis(y, { uf }).reduce((a, b) => a + b, 0);

export default [
  defineGuide({
    id: 'feriados-2027', group: 'feriados', order: 20, tool: 'ft', toolArg: { ano: 2027 },
    countdown: { date: '2027-01-01', label: { pt: 'Ano-Novo de 2027', en: "New Year's Day 2027" } },
    related: ['home', 'calendario-2027', 'feriados-prolongados-2027', 'dias-uteis-2027', 'carnaval-2027'],
    sources: SRC,
    pt: {
      slug: 'feriados-2027', nav: 'Feriados 2027', card: 'Todos os feriados nacionais e estaduais de 2027, por estado',
      title: 'Feriados 2027: lista de feriados nacionais e por estado',
      description: 'Feriados 2027 no Brasil: os nacionais com data e dia da semana, os estaduais das 27 UFs com a lei de cada um, Carnaval, Corpus Christi e os prolongados.',
      h1: 'Feriados 2027: nacionais e estaduais, estado por estado',
      intro: 'Escolha o estado: a lista mostra cada feriado de 2027 com o dia da semana, quantos caem em dia útil, as emendas de um dia e quantos dias úteis sobram.',
      resume: `Os feriados nacionais de 2027 são dez: Confraternização Universal em ${w('2027-01-01', 'pt')}, ${d('2027-01-01', 'pt')}; Sexta-feira da Paixão em ${d(K.paixao(2027), 'pt')}; Tiradentes numa ${w('2027-04-21', 'pt')}; Dia do Trabalho num sábado; Independência, Nossa Senhora Aparecida e Finados em terças-feiras, 7 de setembro, 12 de outubro e 2 de novembro; Proclamação da República numa segunda, 15 de novembro; Dia da Consciência Negra e Natal em sábados. ${uteis(2027).length} deles caem de segunda a sexta, ${fds(2027).length} no fim de semana. O ano tem ${prolong(2027).length} feriados prolongados nacionais, de sexta ou de segunda, e ${emendas(2027).length} feriados em terça ou quinta que pedem emenda. Carnaval, em ${d(K.carnavalTerca(2027), 'pt')}, e Corpus Christi, em ${d(K.corpusChristi(2027), 'pt')}, não são feriados nacionais: são pontos facultativos federais e só viram feriado onde lei local assim determina. Cada estado soma a sua data magna, às vezes outros dias, e cada capital os seus feriados municipais. Em São Paulo, por exemplo, 2027 tem ${K.folgas(2027, { uf: 'SP' }).length} feriados nacionais e estaduais e ${du(2027, 'SP')} dias úteis.`,
      faqs: [
        { q: 'Quantos feriados nacionais tem 2027?', a: `Dez, contando a Sexta-feira da Paixão: 1º de janeiro, Paixão em 26 de março, 21 de abril, 1º de maio, 7 de setembro, 12 de outubro, 2 de novembro, 15 de novembro, 20 de novembro e 25 de dezembro. Só ${uteis(2027).length} caem em dia útil. Carnaval e Corpus Christi não entram na conta: são pontos facultativos.` },
        { q: 'Quais feriados de 2027 caem no fim de semana?', a: `${nomes(fds(2027), 'pt')}. O Dia do Trabalho, a Consciência Negra e o Natal caem em sábados. Como a lei federal não transfere feriados, esses dias não rendem folga extra para quem já não trabalha aos sábados.` },
        { q: 'Quais são os feriados prolongados de 2027?', a: `Sem gastar folga: Ano-Novo (sexta, 1º de janeiro), Sexta-feira da Paixão (26 de março) e Proclamação da República (segunda, 15 de novembro). Com uma emenda de um dia: Independência, Aparecida e Finados, que caem em terças, pedem a segunda anterior. Em São Paulo, a Revolução Constitucionalista, numa sexta, soma mais um.` },
      ],
      body: (h) => `<h2>Todos os feriados de 2027, nacionais e estaduais</h2>
<p>A tabela reúne os feriados nacionais e, para cada data estadual, as siglas dos estados onde ela vale. Feriados municipais das capitais aparecem na ferramenta acima quando a lei da capital foi conferida.</p>
${tabelaAno(h, 2027)}
<h2>Um ano de terças-feiras</h2>
<p>Três feriados nacionais seguidos caem numa terça em 2027: a Independência, Nossa Senhora Aparecida e Finados. Cada um deixa uma segunda-feira solta entre o fim de semana e o feriado. Quem consegue folgar nessas três segundas tem três fins de semana de quatro dias no segundo semestre, com apenas três dias de folga. A Proclamação da República, numa segunda, fecha a sequência com um feriado prolongado gratuito. O ${h.a('feriados-prolongados-2027', 'planejador de feriados prolongados')} calcula o melhor uso das suas folgas no ano todo.</p>
${h.mini('em', { p: ['uf', 'folga'], c: 'Calcular as emendas de 2027' })}
<p>O começo do ano é diferente. A Páscoa cai cedo, em ${h.day(K.pascoa(2027))}, e por isso o Carnaval também: a terça-feira de Carnaval é ${h.day(K.carnavalTerca(2027))}. Tiradentes, numa quarta, fica no meio da semana. O Dia do Trabalho num sábado não rende nada para quem trabalha de segunda a sexta.</p>
<h2>Feriados e dias úteis de 2027 por estado</h2>
<p>A quantidade de feriados muda de um estado para outro por causa dos feriados estaduais. A tabela soma nacionais e estaduais e mostra quantos caem em dia útil e quantos dias úteis sobram de segunda a sexta.</p>
${tabelaUFs(h, 2027)}
<p>Os dias úteis mês a mês, inclusive com o sábado, estão em ${h.a('dias-uteis-2027', 'dias úteis 2027')}. Um calendário para imprimir, com os feriados do seu estado marcados, está em ${h.a('calendario-2027', 'calendário 2027')}.</p>
<h2>De onde vêm as datas</h2>
<p>Os feriados nacionais estão na ${h.src('lei-662', 'Lei 662/1949')}, na ${h.src('lei-6802', 'Lei 6.802/1980')} e na ${h.src('lei-14759', 'Lei 14.759/2023')}; a Sexta-feira da Paixão, na ${h.src('lei-9093', 'Lei 9.093/1995')}. Os estaduais vêm da lei de cada estado, com o link na página do estado. As datas móveis saem da Páscoa, calculada pela fórmula de Gauss. A lista de pontos facultativos federais de 2027 depende de uma portaria que ainda não saiu; veja ${h.a('pontos-facultativos', 'pontos facultativos')}.</p>`,
    },
    en: {
      slug: 'brazil-public-holidays-2027', nav: 'Holidays 2027', card: 'Every national and state holiday in 2027, by state',
      title: 'Public holidays 2027 in Brazil: national and by state',
      description: 'Public holidays in Brazil in 2027: national dates with weekday, the state holidays of all 27 units with their laws, Carnival, Corpus Christi, long weekends.',
      h1: 'Public holidays in Brazil 2027, national and state by state',
      intro: 'Pick a state: the list shows every 2027 holiday with its weekday, how many fall on a working day, the one-day bridges and how many working days are left.',
      resume: `Brazil has ten national holidays in 2027: New Year's Day on ${w('2027-01-01', 'en')} ${d('2027-01-01', 'en')}; Good Friday on ${d(K.paixao(2027), 'en')}; Tiradentes Day on a ${w('2027-04-21', 'en')}; Labour Day on a Saturday; Independence Day, Our Lady of Aparecida and All Souls' Day on Tuesdays, 7 September, 12 October and 2 November; Proclamation of the Republic on Monday 15 November; Black Consciousness Day and Christmas on Saturdays. ${uteis(2027).length} of them fall Monday to Friday and ${fds(2027).length} at the weekend. The year has ${prolong(2027).length} national long weekends, on a Friday or a Monday, and ${emendas(2027).length} holidays on a Tuesday or Thursday that call for a bridge day. Carnival, on ${d(K.carnavalTerca(2027), 'en')}, and Corpus Christi, on ${d(K.corpusChristi(2027), 'en')}, are not national holidays: they are federal optional days off and become holidays only where a local law says so. Each state adds its data magna, sometimes more, and each state capital its own municipal holidays. In São Paulo, for instance, 2027 has ${K.folgas(2027, { uf: 'SP' }).length} national and state holidays and ${du(2027, 'SP')} working days.`,
      faqs: [
        { q: 'How many national holidays does Brazil have in 2027?', a: `Ten, counting Good Friday: 1 January, Good Friday on 26 March, 21 April, 1 May, 7 September, 12 October, 2 November, 15 November, 20 November and 25 December. Only ${uteis(2027).length} fall on a weekday. Carnival and Corpus Christi are not counted: they are optional days off.` },
        { q: 'Which Brazilian holidays fall on a weekend in 2027?', a: `${nomes(fds(2027), 'en')}. Labour Day, Black Consciousness Day and Christmas fall on Saturdays. Since federal law does not move holidays, these give no extra day off if you do not work on Saturdays anyway. The table above shows each date's weekday, so the long weekends stand out at a glance.` },
        { q: 'Which long weekends does Brazil have in 2027?', a: 'With no leave: New Year (Friday 1 January), Good Friday (26 March) and Proclamation of the Republic (Monday 15 November). With a one-day bridge: Independence Day, Aparecida and All Souls\' Day fall on Tuesdays and call for the Monday before. In São Paulo, the Constitutionalist Revolution holiday on a Friday adds another.' },
      ],
      body: (h) => `<h2>Every 2027 holiday, national and state</h2>
<p>The table brings together the national holidays and, for each state date, the abbreviations of the states where it applies. Municipal holidays of the state capitals appear in the tool above when the capital's law has been checked.</p>
${tabelaAno(h, 2027)}
<h2>A year of Tuesdays</h2>
<p>Three national holidays in a row fall on a Tuesday in 2027: Independence Day, Our Lady of Aparecida and All Souls' Day. Each one leaves a stray Monday between the weekend and the holiday. If you can take those three Mondays off, you get three four-day weekends in the second half of the year for just three days of leave. Proclamation of the Republic Day, on a Monday, closes the run with a free long weekend. The ${h.a('feriados-prolongados-2027', 'long-weekend planner')} works out the best use of your days off over the whole year.</p>
${h.mini('em', { p: ['uf', 'folga'], c: 'Work out your 2027 bridges' })}
<p>The start of the year is different. Easter is early, on ${h.day(K.pascoa(2027))}, and so is Carnival: Carnival Tuesday is ${h.day(K.carnavalTerca(2027))}. Tiradentes Day, on a Wednesday, sits midweek. Labour Day on a Saturday gives nothing to anyone working Monday to Friday.</p>
<h2>Holidays and working days in 2027 by state</h2>
<p>The number of holidays varies from state to state because of state holidays. The table adds national and state holidays and shows how many fall on a weekday and how many working days are left, Monday to Friday.</p>
${tabelaUFs(h, 2027)}
<p>Working days month by month, including Saturdays if you need them, are on ${h.a('dias-uteis-2027', 'working days 2027')}. A printable calendar with your state's holidays marked is on ${h.a('calendario-2027', 'calendar 2027')}.</p>
<h2>Where the dates come from</h2>
<p>National holidays are in ${h.src('lei-662', 'Law 662/1949')}, ${h.src('lei-6802', 'Law 6,802/1980')} and ${h.src('lei-14759', 'Law 14,759/2023')}; Good Friday in ${h.src('lei-9093', 'Law 9,093/1995')}. State holidays come from each state's law, linked on the state's page. Movable dates follow Easter, computed with Gauss's formula. The 2027 list of federal optional days off depends on an ordinance that has not come out yet; see ${h.a('pontos-facultativos', 'optional days off')}.</p>`,
    },
  }),
  defineGuide({
    id: 'feriados-2026', group: 'feriados', order: 21, tool: 'ft', toolArg: { ano: 2026, fac: 'sim' },
    countdown: { date: '2026-12-25', label: { pt: 'Natal de 2026', en: 'Christmas 2026' } },
    related: ['home', 'feriados-de-novembro', 'pontos-facultativos', 'feriados-2027'],
    sources: [...SRC, 'mgi-servidor-2026'],
    pt: {
      slug: 'feriados-2026', nav: 'Feriados 2026', card: 'Os feriados de 2026 e os que ainda faltam até dezembro',
      title: 'Feriados 2026: os que faltam e a lista completa do ano',
      description: 'Feriados 2026 no Brasil: os que ainda faltam até o fim do ano, a lista completa com dia da semana, os estaduais de cada UF e os pontos facultativos da portaria.',
      h1: 'Feriados 2026: a lista completa e os que ainda faltam',
      intro: 'Escolha o estado: a lista traz cada feriado de 2026 com o dia da semana e, se quiser, os pontos facultativos federais da portaria do Ministério da Gestão.',
      resume: `Em 2026 o Brasil teve dez feriados nacionais, e o calendário foi generoso: o Ano-Novo caiu numa quinta, a Sexta-feira da Paixão em 3 de abril, Tiradentes numa terça, o Dia do Trabalho numa sexta, a Independência, Aparecida e Finados em segundas-feiras, a Consciência Negra e o Natal em sextas. ${uteis(2026).length} dos dez caíram em dia útil; só a Proclamação da República, num domingo, se perdeu. Até o fim do ano faltam Finados, em ${w('2026-11-02', 'pt')}, 2 de novembro; a Proclamação da República, no domingo 15; a Consciência Negra, na sexta 20; e o Natal, na sexta 25 de dezembro: três feriados prolongados em oito semanas. Para o serviço público federal, a portaria do Ministério da Gestão ainda prevê o Dia do Servidor, transferido de 28 para 30 de outubro, e as tardes de 24 e 31 de dezembro. Os feriados estaduais de 2026 já passaram em quase todos os estados; os que restam aparecem na ferramenta quando você escolhe o estado. Ao todo, São Paulo teve ${K.folgas(2026, { uf: 'SP' }).length} feriados nacionais e estaduais e ${du(2026, 'SP')} dias úteis em 2026.`,
      faqs: [
        { q: 'Quais feriados ainda faltam em 2026?', a: 'Os nacionais que restam são Finados (segunda, 2 de novembro), a Proclamação da República (domingo, 15 de novembro), o Dia Nacional de Zumbi e da Consciência Negra (sexta, 20 de novembro) e o Natal (sexta, 25 de dezembro). Escolha o seu estado na ferramenta para ver se há feriado estadual ou da capital nesse período.' },
        { q: 'O Dia do Servidor Público é feriado?', a: 'Não. É ponto facultativo para os servidores federais, fixado pela portaria anual. Em 2026, o Ministério da Gestão transferiu o ponto facultativo de quarta, 28 de outubro, para sexta, 30 de outubro. Estados e prefeituras decidem por conta própria para os seus servidores; no setor privado, é dia normal.' },
        { q: 'Véspera de Natal e de Ano-Novo são feriado em 2026?', a: 'Não. Os dias 24 e 31 de dezembro de 2026, quintas-feiras, são ponto facultativo após as 13 horas nos órgãos federais, segundo a Portaria MGI 11.460/2025. Nas empresas, valem a convenção coletiva e o que o empregador decidir. O Natal de 2026 e o 1º de janeiro de 2027 caem em sextas-feiras e formam dois fins de semana prolongados seguidos.' },
      ],
      body: (h) => `<h2>Os feriados de 2026, nacionais e estaduais</h2>
<p>A tabela lista os feriados nacionais e os estaduais, com as siglas dos estados onde cada data estadual vale.</p>
${tabelaAno(h, 2026)}
<h2>Novembro e dezembro: três feriados prolongados</h2>
<p>O fim de 2026 concentra os feriados que restam. Finados, numa segunda, forma um fim de semana de três dias de 31 de outubro a 2 de novembro. A Proclamação da República cai num domingo e não rende folga. A Consciência Negra, numa sexta, dá outro fim de semana longo, de 20 a 22 de novembro. O Natal, também numa sexta, fecha o ano com três dias seguidos. Quem tira os quatro dias úteis entre o Natal e o Ano-Novo, de 28 a 31 de dezembro, emenda com o Ano-Novo de 2027, que cai numa sexta, e fica dez dias seguidos livre, de 25 de dezembro a 3 de janeiro.</p>
${h.mini('mes', { p: ['uf', 'mes'], d: { ano: 2026, mes: 12 }, c: 'Ver os feriados de cada mês' })}
<h2>Pontos facultativos de 2026</h2>
<p>A ${h.src('portaria-mgi-2026', 'Portaria MGI nº 11.460/2025')} fixou para os órgãos federais a segunda e a terça de Carnaval, a Quarta-feira de Cinzas até as 14 horas, a segunda 20 de abril, Corpus Christi e a sexta seguinte, o Dia do Servidor Público e as tardes de 24 e 31 de dezembro. O Dia do Servidor foi ${h.src('mgi-servidor-2026', 'transferido para 30 de outubro')}. Para ver todos na ferramenta, abra "Mais opções" e escolha mostrar os pontos facultativos. A lista de 2027 está em ${h.a('pontos-facultativos', 'pontos facultativos')}.</p>
<h2>Dias úteis de 2026 por estado</h2>
${tabelaUFs(h, 2026)}
<p>Os feriados de novembro, com os pontos facultativos e os municipais, estão em ${h.a('feriados-de-novembro', 'feriados de novembro')}; os de dezembro estão na tabela acima. O ano seguinte está em ${h.a('feriados-2027', 'feriados 2027')}.</p>`,
    },
    en: {
      slug: 'brazil-public-holidays-2026', nav: 'Holidays 2026', card: "2026 holidays and the ones still to come before December",
      title: 'Public holidays 2026 in Brazil: what is left and full list',
      description: "Brazilian public holidays in 2026: the ones still to come before the year ends, the full list with weekdays, state holidays and federal optional days off.",
      h1: 'Public holidays in Brazil 2026: full list and what is left',
      intro: 'Pick a state: the list gives every 2026 holiday with its weekday and, if you like, the federal optional days off from the Ministry of Management ordinance.',
      resume: `Brazil had ten national holidays in 2026, and the calendar was generous: New Year's Day fell on a Thursday, Good Friday on 3 April, Tiradentes Day on a Tuesday, Labour Day on a Friday, Independence Day, Aparecida and All Souls' Day on Mondays, and Black Consciousness Day and Christmas on Fridays. ${uteis(2026).length} of the ten fell on a weekday; only Proclamation of the Republic Day, on a Sunday, was lost. Still to come before the end of the year are All Souls' Day on ${w('2026-11-02', 'en')} 2 November, Proclamation of the Republic on Sunday the 15th, Black Consciousness Day on Friday the 20th and Christmas on Friday 25 December: three long weekends in eight weeks. For the federal civil service, the Ministry of Management ordinance also gives Public Servant's Day, moved from 28 to 30 October, and the afternoons of 24 and 31 December. State holidays for 2026 are already over in almost every state; any left show up in the tool when you pick your state. In all, São Paulo had ${K.folgas(2026, { uf: 'SP' }).length} national and state holidays and ${du(2026, 'SP')} working days in 2026.`,
      faqs: [
        { q: 'Which Brazilian holidays are still to come in 2026?', a: "The national ones left are All Souls' Day (Monday 2 November), Proclamation of the Republic (Sunday 15 November), National Day of Zumbi and Black Consciousness (Friday 20 November) and Christmas Day (Friday 25 December). Pick your state in the tool to see whether a state or capital-city holiday also falls in that period." },
        { q: "Is Public Servant's Day a holiday in Brazil?", a: "No. It is an optional day off for federal civil servants, set by the yearly ordinance. In 2026, the Ministry of Management moved it from Wednesday 28 October to Friday 30 October. States and city halls decide for their own staff; in the private sector it is an ordinary day." },
        { q: "Are Christmas Eve and New Year's Eve holidays in Brazil in 2026?", a: 'No. 24 and 31 December 2026, both Thursdays, are optional half days off from 1 pm in federal bodies under Ordinance MGI 11,460/2025. In private companies, the collective agreement and the employer decide. Christmas Day 2026 and 1 January 2027 both fall on Fridays, giving two three-day weekends in a row.' },
      ],
      body: (h) => `<h2>2026 holidays, national and state</h2>
<p>The table lists national holidays and state holidays, with the abbreviations of the states where each state date applies.</p>
${tabelaAno(h, 2026)}
<h2>November and December: three long weekends</h2>
<p>The end of 2026 holds the remaining holidays. All Souls' Day, on a Monday, makes a three-day weekend from 31 October to 2 November. Proclamation of the Republic falls on a Sunday and gives no day off. Black Consciousness Day, on a Friday, brings another long weekend, 20 to 22 November. Christmas, also a Friday, ends the year with three days in a row. Take the four working days between Christmas and New Year, 28 to 31 December, and you join up with New Year's Day 2027, a Friday, for ten days off from 25 December to 3 January.</p>
${h.mini('mes', { p: ['uf', 'mes'], d: { ano: 2026, mes: 12 }, c: 'See the holidays of each month' })}
<h2>Optional days off in 2026</h2>
<p>${h.src('portaria-mgi-2026', 'Ordinance MGI 11,460/2025')} set for federal bodies Carnival Monday and Tuesday, Ash Wednesday until 2 pm, Monday 20 April, Corpus Christi and the Friday after, Public Servant's Day and the afternoons of 24 and 31 December. Public Servant's Day was ${h.src('mgi-servidor-2026', 'moved to 30 October')}. To see them all in the tool, open "More options" and choose to show optional days off. The 2027 list is on ${h.a('pontos-facultativos', 'optional days off')}.</p>
<h2>Working days in 2026 by state</h2>
${tabelaUFs(h, 2026)}
<p>November's holidays, with optional and municipal days off, are on ${h.a('feriados-de-novembro', 'November holidays')}; December's are in the table above. The following year is on ${h.a('feriados-2027', 'public holidays 2027')}.</p>`,
    },
  }),
];
