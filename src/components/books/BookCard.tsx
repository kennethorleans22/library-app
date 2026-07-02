import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Book } from '@/types'

function BookCard({ book }: { book: Book }) {
  const [imgError, setImgError] = useState(false)

  return (
    <Link
      to={`/books/${book.id}`}
      className="flex flex-col overflow-hidden rounded-xl bg-white shadow-[0px_0px_20px_rgba(203,202,202,0.25)]"
    >
      {imgError ? (
        <div className="flex aspect-[2/3] w-full items-center justify-center bg-neutral-100 p-4 text-center text-body-sm font-semibold text-neutral-400">
          No Cover
        </div>
      ) : (
        <img
          src={book.coverImage}
          alt={book.title}
          onError={() => setImgError(true)}
          className="aspect-[2/3] w-full object-cover"
        />
      )}

      <div className="flex flex-col gap-0.5 p-3 md:gap-1 md:p-4">
        <h3 className="line-clamp-1 text-body-sm font-bold text-neutral-900 md:text-body-lg">
          {book.title}
        </h3>
        <p className="line-clamp-1 text-body-sm font-medium text-neutral-700 md:text-body-md">
          {book.author.name}
        </p>
        <div className="flex items-center gap-0.5">
          <img src="/icons/star.svg" alt="" className="h-6 w-6" />
          <span className="text-body-sm font-semibold text-neutral-900 md:text-body-md">
            {book.rating.toFixed(1)}
          </span>
        </div>
      </div>
    </Link>
  )
}

export default BookCard