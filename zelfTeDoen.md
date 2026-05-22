   # Zelf te doen — 't Perron website

Stappen die je zelf uitvoert nadat Claude de code heeft gebouwd en je alles naar GitHub hebt gepusht.
Geen code nodig — alleen klikken in Netlify.

---

## Stap 1 — Netlify account aanmaken

Ga naar [netlify.com](https://netlify.com) en maak een gratis account aan.
Koppel je GitHub-account wanneer gevraagd.

---

## Stap 2 — Site deployen vanuit GitHub

1. Klik "Add new site" → "Import an existing project" → kies GitHub
2. Selecteer de 't Perron repo
3. Vul in:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Klik "Deploy site"
5. Wacht 1-2 minuten tot de eerste deploy klaar is

---

## Stap 3 — Netlify Identity aanzetten

1. Ga naar **Site settings → Identity**
2. Klik "Enable Identity"
3. Zet **Registration** op **"Invite only"**
   (zodat alleen genodigden een account kunnen aanmaken)

---

## Stap 4 — Git Gateway aanzetten

1. Ga naar **Site settings → Identity → Services**
2. Klik "Enable Git Gateway"

Dit laat Decap CMS toe om wijzigingen rechtstreeks in de GitHub-repo op te slaan.

---

## Stap 5 — Domeinnaam instellen (optioneel maar aanbevolen)

Doe dit voor stap 6 zodat de uitnodigingsmail de juiste URL bevat.

1. Ga naar **Domain management**
2. Voeg de echte domeinnaam toe (bijv. tperron.be)

---

## Stap 6 — Eddy en Sabrina uitnodigen

1. Ga naar **Site settings → Identity → Users**
2. Klik "Invite users"
3. Voer hun e-mailadres(sen) in
4. Ze ontvangen een uitnodigingsmail om een wachtwoord in te stellen

---

## Stap 7 — Zelf testen

1. Ga naar `jouwsite.be/admin`
2. Log in
3. Pas een klein item aan (bijv. een prijs) en klik "Publiceren"
4. Wacht 1-2 minuten en controleer of de site is bijgewerkt

---

## Stap 8 — Eigenaars begeleiden (éénmalig)

Stuur Eddy en Sabrina dit bericht (pas de URL aan):

> De menukaart kunnen jullie zelf aanpassen via: **jouwsite.be/admin**
>
> Log in met het e-mailadres en wachtwoord dat jullie via de uitnodigingsmail hebben ingesteld.
>
> Klik op "Menukaart bewerken", pas aan wat nodig is, en klik op "Publiceren".
> De website is na 1 à 2 minuten automatisch bijgewerkt.

---

## Veelgestelde vragen

**Moet ik een Decap CMS account aanmaken?**
Nee. Decap CMS is geen service met een account — het is gewoon een script in de code. De enige account die je nodig hebt is Netlify.

**Wat als Eddy of Sabrina hun wachtwoord vergeten?**
Ga naar Site settings → Identity → Users, zoek de gebruiker en klik "Send recovery email".

**Hoe lang duurt het na een aanpassing voor de site bijgewerkt is?**
1 à 2 minuten. Netlify herbouwt de site automatisch na elke opgeslagen wijziging.

**Kan ik een tweede beheerder toevoegen later?**
Ja, herhaal stap 6 met een ander e-mailadres.
