import React from 'react'
import { Link } from 'react-router-dom'
import { Row, Col } from 'reactstrap'

const Relatives = ({ characterRelatives, auth }) => {
  return (
    <div className="relatives">
      <h3>Relationships</h3>
      {<Row>
        { characterRelatives.length > 0 ? characterRelatives.map(char => (
          <Col lg="3" md="4" xs="6" key={char.character_id}>
            <Link to={`/character/${char.character_id}`}>
            { (char.public || (auth.uid === char.authorId)) && 
              <figure className="item-card character-card">
                <div className="image" style={{ backgroundImage: `url(${char.image})` }}></div>
                <figcaption>
                  <h4>{char.firstname} {char.lastname}</h4>
                  <hr/>
                  <small>{char.relation}</small>
                </figcaption>  
              </figure>}
            </Link>
          </Col>
        )) : <p>No relationships for the moment</p>}
      </Row>}
    </div>
  )
}

export default Relatives
