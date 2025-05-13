import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CardProduct} from '@/lib/types'
import { getPublicUrl } from '@/lib/utils';


interface ProductCardProps {
    product: CardProduct
    onAddToCart: (product: CardProduct) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <Link href={`/product/${product.id}`} className="block">
                <CardHeader className="p-0">
                    <div className="aspect-square relative">
                        <img
                            src={getPublicUrl(`/api/v1/images/image/download/${product.image.id}`)}
                            alt={product.name}
                            className="object-cover w-full h-full"
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-semibold">{product.name}</h3>
                            {product.category && (
                                <p className="text-sm text-muted-foreground">{product.category.name}</p>
                            )}
                        </div>
                        <p className="text-lg font-bold">${product.price}</p>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{product.description}</p>
                </CardContent>
            </Link>
            <CardFooter className="p-4 pt-0">
                <Button
                    className="w-full"
                    onClick={() => onAddToCart(product)}
                >
                    Add to Cart
                </Button>
            </CardFooter>
        </Card>
    )
}
