// Parse une spec de pages « 1-3,5,8-10 » (1-based, inclusif) en indices 0-based
// uniques et triés, bornés à [1, total]. Lève si le format est invalide ou si
// aucune page valide n'est sélectionnée.
export function parsePageRange(spec: string, total: number): number[] {
  const set = new Set<number>();
  for (const raw of spec.split(',')) {
    const part = raw.replace(/\s+/g, '');
    if (part === '') continue;
    const m = part.match(/^(\d+)(?:-(\d+))?$/);
    if (!m) throw new Error(`Format de pages invalide : « ${part} »`);
    const a = parseInt(m[1], 10);
    const b = m[2] !== undefined ? parseInt(m[2], 10) : a;
    const lo = Math.min(a, b);
    const hi = Math.max(a, b);
    for (let p = lo; p <= hi; p++) {
      if (p >= 1 && p <= total) set.add(p - 1);
    }
  }
  if (set.size === 0) throw new Error('Aucune page valide sélectionnée');
  return [...set].sort((x, y) => x - y);
}
