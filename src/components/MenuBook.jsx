import { useState, useRef, useEffect } from 'react'
import fullLogoImg from '../assets/VolledigLogo.png'
import './MenuBook.css'

const SPREADS = [
  {
    id: 0,
    left: null,
    right: { type: 'cover' },
  },
  {
    id: 1,
    left: {
      type: 'menu',
      pageNum: 1,
      category: 'Gerechten',
      note: 'keuken doorlopend open tot 19u30',
      items: [
        { name: 'Verse dagsoep met brood', price: '€ 7,00' },
        { name: 'Uitsmijter', price: '€ 13,00' },
        { name: 'Balletjes in tomatensaus en puree', price: '€ 24,00' },
        { name: 'Vol-au-vent met puree en pasteitje', price: '€ 24,00' },
        { name: 'Toast met brie, appel, honing en noten', price: '€ 16,00' },
        { name: 'Toast met zalm, kruidenkaas en spiegelei', price: '€ 18,00' },
        { name: 'Bagel met hummus en warme kipfilet', price: '€ 15,00' },
      ],
    },
    right: {
      type: 'menu',
      pageNum: 2,
      items: [
        { name: 'Bagel Croque Monsieur', price: '€ 14,00', popular: true },
        { name: 'Bagel Croque Madame', price: '€ 15,00' },
        { name: "Bagel Croque 't Perron", price: '€ 18,00' },
        { name: 'Ceasar Salade', price: '€ 23,00' },
        { name: 'Salade Geitekaas & Appel', price: '€ 24,00' },
      ],
      subSections: [
        {
          title: 'Voor kids',
          items: [
            { name: 'Kinder Spaghetti bolognaise', price: '€ 12,00' },
            { name: 'Balletjes in tomatensaus en puree', price: '€ 12,00' },
            { name: 'Vol-au-vent met puree en pasteitje', price: '€ 12,00' },
          ],
        },
      ],
    },
  },
  {
    id: 2,
    left: {
      type: 'menu',
      pageNum: 3,
      category: 'Ontbijt',
      items: [
        { name: 'Koffiekoek', price: '€ 3,00', popular: true },
        { name: 'Yoghurt met granola en vers fruit', price: '€ 9,00' },
        { name: 'Belegde pistolet (kaas of hesp of serrano)', price: '€ 5,00' },
        { name: 'Boterham met spek & eieren', price: '€ 13,00' },
        { name: 'Brood met 2 spiegelei', price: '€ 10,00' },
        { name: 'Bagel met spek & eieren', price: '€ 13,00' },
        { name: 'Bagel perdu (wentelteefje bagel met vers fruit)', price: '€ 14,00' },
      ],
    },
    right: {
      type: 'formules',
      pageNum: 4,
      category: 'Formules',
      items: [
        {
          name: 'Bagel Ontbijt',
          price: '€ 17,00',
          popular: true,
          desc: 'Koffiekoek, bagel perdu en thee of koffie naar keuze',
        },
        {
          name: 'Klein Ontbijt',
          price: '€ 15,00',
          desc: 'Koffiekoek, assortiment broodjes en charcuterie, yoghurt met granola en vers fruit en een thee of koffie naar keuze',
        },
        {
          name: 'Luxe Ontbijt',
          price: '€ 30,00',
          desc: 'Koffiekoek, assortiment broodjes en charcuterie, yoghurt met granola en vers fruit, toast met kruidenkaas-zalm-spiegelei, vers geperst fruitsap, glaasje cava en thee of koffie naar keuze',
        },
        {
          name: 'Kinder Ontbijt',
          price: '€ 9,50',
          desc: 'Boterham met Nutella en banaan, vers geperst fruitsap of aardbeidrink of chocomelk naar keuze',
        },
      ],
    },
  },
  {
    id: 3,
    left: {
      type: 'menu',
      pageNum: 5,
      category: 'Desserten',
      items: [
        { name: "Tiramisu 't Perron", price: '€ 7,00' },
        { name: 'Stuk taart', price: '€ 7,00', popular: true },
        { name: 'Mattentaart', price: '€ 5,00' },
        { name: 'Warme appeltaart met slagroom', price: '€ 8,50' },
        { name: 'Warme appeltaart met vanille-ijs', price: '€ 11,00' },
        { name: 'Warme appeltaart met vanille-ijs en slagroom', price: '€ 12,00' },
      ],
    },
    right: {
      type: 'menu',
      pageNum: 6,
      items: [
        { name: 'Warme appeltaart met vanille-ijs, slagroom en caramelsaus', price: '€ 12,50' },
        { name: 'Pure Chocolademousse', price: '€ 9,00' },
        { name: 'Witte Chocolademousse', price: '€ 9,00' },
        { name: 'Mix chocolademousse', price: '€ 9,00' },
      ],
    },
  },
  {
    id: 4,
    left: { type: 'back-cover' },
    right: null,
  },
]

