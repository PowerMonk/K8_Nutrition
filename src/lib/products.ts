// filepath: src/lib/products.ts
import { supabase } from "./supabase.ts"; // Imports the Supabase client for database interaction.
import type {
  Product,
  ProductDisplay,
  ProductFilters,
  GroupedProduct,
} from "../types/productType.ts"; // Imports TypeScript types for better code organization and type checking.

/**
 * Product service class to manage data fetching and caching
 */
class ProductService {
  // --- Private Properties ---
  // These properties hold the internal state of the ProductService.

  private productsCache: ProductDisplay[] | null = null; // Stores fetched products to avoid repeated API calls. Initially null.
  private cacheExpiry: number = 0; // Timestamp (in milliseconds) when the current cache expires.
  private readonly CACHE_DURATION = 10 * 60 * 1000; // Defines how long the cache is valid (10 minutes).

  // --- Private Helper Methods ---
  // These methods are internal to the class and are used by its public methods.

  /**
   * Transform product to display format with combined name
   * Takes a raw Product object and adds a 'displayName' property,
   * combining 'name' and 'flavor' if 'flavor' exists.
   */
  private transformToDisplayProduct(product: Product): ProductDisplay {
    const displayName = product.flavor // If a flavor exists, combine name and flavor.
      ? `${product.name} ${product.flavor}`
      : product.name; // Otherwise, just use the product name.

    return {
      ...product, // Spread all existing product properties.
      displayName, // Add the newly created displayName.
    };
  }

  /**
   * Check if cache is valid
   * Determines if the `productsCache` currently holds valid (non-expired) data.
   */
  private isCacheValid(): boolean {
    return this.productsCache !== null && Date.now() < this.cacheExpiry;
  }

  /**
   * Fetch products from Supabase
   * This is the core method for interacting with the Supabase database.
   * It fetches all active products and transforms them into `ProductDisplay` format.
   */
  private async fetchProductsFromAPI(): Promise<ProductDisplay[]> {
    try {
      const { data, error } = await supabase
        .from("products") // Selects the 'products' table.
        .select(
          "id, name, brand, flavor, category, size, price, stock, fragile, description, imageurl, imagealt, active"
        ) // Specifies which columns to retrieve.
        .eq("active", true) // Filters to only get active products.
        .order("name"); // Orders the results by product name.

      if (error) {
        console.error("Error fetching products:", error);
        throw new Error("Failed to fetch products"); // Throws an error if the API call fails.
      }

      if (!data) {
        return []; // Returns an empty array if no data is found.
      }

      // Transform to display format
      return data.map((product) => this.transformToDisplayProduct(product));
    } catch (error) {
      console.error("Error in fetchProductsFromAPI:", error);
      throw error; // Re-throws any caught errors.
    }
  }

  // --- Public Methods ---
  // These methods are meant to be called from outside the class.

  /**
   * Get all active products with caching
   * This is the primary method for getting product data.
   * It first checks the cache and, if invalid, fetches fresh data from the API.
   */
  public async getAllProducts(): Promise<ProductDisplay[]> {
    // Check cache validity
    if (this.isCacheValid()) {
      return this.productsCache!; // If cache is valid, return cached data.
    }

    // Fetch fresh data
    const displayProducts = await this.fetchProductsFromAPI();

    // Update cache
    this.productsCache = displayProducts; // Store the newly fetched data in the cache.
    this.cacheExpiry = Date.now() + this.CACHE_DURATION; // Set the new cache expiry time.

    return displayProducts;
  }

  /**
   * Get unique categories and brands for filters
   * Uses cached data from getAllProducts to avoid duplicate API calls.
   * This is useful for populating dropdowns or filter options.
   */
  public async getProductFilters(): Promise<ProductFilters> {
    // Ensure we have products data (will use cache if available)
    const products = await this.getAllProducts(); // Fetches products, leveraging the cache.

    // Extract and clean categories with trim() to avoid duplicates from whitespace
    const categories = [
      ...new Set(
        products
          .map((p) => p.category.trim()) // Get all categories and remove leading/trailing whitespace.
          .filter((category) => category.length > 0) // Remove empty strings.
      ),
    ].sort(); // Create a Set to get unique categories, convert back to array, and sort alphabetically.

    // Extract and clean brands with trim() to avoid duplicates from whitespace
    const brands = [
      ...new Set(
        products.map((p) => p.brand.trim()).filter((brand) => brand.length > 0)
      ),
    ].sort(); // Same logic as categories for brands.

    return { categories, brands };
  }

  /**
   * Search products by name, brand, or flavor
   * Filters a given list of `ProductDisplay` objects based on a search query.
   * It performs a case-insensitive, accent-insensitive search.
   * UNUSED FUNCTION FOR NOW
   */
  public searchProducts(
    products: ProductDisplay[],
    query: string
  ): ProductDisplay[] {
    if (!query.trim()) return products; // If the query is empty or just whitespace, return all products.

    const normalizedQuery = query
      .toLowerCase() // Convert query to lowercase.
      .normalize("NFD") // Normalize Unicode characters (e.g., 'á' to 'a').
      .replace(/[\u0300-\u036f]/g, ""); // Remove diacritics (accents).

    return products.filter((product) => {
      // Create a searchable string from product data.
      const searchableText = `${product.displayName} ${product.brand} ${
        product.flavor || ""
      }`.toLowerCase();
      const normalizedText = searchableText
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      return normalizedText.includes(normalizedQuery); // Check if the normalized product text includes the normalized query.
    });
  }

