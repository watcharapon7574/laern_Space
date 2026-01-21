interface LogoProps {
  // "full" renders a responsive banner-like layout similar to example 2
  size?: 'sm' | 'md' | 'lg' | 'full'
}

export function Logo({ size = 'md' }: LogoProps) {
  if (size === 'full') {
    return (
      <div className="w-full flex flex-col md:flex-row items-center gap-6 md:gap-10 bg-card">
        <img
          src="/v2-1.png"
          alt="AI EduGame Robot"
          className="flex-none w-32 sm:w-40 md:w-48 lg:w-64 xl:w-72 h-auto object-contain"
        />
        <div className="min-w-0 w-full md:flex-1 overflow-hidden bg-card">
          <img
            src="/v2-2.png"
            alt="AI EDUGAME ONLINE"
            className="block w-full h-auto object-contain"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-4">
      <img
        src="/v2-1.png"
        alt="AI EduGame Robot"
        className={
          size === 'sm' ? 'h-12 w-12' : size === 'md' ? 'h-20 w-20' : 'h-40 w-40'
        }
      />
      <img
        src="/v2-2.png"
        alt="AI EDUGAME ONLINE"
        className={size === 'sm' ? 'h-10' : size === 'md' ? 'h-16' : 'h-32'}
      />
    </div>
  )
}