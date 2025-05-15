'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { useCartStore } from '@/store/useCartStore'
import { useAuthStore } from '@/store/useAuthStore'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { ProductCard } from '@/components/product/ProductCard'
import { CardProduct, Category } from '@/lib/types'
import { toast } from 'react-hot-toast'
import { convertAmpersandToHyphen } from '@/lib/utils'
import { withValidToken } from '@/lib/api/auth'
import { useRouter } from 'next/navigation'
import { addItemToCart } from '@/lib/api/cart'
import ProductSearchBar from '@/components/page/search/SearchBar';


type Props = {
  featuredProducts: CardProduct[];
  categories: Category[];
};

export default function HomePage({ featuredProducts, categories }: Props) {
  const [hydrated, setHydrated] = useState(false)
  const router = useRouter()

  const addToCart = useCartStore((state) => state.addToCart)
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const getAccessToken = useAuthStore(state => state.getAccessToken)
  const isAccessTokenExpired = useAuthStore(state => state.isAccessTokenExpired)
  const getUser = useAuthStore(state => state.getUser)
  const logout = useAuthStore(state => state.logout)
  const setToken = useAuthStore(state => state.setToken)

  useEffect(() => {
    setHydrated(true)
  }, [])

  useEffect(() => {
    const validateAndRefresh = async () => {
      if (!hydrated) return

      if (isAuthenticated) {
        try {
          await withValidToken(
            async () => Promise.resolve(),
            { getAccessToken, isAccessTokenExpired, getUser, setToken, logout, router }
          )
        } catch (err) {
          toast.error('Session expired. Please log in again.')
          logout()
          router.push('/')
        }
      }
    }

    validateAndRefresh()
  }, [isAuthenticated, hydrated])

  const handleAddToCart = async (product: CardProduct) => {
    // First update local cart
    addToCart(
      product,
      (msg) => toast.success(msg),
      (msg) => toast.error(msg)
    )

    // Then sync with backend if authenticated
    if (isAuthenticated) {
      try {
        await withValidToken(
          async (token) => {
            await addItemToCart(product.id, 1, token)
          },
          { getAccessToken, isAccessTokenExpired, getUser, setToken, logout, router }
        )
      } catch (err) {
        toast.error('Failed to sync cart with server')
        console.error(err)
      }
    }
  }

  if (!hydrated) {
    return null
  }

  return (
    <div className="space-y-12">
      {/* Search Bar Section */}
      <section className="w-full flex items-center mt-3 mb-5 justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl mx-auto">
          <ProductSearchBar />
        </div>
      </section>

      {/* Categories Section */}
      <section className="relative px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
        <div className="relative group">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={16}
            slidesPerView={1}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
            className="pb-12"
          >
            {categories.map((category) => (
              <SwiperSlide key={category.id}>
                <Link href={`/${convertAmpersandToHyphen(category.name)}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="aspect-square relative">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <h3 className="text-white text-xl font-bold">{category.name}</h3>
                      </div>
                    </div>
                  </Card>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Swiper Buttons */}
          <div className="swiper-button-prev !w-12 !h-12 !bg-gray-800/90 hover:!bg-gray-900 !rounded-full !text-white !left-0 !top-1/2 !-translate-y-1/2 !-translate-x-1/2 after:!text-xl"></div>
          <div className="swiper-button-next !w-12 !h-12 !bg-gray-800/90 hover:!bg-gray-900 !rounded-full !text-white !right-0 !top-1/2 !-translate-y-1/2 !translate-x-1/2 after:!text-xl"></div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
