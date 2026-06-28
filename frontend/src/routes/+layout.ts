// SPA pur : aucun prerender (routes dynamiques comme /tool/[id]),
// tout est rendu côté client via le fallback index.html (adapter-static).
export const prerender = false;
export const ssr = false;
