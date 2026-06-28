import { describe, it, expect } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { run as mergeRun } from '../src/lib/runtime/client/merge';

async function onePagePdf(): Promise<File> {
  const doc = await PDFDocument.create();
  doc.addPage([200, 200]);
  const bytes = await doc.save();
  return new File([bytes as BlobPart], 'x.pdf', { type: 'application/pdf' });
}

describe('merge client', () => {
  it('fusionne 2 PDF 1-page en 1 PDF 2-pages', async () => {
    const out = await mergeRun([await onePagePdf(), await onePagePdf()]);
    const bytes = new Uint8Array(await out.arrayBuffer());
    const merged = await PDFDocument.load(bytes);
    expect(merged.getPageCount()).toBe(2);
  });
});
