export async function runServerTool(
  id: string,
  files: File[],
  params: Record<string, unknown>
): Promise<Blob> {
  const form = new FormData();
  for (const f of files) form.append('files', f, f.name);
  form.append('params', JSON.stringify(params));

  const res = await fetch(`/api/tools/${id}`, { method: 'POST', body: form });
  if (!res.ok) {
    let message = 'Erreur serveur';
    try {
      const j = await res.json();
      message = j.message ?? message;
    } catch {
      /* corps non-JSON */
    }
    throw new Error(message);
  }
  return await res.blob();
}
