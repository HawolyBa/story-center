import React from 'react'
import { Button } from 'reactstrap'

const FollowButton = ({ isFavorite, likeUser }) => {
  return (
    <Button className="follow-btn"
      size="sm" 
      outline={isFavorite ? true: false}
      onClick={likeUser}
    >
      {isFavorite ? 'Unfollow': 'Follow'}
    </Button>
  )
}

export default FollowButton
