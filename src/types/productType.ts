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
