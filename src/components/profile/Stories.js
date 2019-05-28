import React from 'react'
import { Link } from 'react-router-dom'

import StoriesCards from '../shared/StoriesCards'

const Stories = ({ stories, auth, id }) => {
  return (
    <section className="stories">
      <div className="flex frw spb ac">
        <h5>{stories && stories.length} {stories && stories.length > 1 ? 'stories': 'story'}</h5>
        <Link className="custom-btn" to='/story/add'><i className="fas fa-plus-circle"></i> Add a new story</Link>
      </div>
      <hr/>
      { stories.length > 0 ?
        <StoriesCards auth={auth} type="profile" stories={stories} />:
        <p>No story for the moment</p>
      }
      {/* <div className="masonry" id="masonry">
        {stories && stories.map((v, i) => {
          return (
            <div className={`grid-item grid-item-${i+1}`} key={v.storyId} style={{backgroundImage: `url(${v.banner ? v.banner: defaultBanner})`}} >
              <Link to={`/story/${v && v.storyId}`}>
                <div className="inner">
                  { !v.public && <span className="private-tag"><i className="fas fa-lock"></i></span> }
                  <h3>{v && v.title}</h3> 
                  <hr/>
                  <div className="info">
                    <span>{v && v.chaptersCount} chapter{v && v.chaptersCount > 1 && 's'}</span><br/>
                    <span>{v && v.charactersCount} character{v && v.charactersCount > 1 && 's'}</span>
                  </div>
                  <div className="stats">
                    <span>Followed by {v && v.likesCount} people</span>
                    <div className="ratings">
                      <StarRatings
                      rating={v && v.note}
                      starRatedColor="#27bab0"
                      numberOfStars={5}
                      name='rating'
                      starDimension={'15px'}
                      />
                      <small>{v && v.note && v.note.toFixed(1)}</small>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}
        )}
      </div> */}
    </section>
  )
}

export default Stories
