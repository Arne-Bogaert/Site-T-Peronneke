# Reservatiesysteem 't Perroneke — Implementatieplan

> Dit document is de enige bron van waarheid voor de implementatie van het reservatiesysteem.
> Schrijf geen code zonder dit plan te raadplegen.

---

## Architectuuroverzicht

```
Bezoeker → Reservatieformulier (React sectie, éénpagina)
               ↓ insert (anon key, RLS)
           Supabase PostgreSQL (EU-Frankfurt)
               ↓ webhook trigger
           Netlify Function → Resend → e-mail naar tperron@outlook.be

Eddy/Sabrina → /reservatiebeheer (beveiligd via Supabase Auth)
               ↓ login check
           Reservatie-overzicht + kalender
           + "Nieuwe reservatie" (telefonische invoer)
```

**Nieuwe dependencies:**
- `@supabase/supabase-js` — database + auth client
- `react-router-dom` — clientside routing (/ en /reservatiebeheer)

**Geen wijzigingen aan:** Netlify CMS `/admin`, Decap-configuratie, netlify.toml admin-redirects.

---

## Sectie A — Jij doet zelf (handmatige stappen)

Deze stappen kunnen niet door Claude worden uitgevoerd. Doe ze **voor de implementatie** begint.

### A1. Supabase project aanmaken

