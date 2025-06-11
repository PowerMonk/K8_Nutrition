<script lang="ts">
  import { Search } from '@lucide/svelte';

  interface Props {
    searchTerm: string;
  }

  let { searchTerm = $bindable() }: Props = $props();
</script>

<!-- Search Bar Component -->
<div class="mb-6">
  <label for="search-input" class="block text-sm font-medium text-gray-700 mb-2 font-sans">
    Buscar productos
  </label>
  <div class="relative">
    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Search class="h-5 w-5 text-gray-400" />
    </div>
    <input
      id="search-input"
      type="text"
      bind:value={searchTerm}
      placeholder="Buscar por nombre, marca o sabor..."
      class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-sans"
    />
  </div>
</div>
