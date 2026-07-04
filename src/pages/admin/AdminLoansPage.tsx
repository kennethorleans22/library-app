import { useEffect, useState } from 'react'
import { useAdminLoans, type LoanFilter } from '@/features/admin/useAdminLoans'
import Pagination from '@/components/admin/Pagination'
import { useReturnLoan } from '@/features/admin/useReturnLoan'

const formatLong = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
const formatShort = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

const filters: { key: LoanFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'returned', label: 'Returned' },
  { key: 'overdue', label: 'Overdue' },
]

function badgeClass(displayStatus: string) {
  if (displayStatus === 'Active') return 'bg-success/5 text-success'
  if (displayStatus === 'Overdue') return 'bg-danger/10 text-danger'
  return 'bg-neutral-100 text-neutral-600' // Returned
}

function AdminLoansPage() {
  const [search, setSearch] = useState('')
  const [debounced, setDebounced] = useState('')
  const [status, setStatus] = useState<LoanFilter>('all')
  const [page, setPage] = useState(1)

  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(search)
      setPage(1)
    }, 400)
    return () => clearTimeout(t)
  }, [search])

  const { data, isLoading, isError, error } = useAdminLoans(page, debounced, status)
    const returnLoan = useReturnLoan()
  const loans = data?.data.loans ?? []
  const pagination = data?.data.pagination

  const selectFilter = (key: LoanFilter) => {
    setStatus(key)
    setPage(1)
  }

  return (
    <div className="flex flex-col gap-4 tracking-[-0.02em] lg:gap-6">
      <h1 className="text-display-xs font-bold text-neutral-950 lg:text-display-sm">Borrowed List</h1>

      {/* Search */}
      <div className="flex h-11 items-center gap-1.5 rounded-full border border-neutral-300 bg-white px-4 lg:h-12 lg:w-150">
        <img src="/icons/search.svg" alt="" className="h-5 w-5" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search"
          className="flex-1 text-body-sm font-medium text-neutral-950 outline-none placeholder:text-neutral-600"
        />
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap items-center gap-2 lg:gap-3">
        {filters.map((f) => {
          const active = status === f.key
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
          )
        })}
      </div>

      {isLoading && <p className="text-body-md text-neutral-500">Memuat...</p>}
      {isError && <p className="text-body-md text-danger">Error: {error.message}</p>}
      {!isLoading && !isError && loans.length === 0 && (
        <p className="text-body-md text-neutral-500">Tidak ada data peminjaman.</p>
      )}

      {/* Cards */}
      {loans.map((loan) => (
        <div
          key={loan.id}
          className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-[0px_0px_20px_rgba(203,202,202,0.25)] lg:gap-5 lg:p-5"
        >
          {/* Status + Due Date */}
          <div className="flex items-start justify-between gap-5">
            <div className="flex items-center gap-3">
              <span className="text-body-sm font-bold text-neutral-950 lg:text-body-md">Status</span>
              <span className={`flex items-center rounded-xs px-2 py-0.5 text-body-sm font-bold ${badgeClass(loan.displayStatus)}`}>
                {loan.displayStatus}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-body-sm font-bold text-neutral-950 lg:text-body-md">Due Date</span>
              <span className="flex items-center rounded-xs bg-danger/10 px-2 py-0.5 text-body-sm font-bold text-danger">
                {formatLong(loan.dueAt)}
              </span>
            </div>
          </div>

          <hr className="border-neutral-300" />

          {/* cover+info (kiri) | borrower (kanan desktop / bawah mobile) */}
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
              <img
                src={loan.book.coverImage}
                alt={loan.book.title}
                className="aspect-2/3 w-23 shrink-0 object-cover"
              />
              <div className="flex flex-col gap-1">
                <span className="inline-flex w-fit items-center rounded-sm border border-neutral-300 px-2 text-body-sm font-bold text-neutral-950">
                  {loan.book.category.name}
                </span>
                <p className="text-body-md font-bold text-neutral-950 lg:text-body-xl">{loan.book.title}</p>
                <p className="text-body-sm font-medium text-neutral-700 lg:text-body-md">{loan.book.author.name}</p>
                <div className="flex items-center gap-2 text-body-sm font-bold text-neutral-950 lg:text-body-md">
                  <span>{formatShort(loan.borrowedAt)}</span>
                  <span className="h-0.5 w-0.5 rounded-full bg-neutral-950" />
                  <span>Duration {loan.durationDays} Days</span>
                </div>
              </div>
            </div>

            {/* divider hanya mobile */}
            <hr className="border-neutral-300 lg:hidden" />

                       {/* borrower */}
            <div className="flex flex-col">
              <span className="text-body-sm font-semibold text-neutral-950 lg:text-body-md">borrower's name</span>
              <span className="text-body-md font-bold text-neutral-950 lg:text-body-xl">{loan.borrower.name}</span>
            </div>
          </div>

          {/* Aksi admin: tandai buku sudah dikembalikan (hanya untuk yang belum returned) */}
          {loan.status !== 'RETURNED' && (
            <div className="flex lg:justify-end">
              <button
                onClick={() => returnLoan.mutate(loan.id)}
                disabled={returnLoan.isPending && returnLoan.variables === loan.id}
                className="flex h-10 w-full items-center justify-center rounded-full bg-primary-500 px-4 text-body-sm font-bold text-neutral-25 disabled:opacity-60 lg:w-auto"
              >
                {returnLoan.isPending && returnLoan.variables === loan.id ? 'Memproses...' : 'Mark as Returned'}
              </button>
            </div>
          )}
        </div>
      ))}
      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center pt-2 lg:justify-end">
          <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  )
}

export default AdminLoansPage