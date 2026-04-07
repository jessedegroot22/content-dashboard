interface TopBarProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
}

export default function TopBar({ title, subtitle, actions }: TopBarProps) {
  return (
    <header className="sticky top-0 z-40 h-16 bg-surface-container-low/80 backdrop-blur-xl flex items-center justify-between px-8 border-b-0">
      <div>
        <h2 className="text-lg font-bold font-headline text-on-surface">{title}</h2>
        {subtitle && (
          <p className="text-xs text-on-surface-variant -mt-0.5">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </header>
  )
}
