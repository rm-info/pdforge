import { PDFDocument } from 'pdf-lib';

export async function run(files: File[], _params: Record<string, unknown> = {}): Promise<Blob> {
  const doc = await PDFDocument.load(new Uint8Array(await files[0].arrayBuffer()));
  doc.setTitle('');
  doc.setAuthor('');
  doc.setSubject('');
  doc.setKeywords([]);
  doc.setProducer('');
  doc.setCreator('');
  return new Blob([(await doc.save()) as BlobPart], { type: 'application/pdf' });
}
