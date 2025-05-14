import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { BASE_URL } from '@/lib/config'
import Link from 'next/link'

// Dummy data
const dummyOrder = {
  id: 1,
  orderNumber: 'ORD-001',
  date: '2024-03-20',
  status: 'Delivered',
  total: 299.99,
  items: [
    {
      id: 4,
      name: 'Premium Headphones',
      price: 199.99,
      quantity: 1,
      image: { id: 4 }
    },
    {
      id: 2,
      name: 'Wireless Mouse',
      price: 49.99,
      quantity: 2,
      image: { id: 2 }
    }
  ],
  shippingAddress: {
    street: '123 Main St',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'USA'
  }
}

export default function OrderPage({ params }: { params: { userId: string; orderId: string } }) {
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" asChild>
          <Link href={`/orders/${params.userId}`}>← Back to Orders</Link>
        </Button>
        <h1 className="text-2xl font-bold">Order {dummyOrder.orderNumber}</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Order Details</h2>
              <div className="space-y-2">
                <p><span className="text-muted-foreground">Order Date:</span> {dummyOrder.date}</p>
                <p><span className="text-muted-foreground">Status:</span> {dummyOrder.status}</p>
                <p><span className="text-muted-foreground">Total:</span> ${dummyOrder.total.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
              <div className="space-y-1">
                <p>{dummyOrder.shippingAddress.street}</p>
                <p>{dummyOrder.shippingAddress.city}, {dummyOrder.shippingAddress.state} {dummyOrder.shippingAddress.zipCode}</p>
                <p>{dummyOrder.shippingAddress.country}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Order Items</h2>
            <div className="space-y-4">
              {dummyOrder.items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-20 h-20 relative">
                    <img
                      src={`${BASE_URL}/api/v1/images/image/download/${item.image.id}`}
                      alt={item.name}
                      className="object-cover rounded-lg w-full h-full"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-muted-foreground">${item.price}</p>
                    <p className="text-sm">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
