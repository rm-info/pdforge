import { PDFDocument } from 'pdf-lib';

/** Construit un File PDF de `pages` pages 200×200 pour les tests. */
export async function makePdf(pages: number, name = 'in.pdf'): Promise<File> {
  const doc = await PDFDocument.create();
  for (let i = 0; i < pages; i++) doc.addPage([200, 200]);
  const bytes = await doc.save();
  return new File([bytes as BlobPart], name, { type: 'application/pdf' });
}
