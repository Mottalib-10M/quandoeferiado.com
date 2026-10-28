import type { Locale } from './routes';
const pt = {
  updatedOn: 'Atualizado em', editorialPolicy: 'Política editorial', contactLabel: 'Contato', reviewedBy: 'Feito por',
  skipToContent: 'Ir para o conteúdo', mainNav: 'Navegação principal', breadcrumbLabel: 'Trilha de navegação', breadcrumbHome: 'Início', menuOpen: 'Abrir o menu',
  faqTitle: 'Perguntas frequentes', relatedCalculators: 'Continue com', sourcesTitle: 'Fontes oficiais desta página', writtenBy: 'Feito por',
  asOf: 'Situação em', lastUpdated: 'leis federais, estaduais e municipais conferidas em', footerValidated: 'Fontes: Lei 662/1949, Lei 6.802/1980, Lei 9.093/1995, Lei 14.759/2023, leis estaduais e municipais, portaria anual do Ministério da Gestão',
  footerBrowser: 'Tudo roda no seu navegador · nada do que você digita é enviado ou guardado · sem cadastro',
  footerDisclaimer: 'Site independente publicado pela Radif Partners, sem vínculo com governo federal, estado, prefeitura ou tribunal. Convenção coletiva e contrato de trabalho podem dar folgas além das previstas em lei; as datas são uma indicação baseada nas leis citadas e o site não substitui orientação jurídica.',
  footerPopular: 'Ferramentas',
  notFound: 'Não há página neste endereço. Na página inicial estão o próximo feriado do seu estado, os feriados de 2026 a 2028 e o planejador de feriados prolongados.',
  readMore: 'Ler mais',
  moreOptions: 'Mais opções', copyLink: 'Copiar link', copied: 'Link copiado', print: 'Imprimir', howComputed: 'Como é calculado', openFull: 'Abrir a ferramenta completa',
  countdownTo: 'Faltam para', days: 'dias', hours: 'h', minutes: 'min', seconds: 's', tzNote: 'Contagem pelo relógio do seu aparelho, fuso', passed: 'Esta data já passou.',
};
const en: typeof pt = {
  updatedOn: 'Updated on', editorialPolicy: 'Editorial policy', contactLabel: 'Contact', reviewedBy: 'Prepared by',
  skipToContent: 'Skip to content', mainNav: 'Main navigation', breadcrumbLabel: 'Breadcrumb', breadcrumbHome: 'Home', menuOpen: 'Open menu',
  faqTitle: 'Common questions', relatedCalculators: 'Keep going', sourcesTitle: 'Official sources for this page', writtenBy: 'Prepared by',
  asOf: 'As of', lastUpdated: 'federal, state and municipal laws checked on', footerValidated: 'Sources: Laws 662/1949, 6,802/1980, 9,093/1995 and 14,759/2023, state and municipal laws, the Ministry of Management yearly ordinance',
  footerBrowser: 'Everything runs in your browser · nothing you type is sent or stored · no account',
  footerDisclaimer: 'Independent site published by Radif Partners, not affiliated with the federal government, any state, city hall or court. Collective agreements and employment contracts may give days off beyond the law; this site does not replace legal advice.',
  footerPopular: 'Tools',
  notFound: 'Nothing lives at this address. The home page has the next public holiday in your state, the holidays for 2026 to 2028 and the long-weekend planner.',
  readMore: 'Read more',
  moreOptions: 'More options', copyLink: 'Copy share link', copied: 'Link copied', print: 'Print', howComputed: 'How this is calculated', openFull: 'Open the full tool',
  countdownTo: 'Time left until', days: 'days', hours: 'hrs', minutes: 'min', seconds: 'sec', tzNote: 'Uses your device clock, time zone', passed: 'This date has passed.',
};
const ALL = { pt, en };
export function t(lang: Locale) { return ALL[lang] ?? pt; }
