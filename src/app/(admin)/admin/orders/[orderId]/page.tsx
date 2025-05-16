'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { Loader2 } from 'lucide-react'

import { BASE_URL } from '@/lib/config'
import type { Order, OrderStatus, UserDto } from '@/lib/types'
import { getAdminOrders, updateOrderStatus } from '@/lib/api/order'
import { getUserById } from '@/lib/api/user'
import { withValidToken } from '@/lib/api/auth'
import { useAuthStore } from '@/store/useAuthStore'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from '@/components/ui/select'

const ORDER_STATUSES = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']

export default function AdminOrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const router = useRouter()

  const [order, setOrder] = useState<Order | null>(null)
  const [userInfo, setUserInfo] = useState<UserDto | null>(null)
  const [loading, setLoading] = useState(true)

  const { getAccessToken, isAccessTokenExpired, getUser, setToken, logout } = useAuthStore()

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        await withValidToken(async (token) => {
          const result = await getAdminOrders('ALL', 0, 100, token)
          const found = result.content.find(o => o.id.toString() === orderId)
          if (!found) {
            toast.error('Order not found')
            router.push('/admin/orders')
          } else {
            setOrder(found)
            const user = await getUserById(found.userId, token)
            setUserInfo(user)
          }
        }, { getAccessToken, getUser, logout, setToken, isAccessTokenExpired, router })
      } catch (err) {
        toast.error('Failed to load order')
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  const handleStatusChange = async (newStatus: string) => {
    if (!order || newStatus === order.status) return
    try {
      await withValidToken(async (token) => {
        const updated = await updateOrderStatus(order.id, newStatus as OrderStatus, token)
        setOrder(updated)
        toast.success(`Status updated to ${newStatus}`)
      }, { getAccessToken, getUser, logout, setToken, isAccessTokenExpired, router })
    } catch {
      toast.error('Failed to update status')
    }
  }

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
          <Link href="/admin/orders">← Back to Orders</Link>
        </Button>
        <h1 className="text-2xl font-bold">Order #{order.id}</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          {/* Order Details + User Info */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <p><span className="text-muted-foreground">Order Date:</span> {order.orderDate}</p>
                <Select value={order.status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Update status" />
                  </SelectTrigger>
                  <SelectContent>
                    {ORDER_STATUSES.map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <p><span className="text-muted-foreground">Total:</span> ${order.totalAmount.toFixed(2)}</p>

              {userInfo && (
                <div className="border-t pt-4 space-y-1 text-sm">
                  <p><span className="text-muted-foreground">User ID:</span> {userInfo.id}</p>
                  <p><span className="text-muted-foreground">Name:</span> {userInfo.firstName} {userInfo.lastName}</p>
                  <p><span className="text-muted-foreground">Email:</span> {userInfo.email}</p>
                </div>
              )}
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

        {/* Order Items */}
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
