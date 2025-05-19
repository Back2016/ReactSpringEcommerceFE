'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { BASE_URL } from '@/lib/config'
import { Order } from '@/lib/types'
import { getUserOrderById } from '@/lib/api/order'
import { withValidToken } from '@/lib/api/auth'
import { useAuthStore } from '@/store/useAuthStore'
import { toast } from 'react-hot-toast'
import { HomeIcon, Loader2 } from 'lucide-react'

export default function UserOrderSuccessPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const orderIdParam = searchParams.get('orderId')
    const [order, setOrder] = useState<Order | null>(null)
    const [loading, setLoading] = useState(true)

    const {
        getAccessToken,
        isAccessTokenExpired,
        getUser,
        setToken,
        logout
    } = useAuthStore()

    useEffect(() => {
        if (!orderIdParam) {
            router.replace('/')
            return
        }

        const fetchOrder = async () => {
            try {
                await withValidToken(
                    async (token) => {
                        const fetched = await getUserOrderById(Number(orderIdParam), token)
                        setOrder(fetched)
                    },
                    { getAccessToken, isAccessTokenExpired, getUser, setToken, logout, router }
                )
            } catch (err: any) {
                toast.error(err.message || 'Failed to load order')
                router.replace('/')
            } finally {
                setLoading(false)
            }
        }

        fetchOrder()
    }, [orderIdParam])

    if (loading || !order) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="container mx-auto py-8">
            <div className="flex items-center gap-4 mb-6">
                <Button variant="outline" asChild>
                    <Link href={`/`}><HomeIcon className="w-4 h-4 mr-2" /> Back to HomePage</Link>
                </Button>
                <Button variant="outline" asChild>
                    <Link href={`/orders/${order.userId}`}>Go to Orders</Link>
                </Button>
                <h1 className="text-2xl font-bold">
                    Thank you! Order #{order.id} placed
                </h1>

            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-6">
                    {/* Order Summary */}
                    <Card>
                        <CardContent className="p-6 space-y-4">
                            <p>
                                <span className="text-muted-foreground">Order Date:</span> {order.orderDate}
                            </p>
                            <p>
                                <span className="text-muted-foreground">Status:</span> {order.status}
                            </p>
                            <p>
                                <span className="text-muted-foreground">Total:</span> ${order.totalAmount.toFixed(2)}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Shipping Address */}
                    {order.shippingAddress && (
                        <Card>
                            <CardContent className="p-6 space-y-1 text-sm">
                                <h2 className="text-lg font-semibold mb-2">Shipping Address</h2>
                                <p>{order.shippingAddress.recipientName}</p>
                                <p>{order.shippingAddress.street}</p>
                                <p>
                                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipcode}
                                </p>
                                <p>{order.shippingAddress.country}</p>
                                <p>{order.shippingAddress.phone}</p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Billing Address */}
                    {order.billingAddress && (
                        <Card>
                            <CardContent className="p-6 space-y-1 text-sm">
                                <h2 className="text-lg font-semibold mb-2">Billing Address</h2>
                                <p>{order.billingAddress.recipientName}</p>
                                <p>{order.billingAddress.street}</p>
                                <p>
                                    {order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.zipcode}
                                </p>
                                <p>{order.billingAddress.country}</p>
                                <p>{order.billingAddress.phone}</p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Items */}
                <Card>
                    <CardContent className="p-6 space-y-4">
                        <h2 className="text-lg font-semibold mb-4">Order Items</h2>
                        <div className="space-y-4">
                            {order.items.map((item) => (
                                <div key={item.productId} className="flex items-center justify-between gap-4 py-2 border-b">
                                    <img
                                        src={`${BASE_URL}/api/v1/images/image/download/product/${item.productId}`}
                                        alt={item.productName}
                                        className="w-20 h-20 rounded-md object-cover border"
                                    />
                                    <div className="flex-1">
                                        <p className="font-medium">{item.productName}</p>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-semibold">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
