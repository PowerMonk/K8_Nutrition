<script lang="ts">
  export let searchTerm: string = '';
</script>

<!-- Search Bar Component -->
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
