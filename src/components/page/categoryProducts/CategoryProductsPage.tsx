'use client'

import { Card } from '@/components/ui/card'
import { useCartStore } from '@/store/useCartStore'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { ProductCard } from '@/components/product/ProductCard'
import { CardProduct } from '@/lib/types'
import { toast } from 'react-hot-toast'
import { use } from 'react'
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { PaginationControls } from '@/components/layout/PaginationControls'

type Props = {
  categoryProducts: CardProduct[];
  currentPage: number;
  totalPages: number;
};

export default function CategoryProductsPage({ categoryProducts, currentPage, totalPages }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };


  const addToCart = useCartStore((state) => state.addToCart)

  const handleAddToCart = (product: CardProduct) => {
    addToCart(
      product,
      (msg) => toast.success(msg),
      (msg) => toast.error(msg)
    )
  }

  const { categoryName, categorySlug } = useParams();
  // console.log("categoryName", categoryName);
  const products = categoryProducts;
  // console.log("Featured Products:", featuredProducts);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold capitalize">{categoryName}</h1>
        <p className="text-muted-foreground">Browse our {categorySlug} collection</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoryProducts.map((product) => (
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
