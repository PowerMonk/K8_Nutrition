<script lang="ts">
  import GroupedProductCard from '../GroupedProductCard.svelte';
  import ProductModal from '../ProductModal.svelte';
  import type { GroupedProduct } from '../../types/productType';
  
  interface Props {
    groupedProducts: GroupedProduct[];
    isBigScreen: boolean;
  }

  let { groupedProducts, isBigScreen }: Props = $props();

  // Modal state
  let isModalOpen = $state(false);
  let selectedGroup: GroupedProduct | null = $state(null);

  // Handle product card click
  function handleProductClick(group: GroupedProduct) {
    selectedGroup = group;
    isModalOpen = true;
  }

  // Handle modal close
  function handleModalClose() {
    isModalOpen = false;
    selectedGroup = null;
  }
</script>

<!-- Products Grid with improved spacing -->
<section aria-label="Lista de productos">
  {#if groupedProducts.length > 0}
    {#if isBigScreen}
      <!-- Grid responsive para pantallas grandes con mejor espaciado -->
      <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {#each groupedProducts as group (group.id)}
          <GroupedProductCard {group} onclick={handleProductClick} />
        {/each}
      </div>
    {:else}
      <!-- Grid de 1 columna para pantallas pequeñas con ancho controlado -->
      <!-- max width de 336 px para los product cards -->
      <div class="max-w-84 mx-auto">
        <div class="grid grid-cols-1 gap-6">
          {#each groupedProducts as group (group.id)}
            <GroupedProductCard {group} onclick={handleProductClick} />
          {/each}
        </div>
      </div>
    {/if}
  {/if}
</section>

<!-- Product Modal -->
{#if selectedGroup}
  <ProductModal
    bind:isOpen={isModalOpen}
    products={selectedGroup.products}
    groupName={selectedGroup.name}
    onClose={handleModalClose}
  />
{/if}
