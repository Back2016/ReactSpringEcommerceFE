'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { Order, PaginatedResponse } from '@/lib/types'
import { getAdminOrders } from '@/lib/api/order'
import { withValidToken } from '@/lib/api/auth'
import { useAuthStore } from '@/store/useAuthStore'
import { Card, CardContent } from '@/components/ui/card'
import { PaginationControls } from '@/components/layout/PaginationControls'
import { Select, SelectTrigger, SelectItem, SelectContent, SelectValue } from '@/components/ui/select'
import { toast } from 'react-hot-toast'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

const ORDER_STATUSES = ['ALL', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']

export default function AdminOrdersPage() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const status = searchParams.get('status') || 'PENDING'
    const page = parseInt(searchParams.get('page') || '1')

    const [data, setData] = useState<PaginatedResponse<Order> | null>(null)
    const [loading, setLoading] = useState(true)

    const { getAccessToken, isAccessTokenExpired, getUser, setToken, logout } = useAuthStore()

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                await withValidToken(async (token) => {
                    const result = await getAdminOrders(status, page - 1, 10, token)
                    setData(result)
                }, { getAccessToken, getUser, logout, setToken, isAccessTokenExpired, router })
            } catch (err) {
                toast.error('Failed to load admin orders')
            } finally {
                setLoading(false)
            }
        }

        fetchOrders()
    }, [status, page])

    const handleStatusChange = (newStatus: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('status', newStatus)
        params.set('page', '1')
        router.push(`${pathname}?${params.toString()}`)
    }

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin" />
            </div>
        )
    }

    return (
        <div className="container py-2">
            <div className="flex justify-end items-center mb-6">
                <Select value={status} onValueChange={handleStatusChange}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by Status" />
                    </SelectTrigger>
                    <SelectContent>
                        {ORDER_STATUSES.map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-4">
                {data?.content.map((order) => (
                    <Link key={order.id} href={`/admin/orders/${order.id}`}>
                        <Card className="hover:shadow-md transition-shadow">
                            <CardContent className="p-6 space-y-2">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1 space-y-1">
                                        <p className="font-semibold">Order #{order.id}</p>
                                        <p className="text-muted-foreground text-sm">Placed on {order.orderDate}</p>
                                        <p className="text-muted-foreground text-sm">
                                            {order.userId
                                                ? `User ID: ${order.userId}`
                                                : `Guest: ${order.guestEmail}`}
                                        </p>

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
                                        <p className="text-muted-foreground">{order.status}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            {data && (
                <PaginationControls currentPage={data.number + 1} totalPages={data.totalPages} />
            )}
        </div>
    )
}
