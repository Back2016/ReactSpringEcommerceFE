'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/admin/product') // or /admin/orders as default
  }, [router])

  return null
}
