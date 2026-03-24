import Image from 'next/image'

interface LogoProps {
  // "full" renders a responsive banner-like layout similar to example 2
  size?: 'sm' | 'md' | 'lg' | 'full'
}

export function Logo({ size = 'md' }: LogoProps) {
  if (size === 'full') {
    return (
      <div className="w-full flex flex-col md:flex-row items-center gap-6 md:gap-10 bg-card">
        <Image
          src="/v2-1.png"
          alt="AI EduGame Robot"
          width={288}
          height={288}
          className="flex-none w-32 sm:w-40 md:w-48 lg:w-64 xl:w-72 h-auto object-contain"
          loading="eager"
        />
        <div className="min-w-0 w-full md:flex-1 overflow-hidden bg-card">
          <Image
            src="/v2-2.png"
            alt="AI EDUGAME ONLINE"
            width={800}
            height={200}
            className="block w-full h-auto object-contain"
            loading="eager"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-4">
      <Image
        src="/v2-1.png"
        alt="AI EduGame Robot"
        width={size === 'sm' ? 48 : size === 'md' ? 80 : 160}
        height={size === 'sm' ? 48 : size === 'md' ? 80 : 160}
        className={
          size === 'sm' ? 'h-12 w-12' : size === 'md' ? 'h-20 w-20' : 'h-40 w-40'
        }
      />
      <Image
        src="/v2-2.png"
        alt="AI EDUGAME ONLINE"
        width={size === 'sm' ? 120 : size === 'md' ? 192 : 384}
        height={size === 'sm' ? 40 : size === 'md' ? 64 : 128}
        className={size === 'sm' ? 'h-10' : size === 'md' ? 'h-16' : 'h-32'}
      />
    </div>
  )
}