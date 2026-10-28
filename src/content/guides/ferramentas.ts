/** Ferramentas: feriados prolongados (emendas), dias úteis, calendário. Datas e números: motor. */
import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { tabelaPontes } from '../../lib/bausteine';
import { dLong } from '../../lib/tool-specs';

type L = 'pt' | 'en';
const d = (iso: string, l: L) => dLong(iso, l);
const Y = 2027;
const sp = (f: number) => K.otimiza(Y, { uf: 'SP' }, f);
const du = (uf: Parameters<typeof K.diasUteis>[1]['uf'], y = Y, o = {}) => K.diasUteis(y, { uf }, o).reduce((a, b) => a + b, 0);
const mes = (uf: Parameters<typeof K.diasUteis>[1]['uf'], m: number) => K.diasUteis(Y, { uf })[m - 1];
const ufsDu = [...K.UFS].map((u) => ({ u, n: du(u) })).sort((a, b) => a.n - b.n);
const min = ufsDu[0], max = ufsDu[ufsDu.length - 1];
const mesesMin = (l: L) => { const m = K.diasUteis(Y, { uf: 'SP' }); const lo = Math.min(...m); return m.map((x, i) => [x, i] as const).filter(([x]) => x === lo).map(([, i]) => new Date(Date.UTC(Y, i, 15)).toLocaleDateString(l === 'pt' ? 'pt-BR' : 'en-GB', { month: 'long', timeZone: 'UTC' })).join(l === 'pt' ? ' e ' : ' and '); };
const p3 = sp(3), p10 = sp(10), p20 = sp(20);

