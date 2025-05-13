'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
}

export function PaginationControls({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [inputPage, setInputPage] = useState('')

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`${pathname}?${params.toString()}`)
  }

  // Show up to 3 pages: [prev, current, next]
  const pagesToShow = Array.from({ length: 4 }, (_, i) => currentPage - 1 + i)
    .filter((page) => page >= 1 && page <= totalPages)

  return (
    <div className="flex flex-col items-center gap-4 mt-8">
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          variant="outline"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>

        {pagesToShow.map((page) => (
          <button
            key={page}
            onClick={() => goToPage(page)}
            className={`rounded-full w-10 h-10 flex items-center justify-center border text-sm font-medium
              ${page === currentPage ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
          >
            {page}
          </button>
        ))}

        <Button
          variant="outline"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="number"
          min={1}
          max={totalPages}
          placeholder={`Page ${currentPage} of ${totalPages}`}
          className="border rounded px-2 py-1 text-sm w-28"
          value={inputPage}
          onChange={(e) => setInputPage(e.target.value)}
        />
        <Button
          variant="secondary"
          onClick={() => {
            const page = parseInt(inputPage)
            if (!isNaN(page) && page >= 1 && page <= totalPages) {
              goToPage(page)
              setInputPage('')
            }
          }}
        >
          <ArrowRightIcon className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
