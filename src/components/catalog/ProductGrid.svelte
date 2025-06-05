<script lang="ts">
  import ProductCardItem from '../ProductCardItem.svelte';
  
  // Define product interface to match the real data structure
  interface Product {
    title: string;
    subtitle: string;
    price: number;
    category: string;
    image: string;
    imageAlt: string;
    brand: string;
  }
  
  export let products: Product[] = [];
  export let isBigScreen: boolean = false;
</script>

<!-- Products Grid with improved spacing -->
<section aria-label="Lista de productos">
  {#if products.length > 0}
    {#if isBigScreen}
      <!-- Grid responsive para pantallas grandes con mejor espaciado -->
      <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {#each products as product (product.title)}
          <ProductCardItem {...product} />
        {/each}
      </div>
    {:else}
      <!-- Grid de 1 columna para pantallas pequeñas con ancho controlado -->
       <!-- max width de 336 px para los product cards -->
      <div class="max-w-84 mx-auto">
        <div class="grid grid-cols-1 gap-6">
          {#each products as product (product.title)}
            <ProductCardItem {...product} />
          {/each}
        </div>
      </div>
    {/if}
  {/if}
</section>
