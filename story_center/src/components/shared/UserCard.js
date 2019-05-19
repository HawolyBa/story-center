import React from 'react'
import { Col } from 'reactstrap'
import { Link } from 'react-router-dom'

const UserCard = ({ user }) => {
  return (
    <Col lg="2" md="4" xs="6">
      <Link to={`/profile/${user.id}`}>
      <figure className="user-card item-card">
        <div className="image" style={{ backgroundImage: `url(${user.image})` }}></div>
        <figcaption>
          <h4>{user.username}</h4>
          <hr/>
          <small>{user.likesCount} follower{user.likesCount > 1 && 's'}</small>
        </figcaption>  
      </figure>
      </Link>
    </Col>
  )
}

export default UserCard
