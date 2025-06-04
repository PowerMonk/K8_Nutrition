<script lang="ts">
  export let categories: string[] = [];
  export let brands: string[] = [];
  export let selectedCategory: string = '';
  export let selectedBrand: string = '';
  export let filterIsBig: boolean = false;
</script>

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
