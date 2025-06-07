<script lang="ts">
  import { X } from '@lucide/svelte';
  import type { Product } from '../types/productType';

  interface Props {
    isOpen: boolean;
    products: Product[];
    groupName: string;
    onClose: () => void;
  }

  let { isOpen = $bindable(), products, groupName, onClose }: Props = $props();

  // Modal state using $state rune
  let selectedProduct = $state(products[0]);
  let selectedImageUrl = $state(products[0]?.imageurl || '');

  // Update selected product when props change using $effect
  $effect(() => {
    if (products.length > 0) {
      selectedProduct = products[0];
      selectedImageUrl = products[0].imageurl;
    }
  });

  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(price);
  };

  // Get unique flavors from products using $derived
  const flavors = $derived(
    products
      .filter(p => p.flavor)
      .map(p => ({ flavor: p.flavor!, product: p }))
      .filter((item, index, self) =>
        index === self.findIndex(t => t.flavor === item.flavor)
      )
  );

  // Get unique sizes from products using $derived
  const sizes = $derived(
    products
      .map(p => ({ size: p.size, product: p }))
      .filter((item, index, self) =>
        index === self.findIndex(t => t.size === item.size)
      )
  );

  // Handle flavor selection
  function selectFlavor(flavorProduct: Product) {
    selectedProduct = flavorProduct;
    selectedImageUrl = flavorProduct.imageurl;
  }

  // Handle size selection
  function selectSize(sizeProduct: Product) {
    selectedProduct = sizeProduct;
    selectedImageUrl = sizeProduct.imageurl;
  }

  // Handle modal close
  function handleClose() {
    isOpen = false;
    onClose();
  }

  // Handle backdrop click
  function handleBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  }

  // Handle backdrop keyboard events
  function handleBackdropKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      handleClose();
    }
  }

  // Get stock status
  function getStockStatus(stock: number) {
    if (stock <= 0) return { text: 'Agotado', class: 'text-red-600 bg-red-50' };
    if (stock <= 5) return { text: 'Pocas existencias', class: 'text-yellow-600 bg-yellow-50' };
    return { text: 'En stock', class: 'text-green-600 bg-green-50' };
  }
</script>

{#if isOpen}
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <dialog
    class="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4 m-0 max-w-none max-h-none w-full h-full"
    open={isOpen}
    aria-labelledby="modal-title"
    onclick={handleBackdropClick}
    onkeydown={handleBackdropKeydown}
 >
    <div
      class="bg-white rounded-lg shadow-xl max-w-3xl sm:mx-4 md:mx-8 w-full max-h-[85vh] overflow-y-auto"
      role="document"
    >
      <div class="flex items-center justify-end p-3 border-gray-200">
        <button
          onclick={handleClose}
          class="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Cerrar modal"
          type="button"
        >
          <X class="h-5 w-5 text-gray-500" />
        </button>
      </div>

      <!-- Nombre del producto arriba de la imagen -->
      <div class="px-6 pt-2 pb-4 text-center">
        <h2 class="text-xl font-bold text-black font-sans" id="modal-title">
          {groupName}
        </h2>
      </div>

      <div class="p-6 pt-0">
        <div class="flex flex-col sm:flex-row gap-6">
          <div class="flex-shrink-0">
            <div class="w-64 h-64 sm:h-68 sm:w-68 md:h-72 md:w-72 mx-auto bg-white rounded-lg overflow-hidden flex items-center justify-center">
              <img
                src={selectedImageUrl}
                alt={selectedProduct?.imagealt || groupName}
                class="w-full h-full object-contain"
                loading="lazy"
              />
            </div>
          </div>

          <div class="flex-1 space-y-4">
            <!-- Marca del producto en círculo -->
            <div class="mb-4">
              <span class="inline-block text-black border border-black px-4 py-2 rounded-full font-semibold text-lg font-sans">
                {selectedProduct?.brand || products[0]?.brand}
              </span>
            </div>

            {#if flavors.length > 0}
              <div>
                <h3 class="text-sm font-medium text-gray-900 mb-2 font-sans">Sabor</h3>
                <div class="flex flex-wrap gap-2" role="radiogroup" aria-label="Seleccionar sabor">
                  {#each flavors as { flavor, product }}
                    <button
                      onclick={() => selectFlavor(product)}
                      class="px-3 py-1 text-sm font-medium rounded-md border transition-colors font-sans {
                        selectedProduct?.flavor === flavor
                          ? 'bg-black/90 text-white border-black'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }"
                      role="radio"
                      aria-checked={selectedProduct?.flavor === flavor}
                      type="button"
                    >
                      {flavor}
                    </button>
                  {/each}
                </div>
              </div>
            {/if}

            {#if sizes.length > 0}
              <div>
                <h3 class="text-sm font-medium text-gray-900 mb-2 font-sans">Tamaño</h3>
                <div class="flex flex-wrap gap-2" role="radiogroup" aria-label="Seleccionar tamaño">
                  {#each sizes as { size, product }}
                    <button
                      onclick={() => selectSize(product)}
                      class="px-3 py-1 text-sm font-medium rounded-md border transition-colors font-sans {
                        selectedProduct?.size === size
                          ? 'bg-black/90 text-white border-black'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }"
                      role="radio"
                      aria-checked={selectedProduct?.size === size}
                      type="button"
                    >
                      {size}
                    </button>
                  {/each}
                </div>
              </div>
            {/if}

            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-medium text-gray-900 mb-1 font-sans">Precio</h3>
                <p class="text-2xl font-bold text-black font-sans">
                  {selectedProduct ? formatPrice(selectedProduct.price) : ''}
                </p>
              </div>

              <!-- {#if selectedProduct}
                {@const stockStatus = getStockStatus(selectedProduct.stock)}
                <div class="text-right">
                  <h3 class="text-sm font-medium text-gray-900 mb-1 font-sans">Disponibilidad</h3>
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium font-sans {stockStatus.class}">
                    {stockStatus.text}
                  </span>
                </div>
              {/if} -->
            </div>

            <div class="pt-2">
              <a
                href="/contact"
                class="w-full inline-flex items-center justify-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-all duration-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-sans"
              >
                Contáctanos
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </dialog>
{/if}