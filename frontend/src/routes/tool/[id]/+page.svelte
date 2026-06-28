<script lang="ts">
  import { page } from '$app/stores';
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
  let error = $state<string | null>(null);

  async function execute() {
    if (!tool) return;
    busy = true;
    error = null;
    result = null;
    try {
      result =
        tool.runtime === 'client'
          ? await runClientTool(tool.id, files, values)
          : await runServerTool(tool.id, files, values);
    } catch (e) {
      error = e instanceof Error ? e.message : 'Erreur inconnue';
    } finally {
      busy = false;
    }
  }

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
  <ResultDownload blob={result} filename={`${tool.id}.pdf`} />
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
</style>
