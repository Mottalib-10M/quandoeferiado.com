/** Instant de référence d'un compte à rebours : minuit à Brasília (UTC−3, sans horário de verão depuis 2019).
 *  Sert au premier rendu ; dans le navigateur, le compte à rebours vise minuit dans le fuseau du visiteur. */
export function brasiliaInstant(dateIso: string, time = '00:00'): string {
  const [hh, mm] = time.split(':').map(Number);
  const [y, m, d] = dateIso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d, hh + 3, mm)).toISOString();
}
