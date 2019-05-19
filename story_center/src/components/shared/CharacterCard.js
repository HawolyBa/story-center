import React from 'react'
import { Col } from 'reactstrap'
import { Link } from 'react-router-dom'

const CharacterCard = ({ character, type, auth }) => {
  return (
    <Col lg={type === 'favorites' || type === 'chapter' ? 3 : 2} md={type === 'favorites' || type === 'chapter' ? 4 : 3} xs="6">
      <Link to={`/character/${character.id}`}>
        <figure className="item-card character-card">
          { auth && !character.public && auth.uid === character.authorId && <span className="private-tag"><i className="fas fa-lock"></i></span> }
            <div className={`image flex fc ac jc ${(!auth && !character.public) ||  (!character.public && auth && auth.uid  !== character.authorId) ? 'layer': '' }`} style={{ backgroundImage: `url(${ character.image })`}}>
            </div>
            <figcaption>
              <h4>{character.firstname} {character.lastname && character.lastname}</h4>
              { type !== 'chapter'  && 
              <React.Fragment>
              <hr/>
              <small>{
                  type === 'characters' ?
                  `Followed by ${character.likesCount} people`:
                  type === 'favorites' ?
                  `By ${character.authorName}`:
                  null
                }
              </small>
              </React.Fragment>
            }
            </figcaption>
        </figure>
      </Link>
    </Col>
  )
}

export default CharacterCard