export default [
  defineGuide({
    id: 'feriados-prolongados-2027', group: 'ferramentas', order: 10, tool: 'em', toolArg: { ano: Y },
    related: ['home', 'feriados-2027', 'dias-uteis-2027', 'calendario-2027', 'carnaval-2027'],
    sources: ['lei-662', 'lei-6802', 'lei-14759', 'lei-9093', 'ac-lei-2126'],
    pt: {
      slug: 'feriados-prolongados-2027', nav: 'Feriados prolongados 2027', card: 'Onde pôr suas folgas para ter mais dias livres seguidos',
      title: 'Feriados prolongados 2027: emendas e melhores folgas',
      description: 'Feriados prolongados 2027 por estado: o planejador distribui seus dias de folga nas melhores emendas e mostra cada fim de semana longo com a data. Grátis.',
      h1: 'Feriados prolongados 2027: onde pôr as suas folgas',
      intro: 'Escolha o estado e quantos dias de folga quer usar: o planejador mostra o melhor plano de 2027, todas as emendas do ano e quantos dias livres seguidos você ganha.',
      resume: `Em 2027, os feriados nacionais que já formam fim de semana prolongado sem nenhuma folga são o Ano-Novo, numa sexta, a Sexta-feira da Paixão, em ${d(K.paixao(Y), 'pt')}, e a Proclamação da República, numa segunda, 15 de novembro. As emendas de um dia só ficam todas no segundo semestre: a segunda-feira 6 de setembro, antes da Independência; a segunda 11 de outubro, antes de Nossa Senhora Aparecida; e a segunda 1º de novembro, antes de Finados. Cada uma rende quatro dias livres por um dia de folga. Tiradentes, numa quarta, pede dois dias para render cinco. Com três dias de folga bem colocados, quem trabalha em São Paulo tem ${p3.livre} dias livres em blocos; com dez, ${p10.livre}; com vinte, ${p20.livre}. O planejador testa todas as combinações de dias de trabalho entre um feriado e o fim de semana e escolhe a que dá mais dias livres seguidos para o seu saldo; em caso de empate, a que gasta menos folga. Feriados estaduais e, se quiser, os da capital entram no cálculo. Carnaval só entra se você marcar que folga nesses dias.`,
      faqs: [
        { q: 'Quais são as emendas de feriado de 2027?', a: 'As emendas de um dia são três, todas numa segunda-feira: 6 de setembro (Independência na terça, 7), 11 de outubro (Aparecida na terça, 12) e 1º de novembro (Finados na terça, 2). Em alguns estados há outras, por causa de feriados estaduais; o planejador mostra todas as do seu estado, das melhores para as piores.' },
        { q: 'Empresa é obrigada a dar a emenda do feriado?', a: 'Não. A emenda não é feriado: é um dia útil. A folga depende de acordo com o empregador, de banco de horas, de convenção coletiva ou, no serviço público, de decreto ou portaria que declare ponto facultativo. Quem não trabalha na emenda sem acordo pode ter o dia descontado.' },
        { q: 'Como o planejador escolhe as melhores folgas?', a: 'Ele divide o ano em blocos livres (fins de semana e feriados) e blocos de trabalho entre eles, e testa todas as combinações de blocos de trabalho que encostam num feriado. Fica com a combinação que dá mais dias livres seguidos para o número de folgas que você informou e, em caso de empate, com a que gasta menos. O resultado é exato, não uma estimativa.' },
      ],
      body: (h) => `<h2>As melhores emendas de 2027 em São Paulo</h2>
<p>A tabela ordena as emendas pelo rendimento: quantos dias livres seguidos cada dia de folga traz. Uma emenda de um dia ao lado de um feriado de terça ou de quinta rende quatro dias por um, o melhor que existe. Uma semana inteira de folga, de segunda a sexta, rende nove dias por cinco, menos de dois por um. Tudo que fica acima disso é uma boa emenda.</p>
${tabelaPontes(h, Y, { uf: 'SP' })}
<p>Os números mudam de estado para estado por causa dos feriados estaduais. No ${h.a('feriados-rio-de-janeiro', 'Rio de Janeiro')}, no ${h.a('feriados-acre', 'Acre')} ou na ${h.a('feriados-bahia', 'Bahia')}, escolha o estado no planejador acima para ver as suas. No Acre, a lei estadual manda comemorar na sexta-feira os feriados estaduais que caem de terça a quinta, e o planejador já usa as datas adiadas.</p>
<h2>Como usar o planejador</h2>
<p>Informe o estado, o ano e quantos dias de folga quer gastar em emendas. Em geral não é o saldo inteiro de férias: parte vai para as férias de 30 dias, que a lei trabalhista permite dividir. Um bom ponto de partida é de cinco a dez dias. O planejador mostra no alto quantos dias livres você ganha, embaixo cada bloco com as datas e, por último, todas as emendas do ano por rendimento.</p>
<p>Em "Mais opções" você pode incluir os feriados municipais da capital, quando a lei da capital foi conferida, e marcar a segunda e a terça de Carnaval como folga. Carnaval não é feriado nacional, mas muitas empresas dão folga; se for o seu caso, ele muda bastante o começo do ano.</p>
${h.mini('du', { p: ['uf'], c: 'Ver os dias úteis de 2027' })}
<h2>Por que 2027 é bom no segundo semestre</h2>
<p>Quando um feriado cai na terça ou na quinta, ele cria uma emenda de um dia. Em 2027 isso acontece três vezes seguidas, em setembro, outubro e novembro, sempre numa terça. O primeiro semestre é mais fraco: o Dia do Trabalho cai num sábado, Tiradentes numa quarta, e Corpus Christi, que só é feriado onde a lei local manda, numa quinta, 27 de maio. Onde Corpus Christi é feriado, a sexta 28 de maio vira mais uma emenda de um dia. Em 2028, as mesmas três datas caem numa quinta: escolha 2028 no planejador acima.</p>`,
    },
    en: {
      slug: 'long-weekends-brazil-2027', nav: 'Long weekends 2027', card: 'Where to put your days off for the most time off in a row',
      title: 'Long weekends 2027 in Brazil: bridges and best days off',
      description: 'Long weekends in Brazil 2027 by state: the planner spreads your days off over the best bridge days and lists every long weekend with its dates. Free, exact.',
      h1: 'Long weekends in Brazil 2027: where to put your days off',
      intro: 'Pick your state and how many days off you want to spend: the planner shows the best plan for 2027, every bridge of the year and how many free days in a row you get.',
      resume: `In 2027, the national holidays that make a long weekend with no leave at all are New Year's Day on a Friday, Good Friday on ${d(K.paixao(Y), 'en')}, and Proclamation of the Republic on Monday 15 November. The one-day bridges all come in the second half: Monday 6 September before Independence Day, Monday 11 October before Our Lady of Aparecida, and Monday 1 November before All Souls' Day. Each gives four free days for one day off. Tiradentes Day, on a Wednesday, needs two days off to give five. With three days off placed well, someone working in São Paulo gets ${p3.livre} free days in blocks; with ten, ${p10.livre}; with twenty, ${p20.livre}. The planner tests every combination of working days between a holiday and the weekend and picks the one that gives the most consecutive free days for your allowance; on a tie, the one that uses fewer days off. State holidays and, if you choose, those of the state capital are included. Carnival counts only if you tick that you get those days off.`,
      faqs: [
        { q: 'What are the bridge days (emendas) in Brazil in 2027?', a: 'There are three one-day bridges, all on a Monday: 6 September (Independence Day on Tuesday the 7th), 11 October (Aparecida on Tuesday the 12th) and 1 November (All Souls\' Day on Tuesday the 2nd). Some states have more because of state holidays; the planner shows all of yours, best first.' },
        { q: 'Does my employer have to give me the bridge day off?', a: 'No. A bridge day is not a holiday: it is a working day. Getting it off depends on an agreement with your employer, an hours bank, a collective agreement or, in the civil service, a decree or ordinance declaring an optional day off. Skipping it without agreement can cost you a day\'s pay.' },
        { q: 'How does the long-weekend planner choose?', a: 'It splits the year into free blocks (weekends and holidays) and the working blocks between them, and tests every combination of working blocks that touch a holiday. It keeps the combination giving the most consecutive free days for the number of days off you entered and, on a tie, the one using fewer. The answer is exact, not an estimate.' },
      ],
      body: (h) => `<h2>The best bridges of 2027 in São Paulo</h2>
<p>The table ranks bridges by yield: how many consecutive free days each day off brings. A one-day bridge next to a Tuesday or Thursday holiday gives four days for one, the best there is. A whole week off, Monday to Friday, gives nine days for five, under two for one. Anything above that is a good bridge.</p>
${tabelaPontes(h, Y, { uf: 'SP' })}
<p>The numbers change from state to state because of state holidays. In ${h.a('feriados-rio-de-janeiro', 'Rio de Janeiro')}, ${h.a('feriados-acre', 'Acre')} or ${h.a('feriados-bahia', 'Bahia')}, pick the state in the planner above to see yours. In Acre, state law moves state holidays falling Tuesday to Thursday to the Friday, and the planner already uses the moved dates.</p>
<h2>How to use the planner</h2>
<p>Enter your state, the year and how many days off you want to spend on bridges. Usually that is not your whole leave: part goes on the 30-day annual holiday, which labour law lets you split. Five to ten days is a good starting point. The planner shows at the top how many free days you get, below that each block with its dates and, at the bottom, every bridge of the year by yield.</p>
<p>Under "More options" you can include the municipal holidays of the state capital, where the capital's law has been checked, and mark Carnival Monday and Tuesday as days off. Carnival is not a national holiday, but many employers give the time off; if yours does, it changes the start of the year a lot.</p>
${h.mini('du', { p: ['uf'], c: 'See the working days of 2027' })}
<h2>Why the second half of 2027 is good</h2>
<p>When a holiday falls on a Tuesday or a Thursday, it creates a one-day bridge. In 2027 that happens three times running, in September, October and November, always on a Tuesday. The first half is weaker: Labour Day falls on a Saturday, Tiradentes on a Wednesday, and Corpus Christi, a holiday only where local law says so, on Thursday 27 May. Where Corpus Christi is a holiday, Friday 28 May becomes another one-day bridge. In 2028 the same three dates fall on Thursdays: pick 2028 in the planner above.</p>`,
    },
  }),
  defineGuide({
    id: 'dias-uteis-2027', group: 'ferramentas', order: 11, tool: 'du', toolArg: { ano: Y },
    related: ['feriados-2027', 'feriados-prolongados-2027', 'calendario-2027', 'quantos-dias-faltam'],
    sources: ['lei-662', 'lei-6802', 'lei-14759', 'lei-9093'],
    pt: {
      slug: 'dias-uteis-2027', nav: 'Dias úteis 2027', card: 'Quantos dias úteis tem 2027, mês a mês, no seu estado',
      title: 'Dias úteis 2027: quantos são no ano e em cada mês, por UF',
      description: 'Dias úteis 2027 por estado: total do ano e de cada mês, de segunda a sexta ou a sábado, sem os feriados nacionais, estaduais e, se quiser, da capital.',
      h1: 'Dias úteis 2027: o total do ano e de cada mês',
      intro: 'Escolha o estado: a ferramenta conta os dias úteis de 2027 mês a mês, descontando os feriados nacionais, estaduais e, se quiser, os da capital e o Carnaval.',
      resume: `2027 tem ${K.segASex(Y)} dias de segunda a sexta. Deles saem os feriados que caem em dia útil: os nacionais são ${K.folgas(Y, { uf: 'DF' }).filter((f) => (f.esfera === 'nacional' || f.esfera === 'religioso') && !K.isWeekend(K.fromIso(f.date))).length} em 2027, porque o Dia do Trabalho, a Consciência Negra e o Natal caem em sábados. Os estaduais mudam a conta: São Paulo fica com ${du('SP')} dias úteis, ${K.UF_NOME[min.u]} com ${min.n}, o menor número do país, e ${K.UF_NOME[max.u]} com ${max.n}, o maior. Se a empresa dá folga na segunda e na terça de Carnaval, São Paulo cai para ${du('SP', Y, { carnaval: true })}. Os meses com menos dias úteis em São Paulo são ${mesesMin('pt')}; em fevereiro há ${mes('SP', 2)} dias úteis e em setembro ${mes('SP', 9)}. Quem conta prazos em dias úteis, calcula vale-transporte ou planeja metas mensais precisa do número do seu estado e, às vezes, da sua cidade: os feriados municipais da capital entram em "Mais opções" quando a lei municipal foi conferida. Para quem trabalha também aos sábados, a ferramenta conta de segunda a sábado.`,
      faqs: [
        { q: 'Quantos dias úteis tem 2027?', a: `De segunda a sexta, sem feriados nacionais, 2027 tem ${K.diasUteis(Y, { uf: 'MT' }).reduce((a, b) => a + b, 0)} dias úteis num estado sem feriado estadual em dia útil. Com os feriados estaduais, São Paulo tem ${du('SP')}, Rio de Janeiro ${du('RJ')} e Minas Gerais ${du('MG')}. A ferramenta dá o número de cada estado e de cada mês.` },
        { q: 'Sábado é dia útil?', a: 'Para muitos prazos e para a contagem de dias de trabalho de quem trabalha aos sábados, sim; para bancos e para a maior parte dos escritórios, não. Por isso a ferramenta deixa escolher: de segunda a sexta ou de segunda a sábado. Domingos e feriados nunca contam.' },
        { q: 'Carnaval conta como dia útil?', a: 'Pela lei federal, sim: Carnaval não é feriado nacional, é ponto facultativo para os órgãos federais. Onde uma lei estadual ou municipal faz do Carnaval um feriado, ele deixa de contar. Se a sua empresa dá folga, marque essa opção em "Mais opções".' },
      ],
      body: (h) => `<h2>Dias úteis de 2027 mês a mês</h2>
<p>A conta parte dos dias de segunda a sexta de cada mês e tira os feriados que caem nesses dias. Um feriado no sábado ou no domingo não muda nada. A tabela da ferramenta acima mostra o resultado para o estado escolhido; a tabela abaixo compara alguns estados.</p>
${h.table([h.T('Mês', 'Month'), 'SP', 'RJ', 'MG', 'BA', 'DF'], Array.from({ length: 12 }, (_, i) => [new Date(Date.UTC(Y, i, 15)).toLocaleDateString(h.lang === 'pt' ? 'pt-BR' : 'en-GB', { month: 'long', timeZone: 'UTC' }), ...(['SP', 'RJ', 'MG', 'BA', 'DF'] as const).map((u) => K.diasUteis(Y, { uf: u })[i])]), h.T('Dias úteis de segunda a sexta em 2027, sem feriados municipais', 'Working days Monday to Friday in 2027, municipal holidays excluded'), ['l', 'r', 'r', 'r', 'r', 'r'])}
<h2>Por que o número muda de um estado para outro</h2>
<p>Os feriados nacionais são os mesmos em todo o país. A diferença vem dos feriados estaduais que caem em dia útil. Em 2027, a Revolução Constitucionalista de São Paulo cai numa sexta, o Dois de Julho da Bahia também; já a data magna de outros estados cai no fim de semana e não muda nada. O Distrito Federal tem Corpus Christi como feriado distrital, em 27 de maio, uma quinta. As capitais acrescentam os seus feriados municipais, que só valem na cidade.</p>
<p>Para prazos de processos judiciais e administrativos, valem as regras de cada tribunal ou órgão, que publicam o próprio calendário de expediente, com recessos e pontos facultativos. Use a contagem desta página como referência do calendário civil, não como contagem processual.</p>
${h.mini('ft', { p: ['uf'], c: 'Ver os feriados de 2027 do estado' })}
<h2>Dias úteis entre duas datas</h2>
<p>Para saber quantos dias úteis faltam até uma data, como o Natal, o Carnaval ou a Páscoa, use ${h.a('quantos-dias-faltam', 'quantos dias faltam')}: a ferramenta conta os dias corridos e os dias úteis do seu estado a partir de hoje. O calendário completo, para imprimir, está em ${h.a('calendario-2027', 'calendário 2027')}.</p>`,
    },
    en: {
      slug: 'working-days-brazil-2027', nav: 'Working days 2027', card: 'How many working days 2027 has, month by month, in your state',
      title: 'Working days 2027 in Brazil: per year and month, by state',
      description: 'Working days in Brazil 2027 by state: yearly and monthly totals, Monday to Friday or Saturday, minus national, state and, if you like, capital holidays.',
      h1: 'Working days in Brazil 2027: the year and each month',
      intro: 'Pick a state: the tool counts the working days of 2027 month by month, minus national and state holidays and, if you like, capital-city holidays and Carnival.',
      resume: `2027 has ${K.segASex(Y)} days from Monday to Friday. From them come off the holidays that fall on a weekday: ${K.folgas(Y, { uf: 'DF' }).filter((f) => (f.esfera === 'nacional' || f.esfera === 'religioso') && !K.isWeekend(K.fromIso(f.date))).length} national ones in 2027, because Labour Day, Black Consciousness Day and Christmas fall on Saturdays. State holidays change the count: São Paulo is left with ${du('SP')} working days, ${K.UF_NOME[min.u]} with ${min.n}, the lowest in the country, and ${K.UF_NOME[max.u]} with ${max.n}, the highest. If your employer gives Carnival Monday and Tuesday off, São Paulo drops to ${du('SP', Y, { carnaval: true })}. The months with the fewest working days in São Paulo are ${mesesMin('en')}; February has ${mes('SP', 2)} working days and September ${mes('SP', 9)}. Anyone counting deadlines in working days, working out transport allowances or planning monthly targets needs their own state's figure and sometimes their city's: capital-city holidays are under "More options" where the municipal law has been checked. If you also work Saturdays, the tool counts Monday to Saturday.`,
      faqs: [
        { q: 'How many working days does 2027 have in Brazil?', a: `Monday to Friday, without national holidays, 2027 has ${K.diasUteis(Y, { uf: 'MT' }).reduce((a, b) => a + b, 0)} working days in a state with no state holiday on a weekday. With state holidays, São Paulo has ${du('SP')}, Rio de Janeiro ${du('RJ')} and Minas Gerais ${du('MG')}. The tool gives each state's and each month's figure.` },
        { q: 'Is Saturday a working day in Brazil?', a: 'For many deadlines and for people who work Saturdays, yes; for banks and most offices, no. That is why the tool lets you choose: Monday to Friday or Monday to Saturday. Sundays and holidays never count. Pick your state too, because state holidays change the total.' },
        { q: 'Does Carnival count as a working day in Brazil?', a: 'Under federal law, yes: Carnival is not a national holiday but an optional day off for federal bodies. Where a state or municipal law makes Carnival a holiday, it stops counting. If your employer gives the time off, tick that option under "More options".' },
      ],
      body: (h) => `<h2>Working days in 2027 month by month</h2>
<p>The count starts from each month's Mondays to Fridays and removes the holidays that fall on them. A holiday on a Saturday or Sunday changes nothing. The tool's table above gives the result for the chosen state; the table below compares a few states.</p>
${h.table([h.T('Mês', 'Month'), 'SP', 'RJ', 'MG', 'BA', 'DF'], Array.from({ length: 12 }, (_, i) => [new Date(Date.UTC(Y, i, 15)).toLocaleDateString(h.lang === 'pt' ? 'pt-BR' : 'en-GB', { month: 'long', timeZone: 'UTC' }), ...(['SP', 'RJ', 'MG', 'BA', 'DF'] as const).map((u) => K.diasUteis(Y, { uf: u })[i])]), h.T('Dias úteis de segunda a sexta em 2027, sem feriados municipais', 'Working days Monday to Friday in 2027, municipal holidays excluded'), ['l', 'r', 'r', 'r', 'r', 'r'])}
<h2>Why the number changes from state to state</h2>
<p>National holidays are the same everywhere. The difference comes from state holidays falling on weekdays. In 2027, São Paulo's Constitutionalist Revolution holiday falls on a Friday, and so does Bahia's 2 July; other states' data magna falls at the weekend and changes nothing. The Federal District keeps Corpus Christi as a district holiday, on Thursday 27 May. State capitals add their municipal holidays, which apply in the city only.</p>
<p>For court and administrative deadlines, each court or body's own rules apply; they publish their own working calendar, with recesses and optional days off. Use the count on this page as a reference for the civil calendar, not as a procedural count.</p>
${h.mini('ft', { p: ['uf'], c: "See the state's 2027 holidays" })}
<h2>Working days between two dates</h2>
<p>To find how many working days are left until a date such as Christmas, Carnival or Easter, use ${h.a('quantos-dias-faltam', 'days until')}: it counts calendar days and your state's working days from today. The full printable calendar is on ${h.a('calendario-2027', 'calendar 2027')}.</p>`,
    },
  }),
  defineGuide({
    id: 'calendario-2027', group: 'ferramentas', order: 12, tool: 'calendario', toolArg: { ano: Y },
    related: ['feriados-2027', 'dias-uteis-2027', 'feriados-prolongados-2027', 'quantos-dias-faltam'],
    sources: ['lei-662', 'lei-6802', 'lei-14759', 'lei-9093', 'portaria-mgi-2026'],
    pt: {
      slug: 'calendario-2027', nav: 'Calendário 2027', card: 'O ano de 2027 com os feriados do seu estado, para imprimir',
      title: 'Calendário 2027 com feriados: para imprimir, por estado',
      description: 'Calendário 2027 com os feriados nacionais e do seu estado marcados, os doze meses numa página, pronto para imprimir, com Carnaval, Páscoa e dias úteis.',
      h1: 'Calendário 2027 com feriados, pronto para imprimir',
      intro: 'Escolha o estado: os doze meses de 2027 aparecem com os feriados marcados em cor, a lista das datas e os dias úteis. Use o botão Imprimir para levar ao papel.',
      resume: `O calendário de 2027 começa numa sexta-feira, o dia do Ano-Novo, e termina num sexto dia também, a sexta-feira 31 de dezembro. O ano não é bissexto e tem 365 dias, ${K.segASex(Y)} deles de segunda a sexta. A Páscoa cai cedo, em ${d(K.pascoa(Y), 'pt')}, o que puxa o Carnaval para ${d(K.carnavalTerca(Y), 'pt')} e Corpus Christi para ${d(K.corpusChristi(Y), 'pt')}. No calendário acima, os feriados nacionais e os do estado escolhido aparecem em verde; os pontos facultativos federais, em cinza, só aparecem quando a portaria do ano já foi publicada, e a de 2027 ainda não saiu. As semanas começam no domingo, como nos calendários brasileiros de parede. Ao imprimir, o menu, o rodapé e os botões somem e os doze meses ficam em três colunas, numa folha A4 em pé ou duas. Se quiser marcar também os feriados da capital, escolha a opção ao lado do estado: ela aparece para as capitais cuja lei municipal foi conferida. O endereço da página guarda a escolha, para você salvar ou compartilhar o calendário do seu estado.`,
      faqs: [
        { q: 'Em que dia da semana começa 2027?', a: 'Numa sexta-feira. O 1º de janeiro de 2027, Confraternização Universal, é feriado nacional e forma um fim de semana prolongado de três dias com o sábado e o domingo. O ano termina também numa sexta, 31 de dezembro: como 2027 não é bissexto, ele acaba no mesmo dia da semana em que começa.' },
        { q: '2027 é ano bissexto?', a: 'Não. 2027 tem 365 dias e fevereiro tem 28. O próximo ano bissexto é 2028, quando o Carnaval cai justamente no dia 29 de fevereiro. Por isso o calendário de 2027 tem 52 semanas e um dia, e 261 dias de segunda a sexta-feira antes de descontar os feriados.' },
        { q: 'Como imprimir o calendário 2027?', a: 'Escolha o estado, clique em Imprimir no quadro de resultado ou use o comando de impressão do navegador. A página esconde menus e botões e organiza os doze meses em três colunas. Em "Salvar como PDF" você guarda um arquivo para imprimir depois.' },
      ],
      body: (h) => `<h2>Os feriados marcados no calendário</h2>
<p>O calendário marca três tipos de data. Em verde, os feriados nacionais, a Sexta-feira da Paixão e os feriados estaduais do estado escolhido. Também em verde, se você escolher, os feriados municipais da capital. Em cinza, os pontos facultativos federais, que não são feriado mas dão folga aos servidores federais; eles só aparecem quando a portaria do Ministério da Gestão do ano já foi publicada.</p>
${h.mini('ft', { p: ['uf'], c: 'Lista de feriados de 2027 do estado' })}
<h2>2027 mês a mês</h2>
<p>Janeiro abre com o Ano-Novo numa sexta. Fevereiro tem o Carnaval nos dias 8 e 9. Março tem a Sexta-feira da Paixão no dia 26 e a Páscoa no dia 28. Abril tem Tiradentes numa quarta. Maio tem o Dia do Trabalho num sábado e Corpus Christi no dia 27. Junho, julho e agosto não têm feriado nacional; os estaduais de cada lugar aparecem no calendário. Setembro, outubro e novembro têm feriados em terças-feiras, nos dias 7, 12 e 2. Novembro ainda tem a Proclamação da República numa segunda e a Consciência Negra num sábado. Dezembro tem o Natal num sábado.</p>
<p>Quem precisa planejar folgas pode ir direto ao ${h.a('feriados-prolongados-2027', 'planejador de feriados prolongados')}. O número de dias úteis de cada mês está em ${h.a('dias-uteis-2027', 'dias úteis 2027')}.</p>`,
    },
    en: {
      slug: 'calendar-2027-brazil', nav: 'Calendar 2027', card: 'The 2027 year with your state\'s holidays, ready to print',
      title: 'Calendar 2027 with Brazilian holidays: printable, by state',
      description: "Printable 2027 calendar with Brazil's national holidays and your state's holidays marked, twelve months on one page, with Carnival, Easter and working days.",
      h1: 'Calendar 2027 with Brazilian holidays, ready to print',
      intro: 'Pick a state: the twelve months of 2027 appear with the holidays marked in colour, the list of dates and the working days. Use the Print button to put it on paper.',
      resume: `The 2027 calendar starts on a Friday, New Year's Day, and ends on a Friday too, 31 December. It is not a leap year and has 365 days, ${K.segASex(Y)} of them Monday to Friday. Easter is early, on ${d(K.pascoa(Y), 'en')}, which pulls Carnival to ${d(K.carnavalTerca(Y), 'en')} and Corpus Christi to ${d(K.corpusChristi(Y), 'en')}. In the calendar above, national holidays and those of the chosen state are in green; federal optional days off, in grey, appear only once the year's ordinance is out, and the 2027 one has not been published yet. Weeks start on Sunday, as on Brazilian wall calendars. When printing, the menu, footer and buttons disappear and the twelve months sit in three columns, on one or two portrait A4 sheets. To mark the capital's holidays too, use the option next to the state: it appears for capitals whose municipal law has been checked. The page address keeps your choice, so you can save or share your state's calendar.`,
      faqs: [
        { q: 'What day of the week does 2027 start on?', a: "A Friday. 1 January 2027, New Year's Day, is a national holiday and makes a three-day weekend with the Saturday and Sunday. The year also ends on a Friday, 31 December: because 2027 is not a leap year, it ends on the same weekday it starts on." },
        { q: 'Is 2027 a leap year?', a: 'No. 2027 has 365 days and February has 28. The next leap year is 2028, when Brazilian Carnival falls precisely on 29 February. So the 2027 calendar has 52 weeks and one day, and 261 weekdays before holidays are taken out.' },
        { q: 'How do I print the 2027 calendar?', a: 'Pick the state, click Print in the result box or use your browser\'s print command. The page hides menus and buttons and lays the twelve months out in three columns. "Save as PDF" keeps a file to print later. Nothing is sent anywhere: the calendar is drawn in your browser.' },
      ],
      body: (h) => `<h2>Holidays marked on the calendar</h2>
<p>The calendar marks three kinds of date. In green, national holidays, Good Friday and the state holidays of the chosen state. Also in green, if you choose, the municipal holidays of the state capital. In grey, federal optional days off, which are not holidays but give federal staff the day off; they appear only once the Ministry of Management's ordinance for the year is out.</p>
${h.mini('ft', { p: ['uf'], c: "The state's 2027 holiday list" })}
<h2>2027 month by month</h2>
<p>January opens with New Year's Day on a Friday. February has Carnival on the 8th and 9th. March has Good Friday on the 26th and Easter on the 28th. April has Tiradentes Day on a Wednesday. May has Labour Day on a Saturday and Corpus Christi on the 27th. June, July and August have no national holiday; each place's state holidays show on the calendar. September, October and November have holidays on Tuesdays, the 7th, 12th and 2nd. November also has Proclamation of the Republic on a Monday and Black Consciousness Day on a Saturday. December has Christmas on a Saturday.</p>
<p>If you need to plan days off, go straight to the ${h.a('feriados-prolongados-2027', 'long-weekend planner')}. Each month's working days are on ${h.a('dias-uteis-2027', 'working days 2027')}.</p>`,
    },
  }),
];
