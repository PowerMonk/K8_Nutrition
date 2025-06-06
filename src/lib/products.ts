// filepath: src/lib/products.ts
import { supabase } from "./supabase.ts";
import type {
  Product,
  ProductDisplay,
  ProductFilters,
} from "../types/productType.ts";

/**
 * Product service class to manage data fetching and caching
 */
class ProductService {
  private productsCache: ProductDisplay[] | null = null;
  private cacheExpiry: number = 0;
  private readonly CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

  /**
   * Transform product to display format with combined name
   */
  private transformToDisplayProduct(product: Product): ProductDisplay {
    const displayName = product.flavor
      ? `${product.name} ${product.flavor}`
      : product.name;

    return {
      ...product,
      displayName,
    };
  }

  /**
   * Check if cache is valid
   */
  private isCacheValid(): boolean {
    return this.productsCache !== null && Date.now() < this.cacheExpiry;
  }

  /**
   * Fetch products from Supabase
   */
  private async fetchProductsFromAPI(): Promise<ProductDisplay[]> {
    try {
      const { data, error } = await supabase
        .from("products")
        .select(
          "id, name, brand, flavor, category, size, price, stock, fragile, description, imageurl, imagealt, active"
        )
        .eq("active", true)
        .order("name");

      if (error) {
        console.error("Error fetching products:", error);
        throw new Error("Failed to fetch products");
      }

      if (!data) {
        return [];
      }

      // Transform to display format
      return data.map((product) => this.transformToDisplayProduct(product));
    } catch (error) {
      console.error("Error in fetchProductsFromAPI:", error);
      throw error;
    }
  }

  /**
   * Get all active products with caching
   */
  public async getAllProducts(): Promise<ProductDisplay[]> {
    // Check cache validity
    if (this.isCacheValid()) {
      return this.productsCache!;
    }

    // Fetch fresh data
    const displayProducts = await this.fetchProductsFromAPI();

    // Update cache
    this.productsCache = displayProducts;
    this.cacheExpiry = Date.now() + this.CACHE_DURATION;

    return displayProducts;
  }

  /**
   * Get unique categories and brands for filters
   * Uses cached data from getAllProducts to avoid duplicate API calls
   */
  public async getProductFilters(): Promise<ProductFilters> {
    // Ensure we have products data (will use cache if available)
    const products = await this.getAllProducts();

    // Extract and clean categories with trim() to avoid duplicates from whitespace
    const categories = [
      ...new Set(
        products
          .map((p) => p.category.trim())
          .filter((category) => category.length > 0)
      ),
    ].sort();

    // Extract and clean brands with trim() to avoid duplicates from whitespace
    const brands = [
      ...new Set(
        products.map((p) => p.brand.trim()).filter((brand) => brand.length > 0)
      ),
    ].sort();

    return { categories, brands };
  }

  /**
   * Search products by name, brand, or flavor
   */
  public searchProducts(
    products: ProductDisplay[],
    query: string
  ): ProductDisplay[] {
    if (!query.trim()) return products;

    const normalizedQuery = query
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    return products.filter((product) => {
      const searchableText = `${product.displayName} ${product.brand} ${
        product.flavor || ""
      }`.toLowerCase();
      const normalizedText = searchableText
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      return normalizedText.includes(normalizedQuery);
    });
  }

  /**
   * Filter products by category and brand
   */
  public filterProducts(
    products: ProductDisplay[],
    selectedCategory: string,
    selectedBrand: string
  ): ProductDisplay[] {
    return products.filter((product) => {
      const categoryMatch =
        !selectedCategory ||
        product.category.trim() === selectedCategory.trim();
      const brandMatch =
        !selectedBrand || product.brand.trim() === selectedBrand.trim();
      return categoryMatch && brandMatch;
    });
  }

  /**
   * Clear products cache (useful for development or forced refresh)
   */
  public clearProductsCache(): void {
    this.productsCache = null;
    this.cacheExpiry = 0;
  }
}

// Create and export singleton instance
const productService = new ProductService();

// Export public methods
export const getAllProducts = () => productService.getAllProducts();
export const getProductFilters = () => productService.getProductFilters();
export const searchProducts = (products: ProductDisplay[], query: string) =>
  productService.searchProducts(products, query);
export const filterProducts = (
  products: ProductDisplay[],
  selectedCategory: string,
  selectedBrand: string
) => productService.filterProducts(products, selectedCategory, selectedBrand);
export const clearProductsCache = () => productService.clearProductsCache();
