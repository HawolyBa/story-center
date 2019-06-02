import React from 'react'
import { Col } from 'reactstrap'
import { Link } from 'react-router-dom'
import { defaultAvatar } from '../default/defaultImages'
import styled, { keyframes } from 'styled-components';
import zoomIn from 'react-animations/lib/zoomIn'
const animation = keyframes`${zoomIn}`;
const AnimatedDiv = styled.figure`
  animation: 0.6s ${animation}
`;

const CharacterCard = ({ character, type, auth, lg, md, xs }) => {
  return (
    <Col lg={lg} md={md} xs={xs}>
      <Link to={`/character/${character.id}`}>
        <AnimatedDiv className="item-card character-card">
          { auth && !character.public && auth.uid === character.authorId && <span className="private-tag"><i className="fas fa-lock"></i></span> }
          <div className={`image flex fc ac jc ${(!auth && !character.public) || (!character.public && auth && auth.uid !== character.authorId) ? 'layer' : ''}`}>
            <div style={{ background: `url(${character.image ? character.image : defaultAvatar}) no-repeat center / cover`}} className="inner-image" />
          </div>
            <figcaption>
              <h4>{character.firstname} {character.lastname && character.lastname}</h4>
              {type === 'home' && <span>By {character.authorName}</span>}
              { type !== 'chapter'  && 
              <React.Fragment>
              <hr/>
              <small>{
                  type === 'characters' || type === 'home' ?
                  `Followed by ${character.likesCount} people`:
                  type === 'favorites' ?
                  `By ${character.authorName}`:
                  null
                }
              </small>
              </React.Fragment>
            }
            </figcaption>
        </AnimatedDiv>
      </Link>
    </Col>
  )
}

export default CharacterCard
