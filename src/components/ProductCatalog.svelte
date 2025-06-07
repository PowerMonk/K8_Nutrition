<script lang="ts">
    // Schedules a function to run as soon as the component has been mounted to the DOM. 
    // Unlike $effect, the provided function only runs once.
  import { onMount } from 'svelte';  import SearchBar from './catalog/SearchBar.svelte';
  import FilterSection from './catalog/FilterSection.svelte';
  import ClearFiltersButton from './catalog/ClearFiltersButton.svelte';
  import ProductGrid from './catalog/ProductGrid.svelte';
  import EmptyState from './catalog/EmptyState.svelte';
  import type { ProductDisplay, GroupedProduct } from '../types/productType';
  import { groupProducts, searchGroupedProducts, filterGroupedProducts } from '../lib/products';
  
  // Component props
  export let products: ProductDisplay[] = [];
  export let categories: string[] = [];
  export let brands: string[] = [];

  // Reactive state variables
  let searchTerm = '';
  let selectedCategory = '';
  let selectedBrand = '';
  let groupedProducts: GroupedProduct[] = [];
  let filteredGroupedProducts: GroupedProduct[] = [];
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
  // Group products when component mounts or products change
  $: {
    groupedProducts = groupProducts(products);
  }

  // Reactive filter function with working brand filtering and proper trimming
  $: {
    // Start with all grouped products
    let filtered = [...groupedProducts];

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = searchGroupedProducts(filtered, searchTerm);
    }

    // Apply category and brand filters
    filteredGroupedProducts = filterGroupedProducts(filtered, selectedCategory, selectedBrand);
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
{#if filteredGroupedProducts.length > 0}
  <ProductGrid groupedProducts={filteredGroupedProducts} {isBigScreen} />
{:else}
  <EmptyState 
    {searchTerm} 
    {selectedCategory} 
    {selectedBrand} 
    onclearfilters={clearFilters}
  />
{/if}