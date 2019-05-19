import React from 'react'
import { Row } from 'reactstrap'
import UserCard from './UserCard'

const UsersCards = ({ users }) => {
  return (
    <div className="users-cards">
      <Row>
        {users && users.map(user => (
          <UserCard user={user} key={user.id}/>
        ))}
      </Row>
    </div>
  )
}

export default UsersCards
