import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import AddLocation from '../shared/NewLocation'
import StarRatings from 'react-star-ratings';
import { Squares } from 'react-activity';
import 'react-activity/lib/Squares/Squares.css';
import SimpleBar from 'simplebar-react';
import { defaultBanner } from '../default/defaultImages'
import { siteName } from '../../config/keys'

import Report from '../shared/Report';
import ShareButtons from '../shared/ShareButtons'


const StoryDetails = ({ story, id, auth, deleteChapter, isFavorite, changeRating, UI, innerWidth }) => {
  const chapters = story.chapters.filter(chap => auth.uid !== story.authorId ? chap.status === "published" : chap)
  return innerWidth >= 850 ?
    <SimpleBar style={{ height: '80vh' }}>
      <section className="story-details p-4">
      <div className="upper-band flex as spb">
        {auth.uid === story.authorId ?
          <Link className="square-btn primary-btn outlined" to={`/story/${id}/edit`}>
            Edit
          </Link>:
          <Report type="story" data={story} />
        }
        <div className="flex ac jc fc">
          <div className="favorite flex ac spb frn">
            <StarRatings
              rating={isFavorite ? 1 : 0}
              starRatedColor="#27bab0"
              changeRating={changeRating}
              numberOfStars={1}
              name='rating'
              starDimension={'30px'}
              starHoverColor="#27bab0"
              id="star-rating"
            />
            {isFavorite ? 'Remove from favorite': 'Add to favorite'}</div>
          <small className="mt-2">{story.likesCount} people already liked this story</small>
        </div>
      </div>
      <hr/>
      <p className="summary"><span>Summary:</span> {story && story.summary}</p>
        <small className="storyTags">Tags: {story.tags.map((tag, i) => <Link key={i} to={`/tags/${tag}`}>{`#${tag} `}</Link>)}</small>
      <ShareButtons title={`Read: ${story.title} on ${siteName}`} image={story.banner ? story.banner: defaultBanner}/>
      <hr/>
      <div className="story-details-chapter">
      { auth.uid === story.authorId && 
        <div className="add-btn-group mb-3">
          <i className="fas fa-plus-circle"></i> <Link to={`/story/${id}/add`}>Add a new chapter</Link><br/>
          <i className="fas fa-plus-circle"></i> <AddLocation currentId={id}/>
        </div>
      }
        <h3 className="text-center bold mb-3 normal">Chapters</h3>
        {!UI.loading ?
          chapters && chapters.length > 0 ?
            <div className="chapters-list">
              {chapters.sort((a, b) => a.number - b.number).map(chap => (
                <div key={chap.id} className="chapter-el">
                  <span className="chapter-name">{chap.number}. {chap.title} {auth.uid === story.authorId && chap.status === "draft" && <i>(draft)</i>}</span>
                  <hr />
                  {chap.status === 'published' && <Link to={`/story/${id}/chapter/${chap.id}`} className="chapter-link primary">Read</Link>}
                  {auth.uid === story.authorId &&
                    <Fragment>
                      <Link to={`/story/${id}/chapter/${chap.id}/edit`} className="chapter-link edit">Edit</Link>
                      <span className="chapter-link warning" onClick={deleteChapter.bind(this, chap.id)}>Delete</span>
                    </Fragment>}
                </div>
              ))}
            </div> :
            <p className="text-center">No chapter for the moment</p> :
          <Squares />}
        </div>
      </section>
    </SimpleBar>:
    <section className="story-details p-4">
      <div className="upper-band flex as spb">
        {auth.uid === story.authorId ?
          <Link className="square-btn primary-btn outlined" to={`/story/${id}/edit`}>
            Edit
          </Link> :
          <Report type="story" data={story} />
        }
        <div className="flex ac jc fc">
          <div className="favorite flex ac spb frn">
            <StarRatings
              rating={isFavorite ? 1 : 0}
              starRatedColor="#27bab0"
              changeRating={changeRating}
              numberOfStars={1}
              name='rating'
              starDimension={'30px'}
              starHoverColor="#27bab0"
              id="star-rating"
            />
            {isFavorite ? 'Remove from favorite' : 'Add to favorite'}</div>
          <small className="mt-2">{story.likesCount} people already liked this story</small>
        </div>
      </div>
      <hr />
      <p className="summary"><span>Summary:</span> {story && story.summary}</p>
      <hr />
      <div className="story-details-chapter">
        {auth.uid === story.authorId &&
          <div className="add-btn-group mb-3">
            <i className="fas fa-plus-circle"></i> <Link to={`/story/${id}/add`}>Add a new chapter</Link><br />
            <i className="fas fa-plus-circle"></i> <AddLocation currentId={id} />
          </div>
        }
        <h3 className="text-center bold mb-3 normal">Chapters</h3>
        {!UI.loading ?
          story.chapters && story.chapters.length > 0 ?
          <div className="chapters-list">
            {story.chapters.sort((a, b) => a.number - b.number).map(chap => (
              <div key={chap.id} className="chapter-el">
                <span className="chapter-name">{chap.number}. {chap.title}</span>
                <hr />
                <Link to={`/story/${id}/chapter/${chap.id}`} className="chapter-link primary">Read</Link>
                {auth.uid === story.authorId &&
                  <Fragment>
                    <Link to={`/story/${id}/chapter/${chap.id}/edit`} className="chapter-link edit">Edit</Link>
                    <span className="chapter-link warning" onClick={deleteChapter.bind(this, chap.id)}>Delete</span>
                  </Fragment>}
              </div>
            ))}
          </div> :
          <p>No chapter for the moment</p>:
          <Squares />}
      </div>
    </section>
}

export default StoryDetails
