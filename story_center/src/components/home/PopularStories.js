import React from 'react'
import { defaultBanner } from '../default/defaultImages';
import StarRatings from 'react-star-ratings';
import { Link } from 'react-router-dom'

const PopularStories = ({ popularStories, type }) => {
  return (
    <section className="popular-stories">
      <div className="home-story-cards">
        {popularStories.map(story => (
          <Link to={`/story/${story.id}`} key={story.id}>
            <div className="custom-card story-card" style={{ background: `url(${story.banner ? story.banner : defaultBanner}) no-repeat center / cover` }}>
              <div className="inner-card flex fc ac spa">
                <div className="story-title">
                  <h4>{story.title}</h4>
                  <p>By: {story.authorName}</p>
                </div>
                <p>Followed by {story.likesCount} people</p>
                { type !== 'latest' && 
                <div className="flex frn ac spb">
                  <StarRatings
                    rating={story.note}
                    starRatedColor="#27bab0"
                    numberOfStars={5}
                    name='rating'
                    starDimension={'12px'}
                    starSpacing={"2px"}
                  />
                  <span className="note">{story.note}</span>
                </div> }
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default PopularStories
