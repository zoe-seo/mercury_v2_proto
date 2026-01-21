import { type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useUiStore } from '@/store/ui.store'
import { cn } from '@/utils/cn'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { isSidebarOpen, toggleSidebar } = useUiStore()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <button
            onClick={toggleSidebar}
            className="mr-4 p-2 hover:bg-accent rounded-md"
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Link to="/" className="font-bold text-xl">
            Mercury V2
          </Link>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            'sticky top-14 h-[calc(100vh-3.5rem)] border-r bg-background transition-all duration-300',
            isSidebarOpen ? 'w-64' : 'w-0 overflow-hidden'
          )}
        >
          <nav className="p-4 space-y-2">
            <Link to="/" className="block px-4 py-2 rounded-md hover:bg-accent transition-colors">
              Home
            </Link>
            <Link
              to="/page-a"
              className="block px-4 py-2 rounded-md hover:bg-accent transition-colors"
            >
              Page A (Query)
            </Link>
            <Link
              to="/page-b"
              className="block px-4 py-2 rounded-md hover:bg-accent transition-colors"
            >
              Page B (Zustand)
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
