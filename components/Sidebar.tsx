'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/ideeen', label: 'Content ideeën', icon: 'lightbulb' },
  { href: '/actief', label: 'Actieve jobs', icon: 'pending_actions' },
  { href: '/instellingen', label: 'Instellingen', icon: 'settings' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar flex flex-col shadow-sidebar z-50">
      {/* Logo */}
      <div className="p-8">
        <h1 className="text-xl font-bold text-white font-headline tracking-tight">
          Content Dashboard
        </h1>
        <p className="text-xs text-on-primary-container mt-1">SEO Content Tool</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 mt-2">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 ${
                isActive
                  ? 'text-tertiary-fixed bg-white/10 scale-[0.97]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              <span className={`text-sm ${isActive ? 'font-semibold' : ''}`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="p-6 mt-auto border-t border-white/5">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary-container text-[16px]">
              business
            </span>
          </div>
          <div>
            <p className="text-xs font-semibold text-white">Webleaders</p>
            <p className="text-[10px] text-on-primary-container">Marketing Agency</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
