<script lang="ts">
  let { active = false }: { active?: boolean } = $props();
</script>

{#if active}
  <div class="bar" role="progressbar" aria-label="Traitement en cours"><span></span></div>
{/if}

<style>
  .bar {
    height: 4px;
    background: #eee;
    overflow: hidden;
  }
  .bar span {
    display: block;
    height: 100%;
    width: 40%;
    background: #2d7;
    animation: slide 1s infinite linear;
  }
  @keyframes slide {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(300%);
    }
  }
</style>
