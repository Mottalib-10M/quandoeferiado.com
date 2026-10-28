import { route, hasRoute, type Locale } from './routes';
import { GUIDES, guideById } from '../lib/pages';
import type { Group } from '../lib/page-types';
export interface NavLink { href: string; label: string } export interface NavCategory { label: string; links: NavLink[] }
const CORE: Record<Locale, Record<string, string>> = {
  pt: { home: 'Próximo feriado', method: 'Método', about: 'Sobre', widget: 'Incorporar as ferramentas', contact: 'Contato', editorial: 'Política editorial', privacy: 'Privacidade', terms: 'Aviso legal', cookies: 'Cookies' },
  en: { home: 'Next holiday', method: 'Method', about: 'About', widget: 'Embed the tools', contact: 'Contact', editorial: 'Editorial policy', privacy: 'Privacy', terms: 'Legal notice', cookies: 'Cookies' },
};
/** `short` : intitulé du menu du haut (un ou deux mots, RECETTE §10.3) ; `label` : intitulé complet. */
export const GROUPS: Array<{ id: Group; label: Record<Locale, string>; short: Record<Locale, string> }> = [
  { id: 'ferramentas', label: { pt: 'Feriados prolongados e dias úteis', en: 'Long weekends and working days' }, short: { pt: 'Ferramentas', en: 'Tools' } },
  { id: 'feriados', label: { pt: 'Feriados por ano e por mês', en: 'Holidays by year and month' }, short: { pt: 'Feriados', en: 'Holidays' } },
  { id: 'datas', label: { pt: 'Datas do ano: Carnaval, Páscoa, Natal', en: 'Dates of the year: Carnival, Easter, Christmas' }, short: { pt: 'Datas', en: 'Dates' } },
  { id: 'estados', label: { pt: 'Feriados por estado', en: 'Holidays by state' }, short: { pt: 'Estados', en: 'States' } },
];
export const label = (id: string, lang: Locale) => CORE[lang][id] ?? guideById(id)?.[lang]?.nav ?? id;
const link = (id: string, lang: Locale): NavLink => ({ href: route(id, lang), label: label(id, lang) });
export const inGroup = (g: Group, lang: Locale): NavLink[] => GUIDES.filter((p) => p.group === g && hasRoute(p.id, lang)).map((p) => link(p.id, lang));
export function navCategories(lang: Locale, short = true): NavCategory[] {
  return GROUPS.map((g) => ({ label: (short ? g.short : g.label)[lang], links: g.id === 'ferramentas' ? [link('home', lang), ...inGroup(g.id, lang)] : inGroup(g.id, lang) })).filter((c) => c.links.length);
}
/** La Méthode n'est pas dans le menu du haut (RECETTE §10.3) : sous le titre et en bas de page. */
export const navDirect = (_lang: Locale): NavLink[] => [];
export const footerColumns = (lang: Locale): NavCategory[] => {
  const site = { label: { pt: 'Este site', en: 'This site' }[lang], links: ['home', 'method', 'about', 'contact', 'editorial', 'widget', 'terms', 'privacy', 'cookies'].map((i) => link(i, lang)) };
  return [
    { label: GROUPS[1].label[lang], links: [...inGroup('feriados', lang), ...inGroup('datas', lang)] },
    { label: GROUPS[3].label[lang], links: inGroup('estados', lang) },
    { label: GROUPS[0].label[lang], links: inGroup('ferramentas', lang) },
    site,
  ];
};
/** Les outils, à un clic de toute page (RECETTE §18.2). */
export const popularLinks = (lang: Locale): NavLink[] => [link('home', lang), ...inGroup('ferramentas', lang)];
