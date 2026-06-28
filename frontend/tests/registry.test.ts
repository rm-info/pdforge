import { describe, it, expect } from 'vitest';
import { tools, toolsById, getTool, categories } from '../src/lib/registry';

describe('registry', () => {
  it('a des ids uniques', () => {
    const ids = tools.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('contient merge (client) et ocr (server)', () => {
    expect(getTool('merge')?.runtime).toBe('client');
    expect(getTool('ocr')?.runtime).toBe('server');
  });

  it('chaque descripteur a les champs requis', () => {
    for (const t of tools) {
      expect(t.id).toBeTruthy();
      expect(t.name).toBeTruthy();
      expect(t.category).toBeTruthy();
      expect(['client', 'server']).toContain(t.runtime);
      expect(t.inputs.files.min).toBeGreaterThanOrEqual(1);
    }
  });

  it('expose les catégories distinctes', () => {
    expect(categories).toContain('organize');
    expect(categories).toContain('ocr');
  });

  it('toolsById résout par id', () => {
    expect(toolsById['merge']?.id).toBe('merge');
  });
});
