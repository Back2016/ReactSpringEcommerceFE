// src/components/layout/Footer.tsx
import Link from 'next/link'
import { Facebook, Instagram, Twitter } from 'lucide-react'

export function Footer() {
  return (
    <div className="border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">DemoBuy</h3>
            <p className="text-sm text-muted-foreground">
              Your one-stop shop for all your needs. Quality products, great prices, and excellent service.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-sm text-muted-foreground hover:text-foreground">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-sm text-muted-foreground hover:text-foreground">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Customer Service</h3>
            <ul className="space-y-3">
              <li>
                <p className="text-sm text-muted-foreground hover:text-foreground">
                  Shipping Policy
                </p>
              </li>
              <li>
                <p className="text-sm text-muted-foreground hover:text-foreground">
                  Returns & Refunds
                </p>
              </li>
              <li>
                <p className="text-sm text-muted-foreground hover:text-foreground">
                  FAQ
                </p>
              </li>
              <li>
                <p className="text-sm text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </p>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Follow Us</h3>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} DemoBuy. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