1. Ga naar [supabase.com](https://supabase.com) en maak een gratis account aan
2. Maak een **New Project** aan:
   - **Name:** `tperroneke`
   - **Database Password:** kies een sterk wachtwoord, sla het op in een wachtwoordmanager
   - **Region:** `Central EU (Frankfurt)` — verplicht voor GDPR
3. Wacht tot het project klaar is (~2 minuten)

### A2. Database tabel aanmaken

Ga naar **SQL Editor** in je Supabase dashboard en voer dit volledig uit:

```sql
-- Tabel aanmaken
CREATE TABLE reservaties (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  naam            TEXT NOT NULL,
  telefoon        TEXT,
  email           TEXT,
  datum           DATE NOT NULL,
  tijdstip        TIME NOT NULL,
  aantal_personen INTEGER NOT NULL CHECK (aantal_personen >= 1 AND aantal_personen <= 20),
  opmerking       TEXT,
  bron            TEXT NOT NULL DEFAULT 'online'
                    CHECK (bron IN ('online', 'telefonisch')),
  status          TEXT NOT NULL DEFAULT 'nieuw'
                    CHECK (status IN ('nieuw', 'bevestigd', 'geannuleerd')),
  aangemaakt_op   TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security inschakelen
ALTER TABLE reservaties ENABLE ROW LEVEL SECURITY;

-- Bezoekers mogen invoegen (voor het online formulier)
CREATE POLICY "Anoniem invoegen"
  ON reservaties FOR INSERT
  TO anon
  WITH CHECK (true);

-- Enkel ingelogde gebruikers (Eddy/Sabrina) mogen lezen
CREATE POLICY "Authenticated lezen"
  ON reservaties FOR SELECT
  TO authenticated
  USING (true);

-- Enkel ingelogde gebruikers mogen status bijwerken
CREATE POLICY "Authenticated bijwerken"
  ON reservaties FOR UPDATE
  TO authenticated
  USING (true);

-- Enkel ingelogde gebruikers mogen verwijderen
CREATE POLICY "Authenticated verwijderen"
  ON reservaties FOR DELETE
  TO authenticated
  USING (true);

-- Auto-cleanup: verwijder reservaties ouder dan 30 dagen (elke nacht om 03:00)
-- Vereist pg_cron extensie — ingebouwd in Supabase, geen extra stap nodig
SELECT cron.schedule(
  'cleanup-reservaties',
  '0 3 * * *',
  $$DELETE FROM reservaties WHERE datum < CURRENT_DATE - INTERVAL '30 days'$$
);
```

### A3. API keys kopiëren

Ga naar **Project Settings → API**:
- Kopieer **Project URL** (bv. `https://xxxx.supabase.co`)
- Kopieer **anon / public** key (lange string)

### A4. .env bestand aanmaken

Maak in de root van de WebsiteRepo een bestand `.env` aan:

```
VITE_SUPABASE_URL=jouw-project-url-hier
VITE_SUPABASE_ANON_KEY=jouw-anon-key-hier
```

Controleer dat `.env` in `.gitignore` staat — dit bestand mag **nooit** gepusht worden.

### A5. Beheerdersaccount aanmaken voor Eddy & Sabrina

Ga naar **Authentication → Users → Add user**:
- **Email:** `tperron@outlook.be`
- **Password:** kies een wachtwoord dat Eddy/Sabrina makkelijk kunnen onthouden
- Stuur dit wachtwoord door naar Eddy/Sabrina

### A6. Resend account aanmaken (voor e-mailnotificaties)

1. Ga naar [resend.com](https://resend.com) en maak een gratis account aan
2. Ga naar **API Keys → Create API Key**
3. Voeg toe aan `.env`:
   ```
   RESEND_API_KEY=jouw-resend-key-hier
   ```
4. Verifieer het domein van `tperron@outlook.be` (Resend vraagt dit voor verzendrechten)
   - Alternatief: gebruik het standaard Resend-domein voor notificaties als tijdelijke oplossing

### A7. Supabase Data Processing Agreement accepteren

Ga naar **Project Settings → Legal → Data Processing Agreement** en accepteer. Dit is verplicht onder GDPR.

### A8. Netlify omgevingsvariabelen instellen

Ga naar je Netlify-dashboard → Site → **Site Configuration → Environment Variables**:
- `VITE_SUPABASE_URL` (zelfde als in .env)
- `VITE_SUPABASE_ANON_KEY` (zelfde als in .env)
- `RESEND_API_KEY` (zelfde als in .env)

---

## Sectie B — Implementatiefasen (Claude doet dit)

### Fase 1 — Dependencies installeren

```bash
npm install @supabase/supabase-js react-router-dom
```

**Bestanden:** `package.json`, `package-lock.json`

---

### Fase 2 — Supabase client + routing opzetten

**2a. Supabase client**

Nieuw bestand: `src/lib/supabase.js`
- Initialiseert de Supabase client met `VITE_SUPABASE_URL` en `VITE_SUPABASE_ANON_KEY`
- Geëxporteerd als singleton

**2b. React Router instellen**

`src/main.jsx` aanpassen:
- Wrap met `<BrowserRouter>`
- Route `/` → `<App />` (de huidige éénpagina site)
- Route `/reservatiebeheer` → `<Reservatiebeheer />` (admin panel)

**2c. Netlify routing bijwerken**

`netlify.toml` aanpassen:
- Catch-all `/*` → `/index.html` toevoegen **na** de bestaande `/admin` redirects
- Volgorde is cruciaal: Netlify matcht de eerste regel die past

```toml
# Bestaande /admin regels blijven bovenaan — ongewijzigd
# Nieuwe SPA catch-all onderaan:
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Bestanden:** `src/main.jsx`, `src/lib/supabase.js` (nieuw), `netlify.toml`

---

### Fase 3 — Reservatiesectie (bezoekerskant)

Nieuwe bestanden: `src/components/Reservatie.jsx` + `src/components/Reservatie.css`

**Sectie-eigenschappen:**
- `id="reserveren"` (anchor voor Navbar + Footer)
- Achtergrond: `--color-cream-warm` (na Contact = cream, patroon klopt)
- Geen extra TrainStrip — kleurwisseling is voldoende scheiding

**Formuliervelden:**
| Veld | Type | Verplicht | Validatie |
|---|---|---|---|
| Naam | text | ✅ | min 2 tekens |
| Telefoon | tel | ❌ | Belgisch formaat suggestie |
| E-mail | email | ❌ | geldig e-mailadres |
| Datum | date | ✅ | enkel Do–Za–Zo; geen verleden data |
| Tijdstip | select | ✅ | slots per dag (zie hieronder) |
| Aantal personen | number | ✅ | 1–20 |
| Opmerking | textarea | ❌ | max 500 tekens |

**Tijdslots:**
- Do–Za: 09:00 t/m 19:30 (elke 30 minuten)
- Zo: 09:00 t/m 17:30 (elke 30 minuten)
- Datumselectie disablet automatisch Ma/Di/Wo

**UX-gedrag:**
- Datum wijzigt → tijdslots herberekend
- Submit → loading state (knop disabled, spinnerindicatie)
- Succes → bevestigingsbericht in sectie (geen redirect, geen aparte pagina)
- Fout → inline foutmelding per veld + algemene foutmelding
- Animatie conform DESIGN.md: scroll reveal + stagger

**Supabase call:**
- `supabase.from('reservaties').insert({...})`
- `bron: 'online'` automatisch ingesteld

**App.jsx aanpassen:** `<Reservatie />` invoegen na `<Contact />`, voor `<Footer />`

---

### Fase 4 — Navbar + Footer bijwerken

**Navbar (`Navbar.jsx`):**
- Voeg `{ label: 'Reserveren', href: '#reserveren', cta: true }` toe aan `NAV_LINKS`
- Desktop: "Reserveren" krijgt een aparte stijl — goudkleurige achtergrond (`--color-gold`), donkere tekst, border-radius — visueel onderscheiden als CTA-knop, niet als gewone navigatielink
- Mobiel menu: "Reserveren" link toegevoegd, goudkleurig gemarkeerd
- IntersectionObserver in Navbar: `#reserveren` sectie toevoegen aan de lijst

**Footer (`Footer.jsx`):**
- Voeg `{ label: 'Reserveren', href: '#reserveren' }` toe aan `NAV_LINKS`
- Geen speciale stijl nodig — gewone footer-nav-link

---

### Fase 5 — Admin paneel: /reservatiebeheer

Nieuwe bestanden: `src/pages/Reservatiebeheer.jsx` + `src/pages/Reservatiebeheer.css`

**Authenticatie:**
- Bij laden: check Supabase session (`supabase.auth.getSession()`)
- Geen actieve sessie → loginscherm tonen
- Actieve sessie → dashboard tonen
- Session change listener voor automatische redirect bij logout/sessie-verlopen

**Loginscherm:**
- Simpele kaart: logo + e-mailveld + wachtwoordveld + inlogknop
- Foutmelding bij verkeerd wachtwoord (Nederlandse tekst)
- Geen "wachtwoord vergeten" flow (Eddy/Sabrina bellen Arne)
- Styling: wit op `--color-cream`, minimaal

**Dashboard — reservatieoverzicht:**
- Standaard: toont reservaties van **vandaag** + de komende 7 dagen
- Datumfilter: "Vorige dag" / "Volgende dag" knoppen + datumkiezer
- Weergave: kaarten per reservatie, gesorteerd op tijdstip
  - Naam + tijdstip (groot)
  - Aantal personen + bron (online / telefonisch)
  - Opmerking (indien aanwezig)
  - Status-badge: nieuw (goud) / bevestigd (groen) / geannuleerd (grijs)
  - Actieknoppen: "Bevestigen" / "Annuleren"
- Lege staat: vriendelijke melding "Geen reservaties voor deze dag"

**Telefonische invoer:**
- Zwevende knop "+ Nieuwe reservatie" (altijd zichtbaar)
- Opent een modal met hetzelfde formulier als de bezoekerssectie
- `bron: 'telefonisch'` automatisch ingesteld
- Status direct op 'bevestigd' gezet (telefonische reservaties zijn al bevestigd)

**Uitloggen:**
- Knop in de header van het dashboard
- `supabase.auth.signOut()` + redirect naar `/`

**Styling:**
- Eigen CSS, gebruikt wel dezelfde design tokens uit `index.css`
- Geen Navbar of Footer — dit is een beheertool, geen publieke pagina
- Wel het logo in de header (vertrouwdheid voor Eddy/Sabrina)

---

### Fase 6 — E-mailnotificaties via Netlify Function

Nieuw bestand: `netlify/functions/stuur-bevestiging.js`

**Trigger:** Aangeroepen vanuit het Reservatie-formulier na een succesvolle Supabase insert (niet via webhook — eenvoudiger en betrouwbaarder voor deze schaal)

**Inhoud van de e-mail naar `tperron@outlook.be`:**
```
Nieuwe reservatie ontvangen!

Naam:    [naam]
Datum:   [datum in NL formaat]
Tijdstip: [tijdstip]
Personen: [aantal]
Telefoon: [telefoon of "niet opgegeven"]
E-mail:  [e-mail of "niet opgegeven"]
Opmerking: [opmerking of "geen"]

Beheer via: https://tperroneke.be/reservatiebeheer
```

**Mail 2 — Bevestigingsmail naar de gast** (enkel als e-mail opgegeven):

```text
Bedankt voor uw reservatie bij 't Perroneke!

Wij hebben uw reservatie ontvangen voor:
  [dag in NL], [datum] om [tijdstip]
  [aantal] personen

Wij nemen contact met u op ter bevestiging.
Vragen? Bel ons: 0471 74 56 68

'T Perroneke — Moenebroeckstraat 12, 9506 Schendelbeke
```

**Techniek:**
- Netlify Function (Node.js) ontvangt `POST` met reservatiedata
- Stuurt via Resend API: (1) notificatiemail naar `tperron@outlook.be`, (2) bevestigingsmail naar gast indien e-mail opgegeven
- Beveiligd: functie controleert dat de aanroep van de eigen site komt

---

### Fase 7 — Supabase keep-alive (anti-pauze)

Nieuw bestand: `netlify/functions/keepalive.js` + scheduled trigger

**Probleem:** Supabase free tier pauzeert projecten na 7 dagen inactiviteit.

**Oplossing:** Een Netlify Scheduled Function die elke 5 dagen een lichte query uitvoert op de database (bv. `COUNT(*)` op de reservaties-tabel). Dit houdt het project wakker zonder echte data te verwerken.

`netlify.toml` aanvullen:
```toml
[functions]
  schedule = "@weekly"
```

Dit is een betrouwbaardere oplossing dan een externe cron-service.

---

### Fase 8 — PrivacyModal bijwerken

`src/components/PrivacyModal.jsx` aanpassen:

- De huidige tekst "Wij verzamelen via deze website zelf geen persoonsgegevens" is **niet langer correct** → verwijderen
- Nieuwe sectie toevoegen: **Reservaties**
  - Welke gegevens: naam, optioneel telefoon/e-mail, datum, tijdstip, aantal personen, opmerking
  - Doel: verwerken van reserveringsaanvragen
  - Verwerker: Supabase (Supabase Inc., opslag in Frankfurt, EU)
  - Bewaartermijn: reservaties worden bewaard tot 30 dagen na de reservatiedatum
  - DPA: beschikbaar via Supabase
- Datum bijwerken: "Laatst bijgewerkt: mei 2026"

---

### Fase 9 — /impeccable audit

Na elke fase met visuele output (Fase 3, Fase 4, Fase 5):
- `/impeccable` audit uitvoeren
- Critique verwerken
- Polish toepassen
- Dan pas verder met de volgende fase

---

## Sectie C — Bestandenoverzicht na implementatie

```
src/
  lib/
    supabase.js                    ← NIEUW: Supabase client singleton
  components/
    Navbar.jsx / Navbar.css        ← AANGEPAST: + Reserveren CTA
    Footer.jsx / Footer.css        ← AANGEPAST: + Reserveren link
    Reservatie.jsx / Reservatie.css← NIEUW: bezoekerssectie
    PrivacyModal.jsx               ← AANGEPAST: reservatiegegevens sectie
    [alle andere componenten]      ← ONGEWIJZIGD
  pages/
    Reservatiebeheer.jsx           ← NIEUW: admin panel
    Reservatiebeheer.css           ← NIEUW: admin stijlen
  main.jsx                         ← AANGEPAST: BrowserRouter + routes
  App.jsx                          ← AANGEPAST: <Reservatie /> toegevoegd

netlify/
  functions/
    stuur-bevestiging.js           ← NIEUW: e-mailnotificatie
    keepalive.js                   ← NIEUW: anti-pauze ping

netlify.toml                       ← AANGEPAST: SPA catch-all + scheduled fn
.env                               ← NIEUW (lokaal, niet in git): API keys
```

---

## Sectie D — Openstaande keuzes (beslis voor implementatie)

| # | Vraag | Beslissing |
|---|---|---|
| D1 | Bevestigingsmail naar de gast? | ✅ **Ja** — extra Resend call vanuit `stuur-bevestiging.js` |
| D2 | Maximaal aantal personen? | ✅ **20** — navragen bij Eddy/Sabrina, eventueel later aanpassen in SQL CHECK |
| D3 | Auto-cleanup? | ✅ **30 dagen** na reservatiedatum — Supabase `pg_cron` |
| D4 | Admin route? | ✅ `/reservatiebeheer` |

### D3 — Auto-cleanup uitgelegd

Auto-cleanup = een Supabase cron-job die reservaties automatisch verwijdert X dagen na de reservatiedatum.

**Voordeel:** GDPR data minimisatie (persoonsgegevens niet langer bewaren dan nodig). Database blijft klein.

**Voorstel:** 30 dagen na de reservatiedatum. Een reservatie van 1 juni verdwijnt op 1 juli.

**Techniek:** Supabase heeft een ingebouwde `pg_cron` extensie — geen extra Netlify Function nodig.

```sql
-- Eenmalig uitvoeren in Supabase SQL Editor (indien gekozen voor auto-cleanup):
SELECT cron.schedule(
  'cleanup-reservaties',
  '0 3 * * *',  -- elke nacht om 03:00
  $$DELETE FROM reservaties WHERE datum < NOW() - INTERVAL '30 days'$$
);
```

---

## Sectie E — Volgorde van uitvoering

```
A1 → A2 → A3 → A4 → A5 → A6 → A7 → A8   (jij, voor de sessie)
  ↓
Fase 1 (dependencies)
  ↓
Fase 2 (Supabase client + routing)
  ↓
Fase 3 (Reservatiesectie) → /impeccable
  ↓
Fase 4 (Navbar + Footer) → /impeccable
  ↓
Fase 5 (Admin paneel) → /impeccable
  ↓
Fase 6 (E-mailnotificaties)
  ↓
Fase 7 (Keep-alive)
  ↓
Fase 8 (PrivacyModal)
  ↓
Productietests + deploy
```

---

*Plan aangemaakt: 2026-05-24*
*Laatste wijziging: 2026-05-24*
