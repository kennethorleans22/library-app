import { useRecommendedBooks } from '@/features/books/useRecommendedBooks'
import BookCard from '@/components/books/BookCard'

function RecommendationSection() {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useRecommendedBooks()

  // Gabungkan semua halaman jadi satu daftar buku
  const books = data?.pages.flatMap((page) => page.data.books) ?? []

  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 lg:px-8">
      <div className="flex flex-col items-center gap-2xl md:gap-5xl">
        <h2 className="w-full text-display-xs font-bold text-neutral-950 md:text-display-lg">
          Recommendation
        </h2>

        {isLoading && (
          <p className="text-body-md text-neutral-500">Memuat rekomendasi...</p>
        )}
        {isError && (
          <p className="text-body-md text-danger">Error: {error.message}</p>
        )}

        {books.length > 0 && (
          <div className="grid w-full grid-cols-2 gap-4 md:grid-cols-5 md:gap-5">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}

        {hasNextPage && (
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="flex h-10 w-[150px] items-center justify-center rounded-full border border-neutral-300 text-body-sm font-bold text-neutral-950 disabled:opacity-60 md:h-12 md:w-[200px] md:text-body-md"
          >
            {isFetchingNextPage ? 'Loading...' : 'Load More'}
          </button>
        )}
      </div>
    </section>
  )
}

export default RecommendationSection