<script lang="ts">
  import type { GroupedProduct } from '../types/productType';

  interface Props {
    group: GroupedProduct;
    onclick: (group: GroupedProduct) => void;
  }

  let { group, onclick }: Props = $props();

  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(price);
  };

  // Calculate price range using $derived
  const priceDisplay = $derived((() => {
    const prices = group.products.map((p) => p.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    if (minPrice === maxPrice) {
      return formatPrice(minPrice);
    }

    return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
  })());

  // Handle card click
  function handleClick() {
    onclick(group);
  }
</script>

<!-- Grouped Product Card Component -->
<button
  type="button"
  onclick={handleClick}
  class="w-full bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 overflow-hidden h-full flex flex-col focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
>
  <!-- Product Image -->
  <div class="aspect-square overflow-hidden bg-gray-50 flex items-center justify-center">
    <img
      src={group.imageurl}
      alt={group.imagealt}
      class="w-full h-full object-contain"
      loading="lazy"
    />
  </div>

  <!-- Product Content -->
  <div class="p-4 flex flex-col flex-grow">
    <!-- Product Name (el nombre ya incluye la marca si es necesario) -->
    <h3 class="text-lg font-semibold mb-4 text-black font-sans line-clamp-2 flex items-start text-left">
      {group.name}
    </h3>

    <!-- Spacer to push price section to bottom -->
    <div class="flex-grow"></div>

    <!-- Product Price Range and Category - always at bottom -->
    <div class="flex items-center justify-between mt-auto">
      <span class="text-lg sm:text-xl font-bold text-black font-sans">
        {priceDisplay}
      </span>
      <!-- Category Badge -->
      <span class="inline-block px-2 py-2 text-xs font-medium font-sans bg-blue-50 text-blue-600 rounded-full shrink-0">
        {group.category}
      </span>
    </div>

    <!-- Product variants indicator -->
    {#if group.products.length > 1}
      <div class="mt-2 text-xs text-gray-500 font-sans text-center">
        {group.products.length} variantes disponibles
      </div>
    {/if}
  </div>
</button>