import { Button } from '@/components/ui/button'

export function EmptyCart() {
  return (
    <div className="text-center py-12">
      <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
      <p className="text-muted-foreground mb-8">
        Looks like you haven't added any items to your cart yet.
      </p>
      <Button asChild>
        <a href="/">Continue Shopping</a>
      </Button>
    </div>
  )
}
