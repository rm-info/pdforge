<script lang="ts">
  import { page } from '$app/stores';
  import { PDFDocument } from 'pdf-lib';
  import { getTool } from '$lib/registry';
  import { runClientTool } from '$lib/runtime/client';
  import { runServerTool } from '$lib/runtime/server';
  import FileDropzone from '$lib/ui/FileDropzone.svelte';
  import ToolForm from '$lib/ui/ToolForm.svelte';
  import ProgressBar from '$lib/ui/ProgressBar.svelte';
  import ResultDownload from '$lib/ui/ResultDownload.svelte';

  let tool = $derived(getTool($page.params.id ?? ''));

  let files = $state<File[]>([]);
  let values = $state<Record<string, any>>({});
  let busy = $state(false);
  let result = $state<Blob | null>(null);
  let resultInfo = $state<{ pages: number | null; size: number } | null>(null);
  let error = $state<string | null>(null);
  let outName = $state('');

  // Nom de sortie par défaut = id de l'outil (ex. « merge »).
  $effect(() => {
    if (tool && !outName) outName = tool.id;
  });

  async function execute() {
    if (!tool) return;
    busy = true;
    error = null;
    result = null;
    resultInfo = null;
    try {
      const blob =
        tool.runtime === 'client'
          ? await runClientTool(tool.id, files, values)
          : await runServerTool(tool.id, files, values);
      result = blob;
      resultInfo = await describe(blob);
    } catch (e) {
      error = e instanceof Error ? e.message : 'Erreur inconnue';
    } finally {
      busy = false;
    }
  }

  async function describe(blob: Blob): Promise<{ pages: number | null; size: number }> {
    let pages: number | null = null;
    try {
      const doc = await PDFDocument.load(await blob.arrayBuffer());
      pages = doc.getPageCount();
    } catch {
      /* sortie non-PDF ou chiffrée : on se contente de la taille */
    }
    return { pages, size: blob.size };
  }

  function humanSize(n: number): string {
    if (n < 1024) return `${n} o`;
    if (n < 1024 * 1024) return `${Math.round(n / 1024)} Ko`;
    return `${(n / 1024 / 1024).toFixed(1)} Mo`;
  }

  let downloadName = $derived.by(() => {
    const n = outName.trim() || tool?.id || 'resultat';
    return n.toLowerCase().endsWith('.pdf') ? n : `${n}.pdf`;
  });

  let canRun = $derived(
    !!tool &&
      files.length >= tool.inputs.files.min &&
      (tool.inputs.files.max === 0 || files.length <= tool.inputs.files.max)
  );
</script>

{#if !tool}
  <p>Outil inconnu. <a href="/">Retour</a></p>
{:else}
  <a href="/">← Tous les outils</a>
  <h1>{tool.name}</h1>

  <FileDropzone
    accept={tool.inputs.files.accept}
    min={tool.inputs.files.min}
    max={tool.inputs.files.max}
    bind:files
  />
  <ToolForm params={tool.params} bind:values />

  <button disabled={!canRun || busy} onclick={execute}>Lancer</button>
  <ProgressBar active={busy} />

  {#if error}<p class="error">{error}</p>{/if}

  {#if result}
    <div class="result">
      {#if resultInfo}
        <p class="info">
          Résultat :
          {#if resultInfo.pages !== null}{resultInfo.pages} page(s) · {/if}
          {humanSize(resultInfo.size)}
        </p>
      {/if}
      <label class="outname">
        <span>Nom du fichier</span>
        <input type="text" bind:value={outName} placeholder={tool.id} />
        <small>.pdf</small>
      </label>
      <ResultDownload blob={result} filename={downloadName} />
    </div>
  {/if}
{/if}

<style>
  button {
    margin-top: 1rem;
    padding: 0.6rem 1.2rem;
    border: 0;
    background: #2d7;
    color: #fff;
    border-radius: 6px;
    cursor: pointer;
  }
  button:disabled {
    background: #aaa;
    cursor: not-allowed;
  }
  .error {
    color: #c0392b;
  }
  .result {
    margin-top: 1rem;
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 8px;
  }
  .info {
    margin: 0 0 0.75rem;
    color: #333;
  }
  .outname {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    margin-bottom: 0.75rem;
  }
  .outname input {
    padding: 0.4rem;
    border: 1px solid #ccc;
    border-radius: 6px;
  }
  .outname small {
    color: #888;
  }
</style>
