import { useState, useEffect } from 'react'

// 1 gambar dipakai 3x (nanti tinggal ganti kalau ada gambar berbeda)
const slides = ['/hero.png', '/hero.png', '/hero.png']

function HeroCarousel() {
  const [active, setActive] = useState(0)

  // Ganti slide otomatis tiap 4 detik
  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length)
    }, 4000)

    return () => clearInterval(timer) // bersihkan saat komponen dilepas
  }, [])

  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 lg:px-8">
      <div className="flex flex-col items-center gap-md md:gap-xl">
        <div className="w-full overflow-hidden rounded-2xl md:rounded-4xl">
          <img
            src={slides[active]}
            alt="Welcome to Booky"
            className="aspect-[1200/441] w-full object-cover"
          />
        </div>

        {/* Titik indikator */}
        <div className="flex items-center gap-1 md:gap-1.5">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setActive(index)}
              aria-label={`Slide ${index + 1}`}
              className={`h-1.5 w-1.5 rounded-full md:h-2.5 md:w-2.5 ${
                index === active ? 'bg-primary-500' : 'bg-neutral-300'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default HeroCarousel