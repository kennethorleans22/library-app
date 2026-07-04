import { Link, useParams, useNavigate } from 'react-router-dom';
import { useBookDetail } from '@/features/books/useBookDetail';
import ReviewSection from '@/components/books/ReviewSection';
import RelatedBooksSection from '@/components/books/RelatedBooksSection';
import { useAddToCart } from '@/features/cart/useAddToCart'

function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError, error } = useBookDetail(id);
  const addToCart = useAddToCart();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <p className='mx-auto max-w-[1200px] p-xl text-body-md text-neutral-500'>
        Memuat...
      </p>
    );
  }

  if (isError) {
    return (
      <p className='mx-auto max-w-[1200px] p-xl text-body-md text-danger'>
        Error: {error.message}
      </p>
    );
  }

  if (!data) return null;

  const book = data.data;
  const outOfStock = book.availableCopies <= 0;

  const handleBorrow = async () => {
    try {
      await addToCart.mutateAsync(book.id); // pastikan buku ada di cart dulu
    } catch {
      // kemungkinan buku sudah ada di cart — abaikan, tetap lanjut ke checkout
    }
    navigate('/checkout', { state: { bookId: book.id } });
  };
  const stats = [
    { value: book.availableCopies, label: 'Stock' },
    { value: book.rating.toFixed(1), label: 'Rating' },
    { value: book.reviewCount, label: 'Reviews' },
  ];

  return (
    <div className='mx-auto flex max-w-[1200px] flex-col gap-6 px-4 pb-28 pt-xl tracking-[-0.02em] md:pb-8 lg:px-8'>
      {/* Breadcrumb */}
      <nav className='flex items-center gap-1 text-body-sm font-semibold'>
        <Link to='/' className='text-primary-500'>
          Home
        </Link>
        <img
          src='/icons/chevron-down.svg'
          alt=''
          className='h-4 w-4 -rotate-90'
        />
        <Link to='/category' className='text-primary-500'>
          Category
        </Link>
        <img
          src='/icons/chevron-down.svg'
          alt=''
          className='h-4 w-4 -rotate-90'
        />
        <span className='line-clamp-1 text-neutral-950'>{book.title}</span>
      </nav>

      {/* Cover + Info */}
      <div className='flex flex-col items-center gap-9 lg:flex-row lg:items-start'>
        {/* Cover */}
        <div className='w-[222px] shrink-0 bg-neutral-200 p-1.5 md:w-[337px] md:p-2'>
          <img
            src={book.coverImage}
            alt={book.title}
            className='aspect-[2/3] w-full object-cover'
          />
        </div>

        {/* Info */}
        <div className='flex w-full flex-col gap-4 md:gap-5'>
          <div className='flex flex-col gap-3'>
            <span className='inline-flex w-fit items-center rounded-sm border border-neutral-300 px-2 text-body-sm font-bold text-neutral-950'>
              {book.category.name}
            </span>

            <h1 className='text-display-xs font-bold text-neutral-950 md:text-display-sm'>
              {book.title}
            </h1>

                   <Link
              to={`/authors/${book.author.id}`}
              className="w-fit text-body-sm font-semibold text-neutral-700 hover:text-primary-500 md:text-body-md"
            >
              {book.author.name}
            </Link>

            <div className='flex items-center gap-0.5'>
              <img src='/icons/star.svg' alt='' className='h-6 w-6' />
              <span className='text-body-md font-bold text-neutral-900'>
                {book.rating.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className='flex h-[62px] w-full items-center gap-2xl md:h-[66px]'>
            {stats.map((stat, index) => (
              <div key={stat.label} className='contents'>
                {index > 0 && (
                  <div className='h-[62px] w-px shrink-0 bg-neutral-300 md:h-[66px]' />
                )}

                <div
                  className={`flex min-w-0 flex-1 flex-col items-start md:h-[66px] md:w-[102px] md:flex-none ${
                    index === 0 ? 'h-[62px]' : 'h-[60px]'
                  }`}
                >
                  <span className='w-full text-body-lg font-bold tracking-[-0.03em] text-neutral-950 md:text-display-xs md:tracking-normal'>
                    {stat.value}
                  </span>
                  <span
                    className={`w-full font-medium tracking-[-0.03em] text-neutral-950 md:text-body-md ${
                      index === 0 ? 'text-body-md' : 'text-body-sm'
                    }`}
                  >
                    {stat.label}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Line 3 */}
          <hr className='w-full border-neutral-300 md:w-[559px]' />

          {/* Description */}
          <div className='flex flex-col gap-1'>
            <h2 className='text-body-xl font-bold text-neutral-950'>
              Description
            </h2>
            <p className='text-body-sm font-medium text-neutral-950 md:text-body-md'>
              {book.description}
            </p>
          </div>

          {/* Tombol desktop */}
          <div className='hidden gap-3 lg:flex'>
                     <button
              onClick={() => addToCart.mutate(book.id)}
              disabled={addToCart.isPending}
              className='flex h-12 w-[200px] items-center justify-center rounded-full border border-neutral-300 text-body-md font-bold text-neutral-950 disabled:opacity-60'
            >
              Add to Cart
            </button>
            <button
                         onClick={handleBorrow}
              disabled={outOfStock || addToCart.isPending}
              className='flex h-12 w-[200px] items-center justify-center rounded-full bg-primary-500 text-body-md font-bold text-neutral-25 disabled:opacity-60'
            >
              {outOfStock ? 'Out of Stock' : 'Borrow Book'}
            </button>
          </div>
        </div>
      </div>

      {/* Line 4 */}
      <hr className='-mx-4 w-[calc(100%+32px)] border-neutral-300 lg:-mx-8 lg:w-[calc(100%+64px)] xl:mx-0 xl:w-[1200px]' />
      {/* Review */}
      <ReviewSection
        bookId={book.id}
        rating={book.rating}
        reviewCount={book.reviewCount}
      />
      {/* Related Books */}
      <RelatedBooksSection
        categoryId={book.categoryId}
        currentBookId={book.id}
      />
      {/* Tombol mobile */}
      <div className='fixed inset-x-0 bottom-0 z-40 flex gap-3 bg-white p-4 shadow-[0px_0px_20px_rgba(203,202,202,0.25)] lg:hidden'>
           <button
          onClick={() => addToCart.mutate(book.id)}
          disabled={addToCart.isPending}
          className='flex h-10 flex-1 items-center justify-center rounded-full border border-neutral-300 text-body-sm font-bold text-neutral-950 disabled:opacity-60'
        >
          Add to Cart
        </button>
        <button
          onClick={() => console.log('Borrow:', book.id)}
          disabled={outOfStock}
          className='flex h-10 flex-1 items-center justify-center rounded-full bg-primary-500 text-body-sm font-bold text-neutral-25 disabled:opacity-60'
        >
          {outOfStock ? 'Out of Stock' : 'Borrow Book'}
        </button>
      </div>
    </div>
  );
}

export default BookDetailPage;
