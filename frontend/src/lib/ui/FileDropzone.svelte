<script lang="ts">
  let {
    accept = ['application/pdf'],
    min = 1,
    max = 0,
    files = $bindable([])
  }: { accept?: string[]; min?: number; max?: number; files?: File[] } = $props();

  let dragging = $state(false);

  const fileKey = (f: File) => `${f.name}:${f.size}`;

  // Garde les fichiers compatibles (type MIME, ou extension .pdf en repli quand
  // le navigateur ne renseigne pas le type).
  function accepted(list: File[]): File[] {
    return list.filter(
      (f) =>
        accept.length === 0 ||
        accept.includes(f.type) ||
        (accept.includes('application/pdf') && f.name.toLowerCase().endsWith('.pdf'))
    );
  }

  // Ajout CUMULATIF : chaque lot s'ajoute aux précédents (dédup par nom+taille),
  // borné par `max`. Les outils mono-fichier (max === 1) remplacent.
  function addFiles(incoming: File[]) {
    const add = accepted(incoming);
    if (max === 1) {
      files = add.slice(0, 1);
      return;
    }
    const seen = new Set(files.map(fileKey));
    const merged = [...files];
    for (const f of add) {
      if (!seen.has(fileKey(f))) {
        merged.push(f);
        seen.add(fileKey(f));
      }
    }
    files = max > 0 ? merged.slice(0, max) : merged;
  }

  function onChange(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files?.length) addFiles(Array.from(input.files));
    // Réinitialise pour pouvoir re-sélectionner les mêmes fichiers / un autre lot.
    input.value = '';
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    dragging = false;
    if (e.dataTransfer?.files?.length) addFiles(Array.from(e.dataTransfer.files));
  }

  function removeAt(i: number) {
    files = files.filter((_, idx) => idx !== i);
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
    <span>{files.length} fichier(s) — ajoutez-en d'autres ou déposez un nouveau lot</span>
  {/if}
</label>

{#if files.length > 0}
  <ul class="files">
    {#each files as f, i (fileKey(f))}
      <li>
        <span class="num">{i + 1}.</span>
        <span class="name">{f.name}</span>
        <button type="button" class="rm" onclick={() => removeAt(i)} aria-label="Retirer {f.name}">
          ×
        </button>
      </li>
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
    transition:
      border-color 0.15s,
      background 0.15s;
  }
  .dropzone.dragging {
    border-color: #2d7;
    background: #f0fff8;
  }
  .files {
    list-style: none;
    margin: 0.5rem 0 0;
    padding: 0;
    font-size: 0.9rem;
    color: #444;
  }
  .files li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.25rem 0;
    border-bottom: 1px solid #eee;
  }
  .files .num {
    color: #888;
    min-width: 1.5rem;
  }
  .files .name {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .files .rm {
    border: 0;
    background: transparent;
    color: #c0392b;
    font-size: 1.1rem;
    line-height: 1;
    cursor: pointer;
    padding: 0 0.4rem;
  }
  .warn {
    color: #c0392b;
  }
</style>
