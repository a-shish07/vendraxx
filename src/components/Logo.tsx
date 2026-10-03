'use client'

// Vite's static import is replaced by Next.js public asset resolution.

interface LogoProps {
  variant?: 'light' | 'dark'
  size?: 'sm' | 'md' | 'lg'
}

export default function Logo({
  variant = 'light',
  size = 'md',
}: LogoProps) {
  const sizes = {
    sm: {
      logo: 32,
      text: 'text-base',
      gap: 'gap-2',
    },
    md: {
      logo: 42,
      text: 'text-lg',
      gap: 'gap-2.5',
    },
    lg: {
      logo: 48,
      text: 'text-2xl',
      gap: 'gap-3',
    },
  }

  const current = sizes[size]

  return (
    <div
      className={`flex items-center ${current.gap} select-none`}
      aria-label="Vendrax"
    >
      {/* Original logo */}
      <img
        src="/logo.png"
        alt=""
        width={current.logo}
        height={current.logo}
        className="block shrink-0 object-contain"
      />

      {/* Vendrax name */}
      <span
        className={`
          ${current.text}
          whitespace-nowrap
          font-semibold
          tracking-tight
          ${
            variant === 'light'
              ? 'text-white'
              : 'text-brand'
          }
        `}
      >
        Vendrax
      </span>
    </div>
  )
}