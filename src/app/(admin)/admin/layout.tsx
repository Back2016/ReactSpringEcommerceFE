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
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

        <div className="flex gap-4 mb-6 border-b pb-2">
          {tabs.map(tab => (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium',
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
