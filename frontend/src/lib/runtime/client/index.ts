export type ClientHandler = (
  files: File[],
  params: Record<string, unknown>
) => Promise<Blob>;

const loaders: Record<string, () => Promise<{ run: ClientHandler }>> = {
  merge: () => import('./merge'),
  rotate: () => import('./rotate'),
  'extract-pages': () => import('./extract-pages'),
  'remove-pages': () => import('./remove-pages'),
  'remove-metadata': () => import('./remove-metadata')
};

export async function runClientTool(
  id: string,
  files: File[],
  params: Record<string, unknown>
): Promise<Blob> {
  const loader = loaders[id];
  if (!loader) throw new Error(`Outil client inconnu: ${id}`);
  const mod = await loader();
  return mod.run(files, params);
}
