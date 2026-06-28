<script lang="ts">
  let {
    accept = ['application/pdf'],
    min = 1,
    max = 0,
    files = $bindable([])
  }: { accept?: string[]; min?: number; max?: number; files?: File[] } = $props();

  function onChange(e: Event) {
    const input = e.target as HTMLInputElement;
    files = input.files ? Array.from(input.files) : [];
  }

  let valid = $derived(files.length >= min && (max === 0 || files.length <= max));
</script>

<label class="dropzone">
  <input type="file" multiple={max !== 1} accept={accept.join(',')} onchange={onChange} />
  {#if files.length === 0}
    <span>Déposez vos PDF ici (min {min}{max ? `, max ${max}` : ''})</span>
  {:else}
    <span>{files.length} fichier(s) sélectionné(s)</span>
  {/if}
</label>
{#if files.length > 0 && !valid}
  <p class="warn">Nombre de fichiers invalide.</p>
{/if}

<style>
  .dropzone {
    display: block;
    border: 2px dashed #888;
    padding: 1.5rem;
    text-align: center;
    cursor: pointer;
    border-radius: 8px;
  }
  .warn {
    color: #c0392b;
  }
</style>
