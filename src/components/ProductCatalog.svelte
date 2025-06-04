<script lang="ts">
    // Schedules a function to run as soon as the component has been mounted to the DOM. 
    // Unlike $effect, the provided function only runs once.
  import { onMount } from 'svelte';
  import ProductCardItem from './ProductCardItem.svelte';
  
  // Define product interface
  interface Product {
    title: string;
    subtitle: string;
    price: number;
    category: string;
    image: string;
    imageAlt: string;
  }

  // Component props
  export let products: Product[] = [];
  export let categories: string[] = [];
  export let brands: string[] = [];

  // Reactive state variables
  let searchTerm = '';
  let selectedCategory = '';
  let selectedBrand = '';
  let filteredProducts: Product[] = [];
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

  // Reactive filter function
  $: {
    filteredProducts = products.filter((product) => {
      const normalizedTitle = normalizeText(product.title);
      const normalizedSubtitle = normalizeText(product.subtitle);
      const normalizedCategory = normalizeText(product.category);
      const normalizedSearchTerm = normalizeText(searchTerm.trim());

      const matchesSearch = !normalizedSearchTerm || 
        normalizedTitle.includes(normalizedSearchTerm) || 
        normalizedSubtitle.includes(normalizedSearchTerm);

      const matchesCategory = !selectedCategory || 
        normalizedCategory === normalizeText(selectedCategory);

      // Note: Brand filtering would need product data to include brand information
      const matchesBrand = !selectedBrand; // Simplified for now

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
  <!-- Search Bar -->
  <div class="mb-8">
    <div class="relative max-w-md mx-auto">
      <label for="product-search" class="sr-only">Buscar productos</label>
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
      </div>
      <input
        type="search"
        id="product-search"
        name="search"
        placeholder="Buscar productos..."
        bind:value={searchTerm}
        class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-sans text-base"
      />
    </div>
  </div>

  <!-- Filter Selectors with improved spacing -->
  <div class="max-w-2xl mx-auto">
    {#if filterIsBig}
      <!-- Grid de 2 columnas para pantallas grandes (≥600px) -->
      <div class="grid grid-cols-2 gap-6">
        <!-- Category Filter -->
        <div class="space-y-2">
          <div class="flex items-center space-x-3">
            <span class="text-sm font-medium text-black font-sans whitespace-nowrap">
              Categoría:
            </span>
            <select
              id="category-filter"
              name="category"
              bind:value={selectedCategory}
              class="flex-1 block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-sans text-sm"
            >
              <option value="">Todas las categorías</option>
              {#each categories as category}
                <option value={category}>{category}</option>
              {/each}
            </select>
          </div>
        </div>

        <!-- Brand Filter -->
        <div class="space-y-2">
          <div class="flex items-center space-x-3">
            <span class="text-sm font-medium text-black font-sans whitespace-nowrap">
              Marca:
            </span>
            <select
              id="brand-filter"
              name="brand"
              bind:value={selectedBrand}
              class="flex-1 block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-sans text-sm"
            >
              <option value="">Todas las marcas</option>
              {#each brands as brand}
                <option value={brand}>{brand}</option>
              {/each}
            </select>
          </div>
        </div>
      </div>
    {:else}
      <!-- Grid de 2 columnas para pantallas pequeñas (<600px) con labels arriba -->
      <div class="grid grid-cols-2 gap-4">
        <!-- Category Filter -->
        <div class="space-y-2">
          <label for="category-filter-mobile" class="block text-sm font-medium text-black font-sans">
            Categoría:
          </label>
          <select
            id="category-filter-mobile"
            name="category"
            bind:value={selectedCategory}
            class="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-sans text-sm"
          >
            <option value="">Todas</option>
            {#each categories as category}
              <option value={category}>{category}</option>
            {/each}
          </select>
        </div>

        <!-- Brand Filter -->
        <div class="space-y-2">
          <label for="brand-filter-mobile" class="block text-sm font-medium text-black font-sans">
            Marca:
          </label>
          <select
            id="brand-filter-mobile"
            name="brand"
            bind:value={selectedBrand}
            class="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-sans text-sm"
          >
            <option value="">Todas</option>
            {#each brands as brand}
              <option value={brand}>{brand}</option>
            {/each}
          </select>
        </div>
      </div>
    {/if}
  </div>

  <!-- Clear Filters Button -->
  {#if searchTerm || selectedCategory || selectedBrand}
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
</section>

<!-- Products Grid with improved spacing -->
<section aria-label="Lista de productos">
  {#if filteredProducts.length > 0}
    {#if isBigScreen}
      <!-- Grid responsive para pantallas grandes con mejor espaciado -->
      <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {#each filteredProducts as product (product.title)}
          <ProductCardItem {...product} />
        {/each}
      </div>
    {:else}
      <!-- Grid de 1 columna para pantallas pequeñas con ancho controlado -->
      <div class="max-w-sm mx-auto">
        <div class="grid grid-cols-1 gap-6">
          {#each filteredProducts as product (product.title)}
            <ProductCardItem {...product} />
          {/each}
        </div>
      </div>
    {/if}
  {:else}
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
      {#if searchTerm || selectedCategory || selectedBrand}
        <button
          type="button"
          on:click={clearFilters}
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-sans"
        >
          Limpiar filtros
        </button>
      {/if}
    </div>
  {/if}
</section>