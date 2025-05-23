'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingCart, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/store/useCartStore'
import { useAuthStore } from '@/store/useAuthStore'
import { logout as apiLogout } from '@/lib/api/auth'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { User, LogOut } from 'lucide-react'
export function Navbar() {
  const router = useRouter()
  const cart = useCartStore((state) => state.cart)
  const clearCart = useCartStore((state) => state.clearCart)
  const { isAuthenticated, logout, user, getUserId } = useAuthStore()
  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0)

  const handleLogout = async () => {
    try {
      const response = await apiLogout()
      console.log('Logout response:', response)
      logout()
      clearCart()
      router.replace('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const isAdmin = user?.role === 'ADMIN';

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-4xl font-bold flex items-center gap-2">
            DemoBuy
            <ShoppingCart className="h-10 w-10" />
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/products">
              <Button variant="ghost">All Products</Button>
            </Link>
            <Link href="/categories">
              <Button variant="ghost">Shop By Categories</Button>
            </Link>
            <Link href="/cart">
              <Button variant="ghost" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {cartItemsCount}
                  </span>
                )}
              </Button>
            </Link>
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <User className="h-5 w-5" />
                    {user.firstName}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">Admin Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href={`/profile/${getUserId()}`}>Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/orders/${getUserId()}`}>Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="focus:text-red-600"
                  >
                    Logout
                    <LogOut className="ml-2 h-4 w-4" />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button variant="outline" className="gap-2">
                  <LogIn className="h-4 w-4" />
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
