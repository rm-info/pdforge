import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { tools } from '../src/lib/registry';

const contractPath = fileURLToPath(
  new URL('../../shared/server-tools.json', import.meta.url)
);

describe('contrat registre ↔ backend', () => {
  it('les outils runtime=server correspondent exactement à server-tools.json', () => {
    const declared = new Set<string>(JSON.parse(readFileSync(contractPath, 'utf-8')));
    const serverTools = new Set(tools.filter((t) => t.runtime === 'server').map((t) => t.id));
    expect(serverTools).toEqual(declared);
  });
});
