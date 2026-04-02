import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { List, X } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { SiteSettings } from '@/types'
import { defaultSiteSettings } from '@/lib/defaults'

export function Navbar() {
  const [settings] = useKV<SiteSettings>('site-settings', defaultSiteSettings)
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/scores', label: 'Scores & Tables' },
    { to: '/officials', label: 'Officials' },
    { to: '/sponsors', label: 'Sponsors' },
    { to: '/contact', label: 'Contact' }
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold uppercase tracking-tight text-primary">
              {settings.clubName}
            </h1>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to}>
                <Button
                  variant={isActive(link.to) ? 'default' : 'ghost'}
                  className="uppercase tracking-wide text-sm font-semibold"
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                {isOpen ? <X size={24} /> : <List size={24} />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px]">
              <div className="flex flex-col space-y-4 mt-8">
                {navLinks.map((link) => (
                  <Link key={link.to} to={link.to} onClick={() => setIsOpen(false)}>
                    <Button
                      variant={isActive(link.to) ? 'default' : 'ghost'}
                      className="w-full justify-start uppercase tracking-wide text-sm font-semibold"
                    >
                      {link.label}
                    </Button>
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
