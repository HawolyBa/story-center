import React from 'react'
import StarRatings from 'react-star-ratings';
import { Col } from 'reactstrap'
import { Link } from 'react-router-dom'
import { defaultBanner } from '../default/defaultImages'

const StoryCard = ({ story, type, auth }) => {
  console.log(story.authorId)
  return (
    <Col lg="2" md="4" xs="6">
      <Link to={`/story/${story.id}`}>
        <div className="custom-card story-card" style={{ backgroundImage: `url(${story.banner ? story.banner: defaultBanner})` }}>
          {type === 'profile' && auth && !story.public && auth.uid === story.authorId && <span className="private-tag"><i className="fas fa-lock"></i></span> }
          <div className="inner-card flex fc ac spa">
            <h4>{story.title}</h4>
            <p>Followed by {story.likesCount} people</p>
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
          </div>
        </div>
      </Link>
    </Col>
  )
}

export default StoryCard
