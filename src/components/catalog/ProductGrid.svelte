<script lang="ts">
  import ProductCardItem from '../ProductCardItem.svelte';
  import type { ProductDisplay } from '../../types/productType';
  
  export let products: ProductDisplay[] = [];
  export let isBigScreen: boolean = false;
</script>

<!-- Products Grid with improved spacing -->
<section aria-label="Lista de productos">
  {#if products.length > 0}
    {#if isBigScreen}
      <!-- Grid responsive para pantallas grandes con mejor espaciado -->
      <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {#each products as product (product.id)}
          <ProductCardItem {product} />
        {/each}
      </div>
    {:else}
      <!-- Grid de 1 columna para pantallas pequeñas con ancho controlado -->
      <!-- max width de 336 px para los product cards -->
      <div class="max-w-84 mx-auto">
        <div class="grid grid-cols-1 gap-6">
          {#each products as product (product.id)}
            <ProductCardItem {product} />
          {/each}
        </div>
      </div>
    {/if}
  {/if}
</section>
