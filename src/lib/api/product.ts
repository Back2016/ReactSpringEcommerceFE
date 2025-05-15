// lib/api/product.ts

import { Product, ProductUpdateRequest, AddProductRequest, DetailedProduct } from '@/lib/types';

export async function fetchAllProducts(): Promise<Product[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/products/all`);

  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.status}`);
  }

  const response = await res.json();

  // console.log('Fetched products:', response);

  return response.data;
}

export async function fetchProduct(productId: string) : Promise<DetailedProduct> {

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/products/product/${productId}/product`);

  if (!res.ok) throw new Error("Failed to fetch product");

  const response = await res.json();

  // console.log('Fetched product:', response);

  return response.data;
}

export async function fetchProductsByCategory(categoryName: string) : Promise<Product[]> {
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



export async function fetchPaginatedProductsByName(name: string, page: number, limit = 12) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/products/search?name=${encodeURIComponent(name)}&page=${page}&limit=${limit}`);
    if (!res.ok) {
        throw new Error('Failed to fetch products');
    }

    const response = await res.json();

    return response.data;
}

export async function fetchProductSuggestions(query: string): Promise<string[]> {
  const res = await fetch(`/api/v1/products/suggestions?query=${encodeURIComponent(query)}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch suggestions: ${res.status}`);
  }
  return res.json();
}


// Admin-only: Add a new product
export async function addProduct(product: AddProductRequest, token: string) {
  console.log('Sending token:', token);
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/products/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(product),
  });

  if (!res.ok) throw new Error(`Failed to add product: ${res.status}`);

  const response = await res.json();
  return response.data;
}

// Admin-only: Update an existing product
export async function updateProduct(productId: string, update: ProductUpdateRequest, token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/products/product/${productId}/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(update),
  });

  if (!res.ok) throw new Error(`Failed to update product: ${res.status}`);

  const response = await res.json();
  return response.data;
}

// Admin-only: Delete a product
export async function deleteProduct(productId: string, token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/products/product/${productId}/delete`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error(`Failed to delete product: ${res.status}`);

  const response = await res.json();
  return response.data;
}
