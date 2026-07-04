interface Props {
  open: boolean
  onCancel: () => void
  onConfirm: () => void
  isPending?: boolean
}

function DeleteConfirmDialog({ open, onCancel, onConfirm, isPending }: Props) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" role="dialog" aria-modal="true">
      {/* Overlay gelap */}
      <div className="absolute inset-0 bg-neutral-950/50" onClick={onCancel} />

      {/* Kartu */}
      <div className="relative z-10 flex w-full max-w-113 flex-col gap-4 rounded-2xl bg-white p-5 tracking-[-0.02em] lg:gap-8">
        <div className="flex flex-col gap-3">
          <h2 className="text-body-md font-bold text-neutral-950 lg:text-body-lg">Delete Data</h2>
          <p className="text-body-sm font-semibold text-neutral-950 lg:text-body-md">
            Once deleted, you won't be able to recover this data.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onCancel}
            disabled={isPending}
            className="flex h-10 flex-1 items-center justify-center rounded-full border border-neutral-300 text-body-sm font-bold text-neutral-950 disabled:opacity-60 lg:h-11 lg:text-body-md"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="flex h-10 flex-1 items-center justify-center rounded-full bg-accent-red text-body-sm font-bold text-neutral-25 disabled:opacity-60 lg:h-11 lg:text-body-md"
          >
            {isPending ? 'Loading...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmDialog