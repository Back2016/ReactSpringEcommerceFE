import { Product } from "@/lib/types";
import { fetchAllProducts } from "@/lib/api/product";
import ProductsPage from "@/components/page/products/ProductsPage";


export default async function AllProductsPage() {
  const products = await fetchAllProducts();

  const cardProducts = products.map((product: Product) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.images[0],
    category: product.category,
    inventory: product.inventory,
    description: product.description
  }));

  return (
    <ProductsPage
      allProducts={cardProducts}
      currentPage={1}
      totalPages={1}
    />
  )
}
