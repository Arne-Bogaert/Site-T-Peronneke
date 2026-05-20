import { useState, useEffect } from 'react'
import fullLogoImg from "../assets/'T Perron Logo.png"
import './Navbar.css'

const NAV_LINKS = [
  { label: 'Over ons',  href: '#over-ons'  },
  { label: 'Menu',      href: '#menu'      },
  { label: 'Locatie',   href: '#locatie'   },
  { label: 'Contact',   href: '#contact'   },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const close = () => setMenuOpen(false)

  useEffect(() => {
    if (!menuOpen) return
    const menu = document.getElementById('mobile-nav')
    if (!menu) return
    const focusable = Array.from(
      menu.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
    )
    const first = focusable[0]
    const last  = focusable[focusable.length - 1]
    const onKey = (e) => {
      if (e.key === 'Escape') { close(); return }
      if (e.key !== 'Tab') return
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus() }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first?.focus() }
      }
    }
    document.addEventListener('keydown', onKey)
    first?.focus()
    return () => document.removeEventListener('keydown', onKey)
  }, [menuOpen])

  return (
    <>
<header className={`navbar${scrolled ? ' is-scrolled' : ''}`}>
      {/* Hoofdbalk */}
      <div className="navbar-bar">
        <a href="#" className="navbar-brand" aria-label="'t Perroneke — startpagina">
          <img src={fullLogoImg} alt="" className="navbar-brand-logo" />
        </a>

        {/* Desktop links */}
        <nav className="navbar-links" aria-label="Hoofdnavigatie">
          {NAV_LINKS.map(link => (
            <a key={link.href} href={link.href} className="navbar-link">
              {link.label}
            </a>
          ))}
        </nav>

        {/* Hamburger */}
        <button
          className={`navbar-hamburger${menuOpen ? ' is-open' : ''}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? 'Menu sluiten' : 'Menu openen'}
          aria-expanded={menuOpen}
          aria-controls={menuOpen ? 'mobile-nav' : undefined}
        >
          <span className="ham-line" />
          <span className="ham-line" />
          <span className="ham-line" />
        </button>
      </div>

      {/* Mobiel menu */}
      {menuOpen && (
        <div id="mobile-nav" className="mobile-menu" role="dialog" aria-modal="true" aria-label="Navigatie">
          <nav className="mobile-menu-links">
            {NAV_LINKS.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                className="mobile-menu-link"
                style={{ animationDelay: `${i * 60 + 80}ms` }}
                onClick={close}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
      </header>
    </>
  )
}
