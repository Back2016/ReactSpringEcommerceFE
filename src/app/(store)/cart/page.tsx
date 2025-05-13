'use client'

import { Button } from '@/components/ui/button'
import { useCartStore } from '@/store/useCartStore'
import { CartItem } from '@/components/page/cart/CartItem'
import { CartSummary } from '@/components/page/cart/CartSummary'
import { EmptyCart } from '@/components/page/cart/EmptyCart'

export default function CartPage() {
  const cart = useCartStore((state) => state.cart)
  const removeFromCart = useCartStore((state) => state.removeFromCart)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const clearCart = useCartStore((state) => state.clearCart)

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (cart.length === 0) {
    return <EmptyCart />
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <Button variant="outline" onClick={() => clearCart()}>
          Clear Cart
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeFromCart}
            />
          ))}
        </div>

        <CartSummary total={total} />
      </div>
    </div>
  )
}
