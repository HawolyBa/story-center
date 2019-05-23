import React from 'react'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import Moment from 'react-moment';
import StarRatings from 'react-star-ratings';
import {Link} from 'react-router-dom'
import { object } from 'prop-types'
import { defaultBanner } from '../default/defaultImages'
import { languages } from './addStory/metadatas'

const StoryBanner = ({id, story, category, note}) => {
  const classN = story.status && story.status.split(' ').map(l => l.toLowerCase()).join('-')
  const language = languages.find(l => l.code === story.language)
  return (
    <section className="story-banner" style={{ backgroundImage: `url(${story.banner ? story.banner : defaultBanner})`}}>
      <div className="story-info">
        <h2 className="storyTitle mb-3">
          <Link to={`/story/${id}`}>{story.title}</Link>
        </h2>
        { story.public && 
        <div className="responsive">
          <div className="banner-rating flex afs jc frn">
            <StarRatings
              rating={note}
              starRatedColor="#27bab0"
              numberOfStars={5}
              starDimension={"17px"}
              isAggregateRating={true}
              starSpacing={'2px'}
              isSelectable={false}
              name='banner-rating'
            />
            <small className="note">{note.toFixed(1)}</small>
          </div>
        </div>}
        <div className="details">
          <div>
            <p className="status flex ac jc">
              <span className={`dot dot-${classN}`}></span>{ story.status }
            </p>
            <p>Author: <Link to={`/profile/${story.authorId}`}>{story.authorName}</Link></p>
            <p>Genre: <Link to={`/categories/${category.id}`}>{category.name}</Link></p>
            <p><i className="fab fa-font-awesome-flag"></i>&nbsp;&nbsp; {`${language && language.lang} (${language && language.code})`}</p>
            {story.public && <div className="banner-rating flex afs jc frn">
              <StarRatings
                rating={note}
                starRatedColor="#27bab0"
                numberOfStars={5}
                starDimension={"17px"}
                isAggregateRating={true}
                starSpacing={'2px'}
                isSelectable={false}
                name='banner-rating'
              />
              <small className="note">{note.toFixed(1)}</small>
            </div>}
          </div>
          <div className="sub-info mt-3">
            <small className="date"><i className="far fa-calendar-alt"></i>&nbsp;&nbsp; <Moment format='YYYY-MM-DD'>{new Date(story.createdAt)}</Moment></small><br />
            <small>Copyright: {story.copyright}</small><br />
            <small>Image Copyright: {story.imageCopyright && story.imageCopyright}</small>
          </div>
          {story.mature && <p className="bold warning">Mature content</p>}
        </div>
        <div className="story-stats flex frn fs jc mt-4">
          <div className="stat flex fc jc ac mr-3">
            <span>{story.chaptersCount}</span>
            <span>chapter{story.chaptersCount > 1 ? 's' : ''}</span>
          </div>
          <div className="stat flex fc jc ac">
            <span>{story.charactersCount}</span>
            <span>character{story.charactersCount > 1 ? 's' : ''}</span>
          </div>
        </div>        
      </div>
    </section>
  )
}

StoryBanner.defaultProps = {
  category: {},
  note: 0,
  banner: defaultBanner
}

StoryBanner.propTypes = {
  category: object.isRequired,
}

const mapStateToProps = (state, ownProps) => {
  const categories = state.firestore.ordered.categories
  const chapters = state.firestore.ordered.chapters
  const storyChapters = chapters && chapters.filter(chap => chap.storyId === ownProps.id)
  let allChapWithVote = 0 
  const total = storyChapters && storyChapters.reduce((a,b) => {
    if (b.votesCount > 0) {
      allChapWithVote++
      return a + b.note
    }
    else return a
  }, 0)
  const note = total && total / allChapWithVote
  const story = ownProps.story
  const category = story && categories && categories.filter(gen => gen.id === story.category)[0]
  return {
    category,
    note
  }
}

export default compose(connect(mapStateToProps), firestoreConnect([{collection: 'categories'}, {collection: 'chapters'}]))(StoryBanner)
