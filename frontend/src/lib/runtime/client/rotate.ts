import { PDFDocument, degrees } from 'pdf-lib';

export async function run(files: File[], params: Record<string, unknown>): Promise<Blob> {
  const angle = Number(params.angle ?? 90);
  const doc = await PDFDocument.load(new Uint8Array(await files[0].arrayBuffer()));
  for (const page of doc.getPages()) {
    page.setRotation(degrees((page.getRotation().angle + angle) % 360));
  }
  return new Blob([(await doc.save()) as BlobPart], { type: 'application/pdf' });
}
