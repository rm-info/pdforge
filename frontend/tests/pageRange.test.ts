import { describe, it, expect } from 'vitest';
import { parsePageRange } from '../src/lib/pageRange';

describe('parsePageRange', () => {
  it('parse une liste mixte en indices 0-based, triés et dédupliqués', () => {
    expect(parsePageRange('1-3,5', 10)).toEqual([0, 1, 2, 4]);
  });

  it('déduplique et trie le chevauchement', () => {
    expect(parsePageRange('5,1-2,2', 10)).toEqual([0, 1, 4]);
  });

  it('borne au nombre total de pages', () => {
    expect(parsePageRange('8-100', 10)).toEqual([7, 8, 9]);
  });

  it('gère les espaces', () => {
    expect(parsePageRange(' 1 , 3 - 4 ', 10)).toEqual([0, 2, 3]);
  });

  it('rejette un format invalide', () => {
    expect(() => parsePageRange('abc', 10)).toThrow();
    expect(() => parsePageRange('1-', 10)).toThrow();
  });

  it('rejette une spec qui ne sélectionne aucune page valide', () => {
    expect(() => parsePageRange('50-60', 10)).toThrow();
  });
});
