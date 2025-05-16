'use client'

import { use } from 'react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { Order } from '@/lib/types'
import { getUserOrders } from '@/lib/api/order'
import { withValidToken } from '@/lib/api/auth'
import { toast } from 'react-hot-toast'
import { useAuthStore } from '@/store/useAuthStore'

export default function OrdersPage(promiseProps: { params: Promise<{ userId: string }> }) {
  const { userId } = use(promiseProps.params)

  const [orders, setOrders] = useState<Order[]>([])
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
    const fetchOrders = async () => {
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
          const fetched = await getUserOrders(token)
          setOrders(fetched)
        }, { getAccessToken, getUser, logout, setToken, isAccessTokenExpired, router })
      } catch (err) {
        toast.error('Failed to fetch orders')
        logout()
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [userId])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-muted-foreground">You haven’t placed any orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link key={order.id} href={`/orders/${userId}/order/${order.id}`}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">

                    <div className="flex-1 space-y-1">
                      <p className="font-semibold">Order #{order.id}</p>
                      <p className="text-muted-foreground text-sm">Placed on {order.orderDate}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <p className="text-sm mt-1">{order.items.length} item(s)</p>
                        {Array.from(new Set(order.items.map(i => i.productId))) // unique productIds
                          .slice(0, 3) // limit to 3 images
                          .map(productId => (

                            <img
                              key={productId}
                              src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/images/image/download/product/${productId}`}
                              alt={`Product ${productId}`}
                              className="w-10 h-10 rounded-md object-cover border"
                            />
                          ))}
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold">${order.totalAmount.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">{order.status}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
