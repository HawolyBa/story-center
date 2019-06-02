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

const UserCard = ({ user, type }) => {
  return (
    <Col lg={type === 'favorites' ? 3: 2} md="4" xs="6">
      <Link to={`/profile/${user.id}`}>
      <AnimatedDiv className="user-card item-card">
        <div className="image">
          <div className="inner-image" style={{ background: `url(${user.image ? user.image: defaultAvatar}) no-repeat center / cover` }}/>
        </div>
        <figcaption>
          <h4>{user.username}</h4>
          <hr/>
          <small>{user.likesCount} follower{user.likesCount > 1 && 's'}</small>
        </figcaption>  
      </AnimatedDiv>
      </Link>
    </Col>
  )
}

export default UserCard
