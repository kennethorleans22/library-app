import { useLocation, useNavigate } from 'react-router-dom'

function BorrowSuccessPage() {
  const location = useLocation()
  const navigate = useNavigate()

  // tanggal kembali dikirim dari Checkout: navigate('/borrow-success', { state: { returnDate } })
  const returnDate = (location.state as { returnDate?: string } | null)?.returnDate

  return (
    <div className="flex flex-col items-center gap-6 px-4 py-24 text-center tracking-[-0.02em] lg:gap-8 lg:py-40">
      {/* Ikon sukses: cincin bertingkat + lingkaran biru + centang putih */}
      <div className="flex size-35.5 items-center justify-center rounded-full border border-neutral-200">
        <div className="flex size-32.5 items-center justify-center rounded-full border border-neutral-200">
          <div className="flex size-29.5 items-center justify-center rounded-full border border-neutral-200">
            <div className="flex size-18 items-center justify-center rounded-full bg-primary-500">
                          <img src="/icons/success-check.svg" alt="" className="size-12" />
            </div>
          </div>
        </div>
      </div>

      {/* Teks */}
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-body-xl font-bold text-neutral-950 lg:text-display-sm">
          Borrowing Successful!
        </h1>
        <p className="text-body-md font-semibold text-neutral-950 lg:text-body-lg">
          Your book has been successfully borrowed.
          {returnDate && (
            <>
              {' '}Please return it by{' '}
              <span className="text-danger">{returnDate}</span>
            </>
          )}
        </p>
      </div>

      {/* Tombol */}
      <button
        onClick={() => navigate('/loans')}
        className="flex h-12 w-71.5 items-center justify-center rounded-full bg-primary-500 text-body-md font-bold text-neutral-25"
      >
        See Borrowed List
      </button>
    </div>
  )
}

export default BorrowSuccessPage