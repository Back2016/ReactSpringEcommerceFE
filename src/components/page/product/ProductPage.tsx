'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/store/useCartStore'
import { useAuthStore } from '@/store/useAuthStore'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Minus, Plus } from 'lucide-react'
import { DetailedProduct } from '@/lib/types'
import { BASE_URL } from '@/lib/config'
import toast from 'react-hot-toast'
import { getPublicUrl } from '@/lib/utils'
import { withValidToken } from '@/lib/api/auth'
import { addItemToCart } from '@/lib/api/cart'
import { useRouter } from 'next/navigation'

interface ProductPageProps {
    product: DetailedProduct
}

export function ProductPage({ product }: ProductPageProps) {
    const [quantity, setQuantity] = useState(1)
    const router = useRouter()
    const addToCart = useCartStore((state) => state.addToCart)
    const isAuthenticated = useAuthStore(state => state.isAuthenticated)
    const getAccessToken = useAuthStore(state => state.getAccessToken)
    const isAccessTokenExpired = useAuthStore(state => state.isAccessTokenExpired)
    const getUser = useAuthStore(state => state.getUser)
    const logout = useAuthStore(state => state.logout)
    const setToken = useAuthStore(state => state.setToken)

    const handleAddToCart = async () => {
        // Convert detailed product to card product for adding to cart
        const cardProduct = {
            id: product.id,
            name: product.name,
            price: product.price,
            description: product.description,
            image: product.images[0],
            category: product.category,
            inventory: product.inventory,
            quantity: quantity
        }

        // First update local cart
        addToCart(
            cardProduct,
            (msg) => toast.success(msg),
            (msg) => toast.error(msg)
        )

        // Then sync with backend if authenticated
        if (isAuthenticated) {
            try {
                await withValidToken(
                    async (token) => {
                        await addItemToCart(product.id, quantity, token)
                    },
                    { getAccessToken, isAccessTokenExpired, getUser, setToken, logout, router }
                )
            } catch (err) {
                toast.error('Failed to sync cart with server')
                console.error(err)
            }
        }
    }

    console.log("product", product);

    const longDescription = product.longDescription;
    const productSpecs = product.productSpecs;
    console.log("productSpecs", productSpecs);
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Product Images */}
                <div className="space-y-4">
                    <Swiper
                        modules={[Navigation, Pagination]}
                        spaceBetween={0}
                        slidesPerView={1}
                        navigation
                        pagination={{ clickable: true }}
                        className="aspect-square rounded-lg overflow-hidden"
                    >
                        {product.images.map((image, index) => (
                            <SwiperSlide key={index}>
                                <img
                                    src={getPublicUrl(`/api/v1/images/image/download/${image.id}`)}
                                    alt={`${product.name} - Image ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold">{product.name}</h1>
                        <p className="text-2xl font-bold mt-2">${product.price}</p>
                        <p className="text-muted-foreground mt-2">{product.description}</p>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        >
                            <Minus className="h-4 w-4" />
                        </Button>
                        <span className="text-lg font-medium">{quantity}</span>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setQuantity(quantity + 1)}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Add to Cart Button */}
                    <Button
                        className="w-full"
                        size="lg"
                        onClick={handleAddToCart}
                    >
                        Add to Cart - ${(product.price * quantity).toFixed(2)}
                    </Button>

                    {/* Specifications Section */}
                    {Array.isArray(productSpecs) && productSpecs.length > 0 && (
                        <div className="mt-12">
                            <Card className="p-6">
                                <h2 className="text-2xl font-bold mb-6">Specifications</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <tbody>
                                        {
                                            productSpecs.map((spec) => (
                                                <tr key={spec.id} className="border-b last:border-0">
                                                    <td className="py-3 px-4 font-medium text-muted-foreground">{spec.specName}</td>
                                                    <td className="py-3 px-4">{spec.value}</td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                            </Card>
                        </div>
                    )}

                    {/* Long Description Section */}
                    <div className="mt-8">
                        <Card className="p-6">
                            <h2 className="text-2xl font-bold mb-6">Product Description</h2>
                            <div className="prose prose-sm max-w-none">
                                {(product.longDescription || product.description)?.split('\n').map((paragraph, index) => (
                                    <p key={index} className="mb-4 last:mb-0">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </Card>
                    </div>

                </div>
            </div>
        </div>
    )
}
