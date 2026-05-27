# 't Perroneke — Website

Marketingwebsite voor 't Perroneke, koffiebar & eethuis naast het treinstation in Schendelbeke.
Uitgebaat door Eddy en Sabrina. Gebouwd door Arne Bogaert.

---

## Tech stack

- **React + Vite** — SPA, plain CSS, geen TypeScript
- **React Router DOM** — clientside routing (`/` en `/reservatiebeheer`)
- **Supabase** — PostgreSQL database + authenticatie (EU-Frankfurt)
- **Netlify** — hosting, Netlify Functions (serverless), scheduled functions
- **Resend** — transactionele e-mails
- **Decap CMS** — contentbeheer voor menu (`/admin`)

---

## Lokaal starten

```bash
npm install
npx netlify dev
```

Gebruik `npx netlify dev` (niet `npm run dev`) zodat Netlify Functions meedraaien voor e-mailnotificaties.

### Vereiste omgevingsvariabelen (.env in projectroot)

```env
VITE_SUPABASE_URL=https://[project-ref].supabase.co
VITE_SUPABASE_ANON_KEY=[anon key]
RESEND_API_KEY=re_[key]
```

---

## Structuur

```text
src/
  components/      ← publieke paginasecties (Navbar, Hero, About, Menu, Locatie, Contact, Reservatie, Footer, …)
  pages/           ← volledige pagina's buiten de hoofdsite (Reservatiebeheer)
  lib/             ← Supabase client singleton
  assets/          ← logo, foto's, pixel trein GIFs
  data/
    menu.json      ← menudata, beheerd via Decap CMS

netlify/
  functions/
    stuur-bevestiging.js   ← e-mailnotificaties bij nieuwe reservatie (Resend)
    keepalive.js           ← Supabase anti-pauze ping (elke 5 dagen)

public/
  admin/           ← Decap CMS (niet aanraken)
```

---

## Routes

| Route | Inhoud |
| --- | --- |
| `/` | Publieke éénpagina site |
| `/reservatiebeheer` | Admin panel voor Eddy & Sabrina (login vereist) |
| `/admin` | Decap CMS — contentbeheer menu |

---

## Documentatie

De onderstaande bestanden staan in de lokale map `Documentatie/` en zijn niet opgenomen in git (zie `.gitignore`).

| Bestand | Inhoud |
| --- | --- |
| `Documentatie/DESIGN.md` | Designsysteem: kleuren, typografie, animaties, componentstructuur |
| `Documentatie/PRODUCT.md` | Merkidentiteit, doelpubliek, designprincipes |
| `Documentatie/ReservatieTechstack.md` | Architectuur reservatiesysteem, techstack, handmatige setup, toekomstige plannen |
| `Documentatie/BEWAARD_TEKST.md` | Bewaarde kopyteksten en contentnotities |
| `Documentatie/Skillorder.md` | Volgorde en aanpak van de UI-polish sessies |
| `Documentatie/adminPaneel.md` | Notities en beslissingen rond het adminpaneel |
