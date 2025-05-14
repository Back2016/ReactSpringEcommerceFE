'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getCart, syncCart, addItemToCart, updateCartItem, removeItemFromCart } from '@/lib/api/cart'
import { useAuthStore } from '@/store/useAuthStore'
import { SyncCartRequest } from '@/lib/types'
import toast from 'react-hot-toast'

export default function CartTestPage() {
  const [cartData, setCartData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const { getAccessToken, getUserId } = useAuthStore()

  const handleGetCart = async () => {
    try {
      setLoading(true)
      const token = getAccessToken()
      const userId = getUserId()

      if (!token || !userId) {
        toast.error('Please login first')
        return
      }

      const response = await getCart(userId.toString(), token)
      setCartData(response)
      toast.success('Cart fetched successfully')
    } catch (error) {
      toast.error('Failed to fetch cart')
      console.error('Get cart error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSyncCart = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setLoading(true)
      const token = getAccessToken()
      const userId = getUserId()

      if (!token || !userId) {
        toast.error('Please login first')
        return
      }

      const formData = new FormData(e.currentTarget)
      const syncRequest: SyncCartRequest = {
        productId: Number(formData.get('productId')),
        quantity: Number(formData.get('quantity'))
      }

      const response = await syncCart(userId.toString(), token, [syncRequest])
      setCartData(response)
      toast.success('Cart synced successfully')
    } catch (error) {
      toast.error('Failed to sync cart')
      console.error('Sync cart error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setLoading(true)
      const token = getAccessToken()
      if (!token) {
        toast.error('Please login first')
        return
      }

      const formData = new FormData(e.currentTarget)
      const productId = Number(formData.get('addProductId'))
      const quantity = Number(formData.get('addQuantity'))

      await addItemToCart(productId, quantity, token)
      await handleGetCart() // Refresh cart data
      toast.success('Item added to cart')
    } catch (error) {
      toast.error('Failed to add item to cart')
      console.error('Add to cart error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateCart = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setLoading(true)
      const token = getAccessToken()
      if (!token) {
        toast.error('Please login first')
        return
      }

      const formData = new FormData(e.currentTarget)
      const productId = Number(formData.get('updateProductId'))
      const quantity = Number(formData.get('updateQuantity'))

      await updateCartItem(productId, quantity, token)
      await handleGetCart() // Refresh cart data
      toast.success('Cart item updated')
    } catch (error) {
      toast.error('Failed to update cart item')
      console.error('Update cart error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFromCart = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setLoading(true)
      const token = getAccessToken()
      if (!token) {
        toast.error('Please login first')
        return
      }

      const formData = new FormData(e.currentTarget)
      const productId = Number(formData.get('removeProductId'))

      await removeItemFromCart(productId, token)
      await handleGetCart() // Refresh cart data
      toast.success('Item removed from cart')
    } catch (error) {
      toast.error('Failed to remove item from cart')
      console.error('Remove from cart error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">Cart API Test Page</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Get Cart</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleGetCart}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Loading...' : 'Get Cart'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sync Cart</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSyncCart} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="productId">Product ID</Label>
                <Input
                  id="productId"
                  name="productId"
                  type="number"
                  required
                  placeholder="Enter product ID"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  required
                  min="1"
                  placeholder="Enter quantity"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Syncing...' : 'Sync Cart'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add to Cart</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddToCart} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="addProductId">Product ID</Label>
                <Input
                  id="addProductId"
                  name="addProductId"
                  type="number"
                  required
                  placeholder="Enter product ID"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="addQuantity">Quantity</Label>
                <Input
                  id="addQuantity"
                  name="addQuantity"
                  type="number"
                  required
                  min="1"
                  placeholder="Enter quantity"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Adding...' : 'Add to Cart'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Update Cart Item</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateCart} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="updateProductId">Product ID</Label>
                <Input
                  id="updateProductId"
                  name="updateProductId"
                  type="number"
                  required
                  placeholder="Enter product ID"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="updateQuantity">New Quantity</Label>
                <Input
                  id="updateQuantity"
                  name="updateQuantity"
                  type="number"
                  required
                  min="0"
                  placeholder="Enter new quantity"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Updating...' : 'Update Item'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Remove from Cart</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRemoveFromCart} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="removeProductId">Product ID</Label>
                <Input
                  id="removeProductId"
                  name="removeProductId"
                  type="number"
                  required
                  placeholder="Enter product ID"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Removing...' : 'Remove Item'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {cartData && (
        <Card>
          <CardHeader>
            <CardTitle>Response Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="font-semibold">Cart ID: {cartData.cartId}</p>
                <p className="font-semibold">Total Amount: ${cartData.totalAmount}</p>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Items:</h3>
                {cartData.items.map((item: any) => (
                  <div key={item.itemId} className="border p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{item.product?.name}</p>
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                        <p className="text-sm text-muted-foreground">Product Id: {item.product?.id}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${item.unitPrice}</p>
                        <p className="text-sm text-muted-foreground">Total: ${item.totalPrice}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
