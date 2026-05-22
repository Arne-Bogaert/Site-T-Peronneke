import { useEffect, useRef } from 'react'
import menuData from '../data/menu.json'
import './Menu.css'

function ItemRow({ item, withDescription }) {
  return (
    <li className={`menu-item${item.populair ? ' menu-item--pop' : ''}`}>
      <div className="menu-item-row">
        <span className="menu-item-name">
          {item.naam}
          {item.populair && (
            <span className="menu-star" aria-label="populair">★</span>
          )}
        </span>
        <span className="menu-item-fill" aria-hidden="true" />
        <span className="menu-item-price">€ {item.prijs}</span>
      </div>
      {withDescription && item.beschrijving && (
        <p className="menu-item-desc">{item.beschrijving}</p>
      )}
    </li>
  )
}

export default function Menu() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('menu--visible')
          observer.unobserve(el)
        }
      },
      { threshold: 0.05 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="menu"
      className="menu"
      ref={sectionRef}
      aria-labelledby="menu-heading"
    >
      <div className="menu-inner">

        <header className="menu-hd" style={{ '--i': 0 }}>
          <span className="menu-eyebrow">Menu</span>
          <h2 id="menu-heading" className="menu-title">Ons Menu</h2>
          <div className="menu-title-bar" aria-hidden="true" />
        </header>

        <div className="menu-grid">

          <div className="menu-cat" style={{ '--i': 1 }}>
            <h3 className="menu-cat-title">Gerechten</h3>
            <p className="menu-cat-note">Keuken doorlopend open tot 19u30</p>
            <ul className="menu-items" role="list">
              {menuData.gerechten.map((item, i) => (
                <ItemRow key={i} item={item} />
              ))}
            </ul>
            <h4 className="menu-sub-title">Voor kids</h4>
            <ul className="menu-items menu-items--kids" role="list">
              {menuData.gerechten_kids.map((item, i) => (
                <ItemRow key={i} item={item} />
              ))}
            </ul>
          </div>

          <div className="menu-cat" style={{ '--i': 2 }}>
            <h3 className="menu-cat-title">Ontbijt</h3>
            <ul className="menu-items" role="list">
              {menuData.ontbijt.map((item, i) => (
                <ItemRow key={i} item={item} />
              ))}
            </ul>
          </div>

          <div className="menu-cat" style={{ '--i': 3 }}>
            <h3 className="menu-cat-title">Formules</h3>
            <ul className="menu-items" role="list">
              {menuData.formules.map((item, i) => (
                <ItemRow key={i} item={item} withDescription />
              ))}
            </ul>
          </div>

          <div className="menu-cat" style={{ '--i': 4 }}>
            <h3 className="menu-cat-title">Desserten</h3>
            <ul className="menu-items" role="list">
              {menuData.desserten.map((item, i) => (
                <ItemRow key={i} item={item} />
              ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  )
}
