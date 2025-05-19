'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'

const tabs = [
  { href: '/admin/product', label: 'Manage Products' },
  { href: '/admin/orders', label: 'Manage Orders' }
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen">
      <div className="w-full px-6 py-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        <div className="flex gap-4 mb-8 border-b pb-4">
          {tabs.map(tab => (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'px-6 py-3 rounded-md text-base font-semibold transition',
                pathname.startsWith(tab.href)
                  ? 'bg-black text-white'
                  : 'text-muted-foreground hover:bg-muted'
              )}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        <div className="w-full">
          {children}
        </div>
      </div>
    </div>
  )
}
