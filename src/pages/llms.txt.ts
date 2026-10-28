/** llms.txt (RECETTE §21), généré à partir du registre des pages. */
import { GUIDES } from '../lib/pages';
import { SITE_URL, LAST_UPDATED, SITE_NAMES } from '../data/site-config';
import { route } from '../i18n/routes';
import { GROUPS } from '../i18n/nav';
import { KIT as K } from '../lib/kit';
export function GET() {
  const sp = K.otimiza(2027, { uf: 'SP' }, 10);
  const nEst = K.UFS.reduce((a, u) => a + K.ESTADUAIS(u).length, 0);
  const caps = K.UFS_COM_CAPITAL();
  const lines = [
    `# ${SITE_NAMES.pt}`, '',
    `> Brazilian public holidays (feriados) 2026 to 2028, in Brazilian Portuguese and English: the 9 national holidays (Law 662/1949 as amended, Law 6,802/1980, Law 14,759/2023 since 2024) plus Good Friday (Law 9,093/1995), ${nEst} state holidays across the 27 federative units, each tied to the state law or official calendar read on ${K.LIDO_EM}, and municipal holidays of ${caps.length} state capitals whose municipal law was verified (${caps.map((u) => K.CAPITAL[u]).join(', ')}); other capitals are not published. Federal optional days off (pontos facultativos) from the Ministry of Management ordinance: 2026 published (Portaria MGI 11,460/2025); 2027 not yet published as of ${K.PORTARIA(2027)?.verificado_em}. Easter by Gauss's formula, cross-checked against the Meeus/Jones/Butcher algorithm; Carnival Tuesday = Easter − 47 days (${K.carnavalTerca(2027)} in 2027), Corpus Christi = Easter + 60 (${K.corpusChristi(2027)}). Acre moves state holidays falling Tuesday to Thursday to the Friday (State Law 2,126/2009). Long-weekend planner: exact dynamic programming over the year's working blocks; São Paulo 2027, ${sp.folga} days off give ${sp.livre} free days. Everything runs in the browser; nothing entered is sent. Independent site by Radif Partners; no travel or affiliate offers. Last updated ${LAST_UPDATED}.`, '',
    '## Próximo feriado / Next holiday', `- [Próximo feriado](${SITE_URL}${route('home', 'pt')})`, `- [Next holiday](${SITE_URL}${route('home', 'en')})`, '',
    ...GROUPS.flatMap((g) => [`## ${g.label.en} / ${g.label.pt}`, ...GUIDES.filter((p) => p.group === g.id).flatMap((p) => [
      `- [${p.pt.nav}](${SITE_URL}${route(p.id, 'pt')}): ${p.pt.card}`,
      `- [${p.en.nav}](${SITE_URL}${route(p.id, 'en')}): ${p.en.card}`,
    ]), '']),
    '## About', `- [Método](${SITE_URL}${route('method', 'pt')})`, `- [Method](${SITE_URL}${route('method', 'en')})`, `- [Sobre](${SITE_URL}${route('about', 'pt')})`, `- [About](${SITE_URL}${route('about', 'en')})`,
  ];
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
