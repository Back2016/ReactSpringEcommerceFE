import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

// Dummy data
const dummyOrders = [
  {
    id: 1,
    orderNumber: 'ORD-001',
    date: '2024-03-20',
    total: 299.99,
    status: 'Delivered',
    items: 3
  },
  {
    id: 2,
    orderNumber: 'ORD-002',
    date: '2024-03-15',
    total: 149.50,
    status: 'Processing',
    items: 2
  },
  {
    id: 3,
    orderNumber: 'ORD-003',
    date: '2024-03-10',
    total: 499.99,
    status: 'Shipped',
    items: 4
  }
]

export default function OrdersPage({ params }: { params: { userId: string } }) {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      <div className="space-y-4">
        {dummyOrders.map((order) => (
          <Link key={order.id} href={`/orders/${params.userId}/order/${order.id}`}>
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <p className="font-semibold">{order.orderNumber}</p>
                    <p className="text-muted-foreground">Placed on {order.date}</p>
                    <p className="text-sm mt-1">{order.items} items</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${order.total.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">{order.status}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
