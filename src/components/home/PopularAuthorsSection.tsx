import { usePopularAuthors } from '@/features/authors/usePopularAuthors'
import { Link } from 'react-router-dom'

function PopularAuthorsSection() {
  const { data, isLoading, isError, error } = usePopularAuthors()
  const authors = data?.data.authors ?? []

  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 lg:px-8">
      {/* Garis pembatas di atas section */}
      <div className="border-t border-neutral-300 pt-5xl md:pt-8xl">
        <div className="flex flex-col gap-3xl md:gap-5xl">
          <h2 className="text-display-xs font-bold text-neutral-950 md:text-display-lg">
            Popular Authors
          </h2>

          {isLoading && (
            <p className="text-body-md text-neutral-500">Memuat penulis...</p>
          )}
          {isError && (
            <p className="text-body-md text-danger">Error: {error.message}</p>
          )}

          {authors.length > 0 && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-5">
                          {authors.map((author) => (
                <Link
                  key={author.id}
                  to={`/authors/${author.id}`}
                  className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-[0px_0px_20px_rgba(203,202,202,0.25)] md:gap-4 md:p-4"
                >
                  <img
                    src="/avatar-placeholder.png"
                    alt={author.name}
                    className="h-15 w-15 shrink-0 rounded-full object-cover md:h-[81px] md:w-[81px]"
                  />
                  <div className="flex flex-col gap-0.5">
                    <p className="line-clamp-1 text-body-md font-bold text-neutral-900 md:text-body-lg">
                      {author.name}
                    </p>
                    <div className="flex items-center gap-1.5">
                      <img src="/icons/book.svg" alt="" className="h-6 w-6" />
                      <span className="text-body-sm font-medium text-neutral-950 md:text-body-md">
                        {author.bookCount} books
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default PopularAuthorsSection