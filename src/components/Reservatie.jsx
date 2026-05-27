import { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'
import './Reservatie.css'

function todayStr() {
  const now = new Date()
  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('-')
}

function dayOfWeek(dateStr) {
  // 0=Sun, 1=Mon, ..., 6=Sat — local time interpretatie
  return new Date(dateStr + 'T00:00:00').getDay()
}

function isClosedDay(dateStr) {
  if (!dateStr) return false
  const d = dayOfWeek(dateStr)
  return d >= 1 && d <= 3 // ma, di, wo
}

function generateTimeSlots(dateStr) {
  if (!dateStr) return []
  const d = dayOfWeek(dateStr)
  let endH, endM
  if (d === 0) { endH = 17; endM = 30 }        // zo
  else if (d >= 4) { endH = 19; endM = 30 }    // do–za
  else return []                                 // ma–wo gesloten

  const slots = []
  let h = 9, m = 0
  while (h < endH || (h === endH && m <= endM)) {
    slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
    m += 30
    if (m >= 60) { m -= 60; h++ }
  }

  // Filter verleden slots wanneer datum vandaag is
  if (dateStr === todayStr()) {
    const now = new Date()
    const currentMinutes = now.getHours() * 60 + now.getMinutes()
    return slots.filter(slot => {
      const [sh, sm] = slot.split(':').map(Number)
      return sh * 60 + sm > currentMinutes
    })
  }

  return slots
}

const INIT = {
  naam: '', telefoon: '', email: '',
  datum: '', tijdstip: '', aantal_personen: 2, opmerking: '',
}

export default function Reservatie() {
  const sectionRef = useRef(null)
  const successRef = useRef(null)
  const formRef = useRef(null)
  const [form, setForm] = useState(INIT)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [submittedNaam, setSubmittedNaam] = useState('')
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('reservatie--visible')
          observer.unobserve(el)
        }
      },
      { threshold: 0.08 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const timeSlots = generateTimeSlots(form.datum)
  const closedDay = isClosedDay(form.datum)

  const validate = () => {
    const e = {}
    if (!form.naam || form.naam.trim().length < 2)
      e.naam = 'Vul uw naam in (minimaal 2 tekens).'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Vul een geldig e-mailadres in.'
    if (!form.datum)
      e.datum = 'Kies een datum.'
    else if (new Date(form.datum + 'T00:00:00') < new Date(new Date().toDateString()))
      e.datum = 'Kies een datum in de toekomst.'
    else if (closedDay)
      e.datum = 'We zijn gesloten op maandag, dinsdag en woensdag.'
    if (!form.tijdstip)
      e.tijdstip = 'Kies een tijdstip.'
    else if (form.datum === todayStr()) {
      const now = new Date()
      const currentMinutes = now.getHours() * 60 + now.getMinutes()
      const [sh, sm] = form.tijdstip.split(':').map(Number)
      if (sh * 60 + sm <= currentMinutes)
        e.tijdstip = 'Dit tijdstip is al voorbij. Kies een later tijdstip.'
    }
    const num = Number(form.aantal_personen)
    if (!form.aantal_personen || isNaN(num) || num < 1 || num > 20)
      e.aantal_personen = 'Vul een aantal in tussen 1 en 20.'
    if (form.opmerking && form.opmerking.length > 500)
      e.opmerking = 'Maximaal 500 tekens.'
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
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.from('reservaties').insert({
        naam: form.naam.trim(),
        telefoon: form.telefoon.trim() || null,
        email: form.email.trim() || null,
        datum: form.datum,
        tijdstip: form.tijdstip,
        aantal_personen: Number(form.aantal_personen),
        opmerking: form.opmerking.trim() || null,
        bron: 'online',
      })
      if (error) throw error

      // E-mailnotificatie via Netlify Function (gebouwd in Fase 6)
      try {
        await fetch('/.netlify/functions/stuur-bevestiging', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            naam: form.naam.trim(),
            telefoon: form.telefoon.trim() || null,
            email: form.email.trim() || null,
            datum: form.datum,
            tijdstip: form.tijdstip,
            aantal_personen: Number(form.aantal_personen),
            opmerking: form.opmerking.trim() || null,
          }),
        })
      } catch {
        // E-mail mislukt — reservatie is opgeslagen, geen blokkering voor bezoeker
      }

      setSubmittedNaam(form.naam.trim())
      setSuccess(true)
      setForm(INIT)
      setTimeout(() => successRef.current?.focus(), 50)
    } catch {
      setSubmitError('Er ging iets mis. Probeer het opnieuw of bel ons op 0471 74 56 68.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section
      id="reserveren"
      className="reservatie"
      ref={sectionRef}
      aria-label="Tafel reserveren"
    >
      <div className="reservatie-inner">

        <div className="reservatie-header">
          <div className="reservatie-accent" aria-hidden="true" style={{ '--i': 0 }} />
          <p className="reservatie-label" aria-hidden="true" style={{ '--i': 1 }}>Reserveren</p>
          <h2 className="reservatie-title" style={{ '--i': 2 }}>Tafel reserveren.</h2>
          <p className="reservatie-intro" style={{ '--i': 3 }}>
            Reserveer uw tafel online of bel ons op{' '}
            <a href="tel:+32471745668" className="reservatie-phone-link">0471 74 56 68</a>.
            We bevestigen binnen 24 uur.
          </p>
        </div>

        <div className="reservatie-form-wrapper" style={{ '--i': 4 }}>
          {success ? (
            <div className="reservatie-success" role="status" ref={successRef} tabIndex={-1}>
              <div className="reservatie-success-icon" aria-hidden="true">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 className="reservatie-success-title">Reservatie ontvangen!</h3>
              <p className="reservatie-success-text">
                Bedankt, <strong>{submittedNaam}</strong>. We hebben uw aanvraag goed ontvangen
                en bevestigen binnen de 24 uur via telefoon of e-mail.
                Vragen? Bel ons op{' '}
                <a href="tel:+32471745668">0471 74 56 68</a>.
              </p>
              <button
                className="reservatie-btn-secondary"
                onClick={() => { setSuccess(false); setTimeout(() => formRef.current?.focus(), 50) }}
              >
                Nog een reservatie maken
              </button>
            </div>
          ) : (
            <form className="reservatie-form" onSubmit={handleSubmit} noValidate aria-busy={loading} ref={formRef} tabIndex={-1}>

              {/* Naam + Telefoon */}
              <div className="reservatie-row">
                <div className={`reservatie-field${errors.naam ? ' reservatie-field--error' : ''}`}>
                  <label className="reservatie-field-label" htmlFor="r-naam">
                    Naam <span className="reservatie-required" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="r-naam"
                    name="naam"
                    type="text"
                    className="reservatie-input"
                    value={form.naam}
                    onChange={handleChange}
                    autoComplete="name"
                    aria-required="true"
                    aria-describedby={errors.naam ? 'err-naam' : undefined}
                  />
                  {errors.naam && (
                    <span id="err-naam" className="reservatie-field-error" role="alert">
                      {errors.naam}
                    </span>
                  )}
                </div>

                <div className="reservatie-field">
                  <label className="reservatie-field-label" htmlFor="r-telefoon">Telefoon</label>
                  <input
                    id="r-telefoon"
                    name="telefoon"
                    type="tel"
                    className="reservatie-input"
                    value={form.telefoon}
                    onChange={handleChange}
                    placeholder="bv. 0471 74 56 68"
                    autoComplete="tel"
                  />
                </div>
              </div>

              {/* E-mail */}
              <div className="reservatie-row">
                <div className={`reservatie-field reservatie-field--full${errors.email ? ' reservatie-field--error' : ''}`}>
                  <label className="reservatie-field-label" htmlFor="r-email">E-mail</label>
                  <input
                    id="r-email"
                    name="email"
                    type="email"
                    className="reservatie-input"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                    aria-describedby={errors.email ? 'err-email' : 'hint-email'}
                  />
                  {!errors.email && (
                    <span id="hint-email" className="reservatie-field-hint">
                      Voor uw bevestigingsmail (optioneel)
                    </span>
                  )}
                  {errors.email && (
                    <span id="err-email" className="reservatie-field-error" role="alert">
                      {errors.email}
                    </span>
                  )}
                </div>
              </div>

              {/* Datum + Tijdstip */}
              <div className="reservatie-row reservatie-row--break">
                <div className={`reservatie-field${errors.datum ? ' reservatie-field--error' : ''}`}>
                  <label className="reservatie-field-label" htmlFor="r-datum">
                    Datum <span className="reservatie-required" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="r-datum"
                    name="datum"
                    type="date"
                    className="reservatie-input"
                    value={form.datum}
                    onChange={handleChange}
                    min={todayStr()}
                    aria-required="true"
                    aria-describedby={errors.datum ? 'err-datum' : 'hint-datum'}
                  />
                  {!errors.datum && (
                    <span id="hint-datum" className="reservatie-field-hint">
                      Do–za 09:00–20:00 &nbsp;·&nbsp; Zo 09:00–18:00
                    </span>
                  )}
                  {errors.datum && (
                    <span id="err-datum" className="reservatie-field-error" role="alert">
                      {errors.datum}
                    </span>
                  )}
                </div>

                <div className={`reservatie-field${errors.tijdstip ? ' reservatie-field--error' : ''}`}>
                  <label className="reservatie-field-label" htmlFor="r-tijdstip">
                    Tijdstip <span className="reservatie-required" aria-hidden="true">*</span>
                  </label>
                  <select
                    id="r-tijdstip"
                    name="tijdstip"
                    className="reservatie-input reservatie-select"
                    value={form.tijdstip}
                    onChange={handleChange}
                    disabled={!form.datum || closedDay}
                    aria-required="true"
                    aria-describedby={
                      [errors.tijdstip ? 'err-tijdstip' : null, closedDay ? 'hint-tijdstip-closed' : null]
                        .filter(Boolean).join(' ') || undefined
                    }
                  >
                    <option value="">
                      {!form.datum
                        ? 'Kies eerst een datum'
                        : closedDay
                        ? 'Gesloten deze dag'
                        : 'Kies een tijdstip'}
                    </option>
                    {timeSlots.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                  {closedDay && (
                    <span id="hint-tijdstip-closed" className="reservatie-field-hint">
                      We zijn gesloten op ma, di en wo.
                    </span>
                  )}
                  {errors.tijdstip && (
                    <span id="err-tijdstip" className="reservatie-field-error" role="alert">
                      {errors.tijdstip}
                    </span>
                  )}
                </div>
              </div>

              {/* Aantal personen */}
              <div className="reservatie-row">
                <div className={`reservatie-field reservatie-field--full${errors.aantal_personen ? ' reservatie-field--error' : ''}`}>
                  <label className="reservatie-field-label" htmlFor="r-personen">
                    Aantal personen <span className="reservatie-required" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="r-personen"
                    name="aantal_personen"
                    type="number"
                    className="reservatie-input"
                    value={form.aantal_personen}
                    onChange={handleChange}
                    min="1"
                    max="20"
                    aria-required="true"
                    aria-describedby={errors.aantal_personen ? 'err-personen' : undefined}
                  />
                  {errors.aantal_personen && (
                    <span id="err-personen" className="reservatie-field-error" role="alert">
                      {errors.aantal_personen}
                    </span>
                  )}
                </div>
              </div>

              {/* Opmerking */}
              <div className="reservatie-row">
                <div className={`reservatie-field reservatie-field--full${errors.opmerking ? ' reservatie-field--error' : ''}`}>
                  <label className="reservatie-field-label" htmlFor="r-opmerking">Opmerking</label>
                  <textarea
                    id="r-opmerking"
                    name="opmerking"
                    className="reservatie-input reservatie-textarea"
                    value={form.opmerking}
                    onChange={handleChange}
                    rows={3}
                    maxLength={500}
                    placeholder="Allergieën, speciale gelegenheid, …"
                    aria-describedby={errors.opmerking ? 'err-opmerking' : form.opmerking.length > 0 ? 'hint-opmerking' : undefined}
                  />
                  {form.opmerking.length > 0 && (
                    <span id="hint-opmerking" className="reservatie-field-hint reservatie-field-hint--right">
                      {form.opmerking.length}/500
                    </span>
                  )}
                  {errors.opmerking && (
                    <span id="err-opmerking" className="reservatie-field-error" role="alert">
                      {errors.opmerking}
                    </span>
                  )}
                </div>
              </div>

              {submitError && (
                <p className="reservatie-submit-error" role="alert">{submitError}</p>
              )}

              <div className="reservatie-submit-row">
                <p className="reservatie-required-note">
                  <span aria-hidden="true">*</span> Verplicht veld
                </p>
                <button
                  type="submit"
                  className={`reservatie-btn${loading ? ' reservatie-btn--loading' : ''}`}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="reservatie-spinner" aria-hidden="true" />
                      Bezig…
                    </>
                  ) : (
                    'Reservatie bevestigen'
                  )}
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </section>
  )
}
