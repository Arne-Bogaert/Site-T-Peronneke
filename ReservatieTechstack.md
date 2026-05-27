# Reservatiesysteem 't Perroneke — Techstack & Documentatie

> Dit document beschrijft hoe het reservatiesysteem werkt, welke technologieën gebruikt zijn, en hoe alles in elkaar zit.
> Voor heropzet: de handmatige stappen staan onderaan in Sectie A.

---

## Architectuur

```
Bezoeker → Reservatieformulier (React, #reserveren)
               ↓ INSERT via Supabase anon key + RLS
           Supabase PostgreSQL (EU-Frankfurt)
               ↓ HTTP call vanuit React (na succesvolle insert)
           Netlify Function: stuur-bevestiging.js
               ↓ Resend API
           Notificatiemail → tperron@outlook.be
           Bevestigingsmail → gast (enkel als e-mail opgegeven)

Eddy/Sabrina → /reservatiebeheer
               ↓ Supabase Auth login (tperron@outlook.be)
           Reservatieoverzicht per dag
           Status beheer: nieuw → bevestigd / geannuleerd
           Nieuwe reservatie (telefonisch invoer)
               ↓ INSERT via authenticated rol + RLS
           Supabase PostgreSQL
```

---

## Technologieën

### Supabase
- PostgreSQL database + authenticatie
- Project: `tperroneke`, regio Frankfurt (EU)
- Client library: `@supabase/supabase-js`
- Row Level Security (RLS): zie sectie Database hieronder
- Gratis tier: pauzeert na 7 dagen inactiviteit → keepalive.js voorkomt dit

### React Router DOM
- Client-side routing (SPA)
- Route `/` → publieke éénpagina site (`App.jsx`)
- Route `/reservatiebeheer` → admin panel (`Reservatiebeheer.jsx`)
- Netlify catch-all in `netlify.toml` zorgt dat directe URL's werken

### Netlify Functions
- Serverless Node.js functies, ES modules (`export const handler`)
- `stuur-bevestiging.js` — verstuurt e-mails via Resend bij nieuwe reservatie
- `keepalive.js` — scheduled function, pingelt Supabase elke 5 dagen

### Resend
- Transactionele e-mails via REST API
- Tijdelijke afzender: `t Perroneke <onboarding@resend.dev>`
- Definitieve afzender na domeinverificatie: `reservaties@tperroneke.be`
- Twee mails per reservatie: notificatie (altijd) + bevestiging aan gast (indien e-mail)

---

## Bestanden

| Bestand | Doel |
|---|---|
| `src/lib/supabase.js` | Supabase client singleton (URL + anon key uit .env) |
| `src/components/Reservatie.jsx` | Publiek reservatieformulier met validatie + scroll reveal |
| `src/components/Reservatie.css` | Stijlen formulier (design tokens uit index.css) |
| `src/pages/Reservatiebeheer.jsx` | Admin panel: login, dagoverzicht, statusbeheer, modal |
| `src/pages/Reservatiebeheer.css` | Stijlen admin panel |
| `src/main.jsx` | BrowserRouter + routes (/ en /reservatiebeheer) |
| `src/App.jsx` | Publieke site — Reservatie sectie toegevoegd na Contact |
| `netlify/functions/stuur-bevestiging.js` | E-mailnotificaties via Resend |
| `netlify/functions/keepalive.js` | Supabase anti-pauze ping (scheduled) |
| `netlify.toml` | SPA catch-all redirect + keepalive schedule |
| `.env` | Lokale API keys (staat niet in git) |

---

## Database

### Schema

```sql
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
```

### Row Level Security

| Policy | Rol | Operatie | Uitleg |
|---|---|---|---|
| Anoniem invoegen | `anon` | INSERT | Publiek reservatieformulier |
| Authenticated invoegen | `authenticated` | INSERT | Telefonische invoer in admin |
| Authenticated lezen | `authenticated` | SELECT | Overzicht in admin |
| Authenticated bijwerken | `authenticated` | UPDATE | Statusbeheer |
| Authenticated verwijderen | `authenticated` | DELETE | Opruimen |

### Auto-cleanup (optioneel)

Vereist `pg_cron` extensie in Supabase (Database → Extensions → pg_cron inschakelen):

```sql
SELECT cron.schedule(
  'cleanup-reservaties',
  '0 3 * * *',
  $$DELETE FROM reservaties WHERE datum < CURRENT_DATE - INTERVAL '30 days'$$
);
```

Verwijdert reservaties automatisch 30 dagen na de reservatiedatum (GDPR data minimisatie).

---

## Beheerdersaccount

Supabase Auth beheert de login voor `/reservatiebeheer`.

- Account: `tperron@outlook.be`
- Aanmaken/resetten: Supabase Dashboard → Authentication → Users

---

## Omgevingsvariabelen

### Lokaal (.env in projectroot, nooit in git)
```
VITE_SUPABASE_URL=https://[project-ref].supabase.co
VITE_SUPABASE_ANON_KEY=[lange JWT string]
RESEND_API_KEY=re_[key]
```

### Netlify (Site Configuration → Environment Variables)
Zelfde drie variabelen instellen — Netlify Functions lezen ze via `process.env.*`.

---

## Tijdslots

