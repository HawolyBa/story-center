import React from 'react'
import StarRatings from 'react-star-ratings';
import { Link } from 'react-router-dom'
import { defaultBanner } from '../default/defaultImages'

const StoryCards = ({ stories, type, story, checked }) => {
  return type !== 'archive' ?
    <div className="story-cards">
      {stories.map(story => (
        <Link key={story.id} className="item flex fc ac spb" style={{backgroundImage: `linear-gradient(
          rgba(0, 0, 0, 0.45), 
          rgba(0, 0, 0, 0.45)
        ),url(${story.banner ? story.banner: defaultBanner})`}} to={`/story/${story.id}`}>
          <h3>{story.title}</h3>
          <div className="stats">
            <span>Followed by {story.likesCount} people</span>
            { type === 'popular' && <div className="ratings flex fc ac jc">
              <StarRatings
              rating={story.note}
              starRatedColor="#27bab0"
              numberOfStars={5}
              name='rating'
              starDimension={'12px'} 
              />
              <small>{story.note && story.note.toFixed(1)}</small>
            </div>}
          </div>
        </Link>
      ))}
    </div>:
    <Link className="item flex fc ac spb" style={{backgroundImage: `linear-gradient(
      rgba(0, 0, 0, 0.45), 
      rgba(0, 0, 0, 0.45)
    ),url(${story.banner})`}} to={ `/story/${story.id}`}>
      <div className="story-title">
        <h3>{story.title}</h3>
        <span>By {story.authorName}</span>
      </div>
      <div className="counter flex fc fs">
        <span>{story.chaptersCount} chapter{story.chaptersCount> 1 ? 's': ''}</span>
        <span>{story.charactersCount} character{story.charactersCount > 1 ? 's': ''}</span>
      </div>
      <div className="stats">
        <span>Followed by {story.likesCount} people</span>
        <div className="ratings flex frn ase jc">
          <StarRatings
          rating={story.note}
          starRatedColor="red"
          numberOfStars={5}
          name='rating'
          starDimension={'12px'}
          starSpacing={'2px'}
          />
          <small>{story.note && story.note.toFixed(1)}</small>
        </div>
      </div>
    </Link>
}

export default StoryCards
