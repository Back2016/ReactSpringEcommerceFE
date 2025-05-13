'use client'

import { useCartStore } from '@/store/useCartStore'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { ProductCard } from '@/components/product/ProductCard'
import { CardProduct } from '@/lib/types'
import { toast } from 'react-hot-toast'
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation'
import { PaginationControls } from '@/components/layout/PaginationControls'

type Props = {
  allProducts: CardProduct[];
  currentPage: number;
  totalPages: number;
};

export default function ({ allProducts, currentPage, totalPages }: Props) {


  const addToCart = useCartStore((state) => state.addToCart)

  const handleAddToCart = (product: CardProduct) => {
    addToCart(
      product,
      (msg) => toast.success(msg),
      (msg) => toast.error(msg)
    )
  }

  const products = allProducts;
  // console.log("Featured Products:", featuredProducts);

  return (
    <div className="space-y-8">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>

      <PaginationControls currentPage={currentPage} totalPages={totalPages} />
    </div>
  )
}
