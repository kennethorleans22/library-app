import { type ReactNode } from 'react'
import { useCategories } from '@/features/categories/useCategories'

const RATINGS = [5, 4, 3, 2, 1]

function CheckboxItem({
  checked,
  onChange,
  children,
}: {
  checked: boolean
  onChange: () => void
  children: ReactNode
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2">
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
      {children}
    </label>
  )
}

interface FilterPanelProps {
  selectedCategories: number[]
  selectedRatings: number[]
  onToggleCategory: (id: number) => void
  onToggleRating: (rating: number) => void
}

function FilterPanel({
  selectedCategories,
  selectedRatings,
  onToggleCategory,
  onToggleRating,
}: FilterPanelProps) {
  const { data: categories = [] } = useCategories()

  return (
    <div className="flex flex-col gap-6 rounded-xl bg-white py-4 shadow-lg shadow-neutral-200/50">
      {/* Category */}
      <div className="flex flex-col gap-2.5 px-4">
        <p className="text-body-md font-extrabold text-neutral-950">FILTER</p>
        <p className="text-body-lg font-bold text-neutral-950">Category</p>
        {categories.map((cat) => (
          <CheckboxItem
            key={cat.id}
            checked={selectedCategories.includes(cat.id)}
            onChange={() => onToggleCategory(cat.id)}
          >
            <span className="text-body-md font-medium text-neutral-950">{cat.name}</span>
          </CheckboxItem>
        ))}
      </div>

      <hr className="border-neutral-300" />

      {/* Rating */}
      <div className="flex flex-col gap-2.5 px-4">
        <p className="text-body-lg font-bold text-neutral-950">Rating</p>
        {RATINGS.map((rating) => (
          <CheckboxItem
            key={rating}
            checked={selectedRatings.includes(rating)}
            onChange={() => onToggleRating(rating)}
          >
            <span className="flex items-center gap-1">
              <img src="/icons/star.svg" alt="" className="size-6" />
              <span className="text-body-md text-neutral-950">{rating}</span>
            </span>
          </CheckboxItem>
        ))}
      </div>
    </div>
  )
}

export default FilterPanel