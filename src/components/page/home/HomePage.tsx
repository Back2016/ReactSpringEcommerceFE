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
import { CardProduct, Category } from '@/lib/types'
import { toast } from 'react-hot-toast'
import { convertAmpersandToHyphen } from '@/lib/utils'

type Props = {
  featuredProducts: CardProduct[];
  categories: Category[];
};

export default function HomePage({ featuredProducts, categories }: Props) {
  const addToCart = useCartStore((state) => state.addToCart)

  const handleAddToCart = (product: CardProduct) => {
    addToCart(
      product,
      (msg) => toast.success(msg),
      (msg) => toast.error(msg)
    )
  }

  // console.log("Featured Products:", featuredProducts);

  return (
    <div className="space-y-12">
      {/* Categories Section */}
      <section className="relative">
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
              640: {
                slidesPerView: 2,
              },
              768: {
                slidesPerView: 3,
              },
              1024: {
                slidesPerView: 4,
              },
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

          {/* Custom Navigation Buttons */}
          <div className="swiper-button-prev !w-12 !h-12 !bg-gray-800/90 hover:!bg-gray-900 !rounded-full !text-white !left-0 !top-1/2 !-translate-y-1/2 !-translate-x-1/2 after:!text-xl"></div>
          <div className="swiper-button-next !w-12 !h-12 !bg-gray-800/90 hover:!bg-gray-900 !rounded-full !text-white !right-0 !top-1/2 !-translate-y-1/2 !translate-x-1/2 after:!text-xl"></div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
