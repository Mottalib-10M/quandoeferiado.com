/** Datas: contagem regressiva, Carnaval, Páscoa, Corpus Christi, Dia das Mães, Dia dos Pais. Datas: motor. */
import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { dLong, dName, carnavalLocal, corpusLocal, diaDasMaes, diaDosPais } from '../../lib/tool-specs';

type L = 'pt' | 'en';
const d = (iso: string, l: L) => dLong(iso, l);
const w = (iso: string, l: L) => dName(iso, l);
const Y = 2027;
const lista = (x: string[], l: L) => (x.length > 1 ? `${x.slice(0, -1).join(', ')} ${l === 'pt' ? 'e' : 'and'} ${x[x.length - 1]}` : x[0] ?? '');
const capNome = (uf: string) => K.CAPITAL[uf as keyof typeof K.CAPITAL];
const ccEst = corpusLocal().filter((x) => x.esfera === 'estadual').map((x) => K.UF_NOME[x.uf]);
const ccCap = corpusLocal().filter((x) => x.esfera === 'municipal').map((x) => capNome(x.uf));
const cvLocal = carnavalLocal();
const anos = [2026, 2027, 2028, 2029, 2030];

export default [
  defineGuide({
    id: 'quantos-dias-faltam', group: 'datas', order: 30, tool: 'faltam', toolArg: { evento: 'natal' },
    related: ['home', 'carnaval-2027', 'pascoa-2027', 'dia-das-maes-2027', 'dias-uteis-2027'],
    sources: ['lei-662', 'lei-9093', 'decreto-21366'],
    pt: {
      slug: 'quantos-dias-faltam', nav: 'Quantos dias faltam', card: 'Contagem regressiva para o Natal, o Ano-Novo e o Carnaval',
      title: 'Quantos dias faltam para o Natal, Ano-Novo e Carnaval',
      description: 'Quantos dias faltam para o Natal, o Ano-Novo, o Carnaval, a Páscoa e o Dia das Mães: contagem regressiva ao vivo, dias úteis e os feriados no caminho.',
      h1: 'Quantos dias faltam? Contagem regressiva das datas do ano',
      intro: 'Escolha a data: o contador mostra os dias, as horas e as semanas que faltam, quantos dias úteis há até lá no seu estado e quais feriados ficam no caminho.',
      resume: `O Natal de 2026 cai numa ${w('2026-12-25', 'pt')}, e o de 2027 num sábado. O Ano-Novo de 2027 cai numa sexta-feira, o que dá um fim de semana de três dias logo na virada. O Carnaval de 2027 vem cedo: a terça-feira é ${d(K.carnavalTerca(Y), 'pt')}, e a Páscoa, ${d(K.pascoa(Y), 'pt')}. O Dia das Mães de 2027 é ${d(diaDasMaes(Y), 'pt')} e o Dia dos Pais, ${d(diaDosPais(Y), 'pt')}. O contador acima conta a partir da meia-noite do seu aparelho; no Brasil, que tem quatro fusos horários, a virada no Acre chega duas horas depois de Brasília. Além dos dias corridos, a ferramenta mostra quantos dias úteis faltam no estado escolhido, descontando os feriados nacionais e estaduais, o que serve para quem precisa entregar algo antes do recesso de fim de ano ou do Carnaval. Os feriados que aparecem no caminho são listados com a data e o dia da semana.`,
      faqs: [
        { q: 'Quantos dias faltam para o Natal?', a: 'O contador no alto desta página responde em tempo real, em dias, horas e semanas, a partir da data do seu aparelho. O Natal de 2026 cai numa sexta-feira, o que forma um fim de semana de três dias, e o de 2027 num sábado.' },
        { q: 'Como contar os dias úteis até uma data?', a: 'Escolha a data e o estado: a ferramenta conta os dias de segunda a sexta entre hoje e a data, sem contar hoje, e tira os feriados nacionais e estaduais que caem no meio. Feriados municipais e pontos facultativos não são descontados.' },
        { q: 'A contagem usa o horário de Brasília?', a: 'A primeira exibição usa a data do dia em que a página foi gerada; logo depois, o contador passa a usar o relógio do seu aparelho. Quem está no Acre, no Amazonas ou em Fernando de Noronha vê a virada da meia-noite no horário local.' },
      ],
      body: (h) => `<h2>As datas mais procuradas</h2>
<p>A tabela mostra as datas que a ferramenta conta, nos próximos anos. Carnaval, Páscoa e Corpus Christi mudam todo ano porque dependem da lua; Natal e Ano-Novo têm dia fixo, mas o dia da semana muda.</p>
${h.table([h.T('Data', 'Date'), ...anos.map(String)], [
  [h.T('Carnaval (terça)', 'Carnival (Tuesday)'), ...anos.map((y) => d(K.carnavalTerca(y), h.lang))],
  [h.T('Páscoa', 'Easter'), ...anos.map((y) => d(K.pascoa(y), h.lang))],
  [h.T('Dia das Mães', "Mother's Day"), ...anos.map((y) => d(diaDasMaes(y), h.lang))],
  [h.T('Dia dos Pais', "Father's Day"), ...anos.map((y) => d(diaDosPais(y), h.lang))],
  [h.T('Natal', 'Christmas'), ...anos.map((y) => `${w(`${y}-12-25`, h.lang)}`)],
], h.T('Datas e dias da semana, 2026 a 2030', 'Dates and weekdays, 2026 to 2030'))}
<h2>Dias corridos e dias úteis</h2>
<p>Dias corridos contam todos os dias do calendário, inclusive sábados, domingos e feriados. Dias úteis contam só de segunda a sexta, sem os feriados. Para quem organiza uma entrega antes do Natal, a diferença é grande: em dezembro, entre o dia 1º e o dia 24, há cerca de três semanas e meia de calendário mas só uns dezessete dias úteis. A ferramenta faz essa conta para o estado escolhido.</p>
<p>A contagem começa amanhã: se hoje é segunda e a data é sexta, faltam quatro dias. No próprio dia, o contador mostra "é hoje".</p>
${h.mini('du', { p: ['uf'], c: 'Dias úteis do ano no seu estado' })}
<h2>O fim de ano em 2026</h2>
<p>Em 2026, a véspera de Natal e a véspera de Ano-Novo caem em quintas-feiras e são ponto facultativo depois das 13 horas para os órgãos federais, pela portaria do Ministério da Gestão. O Natal e o 1º de janeiro de 2027 caem em sextas-feiras, o que dá dois fins de semana de três dias seguidos. Os feriados do mês estão em ${h.a('feriados de dezembro de 2026')}.</p>`,
    },
    en: {
      slug: 'days-until-christmas-brazil', nav: 'Days until', card: 'Countdown to Christmas, New Year and Carnival',
      title: 'Days until Christmas, New Year and Carnival in Brazil',
      description: 'Days until Christmas, New Year, Brazilian Carnival, Easter and Mother\'s Day: a live countdown with weeks, working days and the holidays on the way there.',
      h1: 'How many days until…? A countdown to the year\'s dates',
      intro: 'Pick a date: the counter shows the days, hours and weeks left, how many working days there are until then in your state and which holidays fall on the way.',
      resume: `Christmas 2026 falls on a ${w('2026-12-25', 'en')} and Christmas 2027 on a Saturday. New Year's Day 2027 is a Friday, giving a three-day weekend right at the turn of the year. Carnival 2027 comes early: Carnival Tuesday is ${d(K.carnavalTerca(Y), 'en')} and Easter ${d(K.pascoa(Y), 'en')}. Brazilian Mother's Day 2027 is ${d(diaDasMaes(Y), 'en')} and Father's Day ${d(diaDosPais(Y), 'en')}. The counter above runs from midnight on your device; Brazil has four time zones, so midnight in Acre comes two hours after Brasília. Besides calendar days, the tool shows how many working days are left in the chosen state, minus national and state holidays, which helps anyone with a deadline before the year-end break or Carnival. Holidays on the way are listed with their date and weekday.`,
      faqs: [
        { q: 'How many days until Christmas in Brazil?', a: 'The counter at the top of this page answers live, in days, hours and weeks, from your device\'s date. Christmas 2026 falls on a Friday, making a three-day weekend, and Christmas 2027 on a Saturday. Christmas Eve, 24 December, is not a holiday; in 2026 it is an optional day off from 1 pm for federal bodies.' },
        { q: 'How do I count working days until a date?', a: 'Pick the date and the state: the tool counts Mondays to Fridays between today and that date, not counting today, and removes national and state holidays in between. Municipal holidays and optional days off are not removed. If the deadline counts Saturdays, use the working-days calculator, which lets you include them.' },
        { q: 'Does the countdown use Brasília time?', a: 'The first display uses the date the page was built; right after, the counter switches to your device\'s clock. Someone in Acre, Amazonas or Fernando de Noronha sees midnight in local time. Brasília time is UTC−3 all year, since Brazil ended daylight saving time in 2019.' },
      ],
      body: (h) => `<h2>The most searched dates</h2>
<p>The table shows the dates the tool counts down to, over the next few years. Carnival, Easter and Corpus Christi change every year because they follow the moon; Christmas and New Year have a fixed day but the weekday changes.</p>
${h.table([h.T('Data', 'Date'), ...anos.map(String)], [
  [h.T('Carnaval (terça)', 'Carnival (Tuesday)'), ...anos.map((y) => d(K.carnavalTerca(y), h.lang))],
  [h.T('Páscoa', 'Easter'), ...anos.map((y) => d(K.pascoa(y), h.lang))],
  [h.T('Dia das Mães', "Mother's Day"), ...anos.map((y) => d(diaDasMaes(y), h.lang))],
  [h.T('Dia dos Pais', "Father's Day"), ...anos.map((y) => d(diaDosPais(y), h.lang))],
  [h.T('Natal', 'Christmas'), ...anos.map((y) => `${w(`${y}-12-25`, h.lang)}`)],
], h.T('Datas e dias da semana, 2026 a 2030', 'Dates and weekdays, 2026 to 2030'))}
<h2>Calendar days and working days</h2>
<p>Calendar days count every day, weekends and holidays included. Working days count Monday to Friday only, minus holidays. For anyone planning a delivery before Christmas the gap is large: between 1 and 24 December there are about three and a half weeks of calendar but only some seventeen working days. The tool does that sum for the chosen state.</p>
<p>The count starts tomorrow: if today is Monday and the date is Friday, four days are left. On the day itself, the counter says "today".</p>
${h.mini('du', { p: ['uf'], c: "Your state's working days this year" })}
<h2>The end of 2026</h2>
<p>In 2026, Christmas Eve and New Year's Eve fall on Thursdays and are optional days off from 1 pm for federal bodies, under the Ministry of Management's ordinance. Christmas Day and 1 January 2027 fall on Fridays, giving two three-day weekends in a row. The month's holidays are on ${h.a('December 2026 holidays')}.</p>`,
    },
  }),
  defineGuide({
    id: 'carnaval-2027', group: 'datas', order: 31, tool: 'cv', toolArg: { ano: Y },
    countdown: { date: K.carnavalTerca(Y), label: { pt: 'terça-feira de Carnaval de 2027', en: 'Carnival Tuesday 2027' } },
    related: ['pascoa-2027', 'quantos-dias-faltam', 'pontos-facultativos', 'feriados-rio-de-janeiro', 'feriados-2027'],
    sources: ['lei-662', 'portaria-mgi-2026', ...cvLocal.map((x) => x.fonte)],
    pt: {
      slug: 'carnaval-2027', nav: 'Carnaval 2027', card: 'Quando é o Carnaval de 2027 e onde ele é feriado',
      title: 'Carnaval 2027: datas, se é feriado e onde há folga',
      description: "Carnaval 2027 cai de 6 a 9 de fevereiro, com a terça no dia 9 e Cinzas no dia 10. Veja onde é feriado, o ponto facultativo federal e as datas até 2040.",
      h1: 'Carnaval 2027: quando é e onde é feriado',
      intro: 'Escolha o ano: a ferramenta mostra o sábado, a segunda, a terça e a Quarta-feira de Cinzas, como a data sai da Páscoa e onde uma lei faz do Carnaval feriado.',
      resume: `O Carnaval de 2027 vai do sábado 6 à terça-feira ${d(K.carnavalTerca(Y), 'pt')}, e a Quarta-feira de Cinzas é ${d(K.cinzas(Y), 'pt')}. É um dos Carnavais mais cedo da década, porque a Páscoa de 2027 cai em ${d(K.pascoa(Y), 'pt')}: a terça de Carnaval fica sempre 47 dias antes do domingo de Páscoa. Carnaval não é feriado nacional. Nenhuma lei federal o inclui: para os órgãos federais, a segunda, a terça e a manhã de Cinzas costumam ser ponto facultativo, declarado na portaria anual do Ministério da Gestão. Para quem trabalha no setor privado, vale o que diz o contrato, a convenção coletiva ou o costume da empresa. Onde uma lei local faz do Carnaval feriado, ele vale de fato: ${lista(cvLocal.map((x) => (x.esfera === 'estadual' ? `no estado do ${K.UF_NOME[x.uf]}` : `na cidade de ${capNome(x.uf)}`)), 'pt')}, entre as leis que conferimos. Muitas outras cidades decretam ponto facultativo ou feriado ano a ano.`,
      faqs: [
        { q: 'Quem tem folga no Carnaval de 2027?', a: 'Os servidores federais, se a portaria de 2027 repetir a de 2026, que deu ponto facultativo na segunda, na terça e na Quarta-feira de Cinzas até as 14 horas. No estado do Rio de Janeiro e em Manaus, a terça é feriado por lei. No setor privado, a folga depende de acordo ou convenção coletiva.' },
        { q: 'Qual é o Carnaval mais cedo e o mais tarde dos próximos anos?', a: `Entre 2026 e 2030, o mais cedo é o de 2027, com a terça em ${d(K.carnavalTerca(2027), 'pt')}, e o mais tarde o de 2030, com a terça em ${d(K.carnavalTerca(2030), 'pt')}. Em 2028 a terça cai em 29 de fevereiro, um dia que só existe em ano bissexto.` },
        { q: 'Onde a terça de Carnaval é feriado por lei?', a: `Entre as leis que conferimos: no estado do Rio de Janeiro, pela Lei estadual 5.243/2008, e em Manaus, por lei municipal. Muitas prefeituras declaram feriado ou ponto facultativo por decreto a cada ano; veja o decreto da sua cidade. Para os órgãos federais, a segunda e a terça de Carnaval são ponto facultativo pela portaria do Ministério da Gestão.` },
      ],
      body: (h) => `<h2>Datas do Carnaval nos próximos anos</h2>
${h.table([h.T('Ano', 'Year'), h.T('Sábado', 'Saturday'), h.T('Terça-feira', 'Tuesday'), h.T('Quarta de Cinzas', 'Ash Wednesday'), h.T('Páscoa', 'Easter')], anos.map((y) => [String(y), d(K.addDays(K.carnavalTerca(y), -3), h.lang), d(K.carnavalTerca(y), h.lang), d(K.cinzas(y), h.lang), d(K.pascoa(y), h.lang)]), h.T('Carnaval de 2026 a 2030', 'Carnival 2026 to 2030'))}
<h2>Por que a data muda</h2>
<p>O Carnaval é a festa antes da Quaresma, os quarenta dias de preparação para a Páscoa. A Quarta-feira de Cinzas abre a Quaresma e fica 46 dias antes do domingo de Páscoa, porque os domingos não contam como dias de jejum. A Páscoa é o primeiro domingo depois da primeira lua cheia da primavera no hemisfério norte, e por isso anda entre 22 de março e 25 de abril. O Carnaval acompanha: pode cair entre 3 de fevereiro e 9 de março. A conta completa, passo a passo, está em ${h.a('pascoa-2027', 'Páscoa 2027')}.</p>
<h2>Folga no Carnaval: o que vale</h2>
<p>Quem trabalha no serviço público federal segue a portaria do Ministério da Gestão, publicada em geral em dezembro ou janeiro. A de 2026 deu ponto facultativo na segunda e na terça e na manhã da Quarta-feira de Cinzas; a de 2027 ainda não foi publicada. Estados e prefeituras publicam os seus decretos. No setor privado, a empresa pode exigir trabalho nesses dias se não houver lei local de feriado, acordo ou convenção que garanta a folga.</p>
${h.mini('pf', { c: 'Pontos facultativos federais do ano' })}
<p>Se a empresa dá folga no Carnaval, o ${h.a('feriados-prolongados-2027', 'planejador de feriados prolongados')} considera esses dias: marque a opção em "Mais opções".</p>`,
    },
    en: {
      slug: 'carnival-2027-brazil', nav: 'Carnival 2027', card: 'When Carnival 2027 is and where it is a holiday',
      title: 'Carnival 2027 in Brazil: dates, holiday status, days off',
      description: 'Brazilian Carnival 2027 runs 6 to 9 February, Ash Wednesday on the 10th. See where it is a holiday, the federal optional day off and the dates up to 2040.',
      h1: 'Brazil Carnival 2027: when it is and where it is a holiday',
      intro: 'Pick a year: the tool shows Saturday, Monday, Tuesday and Ash Wednesday, how the date follows from Easter and where a law makes Carnival a holiday.',
      resume: `Carnival 2027 runs from Saturday 6 to Tuesday ${d(K.carnavalTerca(Y), 'en')}, and Ash Wednesday is ${d(K.cinzas(Y), 'en')}. It is one of the decade's earliest Carnivals because Easter 2027 falls on ${d(K.pascoa(Y), 'en')}: Carnival Tuesday is always 47 days before Easter Sunday. Carnival is not a national holiday. No federal law lists it: for federal bodies, Monday, Tuesday and Ash Wednesday morning are usually optional days off, declared in the Ministry of Management's yearly ordinance. In the private sector, what counts is your contract, collective agreement or company custom. Where a local law makes Carnival a holiday, it is a real one: ${lista(cvLocal.map((x) => (x.esfera === 'estadual' ? `in the state of ${K.UF_NOME[x.uf]}` : `in the city of ${capNome(x.uf)}`)), 'en')}, among the laws we checked. Many other cities declare an optional day off or a holiday by yearly decree.`,
      faqs: [
        { q: 'Who gets time off for Carnival 2027?', a: 'Federal civil servants, if the 2027 ordinance repeats the 2026 one, which gave Monday, Tuesday and Ash Wednesday until 2 pm as optional days off. In the state of Rio de Janeiro and in Manaus, Tuesday is a holiday by law. In the private sector, time off depends on an agreement or collective agreement.' },
        { q: 'When is Carnival 2028?', a: `In 2028 Carnival Tuesday is ${d(K.carnavalTerca(2028), 'en')}, a day that only exists in leap years, and Ash Wednesday is ${d(K.cinzas(2028), 'en')}. Easter 2028 falls on ${d(K.pascoa(2028), 'en')}. As every year, Carnival Tuesday comes 47 days before Easter Sunday, and federal law does not make it a national holiday.` },
        { q: 'Where is Carnival Tuesday a holiday by law?', a: 'Among the laws we checked: in the state of Rio de Janeiro, under State Law 5,243/2008, and in Manaus, by municipal law. Many city halls declare a holiday or optional day off by decree every year; check your city\'s decree.' },
      ],
      body: (h) => `<h2>Carnival dates in the coming years</h2>
${h.table([h.T('Ano', 'Year'), h.T('Sábado', 'Saturday'), h.T('Terça-feira', 'Tuesday'), h.T('Quarta de Cinzas', 'Ash Wednesday'), h.T('Páscoa', 'Easter')], anos.map((y) => [String(y), d(K.addDays(K.carnavalTerca(y), -3), h.lang), d(K.carnavalTerca(y), h.lang), d(K.cinzas(y), h.lang), d(K.pascoa(y), h.lang)]), h.T('Carnaval de 2026 a 2030', 'Carnival 2026 to 2030'))}
<h2>Why the date moves</h2>
<p>Carnival is the feast before Lent, the forty days of preparation for Easter. Ash Wednesday opens Lent and falls 46 days before Easter Sunday, because Sundays do not count as fasting days. Easter is the first Sunday after the first full moon of the northern spring, so it moves between 22 March and 25 April. Carnival follows: it can fall between 3 February and 9 March. The full calculation, step by step, is on ${h.a('pascoa-2027', 'Easter 2027')}.</p>
<h2>Time off at Carnival: what applies</h2>
<p>Federal civil servants follow the Ministry of Management's ordinance, usually published in December or January. The 2026 one gave Monday, Tuesday and Ash Wednesday morning off; the 2027 one has not been published yet. States and city halls publish their own decrees. In the private sector, an employer may require work on those days unless a local holiday law, an agreement or a collective agreement guarantees the time off.</p>
${h.mini('pf', { c: 'Federal optional days off this year' })}
<p>If your employer gives Carnival off, the ${h.a('feriados-prolongados-2027', 'long-weekend planner')} can take those days into account: tick the option under "More options".</p>`,
    },
  }),
  defineGuide({
    id: 'pascoa-2027', group: 'datas', order: 32, tool: 'pc', toolArg: { ano: Y },
    related: ['carnaval-2027', 'corpus-christi-2027', 'feriados-2027', 'quantos-dias-faltam'],
    sources: ['lei-9093', 'lei-662'],
    pt: {
      slug: 'pascoa-2027', nav: 'Páscoa 2027', card: 'Data da Páscoa de 2027 e de qualquer ano, com a conta',
      title: 'Páscoa 2027: data, Sexta-feira Santa e o cálculo da data',
      description: 'Páscoa 2027 é em 28 de março e a Sexta-feira Santa em 26 de março. Calcule a Páscoa de 2000 a 2060 com a fórmula de Gauss, passo a passo, e as datas móveis.',
      h1: 'Páscoa 2027: a data e como ela é calculada',
      intro: 'Escolha o ano: a ferramenta dá o domingo de Páscoa, a Sexta-feira da Paixão, o Carnaval e Corpus Christi, e mostra cada passo da fórmula de Gauss.',
      resume: `A Páscoa de 2027 é em ${d(K.pascoa(Y), 'pt')}, e a Sexta-feira da Paixão, ou Sexta-feira Santa, em ${d(K.paixao(Y), 'pt')}. É uma Páscoa adiantada: em 2026 ela foi em ${d(K.pascoa(2026), 'pt')} e em 2028 será em ${d(K.pascoa(2028), 'pt')}. A Sexta-feira da Paixão é feriado religioso: a Lei 9.093/1995 permite aos municípios declarar até quatro feriados religiosos, e ela é a única data móvel que a lei cita pelo nome. Na prática, é feriado em todo o país. O domingo de Páscoa já é domingo e não muda nada para quem não trabalha no fim de semana. A data puxa as outras datas móveis: o Carnaval vem 47 dias antes, a Quarta-feira de Cinzas 46 dias antes e Corpus Christi 60 dias depois. Para 2027, isso dá Carnaval em ${d(K.carnavalTerca(Y), 'pt')} e Corpus Christi em ${d(K.corpusChristi(Y), 'pt')}. A ferramenta faz a conta para qualquer ano entre 2000 e 2060.`,
      faqs: [
        { q: 'Sexta-feira Santa é feriado?', a: 'Sim. A Lei 9.093/1995 diz que são feriados religiosos os dias de guarda declarados em lei municipal, até quatro, incluída a Sexta-feira da Paixão. Ela é observada no país inteiro e entra na contagem de feriados de todas as calculadoras do site.' },
        { q: 'Como se calcula a data da Páscoa?', a: 'A Páscoa é o primeiro domingo depois da lua cheia eclesiástica que cai em 21 de março ou logo depois. A fórmula de Gauss transforma essa regra em contas com restos de divisão; a ferramenta mostra cada passo para o ano escolhido.' },
        { q: 'Quais são a data mais cedo e a mais tarde da Páscoa?', a: 'A Páscoa pode cair de 22 de março a 25 de abril. No período de 2000 a 2060, a mais tarde é 25 de abril de 2038; a mais cedo é 23 de março de 2008. Em 2027 a Páscoa cai em 28 de março e em 2028 em 16 de abril; o Carnaval e o Corpus Christi andam junto, com o mesmo número de dias.' },
      ],
      body: (h) => `<h2>Páscoa e datas móveis, ano a ano</h2>
${h.table([h.T('Ano', 'Year'), h.T('Sexta-feira da Paixão', 'Good Friday'), h.T('Páscoa', 'Easter'), h.T('Corpus Christi', 'Corpus Christi')], anos.map((y) => [String(y), d(K.paixao(y), h.lang), d(K.pascoa(y), h.lang), d(K.corpusChristi(y), h.lang)]), h.T('Páscoa e datas ligadas, 2026 a 2030', 'Easter and linked dates, 2026 to 2030'))}
<h2>A regra da Páscoa</h2>
<p>Desde o Concílio de Niceia, a Páscoa cristã do Ocidente é o primeiro domingo depois da primeira lua cheia que cai em 21 de março ou depois. A lua usada não é a astronômica, mas uma lua de tabela, a lua eclesiástica, que segue um ciclo de 19 anos. Por isso a data pode diferir em alguns casos da que se veria olhando o céu.</p>
<p>A fórmula de Gauss faz a conta com números inteiros: o resto da divisão do ano por 19 dá a posição no ciclo lunar; os restos por 4 e por 7 acertam o dia da semana; dois termos corrigem os séculos. A ferramenta acima mostra os valores para o ano escolhido. Para conferir, o site recalcula todos os anos de 1600 a 2600 com um segundo método independente, de Meeus, e os dois dão a mesma data.</p>
${h.mini('cv', { c: 'Carnaval do ano' })}
<h2>A semana da Páscoa e o trabalho</h2>
<p>A Quinta-feira Santa não é feriado nem ponto facultativo federal. A Sexta-feira da Paixão é feriado, e o sábado de Aleluia é um sábado comum. Em 2027, a Páscoa no fim de março faz a Sexta-feira da Paixão formar um fim de semana de três dias, de 26 a 28 de março, sem gastar folga. Quem tira a quinta, o dia 25, ganha quatro.</p>`,
    },
    en: {
      slug: 'easter-2027-brazil', nav: 'Easter 2027', card: 'Easter 2027 and any year, with the calculation',
      title: 'Easter 2027 in Brazil: date, Good Friday and the method',
      description: 'Easter 2027 is on 28 March and Good Friday on 26 March. Work out Easter for any year from 2000 to 2060 with Gauss\'s formula, step by step, plus movable dates.',
      h1: 'Easter 2027: the date and how it is worked out',
      intro: 'Pick a year: the tool gives Easter Sunday, Good Friday, Carnival and Corpus Christi, and shows every step of Gauss\'s formula.',
      resume: `Easter 2027 is on ${d(K.pascoa(Y), 'en')}, and Good Friday on ${d(K.paixao(Y), 'en')}. It is an early Easter: in 2026 it was on ${d(K.pascoa(2026), 'en')} and in 2028 it will be on ${d(K.pascoa(2028), 'en')}. Good Friday is a religious holiday: Law 9,093/1995 lets municipalities declare up to four religious holidays, and it is the only movable date the law names. In practice it is a holiday across the country. Easter Sunday is already a Sunday and changes nothing for people who do not work weekends. The date drives the other movable dates: Carnival comes 47 days before, Ash Wednesday 46 days before and Corpus Christi 60 days after. For 2027, that gives Carnival on ${d(K.carnavalTerca(Y), 'en')} and Corpus Christi on ${d(K.corpusChristi(Y), 'en')}. The tool does the sum for any year between 2000 and 2060.`,
      faqs: [
        { q: 'Is Good Friday a public holiday in Brazil?', a: 'Yes. Law 9,093/1995 says religious holidays are the holy days declared by municipal law, up to four, Good Friday included. It is observed across the country and counts as a holiday in every calculator on this site. In 2027 it falls on 26 March and in 2028 on 14 April.' },
        { q: 'How is the date of Easter worked out?', a: 'Easter is the first Sunday after the ecclesiastical full moon falling on or after 21 March. Gauss\'s formula turns that rule into sums with division remainders; the tool shows each step for the chosen year. The site cross-checks every year against the Meeus algorithm.' },
        { q: 'What are the earliest and latest possible Easter dates?', a: 'Easter can fall from 22 March to 25 April. Between 2000 and 2060, the latest is 25 April 2038 and the earliest 23 March 2008. In 2027 Easter falls on 28 March and in 2028 on 16 April, and Carnival and Corpus Christi move by the same number of days.' },
      ],
      body: (h) => `<h2>Easter and movable dates, year by year</h2>
${h.table([h.T('Ano', 'Year'), h.T('Sexta-feira da Paixão', 'Good Friday'), h.T('Páscoa', 'Easter'), h.T('Corpus Christi', 'Corpus Christi')], anos.map((y) => [String(y), d(K.paixao(y), h.lang), d(K.pascoa(y), h.lang), d(K.corpusChristi(y), h.lang)]), h.T('Páscoa e datas ligadas, 2026 a 2030', 'Easter and linked dates, 2026 to 2030'))}
<h2>The Easter rule</h2>
<p>Since the Council of Nicaea, Western Christian Easter is the first Sunday after the first full moon falling on or after 21 March. The moon used is not the astronomical one but a table moon, the ecclesiastical moon, which follows a 19-year cycle. That is why the date can occasionally differ from what you would see in the sky.</p>
<p>Gauss's formula does the sum with whole numbers: the remainder of the year divided by 19 gives the position in the lunar cycle; the remainders by 4 and by 7 set the weekday; two terms correct for centuries. The tool above shows the values for the chosen year. As a check, the site recomputes every year from 1600 to 2600 with a second, independent method by Meeus, and both give the same date.</p>
${h.mini('cv', { c: "The year's Carnival" })}
<h2>Easter week and work</h2>
<p>Maundy Thursday is neither a holiday nor a federal optional day off. Good Friday is a holiday, and Holy Saturday is an ordinary Saturday. In 2027, Easter at the end of March makes Good Friday a three-day weekend, 26 to 28 March, without using any leave. Taking Thursday the 25th off gives four.</p>`,
    },
  }),
  defineGuide({
    id: 'corpus-christi-2027', group: 'datas', order: 33, tool: 'cc', toolArg: { ano: Y },
    related: ['pascoa-2027', 'feriados-prolongados-2027', 'pontos-facultativos', 'feriados-distrito-federal', 'feriados-rio-de-janeiro'],
    sources: ['lei-662', 'lei-9093', 'portaria-mgi-2026', ...corpusLocal().map((x) => x.fonte)],
    pt: {
      slug: 'corpus-christi-2027', nav: 'Corpus Christi 2027', card: 'Corpus Christi 2027: data e onde é feriado de verdade',
      title: 'Corpus Christi 2027: data, se é feriado e onde há folga',
      description: 'Corpus Christi 2027 cai na quinta-feira 27 de maio. Veja onde é feriado por lei estadual ou municipal, onde é ponto facultativo e a emenda da sexta 28.',
      h1: 'Corpus Christi 2027: feriado ou ponto facultativo?',
      intro: 'Escolha o ano: a ferramenta dá a data de Corpus Christi, a emenda de sexta-feira e a lista dos lugares onde uma lei faz dele feriado.',
      resume: `Corpus Christi de 2027 cai numa quinta-feira, ${d(K.corpusChristi(Y), 'pt')}, sessenta dias depois da Páscoa. Não é feriado nacional: nenhuma lei federal o inclui, e para os órgãos federais ele costuma ser ponto facultativo. Vira feriado onde uma lei estadual ou municipal assim determina. Entre as leis que conferimos, é feriado estadual ${lista(ccEst, 'pt')}, onde vale em todo o território, e feriado municipal em ${ccCap.length} capitais: ${lista(ccCap, 'pt')}. No Rio de Janeiro, o feriado estadual é novo, criado pela Lei 11.002 de outubro de 2025. Onde Corpus Christi é feriado, a sexta-feira 28 de maio de 2027 vira uma emenda de um dia, que rende quatro dias livres seguidos. Em 2026 ele caiu em ${d(K.corpusChristi(2026), 'pt')} e em 2028 cai em ${d(K.corpusChristi(2028), 'pt')}, sempre numa quinta-feira.`,
      faqs: [
        { q: 'Corpus Christi é feriado nacional?', a: 'Não. A lei federal não lista Corpus Christi entre os feriados nacionais. Ele é ponto facultativo para os órgãos federais e feriado onde lei estadual ou municipal o declara, como no Distrito Federal, no estado do Rio de Janeiro e em várias capitais.' },
        { q: 'Corpus Christi é sempre numa quinta-feira?', a: 'Sim. Ele fica sessenta dias depois do domingo de Páscoa, o que sempre dá uma quinta-feira. Por isso cria todo ano uma possível emenda na sexta-feira seguinte. Em 2027 cai em 27 de maio e em 2028 em 15 de junho. Não é feriado nacional: é ponto facultativo federal, e feriado onde uma lei estadual ou municipal o prevê.' },
        { q: 'Corpus Christi é feriado em São Paulo?', a: 'Na cidade de São Paulo, sim: a lei municipal 14.485/2007 o inclui entre os feriados. No estado de São Paulo, não há lei estadual; em outras cidades paulistas, depende da lei de cada município. Em 2027 cai na quinta-feira 27 de maio, e a sexta 28 pode virar emenda.' },
      ],
      body: (h) => `<h2>Onde Corpus Christi é feriado</h2>
${h.table([h.T('Lugar', 'Place'), h.T('Tipo', 'Type'), h.T('Fonte', 'Source')], corpusLocal().map((x) => [x.esfera === 'estadual' ? K.UF_NOME[x.uf] : `${capNome(x.uf)} (${x.uf})`, x.esfera === 'estadual' ? h.T('feriado estadual', 'state holiday') : h.T('feriado municipal', 'municipal holiday'), h.src(x.fonte)]), h.T('Leis conferidas que fazem de Corpus Christi feriado', 'Checked laws making Corpus Christi a holiday'))}
<p>A lista cobre as leis estaduais e as das capitais que lemos. Muitas outras cidades também têm Corpus Christi como feriado municipal, com base na Lei 9.093/1995, que deixa cada município escolher até quatro feriados religiosos. Para uma cidade do interior, veja a lei ou o decreto da prefeitura.</p>
<h2>A emenda de Corpus Christi</h2>
<p>Como cai sempre numa quinta, Corpus Christi é a emenda mais conhecida do ano. Em 2026, a portaria federal deu ponto facultativo também na sexta-feira seguinte, 5 de junho. Para 2027, a portaria ainda não saiu. No setor privado, a sexta só é folga por acordo.</p>
${h.mini('em', { p: ['uf'], c: 'Planejar as folgas do ano' })}
<h2>De onde vem a data</h2>
<p>Corpus Christi é a festa católica da Eucaristia, celebrada na quinta-feira depois do domingo da Santíssima Trindade, ou seja, sessenta dias depois da Páscoa. Em muitas cidades brasileiras, as ruas são enfeitadas com tapetes de serragem e flores para a procissão. A data muda todo ano junto com a Páscoa: veja ${h.a('pascoa-2027', 'Páscoa 2027')}.</p>`,
    },
    en: {
      slug: 'corpus-christi-2027-brazil', nav: 'Corpus Christi 2027', card: 'Corpus Christi 2027: date and where it is really a holiday',
      title: 'Corpus Christi 2027 in Brazil: date and where it is off',
      description: 'Corpus Christi 2027 falls on Thursday 27 May. See where it is a holiday under state or municipal law, where it is an optional day off, and the Friday bridge.',
      h1: 'Corpus Christi 2027: holiday or optional day off?',
      intro: 'Pick a year: the tool gives the date of Corpus Christi, the Friday bridge and the list of places where a law makes it a holiday.',
      resume: `Corpus Christi 2027 falls on a Thursday, ${d(K.corpusChristi(Y), 'en')}, sixty days after Easter. It is not a national holiday: no federal law lists it, and for federal bodies it is usually an optional day off. It becomes a holiday where a state or municipal law says so. Among the laws we checked, it is a state holiday in ${lista(ccEst, 'en')}, applying across the whole territory, and a municipal holiday in ${ccCap.length} state capitals: ${lista(ccCap, 'en')}. In Rio de Janeiro the state holiday is new, created by Law 11,002 of October 2025. Where Corpus Christi is a holiday, Friday 28 May 2027 becomes a one-day bridge giving four free days in a row. In 2026 it fell on ${d(K.corpusChristi(2026), 'en')} and in 2028 it falls on ${d(K.corpusChristi(2028), 'en')}, always a Thursday.`,
      faqs: [
        { q: 'Is Corpus Christi a national holiday in Brazil?', a: 'No. Federal law does not list Corpus Christi among national holidays. It is an optional day off for federal bodies and a holiday where state or municipal law declares it, as in the Federal District, the state of Rio de Janeiro and several capitals.' },
        { q: 'Is Corpus Christi always on a Thursday?', a: 'Yes. It falls sixty days after Easter Sunday, which is always a Thursday. That is why it creates a possible bridge on the following Friday every year. In 2027 it falls on 27 May and in 2028 on 15 June. It is not a national holiday: it is a federal optional day off, and a holiday where a state or municipal law makes it one.' },
        { q: 'Is Corpus Christi a holiday in São Paulo?', a: 'In the city of São Paulo, yes: municipal law 14,485/2007 lists it among the holidays. The state of São Paulo has no state law on it; in other towns in the state, it depends on each municipality\'s law. In 2027 it falls on Thursday 27 May, so Friday the 28th can become a bridge.' },
      ],
      body: (h) => `<h2>Where Corpus Christi is a holiday</h2>
${h.table([h.T('Lugar', 'Place'), h.T('Tipo', 'Type'), h.T('Fonte', 'Source')], corpusLocal().map((x) => [x.esfera === 'estadual' ? K.UF_NOME[x.uf] : `${capNome(x.uf)} (${x.uf})`, x.esfera === 'estadual' ? h.T('feriado estadual', 'state holiday') : h.T('feriado municipal', 'municipal holiday'), h.src(x.fonte)]), h.T('Leis conferidas que fazem de Corpus Christi feriado', 'Checked laws making Corpus Christi a holiday'))}
<p>The list covers the state laws and those of the capitals we read. Many other cities also keep Corpus Christi as a municipal holiday under Law 9,093/1995, which lets each municipality choose up to four religious holidays. For a town in the interior, check the city hall's law or decree.</p>
<h2>The Corpus Christi bridge</h2>
<p>Since it always falls on a Thursday, Corpus Christi is the best-known bridge of the year. In 2026, the federal ordinance also gave the following Friday, 5 June, as an optional day off. The 2027 ordinance is not out yet. In the private sector, Friday is off only by agreement.</p>
${h.mini('em', { p: ['uf'], c: "Plan the year's days off" })}
<h2>Where the date comes from</h2>
<p>Corpus Christi is the Catholic feast of the Eucharist, held on the Thursday after Trinity Sunday, that is sixty days after Easter. In many Brazilian towns the streets are decorated with carpets of sawdust and flowers for the procession. The date moves every year with Easter: see ${h.a('pascoa-2027', 'Easter 2027')}.</p>`,
    },
  }),
  defineGuide({
    id: 'dia-das-maes-2027', group: 'datas', order: 34, tool: 'dc', toolArg: { ano: Y, qual: 'maes' },
    countdown: { date: diaDasMaes(Y), label: { pt: 'Dia das Mães de 2027', en: "Mother's Day 2027" } },
    related: ['quantos-dias-faltam', 'feriados-2027'],
    sources: ['decreto-21366'],
    pt: {
      slug: 'dia-das-maes-2027', nav: 'Dia das Mães 2027', card: 'Quando é o Dia das Mães de 2027 e dos próximos anos',
      title: 'Dia das Mães 2027: data, por que é em maio e se é feriado',
      description: 'O Dia das Mães de 2027 é no domingo 9 de maio, segundo domingo do mês, como manda um decreto de 1932. Veja a data de cada ano até 2040 e quantos dias faltam.',
      h1: 'Dia das Mães 2027: domingo, 9 de maio',
      intro: 'Escolha o ano: a ferramenta dá a data do Dia das Mães e das outras datas comemorativas do ano, com a contagem regressiva.',
      resume: `O Dia das Mães de 2027 é ${d(diaDasMaes(Y), 'pt')}, segundo domingo de maio. A data vem do Decreto 21.366, de 5 de maio de 1932, assinado por Getúlio Vargas: "o segundo domingo de maio é consagrado às mães". O decreto não cria feriado: como cai sempre num domingo, a data não muda o expediente de quem trabalha de segunda a sexta. Para o comércio, é uma das datas de maior movimento do ano, e lojas de shopping costumam abrir no domingo. Em 2026 o Dia das Mães foi em ${d(diaDasMaes(2026), 'pt')} e em 2028 será em ${d(diaDasMaes(2028), 'pt')}. O segundo domingo de maio cai sempre entre os dias 8 e 14. Em Portugal, a data é outra, o primeiro domingo de maio; em vários países de língua inglesa, o segundo domingo de maio, como aqui.`,
      faqs: [
        { q: 'Dia das Mães é feriado?', a: 'Não. O Decreto 21.366/1932 só consagra o segundo domingo de maio às mães. Como cai sempre num domingo, não há folga extra, nem no setor público nem no privado. Em 2027 é em 9 de maio e, em 2028, em 14 de maio.' },
        { q: 'Por que o Dia das Mães muda de data?', a: 'Porque é o segundo domingo de maio, não um dia fixo. Ele cai sempre entre 8 e 14 de maio; em 2027, no dia 9. A regra vem do Decreto 21.366/1932, que consagra às mães o segundo domingo de maio.' },
        { q: 'Quando é o Dia das Mães de 2028?', a: `Em ${d(diaDasMaes(2028), 'pt')}. A tabela da ferramenta mostra a data de cada ano até 2040. O Dia das Mães cai sempre no segundo domingo de maio, pelo Decreto 21.366/1932, e por isso nunca gera folga extra. O Dia dos Pais segue a mesma lógica no segundo domingo de agosto, por costume, sem decreto.` },
      ],
      body: (h) => `<h2>Dia das Mães ano a ano</h2>
${h.table([h.T('Ano', 'Year'), h.T('Dia das Mães', "Mother's Day")], anos.map((y) => [String(y), d(diaDasMaes(y), h.lang)]), h.T('Segundo domingo de maio, 2026 a 2030', 'Second Sunday of May, 2026 to 2030'), ['l', 'l'])}
<h2>A origem da data no Brasil</h2>
<p>A data foi oficializada por Getúlio Vargas em 1932, com o ${h.src('decreto-21366')}. O artigo 1º consagra o segundo domingo de maio às mães, "em comemoração aos sentimentos e virtudes que o amor materno concorre para despertar". É uma data comemorativa, não um feriado: o decreto não fala em folga nem em suspensão do trabalho.</p>
<h2>Trabalho e comércio no Dia das Mães</h2>
<p>Como cai num domingo, valem as regras do domingo: quem trabalha nesse dia, como no comércio de shopping, tem direito ao descanso semanal em outro dia, conforme a escala e a convenção coletiva. Não há pagamento em dobro por ser Dia das Mães, porque não é feriado.</p>
${h.mini('dc', { c: 'Outras datas comemorativas' })}
<p>Para saber quantos dias faltam, use o contador no alto da página ou ${h.a('quantos-dias-faltam', 'quantos dias faltam')}, que também conta os dias úteis até lá.</p>`,
    },
    en: {
      slug: 'mothers-day-2027-brazil', nav: "Mother's Day 2027", card: "When Brazilian Mother's Day 2027 is, and in coming years",
      title: "Mother's Day 2027 in Brazil: date, origin, holiday status",
      description: "Brazilian Mother's Day 2027 is Sunday 9 May, the second Sunday of the month, as set by a 1932 decree. See every year's date up to 2040 and the days left.",
      h1: "Mother's Day 2027 in Brazil: Sunday 9 May",
      intro: "Pick a year: the tool gives the date of Mother's Day and the year's other observances, with a countdown.",
      resume: `Brazilian Mother's Day 2027 is ${d(diaDasMaes(Y), 'en')}, the second Sunday of May. The date comes from Decree 21,366 of 5 May 1932, signed by Getúlio Vargas: "the second Sunday of May is dedicated to mothers". The decree does not create a holiday: since it always falls on a Sunday, it does not change working hours for people who work Monday to Friday. For retailers it is one of the busiest dates of the year, and shopping-centre shops usually open that Sunday. In 2026 Mother's Day was on ${d(diaDasMaes(2026), 'en')} and in 2028 it will be on ${d(diaDasMaes(2028), 'en')}. The second Sunday of May always falls between the 8th and the 14th. In Portugal the date differs, the first Sunday of May; in many English-speaking countries it is the second Sunday of May, as in Brazil.`,
      faqs: [
        { q: "Is Mother's Day a public holiday in Brazil?", a: 'No. Decree 21,366/1932 only dedicates the second Sunday of May to mothers. As it always falls on a Sunday, there is no extra day off, in the public or the private sector. In 2027 it is on 9 May and in 2028 on 14 May.' },
        { q: "Why does Mother's Day change date?", a: 'Because it is the second Sunday of May, not a fixed day. It always falls between 8 and 14 May; in 2027, on the 9th. The rule comes from Decree 21,366/1932, which dedicates the second Sunday of May to mothers.' },
        { q: "When is Brazilian Mother's Day 2028?", a: `On ${d(diaDasMaes(2028), 'en')}. The tool's table shows the date for every year up to 2040. Mother's Day is always the second Sunday of May under Decree 21,366/1932, so it never gives an extra day off. Father's Day follows the same pattern on the second Sunday of August, by custom rather than by decree.` },
      ],
      body: (h) => `<h2>Mother's Day year by year</h2>
${h.table([h.T('Ano', 'Year'), h.T('Dia das Mães', "Mother's Day")], anos.map((y) => [String(y), d(diaDasMaes(y), h.lang)]), h.T('Segundo domingo de maio, 2026 a 2030', 'Second Sunday of May, 2026 to 2030'), ['l', 'l'])}
<h2>Where the date comes from in Brazil</h2>
<p>Getúlio Vargas made the date official in 1932 with ${h.src('decreto-21366')}. Article 1 dedicates the second Sunday of May to mothers, "in celebration of the feelings and virtues that a mother's love helps to awaken". It is an observance, not a holiday: the decree says nothing about time off or stopping work.</p>
<h2>Work and shops on Mother's Day</h2>
<p>Since it falls on a Sunday, Sunday rules apply: anyone working that day, as in shopping-centre retail, is entitled to weekly rest on another day, under their rota and collective agreement. There is no double pay for Mother's Day, because it is not a holiday.</p>
${h.mini('dc', { c: 'Other observances' })}
<p>To see how many days are left, use the counter at the top of the page or ${h.a('quantos-dias-faltam', 'days until')}, which also counts the working days until then.</p>`,
    },
  }),
];
