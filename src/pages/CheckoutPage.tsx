import { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useAppSelector } from '@/app/hooks'
import { useCart } from '@/features/cart/useCart'
import { useBorrowFromCart } from '@/features/cart/useBorrowFromCart'

function CheckoutPage() {
  const user = useAppSelector((s) => s.auth.user)
  const location = useLocation()
  const navigate = useNavigate()

  const { data, isLoading, isFetching } = useCart()
  const borrow = useBorrowFromCart()

    // Dari Cart: state.itemIds (bisa banyak buku). Dari Detail: state.bookId (1 buku langsung).
  const navState = location.state as { itemIds?: number[]; bookId?: number } | null
  const allItems = data?.data.items ?? []
  const items = navState?.bookId
    ? allItems.filter((it) => it.bookId === navState.bookId)
    : navState?.itemIds
      ? allItems.filter((it) => navState.itemIds!.includes(it.id))
      : allItems
  const itemIds = items.map((it) => it.id)

  // form state
  const today = new Date().toISOString().slice(0, 10) // 'YYYY-MM-DD'
  const [borrowDate, setBorrowDate] = useState(today)
  const [duration, setDuration] = useState(3)
  const [agreeReturn, setAgreeReturn] = useState(false)
  const [agreePolicy, setAgreePolicy] = useState(false)

  // hitung tanggal kembali = borrowDate + durasi
  const returnDateObj = new Date(borrowDate + 'T00:00:00')
  returnDateObj.setDate(returnDateObj.getDate() + duration)
  const returnDateText = returnDateObj.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const canBorrow = agreeReturn && agreePolicy && itemIds.length > 0

  const handleConfirm = () => {
    if (!canBorrow) return
    borrow.mutate(
      { itemIds, days: duration, borrowDate },
      {
        onSuccess: () => {
          navigate('/borrow-success', { state: { returnDate: returnDateText } })
        },
      }
    )
  }

   // saat buku baru ditambah dari Detail, cart sedang di-refetch → tampilkan Memuat dulu
  if (isLoading || (items.length === 0 && isFetching)) {
    return <p className="mx-auto max-w-250 p-xl text-body-md text-neutral-500">Memuat...</p>
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-250 flex-col gap-4 px-4 pt-6 lg:px-8">
        <h1 className="text-display-xs font-bold text-neutral-950 lg:text-display-lg">Checkout</h1>
        <p className="text-body-md text-neutral-500">
          Tidak ada buku untuk dipinjam.{' '}
          <Link to="/cart" className="font-bold text-primary-500">Kembali ke Cart</Link>
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-250 flex-col gap-4 px-4 pb-12 pt-6 tracking-[-0.02em] lg:gap-8 lg:px-8">
      <h1 className="text-display-xs font-bold text-neutral-950 lg:text-display-lg">Checkout</h1>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-14.5">
        {/* ===== KIRI: User Information + Book List ===== */}
        <div className="flex flex-col gap-4 lg:flex-1 lg:gap-8">
          {/* User Information */}
          <div className="flex flex-col gap-2 lg:gap-4">
            <h2 className="text-body-lg font-bold text-neutral-950 lg:text-display-xs">
              User Information
            </h2>
            {[
              { label: 'Name', value: user?.name },
              { label: 'Email', value: user?.email },
              { label: 'Nomor Handphone', value: user?.phone },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between">
                <span className="text-body-sm font-medium text-neutral-950 lg:text-body-md">
                  {row.label}
                </span>
                <span className="text-body-sm font-bold text-neutral-950 lg:text-body-md">
                  {row.value}
                </span>
              </div>
            ))}
          </div>

          <hr className="border-neutral-300" />

          {/* Book List */}
          <div className="flex flex-col gap-4">
            <h2 className="text-body-lg font-bold text-neutral-950 lg:text-display-xs">
              Book List
            </h2>
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 lg:gap-4">
                <img
                  src={item.book.coverImage}
                  alt={item.book.title}
                  className="aspect-2/3 w-17.5 shrink-0 object-cover lg:w-23"
                />
                <div className="flex flex-col gap-1">
                  <span className="inline-flex w-fit items-center rounded-sm border border-neutral-300 px-2 text-body-sm font-bold text-neutral-950">
                    {item.book.category.name}
                  </span>
                  <p className="text-body-md font-bold text-neutral-950 lg:text-body-xl">
                    {item.book.title}
                  </p>
                  <p className="text-body-sm font-medium text-neutral-700 lg:text-body-md">
                    {item.book.author.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== KANAN: Complete Your Borrow Request ===== */}
        <div className="flex w-full flex-col gap-4 rounded-3xl bg-white p-4 shadow-[0px_0px_20px_rgba(203,202,202,0.25)] lg:w-119.5 lg:shrink-0 lg:gap-6 lg:p-5">
          <h2 className="text-body-xl font-bold text-neutral-950 lg:text-display-sm">
            Complete Your Borrow Request
          </h2>

          {/* Borrow Date */}
          <div className="flex flex-col gap-0.5">
            <label className="text-body-sm font-bold text-neutral-950">Borrow Date</label>
            <input
              type="date"
              value={borrowDate}
              min={today}
              onChange={(e) => setBorrowDate(e.target.value)}
              className="h-12 w-full cursor-pointer rounded-xl border border-neutral-300 bg-neutral-100 px-4 text-body-md font-semibold text-neutral-950 outline-none"
            />
          </div>

          {/* Borrow Duration */}
          <div className="flex flex-col gap-3">
            <p className="text-body-sm font-bold text-neutral-950 lg:text-body-md">Borrow Duration</p>
            {[3, 5, 10].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDuration(d)}
                className="flex w-fit items-center gap-2 lg:gap-3.75"
              >
                <span
                  className={`flex size-6 items-center justify-center rounded-full ${
                    duration === d ? 'bg-primary-500' : 'border border-neutral-400'
                  }`}
                >
                  {duration === d && <span className="size-2.5 rounded-full bg-white" />}
                </span>
                <span className="text-body-sm font-semibold text-neutral-950 lg:text-body-md">
                  {d} Days
                </span>
              </button>
            ))}
          </div>

          {/* Return Date */}
          <div className="flex flex-col gap-1 rounded-xl bg-primary-50 p-3 lg:p-4">
            <p className="text-body-sm font-bold text-neutral-950 lg:text-body-md">Return Date</p>
            <p className="text-body-sm font-medium text-neutral-950 lg:text-body-md">
              Please return the book no later than{' '}
              <span className="font-bold text-danger">{returnDateText}</span>
            </p>
          </div>

          {/* Agreements */}
          <div className="flex flex-col gap-2">
            <label className="flex items-start gap-2 lg:gap-4">
              <span className="relative flex size-5 shrink-0">
                <input
                  type="checkbox"
                  checked={agreeReturn}
                  onChange={() => setAgreeReturn((v) => !v)}
                  className="peer size-5 cursor-pointer appearance-none rounded-sm border border-neutral-400 checked:border-primary-500 checked:bg-primary-500"
                />
                <img
                  src="/icons/check.svg"
                  alt=""
                  className="pointer-events-none absolute inset-0 m-auto hidden size-3 peer-checked:block"
                />
              </span>
              <span className="text-body-sm font-semibold text-neutral-950 lg:text-body-md">
                I agree to return the book(s) before the due date.
              </span>
            </label>

            <label className="flex items-start gap-2 lg:gap-4">
              <span className="relative flex size-5 shrink-0">
                <input
                  type="checkbox"
                  checked={agreePolicy}
                  onChange={() => setAgreePolicy((v) => !v)}
                  className="peer size-5 cursor-pointer appearance-none rounded-sm border border-neutral-400 checked:border-primary-500 checked:bg-primary-500"
                />
                <img
                  src="/icons/check.svg"
                  alt=""
                  className="pointer-events-none absolute inset-0 m-auto hidden size-3 peer-checked:block"
                />
              </span>
              <span className="text-body-sm font-semibold text-neutral-950 lg:text-body-md">
                I accept the library borrowing policy.
              </span>
            </label>
          </div>

          {/* Confirm & Borrow */}
          <button
            onClick={handleConfirm}
            disabled={!canBorrow || borrow.isPending}
            className="flex h-12 w-full items-center justify-center rounded-full bg-primary-500 text-body-md font-bold text-neutral-25 disabled:opacity-60"
          >
            {borrow.isPending ? 'Loading...' : 'Confirm & Borrow'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage