import React from 'react'
import { Row, Col } from 'reactstrap'
import { Link } from 'react-router-dom'

const PopularCharacters = ({ popularCharacters }) => {
  return (
    <div className="popular-characters">
      <h2 className="mb-4">Popular characters</h2>
      <Row>
        {popularCharacters.map(char => (
          <Col lg="3" md="4" xs="6" key={char.id}>
            <Link to={`/character/${char.id}`}>
              <figure className="item-card character-card">
                <div className="image" style={{ backgroundImage: `url(${char.image})` }}></div>
                <figcaption>
                  <h4>{char.firstname} {char.lastname}</h4>
                  <span>By {char.authorName}</span>
                  <hr />
                  <small>Liked by {char.likesCount} people</small>
                </figcaption>
              </figure>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default PopularCharacters
