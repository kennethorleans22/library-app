function getPageItems(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const items: (number | '...')[] = [1];
  if (current > 3) items.push('...');
  for (let i = current - 1; i <= current + 1; i++) {
    if (i > 1 && i < total) items.push(i);
  }
  if (current < total - 2) items.push('...');
  items.push(total);
  return items;
}

interface Props {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({ page, totalPages, onPageChange }: Props) {
  const go = (p: number) => {
    if (p >= 1 && p <= totalPages) onPageChange(p);
  };

  return (
    <div className='flex items-center gap-4'>
      <button
        onClick={() => go(page - 1)}
        disabled={page === 1}
        className='flex items-center gap-1.5 text-body-md font-medium text-neutral-950 disabled:opacity-40'
      >
        <img src='/icons/chevron-left.svg' alt='' className='h-6 w-6' />
        Previous
      </button>

      <div className='flex items-center'>
        {getPageItems(page, totalPages).map((p, i) =>
          p === '...' ? (
            <span
              key={`e${i}`}
              className='flex h-10 w-10 items-center justify-center text-body-md font-medium text-neutral-950'
            >
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => go(p)}
              className={`flex h-10 w-10 items-center justify-center rounded-lg text-body-md font-medium text-neutral-950 ${
                p === page ? 'border border-neutral-300' : ''
              }`}
            >
              {p}
            </button>
          )
        )}
      </div>

      <button
        onClick={() => go(page + 1)}
        disabled={page === totalPages}
        className='flex items-center gap-1.5 text-body-md font-medium text-neutral-950 disabled:opacity-40'
      >
        Next
        <img src='/icons/chevron-right.svg' alt='' className='h-6 w-6' />
      </button>
    </div>
  );
}

export default Pagination;
