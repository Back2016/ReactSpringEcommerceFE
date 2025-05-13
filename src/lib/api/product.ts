// lib/api/product.ts

import { Product } from '@/lib/types';

export async function fetchAllProducts(): Promise<Product[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/products/all`);

  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.status}`);
  }

  const response = await res.json();

  // console.log('Fetched products:', response);

  return response.data;
}

export async function fetchProduct(productId: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/products/product/${productId}/product`);

  if (!res.ok) throw new Error("Failed to fetch product");

  const response = await res.json();

  // console.log('Fetched product:', response);

  return response.data;
}

export async function fetchProductsByCategory(categoryName: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/products/${categoryName}/all`);

  if (!res.ok) throw new Error("Failed to fetch category products");

  const response = await res.json();
  // console.log('Fetched products by category:', response);
  return response.data;
}

export async function fetchPaginatedProductsByCategory(categoryName: string, currentPage: number, limit: number) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/products/${categoryName}?page=${currentPage}&limit=${limit}`,
    { cache: 'no-store' }
  );
  if (!res.ok) throw new Error("Failed to fetch category products");

  const response = await res.json();
  // console.log('Fetched products by category:', response);
  return response.data;
}
