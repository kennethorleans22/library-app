import { useBooks } from '@/features/books/useBooks'

function BookListPage() {
  const { data, isLoading, isError, error } = useBooks()

  if (isLoading) {
    return <p className="p-xl text-body-md text-neutral-500">Memuat buku...</p>
  }

  if (isError) {
    return <p className="p-xl text-body-md text-accent-red">Error: {error.message}</p>
  }

  return (
    <div className="mx-auto max-w-3xl p-xl">
      <h1 className="mb-xl text-display-sm font-bold text-neutral-900">
        Daftar Buku
      </h1>
      <ul className="flex flex-col gap-md">
        {data?.data.books.map((book) => (
          <li key={book.id} className="rounded-xl border border-neutral-200 p-lg">
            <p className="text-body-lg font-semibold text-neutral-900">
              {book.title}
            </p>
            <p className="text-body-sm text-neutral-500">
              {book.author.name} · {book.category.name}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default BookListPage