import { Category } from '@/lib/types'

const categories: Category[] = [
  { id: 1, name: 'Electronics', image: '/images/categoryImage/electronics.jpg' },
  { id: 2, name: 'Fashion', image: '/images/categoryImage/fashion.jpg' },
  { id: 3, name: 'Home & Living', image: '/images/categoryImage/home-living.jpg' },
  { id: 4, name: 'Sports', image: '/images/categoryImage/sports.jpg' },
  { id: 5, name: 'Books', image: '/images/categoryImage/books.jpg' },
  { id: 6, name: 'Beauty', image: '/images/categoryImage/beauty.jpg' },
  { id: 7, name: 'Toys', image: '/images/categoryImage/toys.jpg' },
  { id: 8, name: 'Garden', image: '/images/categoryImage/garden.jpg' },
]

export async function fetchCategories(): Promise<Category[]> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(categories)
    }, 100)
  })
}
