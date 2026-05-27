// Netlify Function: stuur-bevestiging
// Stuurt twee e-mails via Resend:
//   1. Notificatiemail naar tperron@outlook.be
//   2. Bevestigingsmail naar de gast (enkel als e-mail opgegeven)

const RESEND_API_URL = 'https://api.resend.com/emails'
const NOTIFY_EMAIL   = 'arnebogaert81@gmail.com' // TEST — zet terug naar tperron@outlook.be na testen
const FROM_EMAIL     = "t Perroneke <onboarding@resend.dev>" // tijdelijk — vervang door geverifieerd@tperroneke.be na domeinverificatie
const SITE_URL       = 'https://tperroneke.be'

const DAGEN_NL = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag']
const MAANDEN_NL = [
  'januari', 'februari', 'maart', 'april', 'mei', 'juni',
  'juli', 'augustus', 'september', 'oktober', 'november', 'december',
]

function formatDatumLang(datumStr) {
  const [y, m, d] = datumStr.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return `${DAGEN_NL[date.getDay()]} ${d} ${MAANDEN_NL[m - 1]} ${y}`
}

async function stuurEmail(to, subject, text) {
  const res = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: FROM_EMAIL, to, subject, text }),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Resend fout ${res.status}: ${body}`)
  }
}

export const handler = async (event) => {
  // Enkel POST aanvaarden
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  // Basis-verificatie: aanroep moet van de eigen site komen
  const origin = event.headers['origin'] || ''
  if (origin && !origin.includes('tperroneke.be') && !origin.includes('localhost')) {
    return { statusCode: 403, body: 'Forbidden' }
  }

  let data
  try {
    data = JSON.parse(event.body)
  } catch {
    return { statusCode: 400, body: 'Ongeldige JSON' }
  }

  const { naam, telefoon, email, datum, tijdstip, aantal_personen, opmerking } = data

  if (!naam || !datum || !tijdstip || !aantal_personen) {
    return { statusCode: 400, body: 'Verplichte velden ontbreken' }
  }

  const datumNL    = formatDatumLang(datum)
  const personen   = `${aantal_personen} ${Number(aantal_personen) === 1 ? 'persoon' : 'personen'}`
  const telefoonTxt = telefoon || 'niet opgegeven'
  const emailTxt   = email    || 'niet opgegeven'
  const opmerkingTxt = opmerking || 'geen'

  // Mail 1: notificatie naar 't Perroneke
  const notificatieTekst = `Nieuwe reservatie ontvangen!

Naam:      ${naam}
Datum:     ${datumNL}
Tijdstip:  ${tijdstip}
Personen:  ${personen}
Telefoon:  ${telefoonTxt}
E-mail:    ${emailTxt}
Opmerking: ${opmerkingTxt}

Beheer via: ${SITE_URL}/reservatiebeheer`

  // Mail 2: bevestiging aan gast (enkel als e-mail opgegeven)
  const bevestigingTekst = email ? `Bedankt voor uw reservatie bij 't Perroneke!

Wij hebben uw reservatie ontvangen voor:
  ${datumNL} om ${tijdstip}
  ${personen}

Wij bevestigen binnen de 24 uur via telefoon of e-mail.
Vragen? Bel ons: 0471 74 56 68

't Perroneke — Moenebroeckstraat 12, 9506 Schendelbeke` : null

  const fouten = []

  try {
    await stuurEmail(NOTIFY_EMAIL, `Nieuwe reservatie: ${naam} — ${datumNL} ${tijdstip}`, notificatieTekst)
  } catch (err) {
    fouten.push(`Notificatie: ${err.message}`)
  }

  if (bevestigingTekst) {
    try {
      await stuurEmail(email, `Uw reservatie bij 't Perroneke — ${datumNL}`, bevestigingTekst)
    } catch (err) {
      fouten.push(`Bevestiging: ${err.message}`)
    }
  }

  if (fouten.length > 0) {
    console.error('E-mailfout(en):', fouten.join('; '))
    // Geef toch 200 terug — de reservatie is al opgeslagen in Supabase
    return { statusCode: 200, body: JSON.stringify({ ok: false, fouten }) }
  }

  return { statusCode: 200, body: JSON.stringify({ ok: true }) }
}
