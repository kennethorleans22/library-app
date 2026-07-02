import HeroCarousel from '@/components/home/HeroCarousel'
import CategorySection from '@/components/home/CategorySection'
import RecommendationSection from '@/components/home/RecommendationSection'
import PopularAuthorsSection from '@/components/home/PopularAuthorsSection'

function BookListPage() {
  return (
    <div className="flex flex-col gap-5xl py-xl md:gap-7xl">
      <HeroCarousel />
      <CategorySection />
      <RecommendationSection />
      <PopularAuthorsSection />
    </div>
  )
}

export default BookListPage