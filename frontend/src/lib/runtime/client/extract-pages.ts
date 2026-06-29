import { PDFDocument } from 'pdf-lib';
import { parsePageRange } from '../../pageRange';

export async function run(files: File[], params: Record<string, unknown>): Promise<Blob> {
  const src = await PDFDocument.load(new Uint8Array(await files[0].arrayBuffer()));
  const idx = parsePageRange(String(params.pages ?? ''), src.getPageCount());
  const out = await PDFDocument.create();
  const pages = await out.copyPages(src, idx);
  for (const p of pages) out.addPage(p);
  return new Blob([(await out.save()) as BlobPart], { type: 'application/pdf' });
}
