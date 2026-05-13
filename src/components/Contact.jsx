import './Contact.css'


function IconPhone() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.68l3-.03a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.4a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7a2 2 0 0 1 1.72 2.04z" />
    </svg>
  )
}

function IconMail() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  )
}

function IconInstagram() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

function IconFacebook() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function IconMessenger() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.908 1.438 5.503 3.686 7.196v3.561l3.447-1.888c.92.252 1.896.388 2.867.388 5.523 0 10-4.145 10-9.257S17.523 2 12 2zm1.019 12.467-2.545-2.718-4.972 2.718 5.475-5.812 2.607 2.718 4.91-2.718-5.475 5.812z" />
    </svg>
  )
}

export default function Contact() {
  return (
    <section id="contact" className="contact-section">
      <div className="contact-inner">
        <div className="contact-heading">
          <span className="contact-ornament">✦</span>
          <h2 className="contact-title">Contact</h2>
          <span className="contact-ornament">✦</span>
        </div>

        <div className="contact-info">
          <a className="contact-item" href="tel:0471745668">
            <span className="contact-icon"><IconPhone /></span>
            <span>0471 74 56 68</span>
          </a>

          <a className="contact-item" href="mailto:tperron@outlook.be">
            <span className="contact-icon"><IconMail /></span>
            <span>tperron@outlook.be</span>
          </a>
        </div>

        <div className="contact-rule" />

        <div className="social-row">
          <a
            className="social-btn"
            href="https://www.instagram.com/koffiehuis_tperron"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <IconInstagram />
            <span>Instagram</span>
          </a>
          <a
            className="social-btn"
            href="https://www.facebook.com/profile.php?id=61554801322284"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <IconFacebook />
            <span>Facebook</span>
          </a>
          <a
            className="social-btn"
            href="https://www.facebook.com/messages/t/61554801322284"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Messenger"
          >
            <IconMessenger />
            <span>Messenger</span>
          </a>
        </div>
      </div>
    </section>
  )
}
