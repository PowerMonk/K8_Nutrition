// filepath: src/types/product.ts
/**
 * Product interface matching Supabase products table schema
 */
export interface Product {
  id: number;
  name: string;
  brand: string;
  flavor?: string | null;
  category: string;
  size: string;
  price: number;
  stock: number;
  fragile: boolean;
  description: string;
  imageurl: string;
  imagealt: string;
  active: boolean;
}

/**
 * Product display interface for components
 * Combines name + flavor for unique display names
 */
export interface ProductDisplay extends Product {
  displayName: string;
}

/**
 * Filter options for product catalog
 */
export interface ProductFilters {
  categories: string[];
  brands: string[];
}

/**
 * Grouped product interface for modal display
 * Groups products with the same base name but different flavors/sizes
 */
export interface GroupedProduct {
  id: string; // unique identifier for the group
  name: string; // base product name
  products: Product[]; // all product variations
  category: string; // primary category
  brand: string; // primary brand
  imageurl: string; // primary image for card display
  imagealt: string; // primary alt text
  basePrice: number; // lowest price in the group
}
