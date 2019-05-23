import React from 'react'
import { Link } from 'react-router-dom'
import { Row, Col } from 'reactstrap'
import { defaultAvatar } from '../default/defaultImages'

const Relatives = ({ characterRelatives, auth }) => {
  return (
    <div className="relatives">
      <h3>Relationships</h3>
      {<Row>
        {characterRelatives.length > 0 ? characterRelatives.filter(char => (!auth && !char.public) || (auth && !char.public && auth.uid !== char.authorId) ? char.public : char).map(char => (
          <Col lg="3" md="4" xs="6" key={char.character_id}>
            <Link to={`/character/${char.character_id}`}>
              <figure className="item-card character-card">
                {!char.public && <span className="private-tag"><i className="fas fa-lock"></i></span> }
                <div className={`image flex fc ac jc ${(!auth && !char.public) || (!char.public && auth && auth.uid !== char.authorId) ? 'layer' : ''}`}>
                  <div style={{ background: `url(${char.image ? char.image : defaultAvatar}) no-repeat center / cover`}} className="inner-image" />
                </div>
                <figcaption>
                  <h4>{char.firstname} {char.lastname}</h4>
                  <hr/>
                  <small>{char.relation}</small>
                </figcaption>  
              </figure>
            </Link>
          </Col>
        )) : <p>No relationships for the moment</p>}
      </Row>}
    </div>
  )
}

export default Relatives
