/** Toutes les pages prévues (id = nom du fichier de src/content/guides, ou id d'une entrée d'un fichier à plusieurs pages).
 *  Les tests acceptent un lien vers ces ids pendant la rédaction ; « toutes les pages existent » échoue tant qu'il en manque. */
import { UFS, ufPageId } from './engine/feriados';
export const UF_IDS = UFS.map(ufPageId);
export const PLANNED_GUIDES = [
  'feriados-2026', 'feriados-2027', 'feriados-de-novembro', 'pontos-facultativos',
  'feriados-prolongados-2027', 'dias-uteis-2027', 'calendario-2027',
  'quantos-dias-faltam', 'carnaval-2027', 'pascoa-2027', 'corpus-christi-2027', 'dia-das-maes-2027',
  ...UF_IDS,
];
export const PLANNED_IDS = new Set<string>([...PLANNED_GUIDES, 'home', 'method', 'about', 'widget', 'contact', 'editorial', 'privacy', 'terms', 'cookies']);
