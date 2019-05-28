import React from 'react'
import { Link } from 'react-router-dom'
import { Row, Col } from 'reactstrap'

const Followers = ({followers}) => {
  return (
    <section className="followers">
      <h5>{ followers && followers.length} follower{followers && followers.length > 1 ? 's': ''}</h5>
      <hr/>
      {followers.length > 0 ? 
      <Row>
        { followers.map(follower => (
          <Col lg="2" sm="4" xs="6" className="mb-5" key={follower.id}>
            <Link to={`/profile/${follower.id}`} className="item">
              <figure className="user-card item-card">
                <div className="image" style={{ background: `url(${follower.image}) no-repeat center / cover` }}/>
                <figcaption>
                  <h4>{follower.username}</h4>
                  <hr/>
                  <button className="follow-btn follow-btn-outlined">Unfollow</button>
                </figcaption>
              </figure>
            </Link>
          </Col>
        ))}
      </Row>: 
      <p>No follower for the moment</p>}
    </section>
  )
}

export default Followers
