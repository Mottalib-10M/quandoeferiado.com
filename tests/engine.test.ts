import { describe, it, expect } from 'vitest';
import { pascoa, pascoaMeeus, carnavalTerca, corpusChristi, paixao, feriados, folgas, panorama, UFS, prolongado, proximos, portariaPublicada } from '../src/lib/engine/feriados';
import { otimiza, pontes, diasUteis, segASex, uteisEntre } from '../src/lib/engine/emendas';
import { brasiliaInstant } from '../src/lib/zeit';
import { PLANNED_GUIDES } from '../src/lib/planned';
import { GUIDES } from '../src/lib/pages';

describe('Páscoa', () => {
  it('confere com datas conhecidas', () => {
    expect(pascoa(2024)).toBe('2024-03-31');
    expect(pascoa(2025)).toBe('2025-04-20');
    expect(pascoa(2026)).toBe('2026-04-05');
    expect(pascoa(2027)).toBe('2027-03-28');
    expect(pascoa(2028)).toBe('2028-04-16');
    expect(pascoa(2038)).toBe('2038-04-25');
    expect(pascoa(2008)).toBe('2008-03-23');
  });
  it('Gauss = Meeus de 1600 a 2600', () => {
    for (let y = 1600; y <= 2600; y++) expect(pascoa(y)).toBe(pascoaMeeus(y));
  });
  it('datas móveis', () => {
    expect(carnavalTerca(2027)).toBe('2027-02-09');
    expect(carnavalTerca(2028)).toBe('2028-02-29');
    expect(paixao(2027)).toBe('2027-03-26');
    expect(corpusChristi(2027)).toBe('2027-05-27');
  });
});

describe('Feriados', () => {
  it('dez nacionais (com a Paixão) em todos os estados', () => {
    for (const uf of UFS) {
      const n = folgas(2027, { uf }).filter((f) => f.esfera === 'nacional' || f.esfera === 'religioso');
      expect(n.length).toBe(10);
    }
  });
  it('20 de novembro nacional desde a Lei 14.759/2023', () => {
    expect(folgas(2026, { uf: 'SP' }).some((f) => f.date === '2026-11-20' && f.esfera === 'nacional')).toBe(true);
  });
  it('Acre: adiamento para a sexta (Lei 2.126/2009)', () => {
    const f26 = folgas(2026, { uf: 'AC' });
    expect(f26.some((f) => f.date === '2026-01-22' && f.original === '2026-01-20')).toBe(true);
    expect(f26.some((f) => f.date === '2026-11-19' && f.original === '2026-11-17')).toBe(true);
    expect(f26.some((f) => f.date === '2026-06-15')).toBe(true); // aniversário não muda
    const f27 = folgas(2027, { uf: 'AC' });
    expect(f27.some((f) => f.date === '2027-01-22')).toBe(true);
    expect(f27.some((f) => f.date === '2027-11-19')).toBe(true);
  });
  it('Rio de Janeiro: Carnaval e Corpus Christi estaduais', () => {
    const f = folgas(2027, { uf: 'RJ' }).map((x) => x.date);
    expect(f).toContain('2027-02-09');
    expect(f).toContain('2027-04-23');
    expect(f).toContain('2027-05-27');
  });
  it('Santa Catarina: data magna sempre num domingo', () => {
    for (const y of [2026, 2027, 2028]) {
      const sc = folgas(y, { uf: 'SC' }).filter((f) => f.esfera === 'estadual');
      expect(sc.length).toBe(1);
      expect(new Date(`${sc[0].date}T00:00:00Z`).getUTCDay()).toBe(0);
    }
  });
  it('Espírito Santo: Penha = Páscoa + 8', () => {
    expect(folgas(2027, { uf: 'ES' }).some((f) => f.date === '2027-04-05' && f.esfera === 'estadual')).toBe(true);
  });
  it('Goiás, Paraná e Mato Grosso sem feriado estadual civil', () => {
    for (const uf of ['GO', 'PR', 'MT'] as const) expect(folgas(2027, { uf }).filter((f) => f.esfera === 'estadual').length).toBe(0);
  });
  it('uma data aparece uma vez só (Minas: 21 de abril)', () => {
    const f = feriados(2027, { uf: 'MG', capital: true, facultativos: true });
    expect(new Set(f.map((x) => x.date)).size).toBe(f.length);
  });
  it('pontos facultativos só com portaria publicada', () => {
    expect(portariaPublicada(2026)).toBe(true);
    expect(feriados(2026, { uf: 'MT', facultativos: true }).filter((f) => f.esfera === 'facultativo').length).toBe(9);
    expect(feriados(2027, { uf: 'MT', facultativos: true }).filter((f) => f.esfera === 'facultativo').length).toBe(0);
  });
  it('panorama sem duplicatas', () => {
    const p = panorama(2027);
    expect(new Set(p.map((r) => `${r.esfera}|${r.date}|${r.nome.pt}`)).size).toBe(p.length);
  });
  it('próximos e prolongado', () => {
    expect(proximos('2026-10-28', { uf: 'SP' }, 1)[0].date).toBe('2026-11-02');
    expect(prolongado('2026-11-02').tipo).toBe('prolongado');
    expect(prolongado('2027-09-07')).toMatchObject({ tipo: 'emenda', emenda: '2027-09-06', dias: 4 });
  });
});

describe('Emendas e dias úteis', () => {
  it('dias de segunda a sexta', () => { expect(segASex(2027)).toBe(261); });
  it('dias úteis 2027 num estado sem feriado estadual em dia útil', () => {
    expect(diasUteis(2027, { uf: 'MT' }).reduce((a, b) => a + b, 0)).toBe(261 - 7);
  });
  it('uteisEntre conta os dois extremos', () => {
    expect(uteisEntre('2026-12-21', '2026-12-28', { uf: 'SP' })).toBe(5);
  });
  it('emenda de 6 de setembro de 2027 rende 4 por 1', () => {
    expect(pontes(2027, { uf: 'SP' }).some((p) => p.folgaDe === '2027-09-06' && p.folga === 1 && p.livre === 4)).toBe(true);
  });
  it('otimizador: nunca passa do saldo, e mais saldo nunca rende menos', () => {
    for (const uf of ['SP', 'RJ', 'AC', 'DF'] as const) {
      let prev = 0;
      for (let s = 0; s <= 30; s += 3) {
        const p = otimiza(2027, { uf }, s);
        expect(p.folga).toBeLessThanOrEqual(s);
        expect(p.livre).toBeGreaterThanOrEqual(prev);
        prev = p.livre;
      }
    }
  });
});

describe('Hora de Brasília e páginas', () => {
  it('meia-noite em Brasília = 03:00 UTC', () => {
    expect(brasiliaInstant('2026-12-25', '00:00')).toBe('2026-12-25T03:00:00.000Z');
  });
  it('todas as páginas previstas existem', () => {
    const ids = new Set(GUIDES.map((g) => g.id));
    for (const id of PLANNED_GUIDES) expect(ids.has(id), id).toBe(true);
  });
});
