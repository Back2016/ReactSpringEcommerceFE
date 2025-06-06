'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { BASE_URL } from '@/lib/config'
import { Order } from '@/lib/types'
import { getUserOrders } from '@/lib/api/order'
import { withValidToken } from '@/lib/api/auth'
import { useAuthStore } from '@/store/useAuthStore'
import { toast } from 'react-hot-toast'
import { Loader2 } from 'lucide-react'

export default function OrderPage() {
  const { userId, orderId } = useParams<{ userId: string; orderId: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  const router = useRouter()
  const user = useAuthStore(state => state.user)
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const getAccessToken = useAuthStore(state => state.getAccessToken)
  const getUser = useAuthStore(state => state.getUser)
  const logout = useAuthStore(state => state.logout)
  const setToken = useAuthStore(state => state.setToken)
  const isAccessTokenExpired = useAuthStore(state => state.isAccessTokenExpired)

  useEffect(() => {
    const fetchOrder = async () => {
      if (!isAuthenticated) {
        router.push('/login')
        return
      }

      if (user?.id?.toString() !== userId) {
        router.push(`/orders/${user?.id}`)
        return
      }

      try {
        await withValidToken(async (token) => {
          const orders = await getUserOrders(token)
          const selectedOrder = orders.find(o => o.id.toString() === orderId)
          if (!selectedOrder) {
            toast.error('Order not found')
            router.push(`/orders/${user?.id}`)
            return
          }
          setOrder(selectedOrder)
        }, { getAccessToken, getUser, logout, setToken, isAccessTokenExpired, router })
      } catch (err: any) {
        toast.error('Session expired. Please log in again.')
        logout()
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [userId, orderId])

  if (loading || !order) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading order...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" asChild>
          <Link href={`/orders/${userId}`}>← Back to Orders</Link>
        </Button>
        <h1 className="text-2xl font-bold">Order #{order.id}</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          {/* Order Details */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Order Details</h2>
              <div className="space-y-2">
                <p><span className="text-muted-foreground">Order Date:</span> {order.orderDate}</p>
                <p><span className="text-muted-foreground">Status:</span> {order.status}</p>
                <p><span className="text-muted-foreground">Total:</span> ${order.totalAmount.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
                <div className="space-y-1 text-sm">
                  <p>{order.shippingAddress.recipientName}</p>
                  <p>{order.shippingAddress.street}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                    {order.shippingAddress.zipcode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                  <p>{order.shippingAddress.phone}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Billing Address */}
          {order.billingAddress && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Billing Address</h2>
                <div className="space-y-1 text-sm">
                  <p>{order.billingAddress.recipientName}</p>
                  <p>{order.billingAddress.street}</p>
                  <p>
                    {order.billingAddress.city}, {order.billingAddress.state}{' '}
                    {order.billingAddress.zipcode}
                  </p>
                  <p>{order.billingAddress.country}</p>
                  <p>{order.billingAddress.phone}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>


        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <Link
                  key={item.productId}
                  href={`/product/${item.productId}`}
                  className="block hover:bg-muted/40 rounded-md transition"
                >
                  <div className="flex gap-4 p-2">
                    <div className="w-20 h-20 relative">
                      <img
                        src={`${BASE_URL}/api/v1/images/image/download/product/${item.productId}`}
                        alt={item.productName}
                        className="object-cover rounded-lg w-full h-full"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{item.productName}</p>
                      <p className="text-muted-foreground">${item.price}</p>
                      <p className="text-sm">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
