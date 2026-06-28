<script lang="ts">
  import { tools, categories } from '$lib/registry';
  import ToolCard from '$lib/ui/ToolCard.svelte';
  import SearchBar from '$lib/ui/SearchBar.svelte';
  import CategoryNav from '$lib/ui/CategoryNav.svelte';

  let query = $state('');
  let selected = $state<string | null>(null);

  let filtered = $derived(
    tools.filter(
      (t) =>
        (selected === null || t.category === selected) &&
        t.name.toLowerCase().includes(query.toLowerCase())
    )
  );
</script>

<h1>pdforge</h1>
<SearchBar bind:query />
<CategoryNav {categories} bind:selected />

<div class="grid">
  {#each filtered as t (t.id)}
    <ToolCard tool={t} />
  {/each}
</div>

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }
</style>
