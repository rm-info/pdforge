<script lang="ts">
  import type { ParamSpec } from '$lib/registry/types';
  // valeurs pilotées par le schéma du descripteur -> type dynamique assumé
  let {
    params = [],
    values = $bindable({})
  }: { params?: ParamSpec[]; values?: Record<string, any> } = $props();

  // initialise les valeurs par défaut
  $effect(() => {
    for (const p of params) {
      if (!(p.key in values) && p.default !== undefined) values[p.key] = p.default;
    }
  });
</script>

{#each params as p (p.key)}
  <label class="field">
    <span>{p.label}</span>
    {#if p.type === 'select'}
      <select bind:value={values[p.key]}>
        {#each p.options ?? [] as o (o.value)}
          <option value={o.value}>{o.label}</option>
        {/each}
      </select>
    {:else if p.type === 'bool'}
      <input type="checkbox" bind:checked={values[p.key]} />
    {:else if p.type === 'number'}
      <input type="number" min={p.min} max={p.max} bind:value={values[p.key]} />
    {:else if p.type === 'pageRange'}
      <input type="text" placeholder="ex: 1-3,5,8-10" bind:value={values[p.key]} />
    {:else}
      <input type="text" bind:value={values[p.key]} />
    {/if}
  </label>
{/each}

<style>
  .field {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    margin-bottom: 0.75rem;
  }
</style>
