import React from 'react'
import { Link } from 'react-router-dom'
import { Row, Col } from 'reactstrap'
import { defaultAvatar } from '../default/defaultImages'

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
                <div className={`image flex fc ac jc ${(!auth && !char.public) || (!char.public && auth && auth.uid !== char.authorId) ? 'layer' : ''}`}>
                  <div style={{ background: `url(${char.image ? char.image : defaultAvatar}) no-repeat center / cover`}} className="inner-image" />
                </div>
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
