import { useBookReviews, type Review } from '@/features/reviews/useBookReviews'

function formatReviewDate(iso: string) {
  const d = new Date(iso)
  const date = d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const time = d.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return `${date}, ${time}`
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="flex w-full min-w-0 flex-col gap-4 rounded-2xl bg-white p-4 shadow-lg shadow-neutral-200/50">
      <div className="flex min-w-0 items-center gap-3">
        <img
          src="/avatar-placeholder.png"
          alt={review.user.name}
          className="h-14 w-14 shrink-0 rounded-full object-cover lg:h-16 lg:w-16"
        />

        <div className="flex min-w-0 flex-col">
          <p className="truncate text-body-sm font-bold text-neutral-950 lg:text-body-lg">
            {review.user.name}
          </p>
          <p className="whitespace-nowrap text-body-sm font-medium tracking-tight text-neutral-950 lg:text-body-md">
            {formatReviewDate(review.createdAt)}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center">
          {Array.from({ length: 5 }).map((_, index) => (
            <img
              key={index}
              src="/icons/star.svg"
              alt=""
              className={`h-6 w-6 ${index < review.star ? '' : 'opacity-30 grayscale'}`}
            />
          ))}
        </div>

        <p className="text-body-sm font-semibold text-neutral-950 lg:text-body-md">
          {review.comment}
        </p>
      </div>
    </div>
  )
}

interface ReviewSectionProps {
  bookId: number
  rating: number
  reviewCount: number
}

function ReviewSection({ bookId, rating, reviewCount }: ReviewSectionProps) {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useBookReviews(bookId)

  const reviews = data?.pages.flatMap((page) => page.data.reviews) ?? []

  return (
    <section className="flex w-full flex-col gap-4 tracking-tight">
      <div className="flex w-full flex-col gap-1 lg:gap-3">
        <h2 className="text-display-xs font-bold text-neutral-950 lg:text-display-lg">
          Review
        </h2>

        <div className="flex items-center gap-1">
          <img src="/icons/star.svg" alt="" className="h-6 w-6 lg:h-8 lg:w-8" />
          <span className="whitespace-nowrap text-body-md font-bold text-neutral-950 lg:text-body-xl">
            {rating.toFixed(1)} ({reviewCount} Ulasan)
          </span>
        </div>
      </div>

      {isLoading && (
        <p className="w-full text-body-md text-neutral-500">Memuat review...</p>
      )}

      {isError && (
        <p className="w-full text-body-md text-danger">Error: {error.message}</p>
      )}

      {reviews.length > 0 && (
        <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}

      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="mx-auto flex h-10 w-37.5 items-center justify-center rounded-full border border-neutral-300 text-body-sm font-bold text-neutral-950 disabled:opacity-60 lg:h-12 lg:w-50 lg:text-body-md"
        >
          {isFetchingNextPage ? 'Loading...' : 'Load More'}
        </button>
      )}
    </section>
  )
}

export default ReviewSection