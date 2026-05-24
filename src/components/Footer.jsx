import { useState } from 'react'
import PrivacyModal from './PrivacyModal'
import './Footer.css'

const NAV_LINKS = [
  { label: 'Over ons', href: '#over-ons' },
  { label: 'Menu',     href: '#menu'     },
  { label: 'Locatie',  href: '#locatie'  },
  { label: 'Contact',  href: '#contact'  },
]

export default function Footer() {
  const [privacyOpen, setPrivacyOpen] = useState(false)

  return (
    <>
      <footer className="footer" aria-label="Voettekst">
        <div className="footer-inner">

          <div className="footer-brand">
            <p className="footer-name">'t Perroneke</p>
            <p className="footer-tagline">Koffiebar &amp; eethuis · Schendelbeke</p>
            <address className="footer-adres">
              Moenebroeckstraat 12, 9506 Schendelbeke<br />
              <a href="tel:+32471745668">0471 74 56 68</a> ·{' '}
              <a href="mailto:tperron@outlook.be">tperron@outlook.be</a>
            </address>
          </div>

          <nav className="footer-nav" aria-label="Voettekst navigatie">
            {NAV_LINKS.map(link => (
              <a key={link.href} href={link.href} className="footer-nav-link">
                {link.label}
              </a>
            ))}
          </nav>

        </div>

        <div className="footer-bottom">
          <p className="footer-legal">
            © {new Date().getFullYear()} 't Perroneke ·{' '}
            <button
              className="footer-privacy-btn"
              onClick={() => setPrivacyOpen(true)}
            >
              Privacybeleid
            </button>{' '}
            · Kaart via Google Maps
          </p>
          <p className="footer-credit">
            Website door{' '}
            <a
              href="https://www.linkedin.com/in/arne-bogaert/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Arne Bogaert — LinkedIn (opent in nieuw venster)"
            >
              Arne Bogaert
            </a>
          </p>
        </div>
      </footer>

      {privacyOpen && <PrivacyModal onClose={() => setPrivacyOpen(false)} />}
    </>
  )
}
