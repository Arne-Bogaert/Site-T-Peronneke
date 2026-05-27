import { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'
import logo from "../assets/'T Perron Logo.png"
import './Reservatiebeheer.css'

// ── Helpers ────────────────────────────────────────────────────

function todayStr() {
  const now = new Date()
  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('-')
}

function formatDateNL(dateStr) {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-')
  const date = new Date(Number(y), Number(m) - 1, Number(d))
  return date.toLocaleDateString('nl-BE', { weekday: 'long', day: 'numeric', month: 'long' })
}

function formatTijdstip(t) {
  return t ? t.slice(0, 5) : ''
}

function generateTimeSlots(dateStr) {
  if (!dateStr) return []
  const day = new Date(dateStr + 'T00:00:00').getDay()
  let endH, endM
  if (day === 0) { endH = 17; endM = 30 }
  else if (day >= 4) { endH = 19; endM = 30 }
  else return []
  const slots = []
  let h = 9, m = 0
  while (h < endH || (h === endH && m <= endM)) {
    slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
    m += 30
    if (m >= 60) { m -= 60; h++ }
  }
  return slots
}

function isClosedDay(dateStr) {
  if (!dateStr) return false
  const d = new Date(dateStr + 'T00:00:00').getDay()
  return d >= 1 && d <= 3
}

const STATUS_CONFIG = {
  nieuw:       { label: 'Nieuw',       cls: 'status--nieuw'       },
  bevestigd:   { label: 'Bevestigd',   cls: 'status--bevestigd'   },
  geannuleerd: { label: 'Geannuleerd', cls: 'status--geannuleerd' },
}

const FORM_INIT = {
  naam: '', telefoon: '', email: '', datum: '', tijdstip: '',
  aantal_personen: 2, opmerking: '',
}

// ── Login ──────────────────────────────────────────────────────

function LoginScherm({ onLogin }) {
  const [email, setEmail] = useState('')
  const [wachtwoord, setWachtwoord] = useState('')
  const [loading, setLoading] = useState(false)
  const [fout, setFout] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFout('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password: wachtwoord })
    if (error) {
      setFout('Ongeldig e-mailadres of wachtwoord.')
    } else {
      onLogin()
    }
    setLoading(false)
  }

  return (
    <div className="rb-login-wrap">
      <div className="rb-login-card">
        <img src={logo} alt="'t Perroneke" className="rb-login-logo" />
        <h1 className="rb-login-title">Reservatiebeheer</h1>
        <form className="rb-login-form" onSubmit={handleSubmit} noValidate>
          <div className="rb-field">
            <label className="rb-field-label" htmlFor="l-email">E-mail</label>
            <input
              id="l-email"
              type="email"
              className="rb-input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              aria-required="true"
            />
          </div>
          <div className="rb-field">
            <label className="rb-field-label" htmlFor="l-wachtwoord">Wachtwoord</label>
            <input
              id="l-wachtwoord"
              type="password"
              className="rb-input"
              value={wachtwoord}
              onChange={e => setWachtwoord(e.target.value)}
              autoComplete="current-password"
              aria-required="true"
            />
          </div>
          {fout && <p className="rb-login-fout" role="alert">{fout}</p>}
          <button
            type="submit"
            className={`rb-btn-primary${loading ? ' rb-btn--loading' : ''}`}
            disabled={loading}
          >
            {loading ? <><span className="rb-spinner" aria-hidden="true" />Bezig…</> : 'Inloggen'}
          </button>
        </form>
        <p className="rb-login-hint">Problemen? Contacteer Arne.</p>
      </div>
    </div>
  )
}

// ── Reservatie-kaart ────────────────────────────────────────────

function ReservatieKaart({ reservatie, onStatusChange }) {
  const [updating, setUpdating] = useState(false)
  const [fout, setFout] = useState('')
  const [bevestigFlits, setBevestigFlits] = useState(false)
  const [annuleerConfirm, setAnnuleerConfirm] = useState(false)
  const { label, cls } = STATUS_CONFIG[reservatie.status] || STATUS_CONFIG.nieuw

  const updateStatus = async (nieuweStatus) => {
    setUpdating(true)
    setFout('')
    const { error } = await supabase
      .from('reservaties')
      .update({ status: nieuweStatus })
      .eq('id', reservatie.id)
    setUpdating(false)
    if (error) {
      setFout('Opslaan mislukt. Controleer de verbinding.')
      return
    }
    if (nieuweStatus === 'bevestigd') {
      setBevestigFlits(true)
      setTimeout(() => setBevestigFlits(false), 1400)
    }
    setAnnuleerConfirm(false)
    onStatusChange(reservatie.id, nieuweStatus)
  }

  return (
    <article className={[
      'rb-kaart',
      reservatie.status === 'geannuleerd' ? 'rb-kaart--geannuleerd' : '',
      bevestigFlits ? 'rb-kaart--bevestigd-flits' : '',
    ].filter(Boolean).join(' ')}>
      <div className="rb-kaart-header">
        <div className="rb-kaart-tijd">
          <span className="rb-kaart-tijdstip">{formatTijdstip(reservatie.tijdstip)}</span>
          <span className={`rb-status-badge ${cls}`}>{label}</span>
        </div>
        <span className="rb-kaart-bron">{reservatie.bron}</span>
      </div>

      <div className="rb-kaart-body">
        <p className="rb-kaart-naam">{reservatie.naam}</p>
        <p className="rb-kaart-meta">
          {reservatie.aantal_personen} {reservatie.aantal_personen === 1 ? 'persoon' : 'personen'}
          {reservatie.telefoon && <> · <a href={`tel:${reservatie.telefoon.replace(/\s/g, '')}`}>{reservatie.telefoon}</a></>}
          {reservatie.email && <> · <a href={`mailto:${reservatie.email}`}>{reservatie.email}</a></>}
        </p>
        {reservatie.opmerking && (
          <p className="rb-kaart-opmerking">"{reservatie.opmerking}"</p>
        )}
        {fout && <p className="rb-kaart-fout" role="alert">{fout}</p>}
      </div>

      {reservatie.status !== 'geannuleerd' && (
        <div className="rb-kaart-acties">
          {reservatie.status === 'nieuw' && (
            <button
              className="rb-btn-bevestig"
              onClick={() => updateStatus('bevestigd')}
              disabled={updating}
            >
              Bevestigen
            </button>
          )}
          {annuleerConfirm ? (
            <div className="rb-annuleer-confirm">
              <span>Zeker annuleren?</span>
              <button
                className="rb-btn-annuleer-ja"
                onClick={() => updateStatus('geannuleerd')}
                disabled={updating}
              >
                Ja
              </button>
              <button
                className="rb-btn-annuleer-nee"
                onClick={() => setAnnuleerConfirm(false)}
              >
                Nee
              </button>
            </div>
          ) : (
            <button
              className="rb-btn-annuleer"
              onClick={() => setAnnuleerConfirm(true)}
              disabled={updating}
            >
              Annuleren
            </button>
          )}
        </div>
      )}
    </article>
  )
}

// ── Nieuw reservatie modal (telefonische invoer) ────────────────

function NieuweReservatieModal({ onClose, onSaved }) {
  const [form, setForm] = useState(FORM_INIT)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const dialogRef = useRef(null)

  useEffect(() => {
    const el = dialogRef.current
    if (!el) return
    const focusable = Array.from(el.querySelectorAll('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'))
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    const onKey = (e) => {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key !== 'Tab') return
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus() }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus() }
      }
    }
    document.addEventListener('keydown', onKey)
    first?.focus()
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const timeSlots = generateTimeSlots(form.datum)
  const closedDay = isClosedDay(form.datum)

  function todayStrLocal() {
    const now = new Date()
    return [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join('-')
  }

  const validate = () => {
    const e = {}
    if (!form.naam || form.naam.trim().length < 2) e.naam = 'Verplicht (min. 2 tekens).'
    if (!form.datum) e.datum = 'Kies een datum.'
    else if (closedDay) e.datum = 'Gesloten op ma, di en wo.'
    if (!form.tijdstip) e.tijdstip = 'Kies een tijdstip.'
    const num = Number(form.aantal_personen)
    if (!form.aantal_personen || isNaN(num) || num < 1 || num > 20) e.aantal_personen = '1–20 personen.'
    return e
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => {
      const next = { ...prev, [name]: value }
      if (name === 'datum') next.tijdstip = ''
      return next
    })
    if (errors[name]) setErrors(prev => { const n = { ...prev }; delete n[name]; return n })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')
    const v = validate()
    if (Object.keys(v).length > 0) { setErrors(v); return }

    setLoading(true)
    const { error } = await supabase.from('reservaties').insert({
      naam: form.naam.trim(),
      telefoon: form.telefoon.trim() || null,
      email: form.email.trim() || null,
      datum: form.datum,
      tijdstip: form.tijdstip,
      aantal_personen: Number(form.aantal_personen),
      opmerking: form.opmerking.trim() || null,
      bron: 'telefonisch',
      status: 'bevestigd',
    })
    setLoading(false)
    if (error) { setSubmitError('Opslaan mislukt. Probeer opnieuw.'); return }
    onSaved()
  }

  return (
    <div className="rb-modal-overlay" onClick={onClose} role="presentation">
      <div
        className="rb-modal"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Nieuwe reservatie"
        onClick={e => e.stopPropagation()}
      >
        <div className="rb-modal-header">
          <h2 className="rb-modal-title">Nieuwe reservatie</h2>
          <button className="rb-modal-close" onClick={onClose} aria-label="Sluiten">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form className="rb-modal-form" onSubmit={handleSubmit} noValidate>
          <div className="rb-form-row">
            <div className={`rb-field${errors.naam ? ' rb-field--error' : ''}`}>
              <label className="rb-field-label" htmlFor="m-naam">Naam *</label>
              <input id="m-naam" name="naam" type="text" className="rb-input" value={form.naam} onChange={handleChange} />
              {errors.naam && <span className="rb-field-error" role="alert">{errors.naam}</span>}
            </div>
            <div className="rb-field">
              <label className="rb-field-label" htmlFor="m-telefoon">Telefoon</label>
              <input id="m-telefoon" name="telefoon" type="tel" className="rb-input" value={form.telefoon} onChange={handleChange} placeholder="0472 12 34 56" />
            </div>
          </div>

          <div className="rb-form-row">
            <div className={`rb-field${errors.datum ? ' rb-field--error' : ''}`}>
              <label className="rb-field-label" htmlFor="m-datum">Datum *</label>
              <input id="m-datum" name="datum" type="date" className="rb-input" value={form.datum} onChange={handleChange} min={todayStrLocal()} />
              {errors.datum && <span className="rb-field-error" role="alert">{errors.datum}</span>}
            </div>
            <div className={`rb-field${errors.tijdstip ? ' rb-field--error' : ''}`}>
              <label className="rb-field-label" htmlFor="m-tijdstip">Tijdstip *</label>
              <select id="m-tijdstip" name="tijdstip" className="rb-input rb-select" value={form.tijdstip} onChange={handleChange} disabled={!form.datum || closedDay}>
                <option value="">{!form.datum ? 'Kies datum eerst' : closedDay ? 'Gesloten' : 'Kies tijdstip'}</option>
                {timeSlots.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.tijdstip && <span className="rb-field-error" role="alert">{errors.tijdstip}</span>}
            </div>
          </div>

          <div className="rb-form-row">
            <div className={`rb-field${errors.aantal_personen ? ' rb-field--error' : ''}`}>
              <label className="rb-field-label" htmlFor="m-personen">Aantal personen *</label>
              <input id="m-personen" name="aantal_personen" type="number" className="rb-input" value={form.aantal_personen} onChange={handleChange} min="1" max="20" />
              {errors.aantal_personen && <span className="rb-field-error" role="alert">{errors.aantal_personen}</span>}
            </div>
            <div className="rb-field">
              <label className="rb-field-label" htmlFor="m-email">E-mail</label>
              <input id="m-email" name="email" type="email" className="rb-input" value={form.email} onChange={handleChange} />
            </div>
          </div>

          <div className="rb-field">
            <label className="rb-field-label" htmlFor="m-opmerking">Opmerking</label>
            <textarea id="m-opmerking" name="opmerking" className="rb-input rb-textarea" value={form.opmerking} onChange={handleChange} rows={2} maxLength={500} />
          </div>

          {submitError && <p className="rb-submit-error" role="alert">{submitError}</p>}

          <div className="rb-modal-footer">
            <button type="button" className="rb-btn-secondary" onClick={onClose}>Annuleren</button>
            <button type="submit" className={`rb-btn-primary${loading ? ' rb-btn--loading' : ''}`} disabled={loading}>
              {loading ? <><span className="rb-spinner" aria-hidden="true" />Opslaan…</> : 'Reservatie opslaan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Hoofdcomponent ─────────────────────────────────────────────

export default function Reservatiebeheer() {
  const [sessie, setSessie] = useState(null)
  const [ladenSessie, setLadenSessie] = useState(true)
  const [reservaties, setReservaties] = useState([])
  const [ladenData, setLadenData] = useState(false)
  const [datum, setDatum] = useState(todayStr())
  const [modalOpen, setModalOpen] = useState(false)

  // Sessie ophalen bij laden
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSessie(session)
      setLadenSessie(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessie(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  // Reservaties ophalen wanneer datum of sessie wijzigt
  useEffect(() => {
    if (!sessie) return
    setLadenData(true)
    supabase
      .from('reservaties')
      .select('*')
      .eq('datum', datum)
      .order('tijdstip', { ascending: true })
      .then(({ data, error }) => {
        if (!error) setReservaties(data || [])
        setLadenData(false)
      })
  }, [datum, sessie])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const handleStatusChange = (id, nieuweStatus) => {
    setReservaties(prev => prev.map(r => r.id === id ? { ...r, status: nieuweStatus } : r))
  }

  const handleDatumNavigatie = (richting) => {
    const d = new Date(datum + 'T00:00:00')
    d.setDate(d.getDate() + richting)
    setDatum([
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, '0'),
      String(d.getDate()).padStart(2, '0'),
    ].join('-'))
  }

  const handleModalSaved = () => {
    setModalOpen(false)
    // Herlaad reservaties voor geselecteerde datum
    setLadenData(true)
    supabase
      .from('reservaties')
      .select('*')
      .eq('datum', datum)
      .order('tijdstip', { ascending: true })
      .then(({ data, error }) => {
        if (!error) setReservaties(data || [])
        setLadenData(false)
      })
  }

  if (ladenSessie) return null

  if (!sessie) return <LoginScherm onLogin={() => {}} />

  const actief = reservaties.filter(r => r.status !== 'geannuleerd')
  const geannuleerd = reservaties.filter(r => r.status === 'geannuleerd')

  return (
    <div className="rb-wrap">
      {/* Header */}
      <header className="rb-header">
        <div className="rb-header-inner">
          <img src={logo} alt="'t Perroneke" className="rb-header-logo" />
          <h1 className="rb-header-title">Reservatiebeheer</h1>
          <button className="rb-btn-logout" onClick={handleLogout}>
            Uitloggen
          </button>
        </div>
      </header>

      <main className="rb-main">
        {/* Datumnavigatie */}
        <div className="rb-datum-bar">
          <button
            className="rb-datum-nav"
            onClick={() => handleDatumNavigatie(-1)}
            aria-label="Vorige dag"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div className="rb-datum-midden">
            <p className="rb-datum-label">
              {formatDateNL(datum)}
              <svg className="rb-datum-kalender-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </p>
            <input
              type="date"
              className="rb-datum-input"
              value={datum}
              onChange={e => setDatum(e.target.value)}
              aria-label="Kies datum"
            />
          </div>

          <button
            className="rb-datum-nav"
            onClick={() => handleDatumNavigatie(1)}
            aria-label="Volgende dag"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* Samenvatting */}
        {!ladenData && (
          <div className="rb-samenvatting">
            <span className="rb-samenvatting-item">
              <strong>{actief.length}</strong> {actief.length === 1 ? 'reservatie' : 'reservaties'}
            </span>
            <span className="rb-samenvatting-sep">·</span>
            <span className="rb-samenvatting-item">
              <strong>{actief.reduce((s, r) => s + r.aantal_personen, 0)}</strong> personen
            </span>
          </div>
        )}

        {/* Reservaties */}
        {ladenData ? (
          <div className="rb-laden" aria-live="polite">
            <span className="rb-spinner rb-spinner--dark" aria-hidden="true" />
            Laden…
          </div>
        ) : reservaties.length === 0 ? (
          <div className="rb-leeg">
            <p>Geen reservaties voor {formatDateNL(datum)}.</p>
          </div>
        ) : (
          <div className="rb-lijst">
            {actief.map(r => (
              <ReservatieKaart key={r.id} reservatie={r} onStatusChange={handleStatusChange} />
            ))}
            {geannuleerd.length > 0 && (
              <>
                <p className="rb-sectie-label">Geannuleerd</p>
                {geannuleerd.map(r => (
                  <ReservatieKaart key={r.id} reservatie={r} onStatusChange={handleStatusChange} />
                ))}
              </>
            )}
          </div>
        )}
      </main>

      {/* Zwevende knop */}
      <button
        className="rb-fab"
        onClick={() => setModalOpen(true)}
        aria-label="Nieuwe reservatie toevoegen"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        <span>Nieuwe reservatie</span>
      </button>

      {modalOpen && (
        <NieuweReservatieModal
          onClose={() => setModalOpen(false)}
          onSaved={handleModalSaved}
        />
      )}
    </div>
  )
}
