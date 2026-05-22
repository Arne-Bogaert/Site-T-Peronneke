# Design System — 't Perron Koffiebar & Eethuis

> Dit document is de enkele bron van waarheid voor alle designbeslissingen.
> Elke conversatie met Claude Code verwijst naar dit bestand.
> Pas dit bestand aan wanneer de designfilosofie evolueert.

---

## 1. Merkidentiteit

**Karakter:** Warm, gezellig, eigenzinnig. Een vertrouwde buurtplek aan het station — geen pretentie, geen afstand.

**Mascotte:** De blauwe ara papegaai. Herkenbaar, speels, maar niet kinderachtig.

**Decor:** Het treinstation van Schendelbeke. De pixel trein is een decoratief merkelement dat de locatie en de naam ('t Perron) verankert.

**Anti-referenties (verboden richtingen):**
- Generiek / template-uitstraling
- Fast food / druk / felle promotiekleuren
- Fine dining / koud / Michelin-esthetiek
- Hipster / neon / brutalism / overdreven Instagram-look

---

## 2. Kleurenpalet

Rechtstreeks afgeleid van het logo. Alle kleuren als CSS custom properties in `src/index.css`.

### Primaire kleuren (logo-exact)

| Token | Hex | Gebruik |
|---|---|---|
| `--color-blue-cobalt` | `#2461A8` | Hoofdkleur — papegaaihoofd, koppen, CTA-achtergronden |
| `--color-blue-navy` | `#1A4A8A` | Donkere variant — hover states, zware koppen |
| `--color-blue-sky` | `#3D92CC` | Accent — veerstepen, links, subtiele highlights |
| `--color-gold` | `#F5A520` | Tweede hoofdkleur — accenten, labels, highlights |
| `--color-amber` | `#D97010` | Donkere goud-variant — hover op gouden elementen |

### Neutrale kleuren

| Token | Hex | Gebruik |
|---|---|---|
| `--color-cream` | `#FAF7F2` | Pagina-achtergrond (hoofdthema) |
| `--color-white` | `#FFFFFF` | Kaarten, modals, geëleveerde vlakken |
| `--color-dark` | `#1A1C2E` | Hoofdtekst op lichte achtergronden |
| `--color-muted` | `#57647F` | Subtekst, metadata, labels (contrast 5.56:1 op crème — WCAG AA) |

### Pixel trein palet (decoratief)

| Token | Hex | Gebruik |
|---|---|---|
| `--train-red` | `#CC2222` | Locomotief lichaam |
| `--train-carriage` | `#D4A96A` | Rijtuig — warme crème/beige |
| `--train-window` | `#A0C8E8` | Rijtuigramen — lichtblauw |

### Kleurgebruikregels

- **Blauw + Goud** is het primaire merkcontrast. Samen, nooit los op prominente elementen.
- Achtergronden zijn crème (`--color-cream`) of wit — nooit een tussenkleur.
- Goud is een accentkleur, geen achtergrond voor grote vlakken.
- Goud op witte/crème achtergrond enkel voor grote tekst (≥18px bold of ≥24px normaal) — te weinig contrast voor kleine body tekst.

---

## 3. Typografie

**Koppen:** [Fraunces](https://fonts.google.com/specimen/Fraunces) — een warme, karaktervolle serif met een lichte speelsheid die aansluit bij de handlettering in het logo. Voelt authentiek zonder generiek te zijn.

**Body / UI:** [DM Sans](https://fonts.google.com/specimen/DM+Sans) — schoon, vriendelijk, uitstekend leesbaar op kleine schermen. Paar perfect met Fraunces.

```css
/* Google Fonts import */
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400&family=DM+Sans:wght@400;500;600&display=swap');

--font-heading: 'Fraunces', Georgia, serif;
--font-body:    'DM Sans', system-ui, sans-serif;
```

### Grootteprincipes

- Koppen: altijd `clamp()` — nooit vaste `px` op headings
- Minimale bodytekst: `16px` op desktop, `15px` op mobiel
- Regellengte lopende tekst: maximaal `68ch`
- Regelafstand body: `1.6`

### Hiërarchie

| Niveau | Font | Gewicht | Grootte |
|---|---|---|---|
| H1 (hero) | Fraunces | 700 | `clamp(2.8rem, 8vw, 6rem)` |
| H2 (sectietitel) | Fraunces | 600 | `clamp(1.8rem, 4vw, 2.8rem)` |
| H3 (subsectie) | Fraunces | 400 italic | `clamp(1.2rem, 2.5vw, 1.6rem)` |
| Body | DM Sans | 400 | `1rem` / `1.5rem` line-height |
| Label / tag | DM Sans | 600 | `0.8rem`, letter-spacing: 0.08em, uppercase |

---

## 4. Thema & Layout

**Thema:** Licht — crème/witte achtergrond met kobaltblauwe koppen en gouden accenten.

**Paginastructuur (éénpagina):**
```
Hero (foto fullscreen)  ← TrainStrip zit BINNEN Hero (position: absolute, top: 100px)
Over Ons                ← gradient-overgang (geen losstaande TrainStrip)
  ↓  [treinstrip — te beslissen per sectie]
Menu
  ↓  [treinstrip — te beslissen per sectie]
Locatie & Openingsuren
  ↓  [treinstrip — te beslissen per sectie]
Contact
Footer
```

**Nota TrainStrip:** De component is herbruikbaar maar wordt niet automatisch tussen elke sectie gezet. Tussen Hero en About werd de strip visueel te licht bevonden en vervangen door een gradient op de About-achtergrond. Per nieuwe sectie beslis je of een strip past.

**Grid:**
- Mobiel: 1 kolom, padding `20px`
- Tablet (≥768px): 2 kolommen waar relevant
- Desktop: max-width `1200px`, gecentreerd, padding `clamp(20px, 5vw, 48px)`

**Witruimte:** Genereus. Sectieafstand: `clamp(72px, 10vw, 120px)` verticaal.

---

## 5. Visuele Elementen

### Logo

- **Volledig logo PNG** (`src/assets/'T Perron Logo.png`): gebruikt in navbar — transparante achtergrond, geen SVG-filter nodig
- **Volledig logo WebP** (`src/assets/'T Perron Logo.webp`): beschikbaar als alternatief (footer e.d.)
- **Korte papegaai PNG** (`src/assets/'T Perron Korte Papegaai.png`): decoratief element in secties — transparante achtergrond
- **Korte papegaai WebP** (`src/assets/'T Perron Korte Papegaai.webp`): beschikbaar als alternatief
- Logo staat **nooit** op een drukke of conflicterende achtergrond
- Vrije ruimte rondom logo: minimaal gelijk aan de hoogte van de snavel

### Pixel Trein — Subtiele Strip

Assets in `src/assets/train/`:

| Bestand | Inhoud |
|---|---|
| `train_v18.gif` | Locomotief |
| `carriage_v18_car1.gif` | Rijtuig type 1 |
| `carriage_v18_car2.gif` | Rijtuig type 2 |
| `carriage_v18_car5.gif` | Rijtuig type 5 |
| `carriage_v18_car9.gif` | Rijtuig type 9 |
| `carriage_v18.gif` | Generiek rijtuig |
| `railtrack_v1.png` | Railspoor (tileable horizontale strip) |

**Integratie (subtiele strip):**

- Herbruikbare `<TrainStrip />` component — plaatsing per sectie beslissen (zie paginastructuur nota)
- Trein rijdt via CSS keyframe animatie van **links naar rechts** (`translateX(-100%)` → `translateX(110vw)`)
- Railtrack als tileable `background-image` in een vaste-hoogte strip
- Pixel art schaal: **uitsluitend 2× of 3×** — nooit fractional (voorkomt blur)
- `prefers-reduced-motion`: trein staat stil, railtrack blijft zichtbaar

### Foto's

- Momenteel enkel: `src/assets/Foto_interieur.webp`
- Altijd `object-fit: cover`, nooit uitgerekt
- Hero overlay: kobaltblauw `#1A4A8A` op ~50% opacity wanneer tekst bovenop foto staat
- `fetchpriority="high"` op het hero img element

---

## 6. Interactie & Animatie

**Stijl:** Subtiel en warm. Animaties voelen als een knikje, niet als een show.

| Element | Gedrag |
|---|---|
| Scroll reveal | Fade + translateY(20px→0), ~0.65s ease-out, drempel 8% |
| Hover links/knoppen | Kleurverandering of underline, 0.15s ease |
| Trein | Lineaire CSS keyframe, rijdt continu van links naar rechts |
| Geen | Parallax, zware GSAP sequences, laadanimaties, scale-hover |

Altijd `@media (prefers-reduced-motion: reduce)` voorzien voor alle animaties.

---

## 7. Toegankelijkheid

- **WCAG AA** als minimumnorm
- Kleurcontrast:
  - Kobaltblauw `#2461A8` op crème `#FAF7F2`: ✓ AA (5.2:1)
  - Donker `#1A1C2E` op crème: ✓ AAA
  - Muted `#57647F` op crème `#FAF7F2`: ✓ AA (5.56:1)
  - Goud `#F5A520` op wit/crème: ✗ te laag voor kleine tekst — enkel voor grote/bold elementen (≥18px of ≥14px bold)
  - Wit op kobaltblauw: ✓ AA
- Alle afbeeldingen: betekenisvolle `alt` of `alt=""` indien decoratief
- Focus states: zichtbare `outline` op basis van `--color-gold`
- Semantic HTML: `<nav>`, `<main>`, `<section id="">`, `<footer>` — geen div-soep
- Mobielvriendelijk is niet optioneel

---

## 8. Componentstructuur

```
src/
  assets/
    train/                          ← pixel trein GIFs + railtrack
    'T Perron Logo.png              ← actief in navbar (transparant)
    'T Perron Logo.webp             ← beschikbaar als alternatief
    'T Perron Korte Papegaai.png    ← actief (transparant)
    'T Perron Korte Papegaai.webp   ← beschikbaar als alternatief
    Foto_interieur.webp
  components/
    Hero.jsx / Hero.css             ✅ gebouwd
    Navbar.jsx / Navbar.css         ✅ gebouwd
    TrainStrip.jsx / TrainStrip.css ✅ gebouwd — herbruikbare treinscheidingslijn
    About.jsx / About.css           ✅ gebouwd
    MenuBook.jsx / MenuBook.css     ⏳ te bouwen
    Locatie.jsx / Locatie.css       ⏳ te bouwen
    Contact.jsx / Contact.css       ⏳ te bouwen
  App.jsx
  App.css                           ← skip-link stijlen
  index.css                         ← design tokens (ENIGE bron voor kleuren/fonts/spacing)
```

---

## 9. Open / Uitgestelde Beslissingen

| # | Item | Status |
|---|---|---|
| 1 | Reservatiesysteem | ⏳ Nog niet beslist — voorlopig placeholder knop |
| 2 | Openingsuren | ⏳ Nog niet bekend — placeholder in Locatie sectie |
| 3 | Extra foto's | ⏳ Nog niet beschikbaar — werkt met interieurafbeelding |
