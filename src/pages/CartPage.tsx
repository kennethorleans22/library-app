import { useState } from 'react'
import { useCart } from '@/features/cart/useCart'
import { useNavigate } from 'react-router-dom'

function Checkbox({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <span className="relative flex size-5 shrink-0">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="peer size-5 cursor-pointer appearance-none rounded-sm border border-neutral-400 checked:border-primary-500 checked:bg-primary-500"
      />
      <img
        src="/icons/check.svg"
        alt=""
        className="pointer-events-none absolute inset-0 m-auto hidden size-3 peer-checked:block"
      />
    </span>
  )
}

function CartPage() {
  const { data, isLoading, isError, error } = useCart()
const navigate = useNavigate()

  const items = data?.data.items ?? []
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  const allSelected = items.length > 0 && selectedIds.length === items.length

  const toggleItem = (id: number) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  const toggleAll = () =>
    setSelectedIds(allSelected ? [] : items.map((item) => item.id))

    const handleBorrow = () => {
    if (selectedIds.length === 0) return
    navigate('/checkout', { state: { itemIds: selectedIds } })
  }
  if (isLoading) {
    return <p className="mx-auto max-w-250 p-xl text-body-md text-neutral-500">Memuat...</p>
  }
  if (isError) {
    return <p className="mx-auto max-w-250 p-xl text-body-md text-danger">Error: {error.message}</p>
  }

  return (
    <div className="mx-auto flex w-full max-w-250 flex-col gap-4 px-4 pb-28 pt-6 tracking-tight lg:gap-8 lg:px-8 lg:pb-8">
      <h1 className="text-display-xs font-bold text-neutral-950 lg:text-display-lg">My Cart</h1>

      {items.length === 0 ? (
        <p className="text-body-md text-neutral-500">Keranjangmu masih kosong.</p>
      ) : (
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
          {/* Daftar item */}
          <div className="flex flex-1 flex-col gap-4 lg:gap-6">
            {/* Select All */}
            <label className="flex w-fit cursor-pointer items-center gap-4">
              <Checkbox checked={allSelected} onChange={toggleAll} />
              <span className="text-body-md font-semibold text-neutral-950">Select All</span>
            </label>

            {items.map((item) => (
              <div key={item.id}>
                <div className="flex items-start gap-4">
                  <Checkbox
                    checked={selectedIds.includes(item.id)}
                    onChange={() => toggleItem(item.id)}
                  />
                  <div className="flex items-center gap-3 lg:gap-4">
                    <img
                      src={item.book.coverImage}
                      alt={item.book.title}
                      className="aspect-2/3 w-17.5 shrink-0 object-cover lg:w-23"
                    />
                    <div className="flex flex-col gap-1">
                      <span className="inline-flex w-fit items-center rounded-sm border border-neutral-300 px-2 text-body-sm font-bold text-neutral-950">
                        {item.book.category.name}
                      </span>
                      <p className="text-body-md font-bold text-neutral-950 lg:text-body-lg">
                        {item.book.title}
                      </p>
                      <p className="text-body-sm font-medium text-neutral-700">
                        {item.book.author.name}
                      </p>
                    </div>
                  </div>
                </div>
                <hr className="mt-4 border-neutral-300" />
              </div>
            ))}
          </div>

          {/* Loan Summary — kartu desktop */}
          <div className="hidden w-79.5 shrink-0 flex-col gap-6 rounded-2xl bg-white p-5 shadow-lg shadow-neutral-200/50 lg:flex">
            <p className="text-body-xl font-bold text-neutral-950">Loan Summary</p>
            <div className="flex items-center justify-between">
              <span className="text-body-md font-medium text-neutral-950">Total Book</span>
              <span className="text-body-md font-bold text-neutral-950">{selectedIds.length} Items</span>
            </div>
            <button
                           onClick={handleBorrow}
              disabled={selectedIds.length === 0}
              className="flex h-12 w-full items-center justify-center rounded-full bg-primary-500 text-body-md font-bold text-neutral-25 disabled:opacity-60"
            >
                         Borrow Book
            </button>
          </div>
        </div>
      )}

      {/* Loan Summary — bar mengambang mobile */}
      {items.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 bg-white p-4 shadow-[0px_0px_20px_rgba(203,202,202,0.25)] lg:hidden">
          <div className="flex flex-col">
            <span className="text-body-sm font-medium text-neutral-950">Total Book</span>
            <span className="text-body-sm font-bold text-neutral-950">{selectedIds.length} Items</span>
          </div>
          <button
                       onClick={handleBorrow}
              disabled={selectedIds.length === 0}
            className="flex h-10 w-37.5 items-center justify-center rounded-full bg-primary-500 text-body-sm font-bold text-neutral-25 disabled:opacity-60"
          >
                      Borrow Book
          </button>
        </div>
      )}
    </div>
  )
}

export default CartPage