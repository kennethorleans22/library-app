import { Link } from 'react-router-dom'

const categories = [
  { id: 4, name: 'Fiction', icon: '/categories/fiction.png' },
  { id: 10, name: 'Non-Fiction', icon: '/categories/non-fiction.png' },
  { id: 7, name: 'Self-Improvement', icon: '/categories/self-improvement.png' },
  { id: 9, name: 'Finance', icon: '/categories/finance.png' },
  { id: 11, name: 'Science', icon: '/categories/science.png' },
  { id: 8, name: 'Education', icon: '/categories/education.png' },
]

function CategorySection() {
  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 lg:px-8">
      <div className="grid grid-cols-3 gap-3 md:grid-cols-6 md:gap-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/category?category=${category.id}`}
            className="flex flex-col items-start gap-3 rounded-2xl bg-white p-2 shadow-[0px_0px_20px_rgba(203,202,202,0.25)] md:p-3"
          >
            <div className="flex w-full items-center justify-center rounded-xl bg-[#E0ECFF] p-1.5">
              <img
                src={category.icon}
                alt={category.name}
                className="h-11 w-11 md:h-[52px] md:w-[52px]"
              />
            </div>
            <span className="text-body-xs font-semibold text-neutral-950 md:text-body-md">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default CategorySection