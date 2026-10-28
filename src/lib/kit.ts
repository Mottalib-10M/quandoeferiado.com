/**
 * Trousse de rédaction : tout chiffre et toute date écrits dans une page viennent d'ici, jamais tapés à la main.
 *   K.P                                   paramètres datés et sources (params-2026.json)
 *   K.feriados, K.pascoa, K.proximos …    moteur des feriados (engine/feriados.ts)
 *   K.otimiza, K.pontes, K.diasUteis …    emendas et dias úteis (engine/emendas.ts)
 *   K.tool(kind, lang, args, valeurs)     lance un simulateur de tool-specs.ts et rend sa carte de résultat
 */
import P from '../data/params-2026.json';
import * as F from './engine/feriados';
import * as E from './engine/emendas';
import { runTool } from './tool-specs';
import { LAST_UPDATED } from '../data/site-config';

export const KIT = { P, ...F, ...E, tool: runTool, LIDO: LAST_UPDATED };
export type Kit = typeof KIT;
