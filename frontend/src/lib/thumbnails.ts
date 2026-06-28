// Rendu de vignette PDF via pdf.js, chargé paresseusement (pdf.js ~1 Mo + worker)
// pour ne peser que lorsqu'on affiche réellement des aperçus.

let pdfjsPromise: Promise<typeof import('pdfjs-dist')> | null = null;

async function loadPdfjs(): Promise<typeof import('pdfjs-dist')> {
  if (!pdfjsPromise) {
    pdfjsPromise = (async () => {
      const lib = await import('pdfjs-dist');
      // Vite renvoie l'URL du worker bundlé via le suffixe ?url.
      const worker = await import('pdfjs-dist/build/pdf.worker.min.mjs?url');
      lib.GlobalWorkerOptions.workerSrc = worker.default;
      return lib;
    })();
  }
  return pdfjsPromise;
}

/** Rend la 1ʳᵉ page de `file` en data-URL PNG, largeur ~`maxWidth` px. */
export async function renderFirstPage(file: File, maxWidth = 150): Promise<string> {
  const lib = await loadPdfjs();
  const data = new Uint8Array(await file.arrayBuffer());
  const task = lib.getDocument({ data });
  const doc = await task.promise;
  try {
    const page = await doc.getPage(1);
    const base = page.getViewport({ scale: 1 });
    const viewport = page.getViewport({ scale: maxWidth / base.width });
    const canvas = document.createElement('canvas');
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    await page.render({ canvas, viewport }).promise;
    return canvas.toDataURL('image/png');
  } finally {
    await task.destroy();
  }
}
