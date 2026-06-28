<script lang="ts">
  import { dndzone } from 'svelte-dnd-action';
  import { flip } from 'svelte/animate';
  import { renderFirstPage } from '$lib/thumbnails';

  let {
    accept = ['application/pdf'],
    min = 1,
    max = 0,
    files = $bindable([])
  }: { accept?: string[]; min?: number; max?: number; files?: File[] } = $props();

  type Entry = { id: string; file: File; thumb: string | null };

  let entries = $state<Entry[]>([]);
  let dragging = $state(false);

  const fileKey = (f: File) => `${f.name}:${f.size}`;
  let reorderable = $derived(max !== 1);

  function accepted(list: File[]): File[] {
    return list.filter(
      (f) =>
        accept.length === 0 ||
        accept.includes(f.type) ||
        (accept.includes('application/pdf') && f.name.toLowerCase().endsWith('.pdf'))
    );
  }

  // Ajout CUMULATIF (dédup nom+taille, borné par max) ; mono-fichier remplace.
  function addFiles(incoming: File[]) {
    const add = accepted(incoming);
    if (max === 1) {
      entries = add.slice(0, 1).map((f) => ({ id: fileKey(f), file: f, thumb: null }));
    } else {
      const seen = new Set(entries.map((e) => e.id));
      const next = [...entries];
      for (const f of add) {
        const id = fileKey(f);
        if (!seen.has(id)) {
          next.push({ id, file: f, thumb: null });
          seen.add(id);
        }
      }
      entries = max > 0 ? next.slice(0, max) : next;
    }
    void renderThumbs();
  }

  async function renderThumbs() {
    for (const e of entries) {
      if (e.thumb === null) {
        try {
          e.thumb = await renderFirstPage(e.file);
        } catch {
          e.thumb = ''; // échec de rendu -> placeholder
        }
      }
    }
  }

  function onChange(ev: Event) {
    const input = ev.target as HTMLInputElement;
    if (input.files?.length) addFiles(Array.from(input.files));
    input.value = ''; // permet de re-sélectionner les mêmes fichiers / un autre lot
  }

  function onDrop(ev: DragEvent) {
    ev.preventDefault();
    dragging = false;
    if (ev.dataTransfer?.files?.length) addFiles(Array.from(ev.dataTransfer.files));
  }

  function removeEntry(id: string) {
    entries = entries.filter((e) => e.id !== id);
  }

  function handleDnd(ev: CustomEvent<{ items: Entry[] }>) {
    entries = ev.detail.items;
  }

  // L'ordre des cartes = l'ordre des fichiers passés à l'outil (fusion).
  $effect(() => {
    files = entries.map((e) => e.file);
  });

  let valid = $derived(files.length >= min && (max === 0 || files.length <= max));
</script>

{#snippet cardInner(e: Entry)}
  {#if e.thumb}
    <img src={e.thumb} alt={e.file.name} draggable="false" />
  {:else if e.thumb === ''}
    <div class="ph">PDF</div>
  {:else}
    <div class="ph">…</div>
  {/if}
  <span class="name" title={e.file.name}>{e.file.name}</span>
  <button type="button" class="rm" onclick={() => removeEntry(e.id)} aria-label="Retirer {e.file.name}">
    ×
  </button>
{/snippet}

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
  {#if entries.length === 0}
    <span>Glissez vos PDF ici, ou cliquez pour parcourir (min {min}{max ? `, max ${max}` : ''})</span>
  {:else}
    <span>{entries.length} fichier(s) — ajoutez-en d'autres ou déposez un nouveau lot</span>
  {/if}
</label>

{#if entries.length > 0}
  {#if reorderable}
    <section
      class="grid"
      use:dndzone={{ items: entries, flipDurationMs: 150 }}
      onconsider={handleDnd}
      onfinalize={handleDnd}
    >
      {#each entries as e (e.id)}
        <div class="card" animate:flip={{ duration: 150 }}>{@render cardInner(e)}</div>
      {/each}
    </section>
    {#if entries.length > 1}
      <p class="hint">Glissez les vignettes pour choisir l'ordre de fusion.</p>
    {/if}
  {:else}
    <div class="grid">
      {#each entries as e (e.id)}
        <div class="card">{@render cardInner(e)}</div>
      {/each}
    </div>
  {/if}
{/if}
{#if entries.length > 0 && !valid}
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
  .grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-top: 0.75rem;
  }
  .card {
    position: relative;
    width: 120px;
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 0.4rem;
    background: #fff;
    cursor: grab;
    text-align: center;
  }
  .card img {
    width: 100%;
    height: auto;
    border: 1px solid #eee;
    display: block;
  }
  .card .ph {
    height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #aaa;
    background: #f6f6f6;
  }
  .card .name {
    display: block;
    margin-top: 0.3rem;
    font-size: 0.75rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .card .rm {
    position: absolute;
    top: 2px;
    right: 2px;
    border: 0;
    background: rgba(255, 255, 255, 0.9);
    color: #c0392b;
    font-size: 1rem;
    line-height: 1;
    border-radius: 50%;
    width: 1.4rem;
    height: 1.4rem;
    cursor: pointer;
  }
  .hint {
    font-size: 0.85rem;
    color: #888;
    margin: 0.5rem 0 0;
  }
  .warn {
    color: #c0392b;
  }
</style>
