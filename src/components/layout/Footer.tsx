const socials = [
  { name: 'Facebook', icon: '/icons/facebook.svg', url: 'https://facebook.com' },
  { name: 'Instagram', icon: '/icons/instagram.svg', url: 'https://instagram.com' },
  { name: 'LinkedIn', icon: '/icons/linkedin.svg', url: 'https://linkedin.com' },
  { name: 'TikTok', icon: '/icons/tiktok.svg', url: 'https://tiktok.com' },
]

function Footer() {
  return (
    <footer className="border-t border-neutral-300 bg-white px-4 py-5xl tracking-[-0.02em] md:px-[150px] md:py-8xl">
      <div className="mx-auto flex max-w-[1140px] flex-col items-center gap-3xl md:gap-5xl">
        {/* Logo + deskripsi */}
        <div className="flex flex-col items-center gap-xl md:gap-[22px]">
          <div className="flex items-center gap-lg">
            <img src="/logo.svg" alt="Booky" className="h-8 w-8 md:h-[42px] md:w-[42px]" />
            <span className="text-display-md font-bold text-neutral-950">Booky</span>
          </div>
          <p className="text-center text-body-sm font-semibold text-neutral-950 md:text-body-md">
            Discover inspiring stories &amp; timeless knowledge, ready to borrow anytime.
            Explore online or visit our nearest library branch.
          </p>
        </div>

        {/* Sosial media */}
        <div className="flex flex-col items-center gap-2xl">
          <p className="text-body-md font-bold text-neutral-950">Follow on Social Media</p>
          <div className="flex items-center gap-lg">
            {socials.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300"
              >
                <img src={social.icon} alt={social.name} className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer