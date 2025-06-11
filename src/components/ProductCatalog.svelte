<script lang="ts">
  import { onMount } from 'svelte';
  import SearchBar from './catalog/SearchBar.svelte';
  import FilterSection from './catalog/FilterSection.svelte';
  import ClearFiltersButton from './catalog/ClearFiltersButton.svelte';
  import ProductGrid from './catalog/ProductGrid.svelte';
  import EmptyState from './catalog/EmptyState.svelte';
  import type { ProductDisplay, GroupedProduct } from '../types/productType';
  import { groupProducts, searchGroupedProducts, filterGroupedProducts } from '../lib/products';
  
  // Component props using Svelte 5 syntax
  interface Props {
    products: ProductDisplay[];
    categories: string[];
    brands: string[];
    initialCategory?: string;
    initialBrand?: string;
  }

  let { products, categories, brands, initialCategory = '', initialBrand = '' }: Props = $props();

  // Debug log to see what we're receiving
  console.log("Svelte component received:", { initialCategory, initialBrand });

  // Reactive state variables using $state - Initialize with URL params immediately
  let searchTerm = $state('');
  let selectedCategory = $state(
    typeof window !== 'undefined' 
      ? new URLSearchParams(window.location.search).get('category') || initialCategory || ''
      : initialCategory || ''
  );
  let selectedBrand = $state(
    typeof window !== 'undefined' 
      ? new URLSearchParams(window.location.search).get('brand') || initialBrand || ''
      : initialBrand || ''
  );
  let isBigScreen = $state(false);
  let filterIsBig = $state(false);

  // Group products using $derived
  let groupedProducts = $derived(groupProducts(products));

  // Filter products using $derived - Fixed IIFE syntax
  let filteredGroupedProducts = $derived((() => {
    let filtered = [...groupedProducts];

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = searchGroupedProducts(filtered, searchTerm);
    }

    // Apply category and brand filters
    return filterGroupedProducts(filtered, selectedCategory, selectedBrand);
  })());

  // Screen size detection
  function checkScreenSize() {
    isBigScreen = window.innerWidth >= 450;
    filterIsBig = window.innerWidth >= 600;
  }

  // Update URL when filters change
  function updateURL() {
    if (typeof window === 'undefined') return;
    
    const url = new URL(window.location.href);
    
    // Update or remove category parameter
    if (selectedCategory) {
      url.searchParams.set('category', selectedCategory);
    } else {
      url.searchParams.delete('category');
    }
    
    // Update or remove brand parameter  
    if (selectedBrand) {
      url.searchParams.set('brand', selectedBrand);
    } else {
      url.searchParams.delete('brand');
    }
    
    // Update browser URL without triggering navigation
    window.history.replaceState({}, '', url.toString());
  }

  // Watch for filter changes and update URL (but only after initial load)
  let isInitialized = $state(false);
  $effect(() => {
    if (isInitialized) {
      updateURL();
    }
  });

  onMount(() => {
    // Check screen size
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    // Read URL params and update state if needed (client-side hydration fix)
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    const brandParam = urlParams.get('brand');
    
    console.log("Client-side URL params on mount:", { categoryParam, brandParam });
    
    // Update state if URL params exist and are different
    if (categoryParam && categoryParam !== selectedCategory) {
      selectedCategory = categoryParam;
    }
    if (brandParam && brandParam !== selectedBrand) {
      selectedBrand = brandParam;
    }
    
    // Mark as initialized so URL updates can happen
    isInitialized = true;
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  });

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
    onclearfilters={clearFilters}
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