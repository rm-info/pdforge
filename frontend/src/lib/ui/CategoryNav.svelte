<script lang="ts">
  let {
    categories = [],
    selected = $bindable(null)
  }: { categories?: string[]; selected?: string | null } = $props();
</script>

<nav class="cats">
  <button class:active={selected === null} onclick={() => (selected = null)}>Tous</button>
  {#each categories as c (c)}
    <button class:active={selected === c} onclick={() => (selected = c)}>{c}</button>
  {/each}
</nav>

<style>
  .cats {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin: 1rem 0;
  }
  button {
    padding: 0.4rem 0.8rem;
    border: 1px solid #ccc;
    background: #fff;
    border-radius: 999px;
    cursor: pointer;
  }
  button.active {
    background: #2d7;
    color: #fff;
    border-color: #2d7;
  }
</style>
