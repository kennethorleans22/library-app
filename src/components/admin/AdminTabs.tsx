import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/admin/loans', label: 'Borrowed List' },
  { to: '/admin/user', label: 'User' },
  { to: '/admin/books', label: 'Book List' },
]

function AdminTabs() {
  return (
    <div className="flex w-full gap-2 rounded-2xl bg-neutral-100 p-2 lg:w-150">
      {tabs.map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          className={({ isActive }) =>
            `flex h-10 flex-1 items-center justify-center rounded-xl px-3 text-body-sm lg:text-body-md ${
              isActive
                ? 'bg-white font-bold text-neutral-950 shadow-[0px_0px_20px_rgba(203,202,202,0.25)]'
                : 'font-medium text-neutral-600'
            }`
          }
        >
          {t.label}
        </NavLink>
      ))}
    </div>
  )
}

export default AdminTabs