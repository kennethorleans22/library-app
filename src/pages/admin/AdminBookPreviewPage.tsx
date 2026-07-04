import { useParams, useNavigate } from 'react-router-dom'
import { useBookDetail } from '@/features/books/useBookDetail'
import { useAddToCart } from '@/features/cart/useAddToCart'

function AdminBookPreviewPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data, isLoading, isError, error } = useBookDetail(id)
  const addToCart = useAddToCart()

  if (isLoading) return <p className="text-body-md text-neutral-500">Memuat...</p>
  if (isError) return <p className="text-body-md text-danger">Error: {error.message}</p>
  if (!data) return null

  const book = data.data
  const stats = [
    { value: book.availableCopies, label: 'Stock' },
    { value: book.rating.toFixed(1), label: 'Rating' },
    { value: book.reviewCount, label: 'Reviews' },
  ]

  // Borrow: masukkan ke cart lalu ke checkout (sama seperti Book Detail user)
  const handleBorrow = async () => {
    try {
      await addToCart.mutateAsync(book.id)
    } catch {
      // kemungkinan sudah ada di cart — abaikan, tetap lanjut
    }
    navigate('/checkout', { state: { bookId: book.id } })
  }

  return (
    <div className="flex flex-col gap-6 pb-28 tracking-[-0.02em] lg:gap-8 lg:pb-0">
      {/* Header back */}
      <button onClick={() => navigate('/admin/books')} className="flex w-fit items-center gap-1.5 lg:gap-3">
        <img src="/icons/arrow-left.svg" alt="Back" className="h-6 w-6 lg:h-8 lg:w-8" />
        <span className="text-body-xl font-bold text-neutral-950 lg:text-display-sm">Preview Book</span>
      </button>

      {/* Cover + Info */}
      <div className="flex flex-col items-center gap-9 lg:flex-row lg:items-start">
        {/* Cover */}
        <div className="w-55.5 shrink-0 bg-neutral-200 p-1.5 lg:w-84.25 lg:p-2">
          <img src={book.coverImage} alt={book.title} className="aspect-2/3 w-full object-cover" />
        </div>

        {/* Info */}
        <div className="flex w-full flex-col gap-4 lg:gap-5">
          <div className="flex flex-col gap-2 lg:gap-3">
            <span className="inline-flex w-fit items-center rounded-sm border border-neutral-300 px-2 text-body-sm font-bold text-neutral-950">
              {book.category.name}
            </span>
            <h1 className="text-display-xs font-bold text-neutral-950 lg:text-display-sm">{book.title}</h1>
            <p className="text-body-sm font-semibold text-neutral-700 lg:text-body-md">{book.author.name}</p>
            <div className="flex items-center gap-0.5">
              <img src="/icons/star.svg" alt="" className="h-6 w-6" />
              <span className="text-body-md font-bold text-neutral-900">{book.rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-5">
            {stats.map((stat, i) => (
              <div key={stat.label} className="contents">
                {i > 0 && <div className="h-15 w-px shrink-0 bg-neutral-300 lg:h-16.5" />}
                <div className="flex flex-1 flex-col lg:w-25.5 lg:flex-none">
                  <span className="text-body-lg font-bold text-neutral-950 lg:text-display-xs">{stat.value}</span>
                  <span className="text-body-sm font-medium text-neutral-950 lg:text-body-md">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>

          <hr className="border-neutral-300 lg:w-139.75" />

          {/* Description */}
          <div className="flex flex-col gap-1">
            <h2 className="text-body-xl font-bold text-neutral-950">Description</h2>
            <p className="text-body-sm font-medium text-neutral-950 lg:text-body-md">{book.description}</p>
          </div>

          {/* Buttons desktop (inline) */}
          <div className="hidden gap-3 lg:flex">
            <button
              onClick={() => addToCart.mutate(book.id)}
              disabled={addToCart.isPending}
              className="flex h-12 w-50 items-center justify-center rounded-full border border-neutral-300 text-body-md font-bold text-neutral-950 disabled:opacity-60"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBorrow}
              disabled={addToCart.isPending}
              className="flex h-12 w-50 items-center justify-center rounded-full bg-primary-500 text-body-md font-bold text-neutral-25 disabled:opacity-60"
            >
              Borrow Book
            </button>
          </div>
        </div>
      </div>

      {/* Buttons mobile — bar mengambang + share */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 bg-white p-4 shadow-[0px_0px_20px_rgba(203,202,202,0.25)] lg:hidden">
        <button
          onClick={() => addToCart.mutate(book.id)}
          disabled={addToCart.isPending}
          className="flex h-10 flex-1 items-center justify-center rounded-full border border-neutral-300 text-body-sm font-bold text-neutral-950 disabled:opacity-60"
        >
          Add to Cart
        </button>
        <button
          onClick={handleBorrow}
          disabled={addToCart.isPending}
          className="flex h-10 flex-1 items-center justify-center rounded-full bg-primary-500 text-body-sm font-bold text-neutral-25 disabled:opacity-60"
        >
          Borrow Book
        </button>
        <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-neutral-300">
          <img src="/icons/share.svg" alt="Share" className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}

export default AdminBookPreviewPage