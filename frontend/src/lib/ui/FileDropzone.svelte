<script lang="ts">
  let {
    accept = ['application/pdf'],
    min = 1,
    max = 0,
    files = $bindable([])
  }: { accept?: string[]; min?: number; max?: number; files?: File[] } = $props();

  let dragging = $state(false);

  // Garde les fichiers compatibles (type MIME, ou extension .pdf en repli quand
  // le navigateur ne renseigne pas le type), et borne à `max` si défini.
  function accepted(list: File[]): File[] {
    const ok = list.filter(
      (f) =>
        accept.length === 0 ||
        accept.includes(f.type) ||
        (accept.includes('application/pdf') && f.name.toLowerCase().endsWith('.pdf'))
    );
    return max === 1 ? ok.slice(0, 1) : ok;
  }

  function onChange(e: Event) {
    const input = e.target as HTMLInputElement;
    files = input.files ? accepted(Array.from(input.files)) : [];
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    dragging = false;
    if (e.dataTransfer?.files?.length) {
      files = accepted(Array.from(e.dataTransfer.files));
    }
  }

  let valid = $derived(files.length >= min && (max === 0 || files.length <= max));
</script>

<!-- Toute la zone pointillée est une cible de dépôt : sans preventDefault sur
     dragover/drop, le navigateur ouvrirait le fichier déposé hors du bouton. -->
<label
  class="dropzone"
  class:dragging
  ondragover={(e) => {
    e.preventDefault();
    dragging = true;
  }}
  ondragleave={() => (dragging = false)}
  ondrop={onDrop}
>
  <input type="file" multiple={max !== 1} accept={accept.join(',')} onchange={onChange} />
  {#if files.length === 0}
    <span>Glissez vos PDF ici, ou cliquez pour parcourir (min {min}{max ? `, max ${max}` : ''})</span>
  {:else}
    <span>{files.length} fichier(s) sélectionné(s)</span>
  {/if}
</label>

{#if files.length > 0}
  <ul class="files">
    {#each files as f (f.name + f.size)}
      <li>{f.name}</li>
    {/each}
  </ul>
{/if}
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
    transition: border-color 0.15s, background 0.15s;
  }
  .dropzone.dragging {
    border-color: #2d7;
    background: #f0fff8;
  }
  .files {
    list-style: decimal inside;
    margin: 0.5rem 0 0;
    padding: 0;
    font-size: 0.9rem;
    color: #444;
  }
  .warn {
    color: #c0392b;
  }
</style>
