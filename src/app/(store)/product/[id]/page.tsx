import { notFound } from 'next/navigation'
import { fetchProduct } from '@/lib/api/product'
import { ProductPage } from '@/components/page/product/ProductPage'
export default async function Page({ params }: { params: { id: string } }) {
  try {
    const product = await fetchProduct(params.id)
    return <ProductPage product={product} />
  } catch (error) {
    console.error('Error loading product:', error)
    notFound()
  }
}
