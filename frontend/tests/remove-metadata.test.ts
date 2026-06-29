import { describe, it, expect } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { run as stripRun } from '../src/lib/runtime/client/remove-metadata';

describe('remove-metadata', () => {
  it('efface titre et auteur', async () => {
    const doc = await PDFDocument.create();
    doc.addPage([200, 200]);
    doc.setTitle('Secret Doc');
    doc.setAuthor('Jean Dupont');
    const file = new File([(await doc.save()) as BlobPart], 'in.pdf', {
      type: 'application/pdf'
    });

    const out = await stripRun([file], {});
    const cleaned = await PDFDocument.load(new Uint8Array(await out.arrayBuffer()));
    expect(cleaned.getTitle() ?? '').toBe('');
    expect(cleaned.getAuthor() ?? '').toBe('');
  });
});
