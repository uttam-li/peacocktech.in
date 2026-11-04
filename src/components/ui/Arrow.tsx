interface ArrowProps {
  className?: string
}

export default function Arrow({ className }: ArrowProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" width="20" height="20" aria-hidden="true" focusable="false">
      <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}
