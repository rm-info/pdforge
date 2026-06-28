export type ClientHandler = (
  files: File[],
  params: Record<string, unknown>
) => Promise<Blob>;

const loaders: Record<string, () => Promise<{ run: ClientHandler }>> = {
  merge: () => import('./merge')
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
