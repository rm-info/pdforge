<script lang="ts">
  let { blob = null, filename = 'result.pdf' }: { blob?: Blob | null; filename?: string } =
    $props();

  // Object URL recréé à chaque résultat, et l'ancien révoqué pour éviter la fuite.
  let url = $state<string | null>(null);
  $effect(() => {
    const next = blob ? URL.createObjectURL(blob) : null;
    url = next;
    return () => {
      if (next) URL.revokeObjectURL(next);
    };
  });
</script>

{#if url}
  <a class="dl" href={url} download={filename}>Télécharger le résultat</a>
{/if}

<style>
  .dl {
    display: inline-block;
    margin-top: 1rem;
    padding: 0.6rem 1rem;
    background: #2d7;
    color: #fff;
    border-radius: 6px;
    text-decoration: none;
  }
</style>
