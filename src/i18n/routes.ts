import { makeRouter, type RouteDef } from './routes-core';
import { GUIDES } from '../lib/pages';
/** Portugais du Brésil d'abord, anglais sur toutes les pages (RECETTE : langue locale + anglais). */
export const LOCALES = ['pt', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'pt';
const R = (id: string, pt: string, en: string, noindex = false) => ({ id, paths: { pt: `/pt/${pt}/`, en: `/en/${en}/` }, ...(noindex ? { noindex } : {}) });
const CORE: RouteDef<Locale>[] = [
  { id: 'home', paths: { pt: '/pt/', en: '/en/' } },
  R('method', 'metodologia', 'method'),
  R('about', 'sobre', 'about'),
  R('widget', 'widget', 'widget', true),
  R('contact', 'contato', 'contact', true),
  R('editorial', 'politica-editorial', 'editorial-policy', true),
  R('privacy', 'privacidade', 'privacy', true),
  R('terms', 'aviso-legal', 'legal-notice', true),
  R('cookies', 'cookies', 'cookies', true),
];
const G = (g: (typeof GUIDES)[number]): RouteDef<Locale> => ({ id: g.id, paths: { pt: `/pt/${g.pt.slug}/`, en: `/en/${g.en.slug}/` } });
export const ROUTES: RouteDef<Locale>[] = [CORE[0], ...GUIDES.map(G), ...CORE.slice(1)];
export const { NOINDEX_PATHS, route, hasRoute, altPaths } = makeRouter(LOCALES, ROUTES);
