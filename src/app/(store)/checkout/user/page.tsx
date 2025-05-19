'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/useCartStore'
import { placeOrder } from '@/lib/api/order'
import { getAddresses } from '@/lib/api/address'
import { PlaceOrderRequest, AddressDto, Order } from '@/lib/types'
import { toast } from 'react-hot-toast'
import { useAuthStore } from '@/store/useAuthStore'
import { withValidToken } from '@/lib/api/auth'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AddressModal } from '@/components/page/address/AddressModal'
import { MapPin } from 'lucide-react'

export default function UserCheckoutPage() {
  const router = useRouter()
  const cart = useCartStore((state) => state.cart)
  const clearCart = useCartStore((state) => state.clearCart)

  const { getAccessToken, isAccessTokenExpired, getUser, setToken, logout } = useAuthStore()
  const [hydrated, setHydrated] = useState(false)
  const [addresses, setAddresses] = useState<AddressDto[]>([])
  const [shippingId, setShippingId] = useState<string>('')
  const [billingId, setBillingId] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    withValidToken(
      async (token) => {
        const data = await getAddresses(token)
        setAddresses(data)
        const defShip = data.find(a => a.defaultShipping)
        const defBill = data.find(a => a.defaultBilling)
        if (defShip) setShippingId(String(defShip.id))
        if (defBill) setBillingId(String(defBill.id))
      },
      { getAccessToken, isAccessTokenExpired, getUser, setToken, logout, router }
    )
  }, [hydrated])

  const handlePlaceOrder = () => {
    if (!shippingId || !billingId) {
      toast.error('Please select both shipping and billing addresses.')
      return
    }
    withValidToken(
      async (token) => {
        setIsLoading(true)
        const req: PlaceOrderRequest = {
          shippingAddressId: Number(shippingId),
          billingAddressId: Number(billingId),
        }
        const placed: Order = await placeOrder(req, token)
        toast.success('Order placed successfully!')
        clearCart()
        window.location.href = `/checkout/user/success?orderId=${placed.id}`
      },
      { getAccessToken, isAccessTokenExpired, getUser, setToken, logout, router }
    ).finally(() => setIsLoading(false))
  }

  if (!hydrated) {
    return null
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 p-8">
      {/* Address Selection */}
      <div className="space-y-6">
        <h2 className="text-2xl justify-end font-semibold">Checkout</h2>

        {/* Shipping Address with inline Add Button */}
        <div className="space-y-2">
          <Label className="flex justify-between items-center">
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Shipping Address
            </span>
            <Button size="sm" variant="outline" onClick={() => setShowModal(true)}>
              + New Address
            </Button>
          </Label>
          {addresses.length ? (
            <Select value={shippingId} onValueChange={setShippingId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select shipping address" />
              </SelectTrigger>
              <SelectContent>
                {addresses.map(addr => (
                  <SelectItem key={addr.id} value={String(addr.id)}>
                    {addr.recipientName}, {addr.street}, {addr.city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="text-sm text-gray-500">No addresses. Please add one.</div>
          )}
        </div>

        <div>
          <Label className="flex items-center gap-2">
            <MapPin className="w-4 h-4" /> Billing Address
          </Label>
          {addresses.length ? (
            <Select value={billingId} onValueChange={setBillingId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select billing address" />
              </SelectTrigger>
              <SelectContent>
                {addresses.map(addr => (
                  <SelectItem key={addr.id} value={String(addr.id)}>
                    {addr.recipientName}, {addr.street}, {addr.city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="text-sm text-gray-500">No addresses. Please add one.</div>
          )}
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => router.push('/cart')} disabled={isLoading}>
            Cancel
          </Button>

          <Button onClick={handlePlaceOrder} disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Submit Order'}
          </Button>
        </div>
      </div>

      {/* Cart Summary */}
      <div className="border p-6 rounded-md space-y-4">
        <h3 className="text-xl font-semibold">Your Cart</h3>
        {cart.map(item => (
          <div key={item.id} className="flex items-center justify-between gap-4 py-2 border-b">
            <img
              src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/images/image/download/${item.image.id}`}
              alt={item.name}
              className="w-20 h-20 rounded-md object-cover border"
            />
            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
            </div>
            <p className="font-semibold">${(item.price * (item.quantity || 1)).toFixed(2)}</p>
          </div>
        ))}
        <hr />
        <p className="font-bold text-right">
          Total: $ {cart.reduce((sum, it) => sum + it.price * (it.quantity || 1), 0).toFixed(2)}
        </p>
      </div>

      {showModal && (
        <AddressModal
          mode="add"
          onClose={() => setShowModal(false)}
          onSuccess={(addr) => {
            setAddresses(prev => [...prev, addr])
            if (addr.defaultShipping) setShippingId(String(addr.id))
            if (addr.defaultBilling) setBillingId(String(addr.id))
            setShowModal(false)
          }}
        />
      )}
    </div>
  )
}
