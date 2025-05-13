import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { BASE_URL } from '@/lib/config'
import { CardProduct } from '@/lib/types'
import { Trash } from 'lucide-react'
import Link from 'next/link'

interface CartItemProps {
  item: CardProduct & { quantity: number }
  onUpdateQuantity: (id: number, quantity: number) => void
  onRemove: (id: number) => void
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex gap-4">
          <div className="w-24 h-24 relative">
            <img
              src={`${BASE_URL}/api/v1/images/image/download/${item.image.id}`}
              alt={item.name}
              className="object-cover rounded-lg w-full h-full"
            />
            <Link href={`/product/${item.id}`} className="absolute inset-0"></Link>
          </div>
          <div className="flex-1">
            <Link href={`/product/${item.id}`} className="font-semibold">{item.name}</Link>
            <p className="text-muted-foreground">${item.price}</p>
            <div className="flex items-center gap-4 mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
              >
                -
              </Button>
              <span>{item.quantity}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              >
                +
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-800"
                onClick={() => onRemove(item.id)}
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
