<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  export let searchTerm: string = '';
  export let selectedCategory: string = '';
  export let selectedBrand: string = '';
  
  const dispatch = createEventDispatcher();
  
  const clearFilters = () => {
    dispatch('clearFilters');
  };
  
  $: hasActiveFilters = searchTerm || selectedCategory || selectedBrand;
</script>

<!-- Clear Filters Button -->
{#if hasActiveFilters}
  <div class="text-center mt-4">
    <button
      type="button"
      on:click={clearFilters}
      class="text-sm text-blue-600 hover:text-blue-700 font-medium font-sans underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
    >
      Limpiar filtros
    </button>
  </div>
{/if}
