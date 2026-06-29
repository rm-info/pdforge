import { describe, it, expect } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { makePdf } from './helpers';
import { run as rotateRun } from '../src/lib/runtime/client/rotate';
import { run as extractRun } from '../src/lib/runtime/client/extract-pages';
import { run as removeRun } from '../src/lib/runtime/client/remove-pages';

async function load(blob: Blob): Promise<PDFDocument> {
  return PDFDocument.load(new Uint8Array(await blob.arrayBuffer()));
}

describe('rotate', () => {
  it('applique la rotation à toutes les pages', async () => {
    const out = await rotateRun([await makePdf(2)], { angle: '90' });
    const doc = await load(out);
    expect(doc.getPageCount()).toBe(2);
    for (const p of doc.getPages()) expect(p.getRotation().angle).toBe(90);
  });
});

describe('extract-pages', () => {
  it('ne garde que les pages demandées, dans l’ordre', async () => {
    const out = await extractRun([await makePdf(5)], { pages: '1,3' });
    expect((await load(out)).getPageCount()).toBe(2);
  });

  it('rejette une plage invalide', async () => {
    await expect(extractRun([await makePdf(3)], { pages: 'zzz' })).rejects.toThrow();
  });
});

describe('remove-pages', () => {
  it('retire les pages demandées', async () => {
    const out = await removeRun([await makePdf(5)], { pages: '2-3' });
    expect((await load(out)).getPageCount()).toBe(3);
  });

  it('refuse de tout supprimer', async () => {
    await expect(removeRun([await makePdf(3)], { pages: '1-3' })).rejects.toThrow();
  });
});
