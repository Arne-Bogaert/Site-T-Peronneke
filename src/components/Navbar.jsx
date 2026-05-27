import { useState, useEffect, useRef } from 'react'
import fullLogoImg from "../assets/'T Perron Logo.png"
import './Navbar.css'

const NAV_LINKS = [
  { label: 'Over ons',   href: '#over-ons'   },
  { label: 'Menu',       href: '#menu'       },
  { label: 'Locatie',    href: '#locatie'    },
  { label: 'Contact',    href: '#contact'    },
  { label: 'Reserveren', href: '#reserveren', cta: true },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const hamburgerRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sections = NAV_LINKS
      .map(link => document.querySelector(link.href))
      .filter(Boolean)
    if (!sections.length) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { rootMargin: '-40% 0px -55% 0px' }
    )
    sections.forEach(s => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const close = () => { setMenuOpen(false); hamburgerRef.current?.focus() }

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
    <header className={`navbar${scrolled ? ' is-scrolled' : ''}`}>
      {/* Hoofdbalk */}
      <div className="navbar-bar">
        <a href="#" className="navbar-brand" aria-label="'t Perroneke — startpagina">
          <img src={fullLogoImg} alt="" className="navbar-brand-logo" />
        </a>

        {/* Desktop links */}
        <nav className="navbar-links" aria-label="Hoofdnavigatie">
          {NAV_LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              className={[
                'navbar-link',
                link.cta ? 'navbar-link--cta' : '',
                link.href === '#' + activeSection ? 'is-active' : '',
              ].filter(Boolean).join(' ')}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Hamburger */}
        <button
          ref={hamburgerRef}
          className={`navbar-hamburger${menuOpen ? ' is-open' : ''}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? 'Menu sluiten' : 'Menu openen'}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
        >
          <span className="ham-line" />
          <span className="ham-line" />
          <span className="ham-line" />
        </button>
      </div>

      {/* Mobiel menu */}
      {menuOpen && (
        <div id="mobile-nav" className="mobile-menu" role="dialog" aria-modal="true" aria-label="Navigatie">
          <button
            className="mobile-menu-close"
            onClick={close}
            aria-label="Menu sluiten"
          >
            <span className="mobile-close-line" />
            <span className="mobile-close-line" />
          </button>
          <nav className="mobile-menu-links">
            {NAV_LINKS.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                className={`mobile-menu-link${link.cta ? ' mobile-menu-link--cta' : ''}`}
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
  )
}