De beschikbare tijdslots worden berekend op basis van de dag van de week:

| Dag | Slots | Opmerking |
|---|---|---|
| Maandag | — | Gesloten |
| Dinsdag | — | Gesloten |
| Woensdag | — | Gesloten |
| Donderdag | 09:00 – 19:30 (elke 30 min) | Open |
| Vrijdag | 09:00 – 19:30 (elke 30 min) | Open |
| Zaterdag | 09:00 – 19:30 (elke 30 min) | Open |
| Zondag | 09:00 – 17:30 (elke 30 min) | Open |

---

## Sectie A — Handmatige setup (bij heropzet)

Deze stappen kunnen niet via code worden uitgevoerd.

### A1. Supabase project aanmaken

1. Ga naar [supabase.com](https://supabase.com) en maak een gratis account aan
2. Maak een **New Project** aan:
   - **Name:** `tperroneke`
   - **Database Password:** kies een sterk wachtwoord, sla het op in een wachtwoordmanager
   - **Region:** `Central EU (Frankfurt)` — verplicht voor GDPR
3. Wacht tot het project klaar is (~2 minuten)

### A2. Database tabel aanmaken

Ga naar **SQL Editor** in het Supabase dashboard en voer dit uit:

```sql
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

ALTER TABLE reservaties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anoniem invoegen"
  ON reservaties FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Authenticated invoegen"
  ON reservaties FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated lezen"
  ON reservaties FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated bijwerken"
  ON reservaties FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated verwijderen"
  ON reservaties FOR DELETE TO authenticated USING (true);
```

**Let op:** de `SELECT cron.schedule(...)` regel weglaten als `pg_cron` niet ingeschakeld is — dit geeft anders een fout. Zie auto-cleanup sectie hierboven voor instructies.

### A3. API keys kopiëren

Ga naar **Project Settings → API**:
- Kopieer **Project URL** (bv. `https://xxxx.supabase.co`)
- Kopieer **anon / public** key (lange JWT string)

### A4. .env bestand aanmaken

Maak in de root van de WebsiteRepo een bestand `.env` aan:

```
VITE_SUPABASE_URL=https://[project-ref].supabase.co
VITE_SUPABASE_ANON_KEY=[anon key]
RESEND_API_KEY=[resend key]
```

Controleer dat `.env` in `.gitignore` staat — dit bestand mag nooit gepusht worden.

### A5. Beheerdersaccount aanmaken

Ga naar **Authentication → Users → Add user**:
- **Email:** `tperron@outlook.be`
- **Password:** kies een wachtwoord dat Eddy/Sabrina makkelijk kunnen onthouden

### A6. Resend account aanmaken

1. Ga naar [resend.com](https://resend.com) en maak een gratis account aan
2. Ga naar **API Keys → Create API Key**
3. Voeg de sleutel toe aan `.env` als `RESEND_API_KEY`
4. Verifieer `tperroneke.be` als afzenderdomein voor productie (Domains → Add Domain → DNS records toevoegen bij domeinbeheerder)
5. Wijzig `FROM_EMAIL` in `stuur-bevestiging.js` naar `reservaties@tperroneke.be` na verificatie

### A7. Data Processing Agreement accepteren

Ga naar **Project Settings → Legal → Data Processing Agreement** en accepteer (verplicht onder GDPR).

### A8. Netlify omgevingsvariabelen instellen

Ga naar Netlify dashboard → Site → **Site Configuration → Environment Variables** en voeg toe:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `RESEND_API_KEY`

---

## Toekomstige plannen

### Automatische bevestigingsmail bij statuswijziging

**Concept:** Wanneer Eddy of Sabrina een reservatie op "Bevestigd" zet in het admin panel, verstuurt het systeem automatisch een bevestigingsmail naar de gast (indien e-mailadres bekend).

**Status:** Nog niet geïmplementeerd. Te bespreken met Eddy & Sabrina — zij beslissen of ze dit willen.

**Impact op huidige teksten:**
- Huidig: "Wij bevestigen binnen de 24 uur via telefoon of e-mail"
- Na implementatie: de mail IS de bevestiging, geen handmatige stap meer nodig

**Technische aanpak:**
- In `ReservatieKaart.jsx`: na de succesvolle Supabase `update()` aanroep, een extra call naar `/.netlify/functions/stuur-bevestiging` met `{ type: 'bevestiging', ...reservatieData }`
- In `stuur-bevestiging.js`: nieuwe `type`-parameter toevoegen die onderscheid maakt tussen `'nieuw'` (huidige flow) en `'bevestiging'` (nieuw)
- Alleen sturen als `reservatie.email` aanwezig is
- Inhoud bevestigingsmail:
  ```
  Uw reservatie bij 't Perroneke is bevestigd!

  [dag] [datum] om [tijdstip]
  [aantal] personen

  Wij verheugen ons u te mogen ontvangen.
  Vragen? Bel ons: 0471 74 56 68

  't Perroneke — Moenebroeckstraat 12, 9506 Schendelbeke
  ```

**Vereisten voor activatie:**
- Domein `tperroneke.be` verifiëren in Resend (anders verstuurd via `onboarding@resend.dev`)
- Akkoord van Eddy & Sabrina

---

*Aangemaakt: mei 2026*
