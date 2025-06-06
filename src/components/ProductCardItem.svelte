<script lang="ts">
  import type { ProductDisplay } from '../types/productType';

  // Product props - expect a ProductDisplay object
  export let product: ProductDisplay;

  // Format price for display
  const formattedPrice = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(product.price);
</script>

<!-- Product Card Component with consistent height -->
<div class="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 overflow-hidden h-full flex flex-col">
  <!-- Product Image -->
  <div class="aspect-square overflow-hidden bg-gray-50 flex items-center justify-center">
    <img
      src={product.imageurl}
      alt={product.imagealt}
      class="w-full h-full object-contain"
      loading="lazy"
    />
  </div>

  <!-- Product Content with flex-grow to push price to bottom -->
  <div class="p-4 flex flex-col flex-grow">
    <!-- Product Title with consistent height -->
    <h3 class="text-lg font-semibold mb-4 text-black font-sans line-clamp-2 flex items-start">
      {product.displayName}
    </h3>

    <!-- Spacer to push price section to bottom -->
    <div class="flex-grow"></div>

    <!-- Product Price and Category - always at bottom -->
    <div class="flex items-center justify-between mt-auto">
      <span class="text-lg sm:text-xl font-bold text-black font-sans">
        {formattedPrice}
      </span>
      <!-- Category Badge with smaller size -->
      <span class="inline-block px-2 py-2 text-xs font-medium font-sans bg-blue-50 text-blue-600 rounded-full shrink-0">
        {product.category}
      </span>
    </div>
  </div>
</div>
