<script lang="ts">
    // Schedules a function to run as soon as the component has been mounted to the DOM. 
    // Unlike $effect, the provided function only runs once.
  import { onMount } from 'svelte';
  import SearchBar from './catalog/SearchBar.svelte';
  import FilterSection from './catalog/FilterSection.svelte';
  import ClearFiltersButton from './catalog/ClearFiltersButton.svelte';
  import ProductGrid from './catalog/ProductGrid.svelte';
  import EmptyState from './catalog/EmptyState.svelte';
  import type { ProductDisplay } from '../types/productType';
  
  // Component props
  export let products: ProductDisplay[] = [];
  export let categories: string[] = [];
  export let brands: string[] = [];

  // Reactive state variables
  let searchTerm = '';
  let selectedCategory = '';
  let selectedBrand = '';
  let filteredProducts: ProductDisplay[] = [];
  let isBigScreen = false;
  let filterIsBig = false;

  // Screen size detection with optimized breakpoints
  function checkScreenSize() {
    isBigScreen = window.innerWidth >= 450;
    filterIsBig = window.innerWidth >= 600; 
  }

  onMount(() => {
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  });

  // Utility function to normalize text (remove accents and convert to lowercase)
  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, ''); // Remove diacritics/accents
  };

  // Reactive filter function with working brand filtering and proper trimming
  $: {
    filteredProducts = products.filter((product) => {
      const normalizedTitle = normalizeText(product.displayName);
      // const normalizedSubtitle = normalizeText(product.displaySubtitle);
      const normalizedCategory = normalizeText(product.category.trim());
      const normalizedBrand = normalizeText(product.brand.trim());
      const normalizedSearchTerm = normalizeText(searchTerm.trim());

      const matchesSearch = !normalizedSearchTerm || 
        normalizedTitle.includes(normalizedSearchTerm); 
        // || normalizedSubtitle.includes(normalizedSearchTerm);

      const matchesCategory = !selectedCategory || 
        normalizedCategory === normalizeText(selectedCategory.trim());

      const matchesBrand = !selectedBrand || 
        normalizedBrand === normalizeText(selectedBrand.trim());

      return matchesSearch && matchesCategory && matchesBrand;
    });
  }

  // Clear all filters
  const clearFilters = () => {
    searchTerm = '';
    selectedCategory = '';
    selectedBrand = '';
  };
</script>

<!-- Search and Filters Section -->
<section class="mb-12" aria-label="Búsqueda y filtros de productos">
  <SearchBar bind:searchTerm />
  <FilterSection 
    {categories} 
    {brands} 
    bind:selectedCategory 
    bind:selectedBrand 
    {filterIsBig} 
  />
  <ClearFiltersButton 
    {searchTerm} 
    {selectedCategory} 
    {selectedBrand} 
    on:clearFilters={clearFilters} 
  />
</section>

<!-- Products Display -->
{#if filteredProducts.length > 0}
  <ProductGrid products={filteredProducts} {isBigScreen} />
{:else}
  <EmptyState 
    {searchTerm} 
    {selectedCategory} 
    {selectedBrand} 
    onclearfilters={clearFilters}
  />
{/if}