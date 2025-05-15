import { Product } from "@/lib/types";
import { fetchAllProducts } from "@/lib/api/product";
import ProductsPage from "@/components/page/products/ProductsPage";
import ProductSearchBar from "@/components/page/search/SearchBar";


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
    <div>
      {/* Search Bar Section */}
      <section className="w-full flex items-center mt-3 mb-5 justify-center px-4 sm:px-6 lg:px-8" >
        <div className="w-full max-w-2xl mx-auto">
          <ProductSearchBar />
        </div>
      </section>
      {/* Products Section */}
      <section className="px-4 sm:px-6 lg:px-8">
        <ProductsPage
          allProducts={cardProducts}
          currentPage={1}
          totalPages={1}
        />
      </section>
    </div>
  )
}
