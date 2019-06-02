import React from 'react'
import Moment from 'react-moment'
import StarRatings from 'react-star-ratings';
import { Link } from 'react-router-dom'
import { Col } from 'reactstrap'
import styled, { keyframes } from 'styled-components';
import zoomIn from 'react-animations/lib/zoomIn'
const animation = keyframes`${zoomIn}`;
const AnimatedDiv = styled.span`
  animation: 0.6s ${animation}
`;

const StoryListItem = ({ story, auth, type }) => {
  const classN = story.status && story.status.split(' ').map(l => l.toLowerCase()).join('-')
  return (
    <Col md="6">
      <Link to={`/story/${story.id}`}>
        <AnimatedDiv className="story-list-item">
          {type === 'profile' && auth && !story.public && auth.uid === story.authorId && <span className="private-tag"><i className="fas fa-lock"></i></span> }
          <div className="flex fc fs spb">
            <h4>{story.title}</h4>
            <small><span className={`dot dot${classN}`}></span> {story.status}</small>
            <small>Created on: <Moment format="YYYY-MM-DD">{new Date(story.createdAt)}</Moment></small>
            <hr/>
          </div>
          <p>Summary: {story.summary}</p>
          <div className="story-footer flex fs ac frn">
            <div className="flex frn ac spb">
              <StarRatings
                rating={story.note}
                starRatedColor="#27bab0"
                numberOfStars={5}
                name='rating'
                starDimension={'12px'}
                starSpacing={"3px"}
              />
              <span className="note">{story.note}</span>
            </div>
            <div className="stats">
              <span><strong>{story.chaptersCount}</strong> chapter{story.chaptersCount > 1 ? 's': ''}</span>
            </div>
            <span>{story.likesCount} <i className="fas fa-heart"></i></span>
          </div>
        </AnimatedDiv>
      </Link>
    </Col>
  )
}

export default StoryListItem
