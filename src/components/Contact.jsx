import { useEffect, useRef, useState } from 'react'
import './Contact.css'

const CONTACT_ITEMS = [
  {
    label: 'Telefoon',
    value: '0471 74 56 68',
    href: 'tel:+32471745668',
    copyValue: '0471 74 56 68',
    external: false,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.94-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
  {
    label: 'E-mail',
    value: 'tperron@outlook.be',
    href: 'mailto:tperron@outlook.be',
    copyValue: 'tperron@outlook.be',
    external: false,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    value: '@koffiehuis_tperron',
    href: 'https://www.instagram.com/koffiehuis_tperron',
    external: true,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    label: 'Facebook',
    value: "'t Perroneke",
    href: 'https://www.facebook.com/profile.php?id=61554801322284',
    external: true,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: 'Messenger',
    value: 'Chat via Messenger',
    href: 'https://www.facebook.com/messages/t/61554801322284',
    external: true,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
]

const ArrowIcon = () => (
  <svg
    className="contact-card-arrow"
    width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
)

const ClipboardIcon = () => (
  <svg
    className="contact-card-arrow contact-card-arrow--clipboard"
    width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
  </svg>
)

export default function Contact() {
  const sectionRef = useRef(null)
  const [copiedId, setCopiedId] = useState(null)
  const toastTimerRef = useRef(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('contact--visible')
          observer.unobserve(el)
        }
      },
      { threshold: 0.08 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    }
  }, [])

  const handleCardClick = (item) => {
    if (!item.copyValue || !navigator.clipboard) return
    navigator.clipboard.writeText(item.copyValue)
      .then(() => {
        if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
        setCopiedId(item.label)
        toastTimerRef.current = setTimeout(() => setCopiedId(null), 1800)
      })
      .catch(() => {})
  }

  return (
    <section
      id="contact"
      className="contact"
      ref={sectionRef}
      aria-label="Contact"
    >
      <div className="contact-inner">

        <div className="contact-header">
          <div className="contact-accent" aria-hidden="true" style={{ '--i': 0 }} />
          <p className="contact-label" aria-hidden="true" style={{ '--i': 1 }}>
            Contact
          </p>
          <h2 className="contact-title" style={{ '--i': 2 }}>
            Kom gerust langs.
          </h2>
          <p className="contact-intro" style={{ '--i': 3 }}>
            Reserveren kan telefonisch. Bel ons op, stuur een mailtje
            of volg ons op sociale media: we helpen je graag verder.
          </p>
        </div>

        <ul className="contact-grid" aria-label="Contactkanalen">
          {CONTACT_ITEMS.map((item, i) => (
            <li
              key={item.label}
              className="contact-grid-item"
              style={{ '--i': i }}
            >
              <a
                href={item.href}
                className={`contact-card${item.copyValue ? ' contact-card--copiable' : ''}${copiedId === item.label ? ' is-copied' : ''}`}
                {...(item.external
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
                aria-label={`${item.label}: ${item.value}${item.external ? ' (opent in nieuw venster)' : ''}`}
                onClick={() => handleCardClick(item)}
              >
                <span className="contact-card-icon" aria-hidden="true">
                  {item.icon}
                </span>
                <span className="contact-card-body">
                  <span className="contact-card-label">{item.label}</span>
                  <span className="contact-card-value">{item.value}</span>
                </span>
                {item.copyValue ? <ClipboardIcon /> : <ArrowIcon />}
                {item.copyValue && (
                  <span
                    className="contact-card-toast"
                    role="status"
                    aria-live="polite"
                  >
                    {copiedId === item.label ? 'Gekopieerd!' : ''}
                  </span>
                )}
              </a>
            </li>
          ))}
        </ul>

      </div>
    </section>
  )
}
