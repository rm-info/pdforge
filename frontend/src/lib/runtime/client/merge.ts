import { PDFDocument } from 'pdf-lib';

export async function run(
  files: File[],
  _params: Record<string, unknown> = {}
): Promise<Blob> {
  const out = await PDFDocument.create();
  for (const file of files) {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const src = await PDFDocument.load(bytes);
    const pages = await out.copyPages(src, src.getPageIndices());
    for (const p of pages) out.addPage(p);
  }
  const merged = await out.save();
  return new Blob([merged], { type: 'application/pdf' });
}
