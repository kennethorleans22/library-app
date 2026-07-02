const categories = [
  { name: 'Fiction', icon: '/categories/fiction.png' },
  { name: 'Non-Fiction', icon: '/categories/non-fiction.png' },
  { name: 'Self-Improvement', icon: '/categories/self-improvement.png' },
  { name: 'Finance', icon: '/categories/finance.png' },
  { name: 'Science', icon: '/categories/science.png' },
  { name: 'Education', icon: '/categories/education.png' },
]

function CategorySection() {
  const handleSelect = (name: string) => {
    // TODO: filter buku sesuai kategori — disambungkan saat bikin grid + filter
    console.log('Kategori dipilih:', name)
  }

  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 lg:px-8">
      <div className="grid grid-cols-3 gap-3 md:grid-cols-6 md:gap-4">
        {categories.map((category) => (
          <button
            key={category.name}
            onClick={() => handleSelect(category.name)}
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
          </button>
        ))}
      </div>
    </section>
  )
}

export default CategorySection