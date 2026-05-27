import { useEffect, useRef } from 'react'
import './PrivacyModal.css'

export default function PrivacyModal({ onClose }) {
  const overlayRef = useRef(null)
  const closeRef   = useRef(null)

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key !== 'Tab') return
      const modal = overlayRef.current
      if (!modal) return
      const focusable = Array.from(
        modal.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
      )
      const first = focusable[0]
      const last  = focusable[focusable.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus() }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first?.focus() }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="privacy-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Privacybeleid"
      ref={overlayRef}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="privacy-modal">
        <div className="privacy-modal-header">
          <h2 className="privacy-modal-title">Privacybeleid</h2>
          <button
            ref={closeRef}
            className="privacy-modal-close"
            onClick={onClose}
            aria-label="Privacybeleid sluiten"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"
              aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="privacy-modal-body">
          <p className="privacy-updated">Laatst bijgewerkt: mei 2026</p>

          <h3>Verwerkingsverantwoordelijke</h3>
          <p>
            't Perroneke, uitgebaat door Eddy en Sabrina<br />
            Moenebroeckstraat 12, 9506 Schendelbeke<br />
            <a href="mailto:tperron@outlook.be">tperron@outlook.be</a>
          </p>

          <h3>Reservaties</h3>
          <p>
            Wanneer u een tafel reserveert via onze website, verwerken wij de
            volgende gegevens: naam, datum, tijdstip, aantal personen en
            eventueel een telefoonnummer, e-mailadres en opmerking.
            Deze gegevens worden uitsluitend gebruikt om uw reservatie te
            bevestigen en te beheren.
          </p>
          <p>
            Uw reservatiegegevens worden opgeslagen via{' '}
            <strong>Supabase Inc.</strong> op servers in Frankfurt (EU).
            Supabase is gecertificeerd onder de Standard Contractual Clauses
            en heeft een verwerkersovereenkomst (DPA) beschikbaar via{' '}
            <a
              href="https://supabase.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Supabase privacybeleid (opent in nieuw venster)"
            >
              supabase.com/privacy
            </a>
            . Reservaties worden bewaard tot 30 dagen na de reservatiedatum
            en daarna verwijderd.
          </p>
          <p>
            E-mailbevestigingen worden verstuurd via{' '}
            <strong>Resend Inc.</strong> Uw e-mailadres wordt enkel gebruikt
            om u de bevestiging te bezorgen en wordt niet bewaard door Resend
            na verzending.
          </p>

          <h3>Externe diensten</h3>
          <p>
            Deze website maakt gebruik van twee externe diensten die mogelijk
            gegevens verwerken:
          </p>
          <ul>
            <li>
              <strong>Google Maps</strong> — De interactieve kaart wordt
              aangeboden door Google Ireland Limited. U geeft expliciet
              toestemming vóór de kaart laadt. Bij het laden kunnen cookies
              worden geplaatst en kan uw IP-adres worden doorgegeven aan
              Google.{' '}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Google Privacybeleid (opent in nieuw venster)"
              >
                Google Privacybeleid
              </a>
            </li>
            <li>
              <strong>Google Fonts</strong> — Lettertypes worden geladen via
              Google Fonts. Hierbij kan uw IP-adres worden doorgegeven aan
              Google servers.{' '}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Google Privacybeleid (opent in nieuw venster)"
              >
                Google Privacybeleid
              </a>
            </li>
          </ul>

          <h3>Uw rechten</h3>
          <p>
            U heeft het recht op inzage, correctie en verwijdering van uw
            persoonsgegevens, alsook het recht om bezwaar te maken tegen de
            verwerking. Contacteer ons via{' '}
            <a href="mailto:tperron@outlook.be">tperron@outlook.be</a>.
          </p>
          <p>
            U kunt ook een klacht indienen bij de Gegevensbeschermingsautoriteit:{' '}
            <a
              href="https://www.gegevensbeschermingsautoriteit.be"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Gegevensbeschermingsautoriteit (opent in nieuw venster)"
            >
              gegevensbeschermingsautoriteit.be
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
