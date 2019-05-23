import React from 'react'
import { Row } from 'reactstrap'
import UserCard from './UserCard'

const UsersCards = ({ users, type }) => {
  return (
    <div className="users-cards">
      <Row>
        {users && users.map(user => (
          <UserCard type={type} user={user} key={user.id}/>
        ))}
      </Row>
    </div>
  )
}

export default UsersCards
