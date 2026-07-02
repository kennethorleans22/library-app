import { Link, useParams } from 'react-router-dom'
import { useBookDetail } from '@/features/books/useBookDetail'

function BookDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading, isError, error } = useBookDetail(id)

  if (isLoading) {
    return <p className="mx-auto max-w-[1200px] p-xl text-body-md text-neutral-500">Memuat...</p>
  }
  if (isError) {
    return <p className="mx-auto max-w-[1200px] p-xl text-body-md text-danger">Error: {error.message}</p>
  }
  if (!data) return null

  const book = data.data
  const outOfStock = book.availableCopies <= 0

  const stats = [
    { value: book.availableCopies, label: 'Stock' },
    { value: book.rating.toFixed(1), label: 'Rating' },
    { value: book.reviewCount, label: 'Reviews' },
  ]

  return (
    <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-4 pb-28 pt-xl tracking-[-0.02em] lg:px-8 md:pb-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-body-sm font-semibold">
        <Link to="/" className="text-primary-500">Home</Link>
        <img src="/icons/chevron-down.svg" alt="" className="h-4 w-4 -rotate-90" />
        <Link to="/category" className="text-primary-500">Category</Link>
        <img src="/icons/chevron-down.svg" alt="" className="h-4 w-4 -rotate-90" />
        <span className="line-clamp-1 text-neutral-950">{book.title}</span>
      </nav>

      {/* Cover + Info */}
      <div className="flex flex-col items-center gap-9 md:flex-row md:items-start">
        {/* Cover */}
        <div className="w-[222px] shrink-0 bg-neutral-200 p-1.5 md:w-[337px] md:p-2">
          <img
            src={book.coverImage}
            alt={book.title}
            className="aspect-[2/3] w-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex w-full flex-col gap-4 md:gap-5">
          <div className="flex flex-col gap-3">
            <span className="inline-flex w-fit items-center rounded-sm border border-neutral-300 px-2 text-body-sm font-bold text-neutral-950">
              {book.category.name}
            </span>
            <h1 className="text-display-xs font-bold text-neutral-950 md:text-display-sm">
              {book.title}
            </h1>
            <p className="text-body-sm font-semibold text-neutral-700 md:text-body-md">
              {book.author.name}
            </p>
            <div className="flex items-center gap-0.5">
              <img src="/icons/star.svg" alt="" className="h-6 w-6" />
              <span className="text-body-md font-bold text-neutral-900">
                {book.rating.toFixed(1)}
              </span>
            </div>
          </div>

                 {/* Stats */}
          <div className="flex w-full items-stretch">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`flex flex-1 flex-col md:w-[102px] md:flex-none ${
                  index > 0 ? 'border-l border-neutral-300 pl-5' : ''
                }`}
              >
                <span className="text-body-lg font-bold text-neutral-950 md:text-display-xs">
                  {stat.value}
                </span>
                <span className="text-body-md font-medium text-neutral-950">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          <hr className="border-neutral-300" />

          {/* Description */}
          <div className="flex flex-col gap-1">
            <h2 className="text-body-xl font-bold text-neutral-950">Description</h2>
            <p className="text-body-sm font-medium text-neutral-950 md:text-body-md">
              {book.description}
            </p>
          </div>

          {/* Tombol (desktop, inline) */}
          <div className="hidden gap-3 md:flex">
            <button
              onClick={() => console.log('Add to cart:', book.id)}
              className="flex h-12 w-[200px] items-center justify-center rounded-full border border-neutral-300 text-body-md font-bold text-neutral-950"
            >
              Add to Cart
            </button>
            <button
              onClick={() => console.log('Borrow:', book.id)}
              disabled={outOfStock}
              className="flex h-12 w-[200px] items-center justify-center rounded-full bg-primary-500 text-body-md font-bold text-neutral-25 disabled:opacity-60"
            >
              {outOfStock ? 'Out of Stock' : 'Borrow Book'}
            </button>
          </div>
        </div>
      </div>

      {/* Tombol (mobile, floating di bawah) */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex gap-3 bg-white p-4 shadow-[0px_0px_20px_rgba(203,202,202,0.25)] md:hidden">
        <button
          onClick={() => console.log('Add to cart:', book.id)}
          className="flex h-10 flex-1 items-center justify-center rounded-full border border-neutral-300 text-body-sm font-bold text-neutral-950"
        >
          Add to Cart
        </button>
        <button
          onClick={() => console.log('Borrow:', book.id)}
          disabled={outOfStock}
          className="flex h-10 flex-1 items-center justify-center rounded-full bg-primary-500 text-body-sm font-bold text-neutral-25 disabled:opacity-60"
        >
          {outOfStock ? 'Out of Stock' : 'Borrow Book'}
        </button>
      </div>
    </div>
  )
}

export default BookDetailPage