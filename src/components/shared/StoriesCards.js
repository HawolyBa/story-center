import React from 'react'
import { Row } from 'reactstrap'
import StoryCard from './StoryCard'

const StoriesCards = ({ auth, stories, type }) => {
  return (
      <Row>
      { stories.map(story => (
        <StoryCard auth={auth} type={type} key={story.id || story.storyId} story={story}/>
      ))}
      </Row>
  )
}

export default StoriesCards
