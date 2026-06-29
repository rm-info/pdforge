import { PDFDocument } from 'pdf-lib';
import { parsePageRange } from '../../pageRange';

export async function run(files: File[], params: Record<string, unknown>): Promise<Blob> {
  const src = await PDFDocument.load(new Uint8Array(await files[0].arrayBuffer()));
  const total = src.getPageCount();
  const remove = new Set(parsePageRange(String(params.pages ?? ''), total));
  const keep: number[] = [];
  for (let i = 0; i < total; i++) if (!remove.has(i)) keep.push(i);
  if (keep.length === 0) throw new Error('Toutes les pages seraient supprimées');
  const out = await PDFDocument.create();
  const pages = await out.copyPages(src, keep);
  for (const p of pages) out.addPage(p);
  return new Blob([(await out.save()) as BlobPart], { type: 'application/pdf' });
}
