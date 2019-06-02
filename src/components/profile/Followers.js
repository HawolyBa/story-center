import React from 'react'
import { Link } from 'react-router-dom'
import { Row, Col } from 'reactstrap'

import styled, { keyframes } from 'styled-components';
import fadeIn from 'react-animations/lib/fadeIn'
const animation = keyframes`${fadeIn}`;
const AnimatedSection = styled.section`
  animation: 0.6s ${animation}
`;

const Followers = ({followers}) => {
  return (
    <AnimatedSection className="followers">
      <h5 className="mb-4">{ followers && followers.length} follower{followers && followers.length > 1 ? 's': ''}</h5>
      {followers.length > 0 ? 
      <Row>
        { followers.map(follower => (
          <Col lg="2" sm="4" xs="6" className="mb-5" key={follower.id}>
            <Link to={`/profile/${follower.id}`} className="item">
              <figure className="user-card item-card">
                <div className="image" style={{ background: `url(${follower.image}) no-repeat center / cover` }}/>
                <figcaption>
                  <h4>{follower.username}</h4>
                </figcaption>
              </figure>
            </Link>
          </Col>
        ))}
      </Row>: 
      <p>No follower for the moment</p>}
    </AnimatedSection>
  )
}

export default Followers
