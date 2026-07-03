import { useState } from 'react'
import { useAppSelector } from '@/app/hooks'
import { useBookList } from '@/features/books/useBookList'
import BookCard from '@/components/books/BookCard'
import FilterPanel from '@/components/books/FilterPanel'
import { useSearchParams } from 'react-router-dom'

function CategoryPage() {
  const search = useAppSelector((state) => state.ui.search)
  const { data, isLoading, isError, error } = useBookList(search)

  const [searchParams] = useSearchParams()
  const categoryParam = searchParams.get('category')

  const [selectedCategories, setSelectedCategories] = useState<number[]>(
    categoryParam ? [Number(categoryParam)] : []
  )
  const [selectedRatings, setSelectedRatings] = useState<number[]>([])
  const [filterOpen, setFilterOpen] = useState(false)

  const toggleCategory = (id: number) =>
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  const toggleRating = (rating: number) =>
    setSelectedRatings((prev) =>
      prev.includes(rating) ? prev.filter((x) => x !== rating) : [...prev, rating]
    )

  const books = data?.data.books ?? []
  const minRating = selectedRatings.length > 0 ? Math.min(...selectedRatings) : 0

  const filtered = books.filter((book) => {
    const categoryOk =
      selectedCategories.length === 0 || selectedCategories.includes(book.categoryId)
    const ratingOk = book.rating >= minRating
    return categoryOk && ratingOk
  })

  const filterProps = {
    selectedCategories,
    selectedRatings,
    onToggleCategory: toggleCategory,
    onToggleRating: toggleRating,
  }

  return (
    <div className="mx-auto flex w-full max-w-300 flex-col gap-4 px-4 py-6 tracking-tight lg:gap-8 lg:px-8">
      <h1 className="text-display-xs font-bold text-neutral-950 lg:text-display-lg">
        Book List
      </h1>

      {/* Tombol FILTER (mobile) */}
      <button
        onClick={() => setFilterOpen(true)}
        className="flex items-center justify-between rounded-xl bg-white p-3 shadow-lg shadow-neutral-200/50 lg:hidden"
      >
        <span className="text-body-sm font-extrabold text-neutral-950">FILTER</span>
        <img src="/icons/filter-lines.svg" alt="" className="size-5" />
      </button>

      <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
        {/* Sidebar (desktop) */}
        <div className="hidden w-66.5 shrink-0 lg:block">
          <FilterPanel {...filterProps} />
        </div>

        {/* Grid */}
        <div className="w-full">
          {isLoading && <p className="text-body-md text-neutral-500">Memuat buku...</p>}
          {isError && <p className="text-body-md text-danger">Error: {error.message}</p>}
          {!isLoading && !isError && filtered.length === 0 && (
            <p className="text-body-md text-neutral-500">Tidak ada buku yang cocok.</p>
          )}
          {filtered.length > 0 && (
            <div className="grid w-full grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
              {filtered.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Drawer FILTER (mobile) */}
      {filterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="flex-1 bg-black/40" onClick={() => setFilterOpen(false)} />
          <div className="w-72 overflow-y-auto bg-neutral-50 p-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-body-lg font-bold text-neutral-950">Filter</span>
              <button onClick={() => setFilterOpen(false)}>
                <img src="/icons/close.svg" alt="Close" className="size-6" />
              </button>
            </div>
            <FilterPanel {...filterProps} />
          </div>
        </div>
      )}
    </div>
  )
}

export default CategoryPage