# pdforge

Suite PDF self-hosted (clone Stirling sans Java). Frontend Svelte SPA statique +
backend FastAPI stateless. Tailnet-only.

## Architecture

- `frontend/` — SvelteKit en SPA statique (`adapter-static`, `ssr=false`), build servi par Caddy.
- `backend/` — FastAPI, endpoint générique `/api/tools/{id}`, stateless (suppression temp immédiate).
- `shared/server-tools.json` — contrat des outils serveur, cross-vérifié par le front et le back.

Les outils sont décrits par des **descripteurs** (`frontend/src/lib/registry`). Chaque outil
déclare `runtime: 'client' | 'server'` : les outils client s'exécutent en WASM dans le
navigateur (pdf-lib…), les outils serveur tapent l'API Python (ocrmypdf…).

## Développement

Backend :

```bash
cd backend
python3 -m venv .venv
.venv/bin/pip install -r requirements-dev.txt
.venv/bin/python -m pytest          # tests
.venv/bin/uvicorn app.main:app --reload
```

Frontend :

```bash
cd frontend
npm install
npm run dev        # serveur de dev
npm test           # tests unitaires (Vitest)
npm run check      # svelte-check
npm run build      # build statique -> build/
```

## Conteneur backend

L'image se build depuis la **racine du projet** (pour inclure `shared/`) :

```bash
docker compose up -d --build        # bind 127.0.0.1:8810 -> 8000
curl -fsS http://127.0.0.1:8810/api/health
```

`ocrmypdf` + Tesseract (fra/eng) proviennent d'`apt` dans l'image (pas de pip ocrmypdf :
sa version épinglée tirait un pikepdf incompatible).

## Outils (Wave 0)

- `merge` (client) — fusionner des PDF.
- `ocr` (serveur) — rendre un PDF scanné cherchable.

Les vagues suivantes ajoutent organiser / sécurité / optimiser / convertir via de simples
descripteurs + handlers (voir `docs/superpowers/plans` dans le repo homelab).

## Déploiement

Tailnet-only. Câblage Caddy / CoreDNS / Kuma + script `scripts/deploy-pdforge` côté repo
homelab (phase I2/I3 du plan).
