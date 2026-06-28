<script lang="ts">
  import type { ToolDescriptor } from '$lib/registry/types';
  let { tool }: { tool: ToolDescriptor } = $props();
</script>

<a class="card" href={`/tool/${tool.id}`}>
  <strong>{tool.name}</strong>
  <small>{tool.runtime === 'client' ? 'local' : 'serveur'}</small>
</a>

<style>
  .card {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    text-decoration: none;
    color: inherit;
  }
  .card:hover {
    border-color: #2d7;
  }
  small {
    color: #888;
  }
</style>
