import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useMyReviews, type MyReview } from '@/features/reviews/useMyReviews'

const tabs = [
  { label: 'Profile', to: '/profile' },
  { label: 'Borrowed List', to: '/loans' },
  { label: 'Reviews', to: '/reviews' },
]

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

function ReviewStars({ star }: { star: number }) {
  return (
    <div className="flex h-6 items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, index) => (
        <img
          key={index}
          src="/icons/star.svg"
          alt=""
          className={`size-6 ${index < star ? '' : 'opacity-40 grayscale'}`}
        />
      ))}
    </div>
  )
}

function ReviewCard({ review }: { review: MyReview }) {
  return (
    <article className="flex w-full flex-col gap-4 rounded-2xl bg-white p-4 shadow-card lg:gap-5 lg:p-5">
      <p className="text-body-sm font-semibold tracking-figma-tight text-neutral-950 lg:text-body-md">
        {formatReviewDate(review.createdAt)}
      </p>

      <hr className="w-full border-neutral-300" />

      <div className="flex items-center gap-3 lg:gap-4">
        <img
          src={review.book.coverImage}
          alt={review.book.title}
          className="h-26.5 w-17.5 shrink-0 object-cover lg:h-34.5 lg:w-23"
        />

        <div className="flex min-w-0 flex-col gap-1">
          <span className="flex h-7 w-fit items-center rounded-sm border border-neutral-300 px-2 text-body-sm font-bold tracking-figma-tight text-neutral-950">
            {review.book.category.name}
          </span>

          <h2 className="line-clamp-1 text-body-md font-bold tracking-figma-tight text-neutral-950 lg:text-body-xl">
            {review.book.title}
          </h2>

          <p className="line-clamp-1 text-body-sm font-medium tracking-figma-tighter text-neutral-700 lg:text-body-md">
            {review.book.author.name}
          </p>
        </div>
      </div>

      <hr className="w-full border-neutral-300" />

      <div className="flex flex-col gap-2">
        <ReviewStars star={review.star} />

        <p className="text-body-sm font-semibold leading-7 tracking-figma-tight text-neutral-950 lg:text-body-md">
          {review.comment || 'No written comment.'}
        </p>
      </div>
    </article>
  )
}

function ReviewsPage() {
  const [search, setSearch] = useState('')
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMyReviews(search)

  const reviews = data?.pages.flatMap((page) => page.data.reviews) ?? []

  return (
    <div className="mx-auto flex w-full max-w-98.25 flex-col gap-3.75 px-4 pb-16 pt-4 tracking-figma-tight lg:max-w-250 lg:gap-6 lg:px-0 lg:pb-20 lg:pt-10">
      <div className="grid h-14 w-full grid-cols-3 gap-2 rounded-2xl bg-neutral-100 p-2 lg:w-139.25">
        {tabs.map((tab) => {
          const active = tab.label === 'Reviews'

          return (
            <Link
              key={tab.label}
              to={tab.to}
              className={`flex h-10 items-center justify-center whitespace-nowrap rounded-xl px-1 text-body-sm lg:px-3 lg:text-body-md ${
                active
                  ? 'bg-white font-bold tracking-figma-tight text-neutral-950 shadow-card'
                  : 'font-medium tracking-figma-tighter text-neutral-600'
              }`}
            >
              {tab.label}
            </Link>
          )
        })}
      </div>

      <h1 className="text-display-xs font-bold text-neutral-950 lg:text-display-sm">
        Reviews
      </h1>

      <div className="flex h-11 w-full items-center gap-1.5 rounded-full border border-neutral-300 bg-white px-4 lg:h-12 lg:w-136">
        <img src="/icons/search.svg" alt="" className="size-5" />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search Reviews"
          className="min-w-0 flex-1 bg-transparent text-body-sm font-medium tracking-figma-tighter text-neutral-950 outline-none placeholder:text-neutral-600"
        />
      </div>

      {isLoading && (
        <p className="text-body-md font-medium text-neutral-500">Memuat reviews...</p>
      )}

      {isError && (
        <p className="text-body-md font-medium text-danger">Error: {error.message}</p>
      )}

      {!isLoading && reviews.length === 0 && (
        <div className="flex min-h-60 w-full flex-col items-center justify-center gap-2 rounded-2xl bg-white p-6 text-center shadow-card">
          <h2 className="text-body-lg font-bold tracking-figma-tight text-neutral-950">
            No books reviewed yet
          </h2>
          <p className="max-w-80 text-body-sm font-medium tracking-figma-tighter text-neutral-600">
            Reviews you submit from your borrowed books will appear here.
          </p>
        </div>
      )}

      {reviews.length > 0 && (
        <div className="flex w-full flex-col gap-4 lg:gap-5">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}

      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="mx-auto flex h-12 w-50 items-center justify-center rounded-full border border-neutral-300 text-body-md font-bold tracking-figma-tight text-neutral-950 disabled:opacity-60"
        >
          {isFetchingNextPage ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  )
}

export default ReviewsPage