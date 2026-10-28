/** Configuration centrale du site (générée par new-site.py). */
export const SITE_URL = "https://br-feriados.example";
export const SITE_NAMES: Record<string, string> = {"pt": "BR Feriados", "en": "BR Feriados"};
// Partie du nom affichée en couleur dans l'en-tête (RECETTE §10.3), « » pour aucune.
export const BRAND_ACCENT = "Feriados";
export const NUM_TAGS: Record<string, string> = {"pt": "pt-BR", "en": "en-GB"};
export const LANG_TAGS: Record<string, string> = {"pt": "pt-BR", "en": "en-BR"};
export const OG_LOCALES: Record<string, string> = {"pt": "pt_BR", "en": "en_GB"};
export const LOCALE_TAG = 'pt-BR';
export const CURRENCY = 'BRL';
export const YEAR = 2026;
/** Année de création du site — signal d'ancienneté (RECETTE §8.0). */
export const SITE_FOUNDED = '2026';
export const LAST_UPDATED = '2026-10-28';
export const AUTHOR_NAME = 'Radif Partners';
export const AUTHOR_ROLE: Record<string, string> = {"pt": "Editora independente de um calendário de feriados brasileiros que lê as leis federais, as leis estaduais das 27 unidades da federação e as leis municipais das capitais", "en": "Independent publisher of a Brazilian public holiday calendar built from the federal statutes, the holiday laws of all 27 states and the municipal laws of the state capitals"};
export const AUTHOR_DESC: Record<string, string> = {"pt": "A Radif Partners é uma editora independente, sem vínculo com governo, prefeitura ou banco. Para o BR Feriados ela lê no texto oficial a Lei 662/1949, a Lei 6.802/1980, a Lei 14.759/2023 e a Lei 9.093/1995, a lei de cada estado que fixa sua data magna e as leis municipais das capitais, e acompanha a portaria anual do Ministério da Gestão sobre pontos facultativos. Páscoa, Carnaval e Corpus Christi saem de um algoritmo testado. Nada do que você digita sai do seu navegador.", "en": "Radif Partners is an independent publisher with no tie to any government, city hall or bank. For BR Feriados it reads the official text of Law 662/1949, Law 6,802/1980, Law 14,759/2023 and Law 9,093/1995, each state's own holiday law and the municipal laws of the state capitals, and follows the Ministry of Management's yearly ordinance on optional days off. Easter, Carnival and Corpus Christi come from a tested algorithm. Nothing you type leaves your browser."};
/** Sujets sur lesquels l'editeur est competent (schema.org knowsAbout). Ce sont les
 *  themes reellement traites par le site, pas une liste de mots-cles : un sujet
 *  declare ici sans page qui le couvre est une declaration fausse. */
export const KNOWS_ABOUT: Record<string, string[]> = {"pt": ["Feriados nacionais do Brasil", "Feriados estaduais das 27 unidades da federação", "Feriados municipais das capitais", "Pontos facultativos do serviço público federal", "Cálculo da Páscoa, do Carnaval e de Corpus Christi", "Dias úteis e emendas de feriado"], "en": ["Brazilian national public holidays", "State holidays in Brazil's 27 federative units", "Municipal holidays of the state capitals", "Optional days off in the federal civil service", "Computing Easter, Carnival and Corpus Christi", "Working days and long weekends in Brazil"]};
export const CONTACT_EMAIL = "contato@br-feriados.example";
export const THEME_COLOR = '#00703C';
export const LOGO_SYMBOL = '31';
export const BING_VERIFY_CODE = '';
export const GOOGLE_VERIFY_CODE = '';
/** Régime : 'none' pour tous les sites (RECETTE §15.6, décision de l'éditeur du 2026-10-06) :
 *  aucun bandeau ; Clarity chargé en mode sans cookie (consentv2 denied) ; GA4 avec cookies si GA4_ID.
 *  'opt-in' / 'notice' ne servent plus qu'aux sites anciens qui les portent encore. */
export const CONSENT_MODE: 'opt-in' | 'notice' | 'none' = 'none';
/** Propriété Google Analytics 4 (décision de l'éditeur du 2026-10-17, RECETTE §15.6) : GA4 normal,
 *  avec cookies _ga / _ga_<ID> (390 jours), sans bandeau, publicité refusée. Créée par
 *  `seo-platform/scripts/create-ga4.ts accounts/372759688` (RECETTE §15.3, étape 15), puis
 *  pages légales régénérées : `python3 scripts/gen-legal-pages.py .`. Vide = pas de GA4. */
export const GA4_ID = '';
/** Projet Microsoft Clarity (compte amradif), chargé sans cookie. Vide = aucune mesure. */
export const CLARITY_ID = '';
export const INDEXNOW_KEY = 'b9af556fc0a91ade33f7f8c4c239c69b';

/* ------------------------------------------------------------------------- *
 * IDENTITÉ LÉGALE — À COMPLÉTER AVANT LA MISE EN LIGNE
 * Ces champs alimentent la mention légale du pays, la politique de confidentialité,
 * la page contact et le schema Organization. Un champ vide s'affiche en jaune
 * sur le site. Contrôle : `npm run check:legal`.
 * ------------------------------------------------------------------------- */
export interface LegalHosting { name: string; address: string; phone: string; url: string }
export interface LegalIdentity {
  entityName: string; legalForm: string; street: string; postalCode: string; city: string;
  country: string; phone: string; registerLabel: string; registerNumber: string;
  vatLabel: string; vatNumber: string; jurisdiction: string;
  supervisoryAuthority: string; supervisoryAuthorityUrl: string; hosting: LegalHosting;
}
export const LEGAL: LegalIdentity = {
  entityName: 'Radif Partners',  // éditeur de tous les sites du portefeuille (RECETTE §8)
  legalForm: '',             // vide à dessein, comme sur les autres sites du portefeuille
  street: '49 rue du Ressort',
  postalCode: '63000',
  city: 'Clermont-Ferrand',
  country: "France",
  phone: '',
  registerLabel: "SIREN",
  registerNumber: '',
  vatLabel: "VAT",
  vatNumber: '',
  jurisdiction: "France",
  supervisoryAuthority: "Commission nationale de l'informatique et des libertés (CNIL)",
  supervisoryAuthorityUrl: "https://www.cnil.fr",
  hosting: { name: 'GitHub, Inc. (GitHub Pages)', address: '88 Colin P Kelly Jr Street, San Francisco, CA 94107, United States', phone: '', url: 'https://pages.github.com' },
};

/** Champs sans lesquels le site ne doit pas être mis en ligne. */
export const LEGAL_REQUIRED: Array<keyof LegalIdentity> = ['entityName', 'street', 'postalCode', 'city'];

/** Profils publics de l'auteur (schema.org sameAs). Laisser vide si aucun. */
export const AUTHOR_SAME_AS: string[] = [];

/** Rythme de revue éditoriale annoncé sur le site, en mois. */
export const REVIEW_CYCLE_MONTHS = 12;
