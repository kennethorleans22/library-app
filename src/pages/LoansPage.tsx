import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMyLoans, type Loan } from '@/features/loans/useMyLoans'

type LoanFilter = 'All' | 'Active' | 'Returned' | 'Overdue'

const tabs = [
  { label: 'Profile', to: '/profile' },
  { label: 'Borrowed List', to: '/loans' },
  { label: 'Reviews', to: '/reviews' },
]

const filters: LoanFilter[] = ['All', 'Active', 'Returned', 'Overdue']

function formatDate(iso: string, month: 'short' | 'long') {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month,
    year: 'numeric',
  })
}

function getLoanStatus(loan: Loan): Exclude<LoanFilter, 'All'> {
  const display = loan.displayStatus.toLowerCase()

  if (display.includes('overdue') || loan.status === 'LATE') return 'Overdue'
  if (display.includes('returned') || loan.status === 'RETURNED') return 'Returned'
  return 'Active'
}

function getStatusClass(status: Exclude<LoanFilter, 'All'>) {
  if (status === 'Active') return 'bg-status-active-soft text-status-active'
  if (status === 'Overdue') return 'bg-danger-soft text-danger'
  return 'bg-neutral-100 text-neutral-700'
}

function LoanCard({ loan }: { loan: Loan }) {
  const navigate = useNavigate()
  const status = getLoanStatus(loan)

  return (
    <article className="flex h-74.5 w-full flex-col gap-4 rounded-2xl bg-white p-4 shadow-card lg:h-62.5 lg:gap-5 lg:p-5">
      <div className="flex h-8 w-full items-start justify-between gap-5">
        <div className="flex items-center gap-1 lg:gap-3">
          <span className="text-body-sm font-bold tracking-figma-tight text-neutral-950 lg:text-body-md">
            Status
          </span>
          <span className={`flex h-8 items-center rounded-xs px-2 text-body-sm font-bold tracking-figma-tight ${getStatusClass(status)}`}>
            {status}
          </span>
        </div>

        <div className="flex items-center gap-1 lg:gap-3">
          <span className="text-body-sm font-bold tracking-figma-tight text-neutral-950 lg:text-body-md">
            Due Date
          </span>
          <span className="flex h-8 items-center rounded-xs bg-danger-soft px-2 text-body-sm font-bold tracking-figma-tight text-danger">
            {formatDate(loan.dueAt, 'long')}
          </span>
        </div>
      </div>

      <hr className="w-full border-neutral-300" />

      <div className="flex flex-1 flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4 lg:h-34.5 lg:w-76 lg:shrink-0 lg:items-start">
          <img
            src={loan.book.coverImage}
            alt={loan.book.title}
            className="h-34.5 w-23 shrink-0 object-cover"
          />

          <div className="flex min-w-0 flex-col gap-1 lg:h-33.5 lg:w-49 lg:shrink-0">
            <span className="flex h-7 w-fit items-center rounded-sm border border-neutral-300 px-2 text-body-sm font-bold tracking-figma-tight text-neutral-950">
              {loan.book.category.name}
            </span>

            <h2 className="line-clamp-1 text-body-md font-bold tracking-figma-tight text-neutral-950 lg:text-body-xl">
              {loan.book.title}
            </h2>

            <p className="line-clamp-1 text-body-sm font-medium tracking-figma-tighter text-neutral-700 lg:text-body-md">
              {loan.book.author.name}
            </p>

      <div className="flex h-7.5 w-max items-center gap-2 whitespace-nowrap text-body-sm font-bold tracking-figma-tight text-neutral-950 lg:text-body-md">
  <span>{formatDate(loan.borrowedAt, 'short')}</span>
  <span className="size-0.5 shrink-0 rounded-full bg-neutral-950" />
  <span>Duration {loan.durationDays} Days</span>
</div>
          </div>
        </div>

        <button
          onClick={() => navigate(`/books/${loan.book.id}`)}
          className="flex h-10 w-full items-center justify-center rounded-full bg-primary-500 text-body-md font-bold tracking-figma-tight text-neutral-25 lg:w-45.5"
        >
          Give Review
        </button>
      </div>
    </article>
  )
}

