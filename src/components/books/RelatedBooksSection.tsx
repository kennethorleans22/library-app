import { useRelatedBooks } from '@/features/books/useRelatedBooks'
import BookCard from '@/components/books/BookCard'

interface RelatedBooksSectionProps {
  categoryId: number
  currentBookId: number
}

function RelatedBooksSection({ categoryId, currentBookId }: RelatedBooksSectionProps) {
  const { data } = useRelatedBooks(categoryId)

  // Buku satu kategori, tanpa buku yang sedang dibuka, ambil 5
  const related = (data?.data.books ?? [])
    .filter((book) => book.id !== currentBookId)
    .slice(0, 5)

  // Kalau tidak ada buku terkait, sembunyikan seluruh section
  if (related.length === 0) return null

  return (
    <section className="flex w-full flex-col gap-5 tracking-tight lg:gap-10">
      <h2 className="text-display-xs font-bold text-neutral-950 lg:text-display-lg">
        Related Books
      </h2>
      <div className="grid w-full grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-5">
        {related.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </section>
  )
}

export default RelatedBooksSection