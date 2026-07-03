import { useParams } from 'react-router-dom'
import { useAuthorBooks } from '@/features/authors/useAuthorBooks'
import BookCard from '@/components/books/BookCard'

function AuthorBooksPage() {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading, isError, error } = useAuthorBooks(id)

  if (isLoading) {
    return <p className="mx-auto max-w-300 p-xl text-body-md text-neutral-500">Memuat...</p>
  }
  if (isError) {
    return <p className="mx-auto max-w-300 p-xl text-body-md text-danger">Error: {error.message}</p>
  }
  if (!data) return null

  const { author, bookCount, books } = data.data

  return (
    <div className="mx-auto flex w-full max-w-300 flex-col gap-4 px-4 py-6 tracking-tight lg:gap-10 lg:px-8">
      {/* Kartu penulis */}
      <div className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-lg shadow-neutral-200/50 lg:gap-4 lg:p-4">
        <img
          src="/avatar-placeholder.png"
          alt={author.name}
          className="size-15 shrink-0 rounded-full object-cover lg:size-20.25"
        />
        <div className="flex flex-col gap-0.5">
          <p className="text-body-md font-bold text-neutral-900 lg:text-body-lg">
            {author.name}
          </p>
          <div className="flex items-center gap-1.5">
            <img src="/icons/book.svg" alt="" className="size-6" />
            <span className="text-body-sm font-medium text-neutral-950 lg:text-body-md">
              {bookCount} books
            </span>
          </div>
        </div>
      </div>

      {/* Book List */}
      <div className="flex flex-col gap-4 lg:gap-8">
        <h1 className="text-display-xs font-bold text-neutral-950 lg:text-display-lg">
          Book List
        </h1>

        {books.length > 0 ? (
          <div className="grid w-full grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-5">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <p className="text-body-md text-neutral-500">Penulis ini belum punya buku.</p>
        )}
      </div>
    </div>
  )
}

export default AuthorBooksPage