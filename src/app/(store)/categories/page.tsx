import { Card } from '@/components/ui/card'
import { fetchCategories } from '@/lib/api/category'
import { Category } from '@/lib/types'
import { convertAmpersandToHyphen } from '@/lib/utils';
import Link from 'next/link'

export default async function CategoriesPage() {
    const categories = await fetchCategories();

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold mb-12 text-center">Shop by Category</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:grid-cols-4 gap-8">
                {categories.map((category: Category) => (
                    <Link
                        key={category.id}
                        href={`/categories/${convertAmpersandToHyphen(category.name)}`}
                        className="block group"
                    >
                        <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
                            <div className="aspect-square relative">
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/40 transition-opacity duration-300 group-hover:bg-black/50" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <h2 className="text-2xl font-bold text-white">{category.name}</h2>
                                </div>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}
