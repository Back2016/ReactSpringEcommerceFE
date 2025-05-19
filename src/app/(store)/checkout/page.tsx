'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'

export default function CheckoutPage() {
  const router = useRouter()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const getUserId = useAuthStore((state) => state.getUserId)

  useEffect(() => {
    if (isAuthenticated) {
      const userId = getUserId()
      router.replace(`/checkout/user`)
    } else {
      router.replace('/checkout/guest')
    }
  }, [isAuthenticated, getUserId, router])

  return null
}