const MAX_SPREAD = SPREADS.length - 1

function CoverPage() {
  return (
    <div className="cover-page">
      <img
        src={fullLogoImg}
        alt="'t Perron — Koffiebar & Eethuis"
        className="cover-logo-img"
      />
      <p className="cover-loc">Schendelbeke</p>
    </div>
  )
}

function BackCoverPage() {
  return (
    <div className="back-cover-page">
      <div className="cover-ornament">✦</div>
      <p className="back-cover-text">Smakelijk!</p>
      <div className="cover-ornament">✦</div>
    </div>
  )
}

function MenuItemRow({ item }) {
  return (
    <div className="menu-row">
      <span className="item-name">
        {item.name}
        {item.popular && <span className="popular-tag">★</span>}
      </span>
      <span className="item-dots" aria-hidden="true" />
      <span className="item-price">{item.price}</span>
    </div>
  )
}

function FormuleItem({ item }) {
  return (
    <div className="formule-item">
      <div className="formule-row">
        <span className="formule-name">
          {item.name}
          {item.popular && <span className="popular-tag">★</span>}
        </span>
        <span className="formule-price">{item.price}</span>
      </div>
      <p className="formule-desc">{item.desc}</p>
    </div>
  )
}

function PageContent({ data }) {
  if (!data) return null
  if (data.type === 'cover') return <CoverPage />
  if (data.type === 'back-cover') return <BackCoverPage />

  const isFormule = data.type === 'formules'

  return (
    <div className="page-content">
      {data.category && (
        <div className="page-header">
          <h2 className="page-category">{data.category}</h2>
          {data.note && <p className="category-note">{data.note}</p>}
          <div className="category-rule" />
        </div>
      )}

      {data.items && (
        <div className={isFormule ? 'formules-list' : 'menu-items'}>
          {data.items.map((item, i) =>
            isFormule
              ? <FormuleItem key={i} item={item} />
              : <MenuItemRow key={i} item={item} />
          )}
        </div>
      )}

      {data.subSections?.map((section, i) => (
        <div key={i} className="sub-section">
          <div className="sub-header">
            <h3 className="sub-title">{section.title}</h3>
            <div className="sub-rule" />
          </div>
          <div className="menu-items">
            {section.items.map((item, j) => (
              <MenuItemRow key={j} item={item} />
            ))}
          </div>
        </div>
      ))}

      {data.pageNum && (
        <div className="page-num">— {data.pageNum} —</div>
      )}
    </div>
  )
}

export default function MenuBook() {
  const [spread, setSpread] = useState(0)
  const [flip, setFlip] = useState(null)
  const timerRef = useRef(null)

  useEffect(() => () => clearTimeout(timerRef.current), [])

  function goForward() {
    if (flip || spread >= MAX_SPREAD) return
    const prevRight = SPREADS[spread].right
    setSpread(s => s + 1)
    setFlip({ direction: 'forward', content: prevRight })
    timerRef.current = setTimeout(() => setFlip(null), 780)
  }

  function goBackward() {
    if (flip || spread <= 0) return
    const prevLeft = SPREADS[spread].left
    setSpread(s => s - 1)
    setFlip({ direction: 'backward', content: prevLeft })
    timerRef.current = setTimeout(() => setFlip(null), 780)
  }

  const current = SPREADS[spread]

  return (
    <section id="menu" className="menu-section">
      <h2 className="menu-section-title">Ons Menu</h2>

      <div className="book-wrapper">
        <button
          className="nav-btn"
          onClick={goBackward}
          disabled={spread === 0 || !!flip}
          aria-label="Vorige pagina"
        >
          ‹
        </button>

        <div className="book">
          <div className="page page-left">
            <PageContent data={current.left} />
          </div>
          <div className="book-spine" />
          <div className="page page-right">
            <PageContent data={current.right} />
          </div>

          {flip && (
            <div className={`flip-overlay flip-${flip.direction}`}>
              <div className="flip-face flip-front">
                <PageContent data={flip.content} />
              </div>
              <div className="flip-face flip-back">
                <PageContent
                  data={
                    flip.direction === 'forward'
                      ? SPREADS[spread].left
                      : SPREADS[spread].right
                  }
                />
              </div>
            </div>
          )}
        </div>

        <button
          className="nav-btn"
          onClick={goForward}
          disabled={spread === MAX_SPREAD || !!flip}
          aria-label="Volgende pagina"
        >
          ›
        </button>
      </div>

      <div className="page-dots" aria-hidden="true">
        {SPREADS.map((_, i) => (
          <span key={i} className={`page-dot${i === spread ? ' active' : ''}`} />
        ))}
      </div>
    </section>
  )
}