function LoansPage() {
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState<LoanFilter>('All')
const [visibleCount, setVisibleCount] = useState(3)

useEffect(() => {
  setVisibleCount(3)
}, [search, activeFilter])
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMyLoans()

  const loans = data?.pages.flatMap((page) => page.data.loans) ?? []

  const filteredLoans = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    return loans.filter((loan) => {
      const status = getLoanStatus(loan)
      const matchesStatus = activeFilter === 'All' || status === activeFilter

      const matchesSearch =
        keyword.length === 0 ||
        loan.book.title.toLowerCase().includes(keyword) ||
        loan.book.author.name.toLowerCase().includes(keyword) ||
        loan.book.category.name.toLowerCase().includes(keyword)

      return matchesStatus && matchesSearch
    })
  }, [loans, search, activeFilter])
const desktopLoans = filteredLoans.slice(0, visibleCount)
const canLoadMore = visibleCount < filteredLoans.length || hasNextPage

const handleLoadMore = () => {
  const nextCount = visibleCount + 3
  setVisibleCount(nextCount)

  if (hasNextPage && nextCount >= filteredLoans.length) {
    fetchNextPage()
  }
}
  return (
    <div className="mx-auto flex w-full max-w-250 flex-col gap-3.75 px-4 pb-16 pt-4 tracking-figma-tight lg:gap-6 lg:px-0 lg:pb-20 lg:pt-12">
      <div className="grid h-14 w-full grid-cols-3 gap-2 rounded-2xl bg-neutral-100 p-2 lg:w-139.25">
        {tabs.map((tab) => {
          const active = tab.label === 'Borrowed List'

          return (
            <Link
              key={tab.label}
              to={tab.to}
              className={`flex h-10 items-center justify-center rounded-xl px-3 text-body-sm lg:text-body-md ${
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
        Borrowed List
      </h1>

      <div className="flex h-11 w-full items-center gap-1.5 rounded-full border border-neutral-300 bg-white px-4 lg:w-136">
        <img src="/icons/search.svg" alt="" className="size-5" />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search book"
          className="min-w-0 flex-1 bg-transparent text-body-sm font-medium tracking-figma-tighter text-neutral-950 outline-none placeholder:text-neutral-600"
        />
      </div>

      <div className="flex w-full gap-2 overflow-x-auto lg:gap-3">
        {filters.map((filter) => {
          const active = activeFilter === filter

          return (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`flex h-10 shrink-0 items-center justify-center rounded-full border px-4 ${
                active
                  ? 'border-primary-500 bg-primary-50 text-body-md font-bold text-primary-500'
                  : 'border-neutral-300 bg-white text-body-sm font-semibold text-neutral-950 lg:text-body-md'
              }`}
            >
              {filter}
            </button>
          )
        })}
      </div>

      {isLoading && (
        <p className="text-body-md font-medium text-neutral-500">Memuat borrowed list...</p>
      )}

      {isError && (
        <p className="text-body-md font-medium text-danger">Error: {error.message}</p>
      )}

      {!isLoading && filteredLoans.length === 0 && (
        <p className="text-body-md font-medium text-neutral-500">
          Tidak ada data pinjaman yang cocok.
        </p>
      )}

    {filteredLoans.length > 0 && (
  <>
    <div className="flex w-full flex-col gap-4 lg:hidden">
      {filteredLoans.map((loan) => (
        <LoanCard key={loan.id} loan={loan} />
      ))}
    </div>

    <div className="hidden w-full flex-col gap-4 lg:flex">
      {desktopLoans.map((loan) => (
        <LoanCard key={loan.id} loan={loan} />
      ))}
    </div>
  </>
)}

{canLoadMore && (
  <button
    onClick={handleLoadMore}
    disabled={isFetchingNextPage}
    className="mx-auto hidden h-12 w-50 items-center justify-center rounded-full border border-neutral-300 text-body-md font-bold tracking-figma-tight text-neutral-950 disabled:opacity-60 lg:flex"
  >
    {isFetchingNextPage ? 'Loading...' : 'Load More'}
  </button>
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

export default LoansPage