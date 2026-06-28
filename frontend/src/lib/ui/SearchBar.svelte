<script lang="ts">
  let { query = $bindable('') }: { query?: string } = $props();
</script>

<input class="search" type="search" placeholder="Rechercher un outil…" bind:value={query} />

<style>
  .search {
    width: 100%;
    padding: 0.6rem;
    border: 1px solid #ccc;
    border-radius: 6px;
  }
</style>
