import { useEffect, useState } from 'react';
import { useAdminBooks, type BookFilter } from '@/features/admin/useAdminBooks';
import Pagination from '@/components/admin/Pagination';
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog';
import { useDeleteBook } from '@/features/admin/useDeleteBook';
import { useNavigate, useLocation } from 'react-router-dom';

const filters: { key: BookFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'available', label: 'Available' },
  { key: 'borrowed', label: 'Borrowed' },
  { key: 'returned', label: 'Returned' },
];

function AdminBooksPage() {
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [status, setStatus] = useState<BookFilter>('all');
  const [page, setPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const deleteBook = useDeleteBook();
  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading, isError, error } = useAdminBooks(
    page,
    debounced,
    status
  );
  const books = data?.data.books ?? [];
  const pagination = data?.data.pagination;
  const navigate = useNavigate();
  const location = useLocation();
  const [toast, setToast] = useState<string>(
    () => (location.state as { toast?: string } | null)?.toast ?? ''
  );

  useEffect(() => {
    if (!toast) return;
    window.history.replaceState({}, ''); // hapus state biar tak muncul lagi saat refresh
    const timer = setTimeout(() => setToast(''), 3000);
    return () => clearTimeout(timer);
  }, [toast]);
  const selectFilter = (key: BookFilter) => {
    setStatus(key);
    setPage(1);
  };

  // placeholder — nanti diisi di 4 fitur (Preview/Edit/Delete/Add)
  const handleAdd = () => navigate('/admin/books/new');
  const handlePreview = (id: number) => {
    setOpenMenuId(null);
    navigate(`/admin/books/${id}/preview`);
  };
  const handleEdit = (id: number) => {
    setOpenMenuId(null)
    navigate(`/admin/books/${id}/edit`)
  }
  const handleDelete = (id: number) => {
    setOpenMenuId(null);
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId === null) return;
    deleteBook.mutate(deleteId, { onSuccess: () => setDeleteId(null) });
  };

  return (
    <div className='flex flex-col gap-4 tracking-[-0.02em] lg:gap-6'>
      {' '}
      {toast && (
        <div className='pointer-events-none fixed inset-x-0 top-17 z-50 px-4 lg:top-29 lg:px-8'>
          <div className='mx-auto flex max-w-300 justify-center lg:justify-end'>
            <div className='pointer-events-auto flex h-10 w-86.25 items-center justify-between gap-2 rounded-md bg-accent-green px-3 lg:w-72.75'>
              <span className='text-body-sm font-semibold text-white'>
                {toast}
              </span>
              <button onClick={() => setToast('')} className='shrink-0'>
                <img
                  src='/icons/close.svg'
                  alt='close'
                  className='h-4 w-4 brightness-0 invert'
                />
              </button>
            </div>
          </div>
        </div>
      )}
      <h1 className='text-display-xs font-bold text-neutral-950 lg:text-display-sm'>
        Book List
      </h1>
      {/* Add Book */}
      <button
        onClick={handleAdd}
        className='flex h-11 w-full items-center justify-center rounded-full bg-primary-500 text-body-md font-bold text-neutral-25 lg:h-12 lg:w-60'
      >
        Add Book
      </button>
      {/* Search */}
      <div className='flex h-11 items-center gap-1.5 rounded-full border border-neutral-300 bg-white px-4 lg:h-12 lg:w-150'>
        <img src='/icons/search.svg' alt='' className='h-5 w-5' />
        <input
          type='text'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder='Search book'
          className='flex-1 text-body-sm font-medium text-neutral-950 outline-none placeholder:text-neutral-600'
        />
      </div>
      {/* Filter chips */}
      <div className='flex flex-wrap items-center gap-2 lg:gap-3'>
        {filters.map((f) => {
          const active = status === f.key;
          return (
            <button
              key={f.key}
              onClick={() => selectFilter(f.key)}
              className={`flex h-10 items-center justify-center rounded-full border px-4 text-body-md ${
                active
                  ? 'border-primary-500 bg-primary-50 font-bold text-primary-500'
                  : 'border-neutral-300 font-semibold text-neutral-950'
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>
      {isLoading && <p className='text-body-md text-neutral-500'>Memuat...</p>}
      {isError && (
        <p className='text-body-md text-danger'>Error: {error.message}</p>
      )}
      {!isLoading && !isError && books.length === 0 && (
        <p className='text-body-md text-neutral-500'>Tidak ada buku.</p>
      )}
      {/* Cards */}
      {books.map((book) => (
        <div
          key={book.id}
          className='flex items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-[0px_0px_20px_rgba(203,202,202,0.25)] lg:p-5'
        >
          {/* Kiri: cover + info */}
          <div className='flex min-w-0 items-center gap-3 lg:gap-4'>
            <img
              src={book.coverImage}
              alt={book.title}
              className='aspect-2/3 w-23 shrink-0 object-cover'
            />
            <div className='flex min-w-0 flex-col gap-0.5 lg:gap-1'>
              <span className='inline-flex w-fit items-center rounded-sm border border-neutral-300 px-2 text-body-sm font-bold text-neutral-950'>
                {book.category.name}
              </span>
              <p className='truncate text-body-sm font-bold text-neutral-950 lg:text-body-lg'>
                {book.title}
              </p>
              <p className='truncate text-body-sm font-medium text-neutral-700 lg:text-body-md'>
                {book.author.name}
              </p>
              <div className='flex items-center gap-0.5'>
                <img src='/icons/star.svg' alt='' className='h-6 w-6' />
                <span className='text-body-sm font-bold text-neutral-900 lg:text-body-md'>
                  {book.rating.toFixed(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Kanan desktop: 3 tombol */}
          <div className='hidden shrink-0 items-center gap-3.25 lg:flex'>
            <button
              onClick={() => handlePreview(book.id)}
              className='flex h-12 w-23.75 items-center justify-center rounded-full border border-neutral-300 text-body-md font-bold text-neutral-950'
            >
              Preview
            </button>
            <button
              onClick={() => handleEdit(book.id)}
              className='flex h-12 w-23.75 items-center justify-center rounded-full border border-neutral-300 text-body-md font-bold text-neutral-950'
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(book.id)}
              className='flex h-12 w-23.75 items-center justify-center rounded-full border border-neutral-300 text-body-md font-bold text-danger'
            >
              Delete
            </button>
          </div>

          {/* Kanan mobile: kebab menu */}
          <div className='relative shrink-0 lg:hidden'>
            <button
              onClick={() =>
                setOpenMenuId(openMenuId === book.id ? null : book.id)
              }
            >
              <img src='/icons/more.svg' alt='Menu' className='h-6 w-6' />
            </button>
            {openMenuId === book.id && (
              <div className='absolute right-0 top-8 z-10 flex w-38.5 flex-col gap-4 rounded-2xl bg-white p-4 shadow-[0px_0px_20px_rgba(203,202,202,0.25)]'>
                <button
                  onClick={() => {
                    handlePreview(book.id);
                    setOpenMenuId(null);
                  }}
                  className='text-left text-body-sm font-semibold text-neutral-950'
                >
                  Preview
                </button>
                <button
                  onClick={() => {
                    handleEdit(book.id);
                    setOpenMenuId(null);
                  }}
                  className='text-left text-body-sm font-semibold text-neutral-950'
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    handleDelete(book.id);
                    setOpenMenuId(null);
                  }}
                  className='text-left text-body-sm font-semibold text-danger'
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
      {pagination && pagination.totalPages > 1 && (
        <div className='flex justify-center pt-2 lg:justify-end'>
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
      <DeleteConfirmDialog
        open={deleteId !== null}
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        isPending={deleteBook.isPending}
      />
    </div>
  );
}

export default AdminBooksPage;
