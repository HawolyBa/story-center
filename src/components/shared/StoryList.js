import React from 'react'
import StoryListItem from './StoryListItem'
import { Row } from 'reactstrap'

const StoryList = ({ stories, auth, type }) => {
  return (
    <div className="story-list">
      <Row>
        { stories.map(story => (
          <StoryListItem auth={auth} type={type} story={story} key={story.id}/>
        )) }
      </Row>
    </div>
  )
}

export default StoryList
