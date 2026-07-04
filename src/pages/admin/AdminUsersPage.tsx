import { useEffect, useState } from 'react'
import { useAdminUsers } from '@/features/admin/useAdminUsers'
import Pagination from '@/components/admin/Pagination'

const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

function AdminUsersPage() {
  const [search, setSearch] = useState('')
  const [debounced, setDebounced] = useState('')
  const [page, setPage] = useState(1)

  // debounce: tunggu 400ms setelah berhenti mengetik baru cari (biar tak spam request)
  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(search)
      setPage(1)
    }, 400)
    return () => clearTimeout(t)
  }, [search])

  const { data, isLoading, isError, error } = useAdminUsers(page, debounced)
  const users = data?.data.users ?? []
  const pagination = data?.data.pagination

  const from = pagination ? (pagination.page - 1) * pagination.limit + 1 : 0
  const to = pagination ? Math.min(pagination.page * pagination.limit, pagination.total) : 0

  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      <h1 className="text-display-xs font-bold text-neutral-950 lg:text-display-sm">User</h1>

      {/* Search */}
      <div className="flex h-11 items-center gap-1.5 rounded-full border border-neutral-300 bg-white px-4 lg:h-12 lg:w-150">
        <img src="/icons/search.svg" alt="" className="h-5 w-5" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search user"
          className="flex-1 text-body-sm font-medium text-neutral-950 outline-none placeholder:text-neutral-600"
        />
      </div>

      {isLoading && <p className="text-body-md text-neutral-500">Memuat...</p>}
      {isError && <p className="text-body-md text-danger">Error: {error.message}</p>}

      {!isLoading && !isError && (
        <>
          {/* ===== TABEL (desktop) ===== */}
          <div className="hidden rounded-xl border border-neutral-300 p-4 shadow-[0px_0px_24px_rgba(203,202,202,0.2)] lg:block">
            <table className="w-full table-fixed">
              <thead>
                <tr className="bg-neutral-50">
                  <th className="h-16 w-11 px-4 text-left text-body-sm font-bold text-neutral-950">No</th>
                  <th className="h-16 px-4 text-left text-body-sm font-bold text-neutral-950">Name</th>
                  <th className="h-16 px-4 text-left text-body-sm font-bold text-neutral-950">Nomor Handphone</th>
                  <th className="h-16 px-4 text-left text-body-sm font-bold text-neutral-950">Email</th>
                  <th className="h-16 px-4 text-left text-body-sm font-bold text-neutral-950">Created at</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u.id} className="border-b border-neutral-300">
                    <td className="h-16 px-4 text-body-md font-semibold text-neutral-950">{from + i}</td>
                    <td className="h-16 px-4 text-body-md font-semibold text-neutral-950">{u.name}</td>
                    <td className="h-16 px-4 text-body-md font-semibold text-neutral-950">{u.phone}</td>
                    <td className="h-16 px-4 text-body-md font-semibold text-neutral-950">{u.email}</td>
                    <td className="h-16 px-4 text-body-md font-semibold text-neutral-950">
                      {formatDateTime(u.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {pagination && (
              <div className="flex items-center justify-between px-6 pt-4">
                <span className="text-body-md font-medium text-neutral-950">
                  Showing {from} to {to} of {pagination.total} entries
                </span>
                <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} />
              </div>
            )}
          </div>

          {/* ===== CARDS (mobile) ===== */}
          <div className="flex flex-col gap-4 lg:hidden">
            {users.map((u, i) => (
              <div
                key={u.id}
                className="flex flex-col gap-1 rounded-xl bg-white p-3 shadow-[0px_0px_20px_rgba(203,202,202,0.25)]"
              >
                <Row label="No" value={String(from + i)} />
                <Row label="Name" value={u.name} />
                <Row label="Email" value={u.email} />
                <Row label="Nomor Handphone" value={u.phone} />
                <Row label="Created at" value={formatDateTime(u.createdAt)} />
              </div>
            ))}

            {pagination && (
              <div className="flex justify-center pt-2">
                <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-body-sm font-semibold text-neutral-950">{label}</span>
      <span className="text-right text-body-sm font-bold text-neutral-950">{value}</span>
    </div>
  )
}

export default AdminUsersPage