'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/store/useCartStore'
import { useAuthStore } from '@/store/useAuthStore'
import { CartItem } from '@/components/page/cart/CartItem'
import { CartSummary } from '@/components/page/cart/CartSummary'
import { EmptyCart } from '@/components/page/cart/EmptyCart'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { withValidToken } from '@/lib/api/auth'
// Cart API
import {
  removeItemFromCart,
  updateCartItem,
  clearCart as clearCartApi
} from '@/lib/api/cart'

export default function CartPage() {
  const [hydrated, setHydrated] = useState(false)
  const router = useRouter()

  const cart = useCartStore(state => state.cart)
  const removeFromCartLocal = useCartStore(state => state.removeFromCart)
  const updateQuantityLocal = useCartStore(state => state.updateQuantity)
  const clearCartLocal = useCartStore(state => state.clearCart)

  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const getAccessToken = useAuthStore(state => state.getAccessToken)
  const isAccessTokenExpired = useAuthStore(state => state.isAccessTokenExpired)
  const getUser = useAuthStore(state => state.getUser)
  const logout = useAuthStore(state => state.logout)
  const setToken = useAuthStore(state => state.setToken)

  useEffect(() => {
    setHydrated(true)
  }, [])

  useEffect(() => {
    const validateAndRefresh = async () => {
      if (!hydrated) return

      if (!isAuthenticated) {
        router.push('/login')
        return
      }

      try {
        await withValidToken(
          async () => Promise.resolve(),
          { getAccessToken, isAccessTokenExpired, getUser, setToken, logout, router }
        )
      } catch (err) {
        toast.error('Session expired. Please log in again.')
        logout()
        router.push('/')
      }
    }

    validateAndRefresh()
  }, [isAuthenticated, hydrated])

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleUpdateQuantity = async (productId: number, quantity: number) => {
    updateQuantityLocal(productId, quantity)
    if (isAuthenticated) {
      try {
        await withValidToken(
          token => updateCartItem(productId, quantity, token),
          { getAccessToken, isAccessTokenExpired, getUser, setToken, logout, router }
        )
      } catch (err) {
        toast.error('Failed to update item in server cart')
        console.error(err)
      }
    }
  }

  const handleRemoveItem = async (productId: number) => {
    removeFromCartLocal(productId)
    if (isAuthenticated) {
      try {
        await withValidToken(
          token => removeItemFromCart(productId, token),
          { getAccessToken, isAccessTokenExpired, getUser, setToken, logout, router }
        )
      } catch (err) {
        toast.error('Failed to remove item from server cart')
        console.error(err)
      }
    }
  }

  const handleClearCart = async () => {
    clearCartLocal()
    if (isAuthenticated) {
      try {
        await withValidToken(
          token => clearCartApi(token),
          { getAccessToken, isAccessTokenExpired, getUser, setToken, logout, router }
        )
      } catch (err) {
        toast.error('Failed to clear server cart')
        console.error(err)
      }
    }
  }

  if (!hydrated) {
    return null
  }

  if (cart.length === 0) {
    return <EmptyCart />
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <Button variant="outline" onClick={handleClearCart}>
          Clear Cart
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onUpdateQuantity={handleUpdateQuantity}
              onRemove={handleRemoveItem}
            />
          ))}
        </div>

        <CartSummary total={total} />
      </div>
    </div>
  )
}
