<script lang="ts">
  
  interface Props {
    searchTerm: string;
    selectedCategory: string;
    selectedBrand: string;
    onclearfilters: () => void;
  }

  let { searchTerm = '', selectedCategory = '', selectedBrand = '', onclearfilters }: Props = $props();
  
  // Using $derived rune instead of $: reactive statement
  const hasActiveFilters = $derived(searchTerm || selectedCategory || selectedBrand);
  
  // Function to handle clear filters - now calls the callback prop
  const clearFilters = () => {
    onclearfilters?.();
  };
</script>

<!-- Clear Filters Button -->
{#if hasActiveFilters}
  <div class="text-center mt-4">
    <button
      type="button"
      onclick={clearFilters}
      class="text-sm text-blue-600 hover:text-blue-700 font-medium font-sans underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
    >
      Limpiar filtros
    </button>
  </div>
{/if}
