import React from 'react'

const Badges = ({badges}) => {
  return (
    <section className="badges">
      <h3>{badges.length} Badge{badges.length > 1 ? 's': ''}</h3>
      <div className="badges-grid flex fs ac frw">
        { badges.map(badge => (
          <div className="badge-block">
            <figure key={badge.id} className="badge flex fc ac jc">
              <img src={badge.image} alt={badge.name}/>
              <figcaption>{badge.name}</figcaption>
            </figure>
            <div className="badge-tooltip">
              { badge.description }
            </div>
          </div>
        )) }
      </div>
    </section>
  )
}

export default Badges
