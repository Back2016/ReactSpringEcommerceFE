
import CategoryProductsPage from "@/components/page/categoryProducts/CategoryProductsPage";
import { Product } from "@/lib/types";
import { fetchPaginatedProductsByCategory } from "@/lib/api/product";
import { convertHyphenToAmpersand } from "@/lib/utils";

type Props = {
  params: Promise<{ categoryName: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function CategoryPage({ params, searchParams }: Props) {
  const { categoryName } = await params;
  const searchParamsObj = await searchParams;
  const page = parseInt(searchParamsObj.page as string) || 1;
  const limit = parseInt(searchParamsObj.limit as string) || 12;
  const categoryNameWithAmpersand = convertHyphenToAmpersand(categoryName);
  console.log('Category name with ampersand:', categoryNameWithAmpersand);

  const paginatedResponse = await fetchPaginatedProductsByCategory(categoryNameWithAmpersand, page, limit);
  console.log('Paginated response:', paginatedResponse);
  // console.log('Products:', products);
  const cardProducts = paginatedResponse.items.map((product: Product) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.images[0],
    category: product.category,
    inventory: product.inventory,
    description: product.description
  }));

  return (
    <CategoryProductsPage
      categoryProducts={cardProducts}
      currentPage={paginatedResponse.currentPage}
      totalPages={paginatedResponse.totalPages}
    />
  )
}
