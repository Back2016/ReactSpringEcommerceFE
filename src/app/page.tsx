import HomePage from '@/components/page/home/HomePage';
import { Product, CardProduct, Category } from '@/lib/types';
import { fetchAllProducts } from '@/lib/api/product';
import { fetchCategories } from '@/lib/api/category';

export default async function Home() {
  const products: Product[] = await fetchAllProducts();
  const categories: Category[] = await fetchCategories();

  const featuredProducts: CardProduct[] = products.map((product) => ({
    ...product,
    image: product.images?.[0] ?? null, // extract first image or null
    inventory: product.inventory ?? 0,
  }));

  // console.log("Featured Products:", featuredProducts);

  return <HomePage featuredProducts={featuredProducts} categories={categories} />;
}
