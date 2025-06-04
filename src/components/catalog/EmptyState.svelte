<script lang="ts">
  // Using $props rune instead of export let
  let { searchTerm = '', selectedCategory = '', selectedBrand = '', onclearfilters } = $props();
  
  // Using $derived rune instead of $: reactive statement
  const hasActiveFilters = $derived(searchTerm || selectedCategory || selectedBrand);
  
  // Function to handle clear filters - now calls the callback prop
  const clearFilters = () => {
    onclearfilters?.();
  };
</script>

<!-- Empty State -->
<div class="text-center py-12">
  <div class="mx-auto w-24 h-24 mb-4">
    <svg class="w-full h-full text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
  </div>
  <h3 class="text-lg font-medium text-gray-900 mb-2 font-sans">
    No se encontraron productos
  </h3>
  <p class="text-gray-500 text-base font-sans mb-4">
    No hay productos que coincidan con tu búsqueda actual.
  </p>
  {#if hasActiveFilters}
    <button
      type="button"
      onclick={clearFilters}
      class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-sans"
    >
      Limpiar filtros
    </button>
  {/if}
</div>
