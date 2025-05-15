'use client'

import { CardProduct } from '@/lib/types'
import { useCartStore } from '@/store/useCartStore'
import { ProductCard } from '@/components/product/ProductCard'
import { PaginationControls } from '@/components/layout/PaginationControls'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { toast } from 'react-hot-toast'

type Props = {
  searchTerm: string
  searchResults: CardProduct[]
  currentPage: number
  totalPages: number
}

export default function SearchResultsPage({
  searchTerm,
  searchResults,
  currentPage,
  totalPages,
}: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const addToCart = useCartStore((state) => state.addToCart)

  const handleAddToCart = (product: CardProduct) => {
    addToCart(
      product,
      (msg) => toast.success(msg),
      (msg) => toast.error(msg)
    )
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', newPage.toString())
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Results for &quot;{searchTerm}&quot;</h1>
        <p className="text-muted-foreground">
          Showing {searchResults.length} result{searchResults.length !== 1 && 's'} for “{searchTerm}”
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {searchResults.map((product) => (
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
