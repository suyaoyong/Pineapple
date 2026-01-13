export function BananaIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M32 18C22 18 14 28 14 40C14 51 22 58 32 58C42 58 50 51 50 40C50 28 42 18 32 18Z"
        fill="#F6C343"
        stroke="#D99A1D"
        strokeWidth="2"
      />
      <path d="M32 6L24 16L32 12L40 16L32 6Z" fill="#2F9E44" />
      <path d="M24 10L20 20L28 16L24 10Z" fill="#37B24D" />
      <path d="M40 10L36 16L44 20L40 10Z" fill="#37B24D" />
      <path d="M22 32L42 52" stroke="#E0A22B" strokeWidth="2" strokeLinecap="round" />
      <path d="M42 32L22 52" stroke="#E0A22B" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
