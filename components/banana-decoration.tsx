export function BananaDecoration({
  className,
  rotate = 0,
}: {
  className?: string
  rotate?: number
}) {
  return (
    <div
      className={`absolute pointer-events-none opacity-20 ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <svg viewBox="0 0 120 120" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M60 20C40 20 24 40 24 64C24 90 40 108 60 108C80 108 96 90 96 64C96 40 80 20 60 20Z"
          fill="#F6C343"
        />
        <path d="M60 8L48 24L60 18L72 24L60 8Z" fill="#2F9E44" />
        <path d="M46 14L40 28L52 22L46 14Z" fill="#37B24D" />
        <path d="M74 14L68 22L80 28L74 14Z" fill="#37B24D" />
        <path d="M38 50L82 94" stroke="#E0A22B" strokeWidth="4" strokeLinecap="round" />
        <path d="M82 50L38 94" stroke="#E0A22B" strokeWidth="4" strokeLinecap="round" />
      </svg>
    </div>
  )
}