  /**
   * Filter products by category and brand
   * Filters a list of `ProductDisplay` objects based on selected category and brand.
   * If a filter is not provided (empty string), it doesn't apply that filter.
   */
  public filterProducts(
    products: ProductDisplay[],
    selectedCategory: string,
    selectedBrand: string
  ): ProductDisplay[] {
    return products.filter((product) => {
      const categoryMatch =
        !selectedCategory || // If no category selected, it's a match.
        product.category.trim() === selectedCategory.trim(); // Otherwise, check for exact match (trimmed).
      const brandMatch =
        !selectedBrand || product.brand.trim() === selectedBrand.trim(); // Same for brand.
      return categoryMatch && brandMatch; // Product must match both (if specified).
    });
  }

  /**
   * Clear products cache (useful for development or forced refresh)
   * Resets the cache, forcing the next `getAllProducts` call to fetch fresh data.
   */
  public clearProductsCache(): void {
    this.productsCache = null;
    this.cacheExpiry = 0;
  }

  /**
   * Group products by base name AND brand for modal display
   * Products with the same name but different brands are grouped separately.
   * This is particularly useful for displaying products with multiple sizes/flavors
   * under a single "parent" product in the UI, while still distinguishing by brand.
   */
  public groupProducts(products: ProductDisplay[]): GroupedProduct[] {
    const groups = new Map<string, Product[]>(); // A Map to store groups, using a composite key.

    // Group products by name AND brand
    products.forEach((product) => {
      // Create a composite key using name and brand
      const groupKey = `${product.name}__${product.brand}`; // e.g., "Coca-Cola__Coca-Cola" or "Milk__Lala"

      if (!groups.has(groupKey)) {
        groups.set(groupKey, []); // If group doesn't exist, create an empty array for it.
      }
      groups.get(groupKey)!.push(product); // Add the current product to its respective group.
    });

    // Convert groups to GroupedProduct array
    return Array.from(groups.entries()).map(([groupKey, productList]) => {
      // Sort products by price (lowest first) within each group.
      const sortedProducts = productList.sort((a, b) => a.price - b.price);
      const primaryProduct = sortedProducts[0]; // The product with the lowest price in the group is chosen as the "primary".
      const [name, brand] = groupKey.split("__"); // Extract name and brand from the group key.

      // Generate display name that includes the brand if it's a common product name
      // This logic ensures that if "Milk" is sold by multiple brands, the group name becomes "Milk Lala",
      // but if "Coca-Cola" is only by "Coca-Cola", it just remains "Coca-Cola".
      const displayName = this.hasMultipleManufacturers(products, name)
        ? `${name} ${brand}`
        : name;

      return {
        // Generate a unique ID for the grouped product.
        id: `group-${name.toLowerCase().replace(/\s+/g, "-")}-${brand
          .toLowerCase()
          .replace(/\s+/g, "-")}`,
        name: displayName,
        products: sortedProducts, // All products within this group, sorted by price.
        category: primaryProduct.category,
        brand: primaryProduct.brand,
        imageurl: primaryProduct.imageurl,
        imagealt: primaryProduct.imagealt,
        basePrice: primaryProduct.price, // The price of the lowest-priced product in the group.
      };
    });
  }

  /**
   * Check if a product name is manufactured by multiple brands
   * Used to determine if we need to show the brand name in the card.
   * This is a helper for `groupProducts`.
   */
  private hasMultipleManufacturers(
    products: ProductDisplay[],
    name: string
  ): boolean {
    const brands = new Set<string>(); // Use a Set to store unique brands.

    products.forEach((product) => {
      if (product.name === name) {
        brands.add(product.brand); // Add the brand if the product name matches.
      }
    });

    return brands.size > 1; // Returns true if more than one unique brand is found for that product name.
  }

  /**
   * Search grouped products by name, brand, or flavor
   * Similar to `searchProducts`, but operates on `GroupedProduct` objects.
   */
  public searchGroupedProducts(
    groupedProducts: GroupedProduct[],
    query: string
  ): GroupedProduct[] {
    if (!query.trim()) return groupedProducts; // If query is empty, return all groups.

    const normalizedQuery = query
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    return groupedProducts.filter((group) => {
      // Search in group name, brand, and all product flavors within the group.
      const searchableText = `${group.name} ${group.brand} ${group.products
        .map((p) => p.flavor || "")
        .join(" ")}`.toLowerCase(); // Concatenate all relevant text for searching.
      const normalizedText = searchableText
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      return normalizedText.includes(normalizedQuery);
    });
  }

  /**
   * Filter grouped products by category and brand
   * Similar to `filterProducts`, but operates on `GroupedProduct` objects.
   */
  public filterGroupedProducts(
    groupedProducts: GroupedProduct[],
    selectedCategory: string,
    selectedBrand: string
  ): GroupedProduct[] {
    return groupedProducts.filter((group) => {
      const categoryMatch =
        !selectedCategory || group.category.trim() === selectedCategory.trim();
      const brandMatch =
        !selectedBrand || group.brand.trim() === selectedBrand.trim();
      return categoryMatch && brandMatch;
    });
  }
}

// Create and export singleton instance
// This creates a single instance of ProductService that can be imported and used throughout the application.
// This is often called a "singleton pattern" because only one instance of the class exists.
const productService = new ProductService();

// Export public methods
// These exports make the public methods of the `productService` instance directly available for import,
// making them easier to use without needing to instantiate the class elsewhere.
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
export const groupProducts = (products: ProductDisplay[]) =>
  productService.groupProducts(products);
export const searchGroupedProducts = (
  groupedProducts: GroupedProduct[],
  query: string
) => productService.searchGroupedProducts(groupedProducts, query);
export const filterGroupedProducts = (
  groupedProducts: GroupedProduct[],
  selectedCategory: string,
  selectedBrand: string
) =>
  productService.filterGroupedProducts(
    groupedProducts,
    selectedCategory,
    selectedBrand
  );
