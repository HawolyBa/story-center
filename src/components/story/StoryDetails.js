import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import AddLocation from '../shared/NewLocation'
import StarRatings from 'react-star-ratings';
import { Squares } from 'react-activity';
import 'react-activity/lib/Squares/Squares.css';
import SimpleBar from 'simplebar-react';
import { defaultBanner } from '../default/defaultImages'
import { siteName } from '../../config/keys'
import { languages } from './addStory/metadatas'

import CharactersAndLocationsInChapter from './chapter/CharactersAndLocationsInChapter'
import Ratings from './chapter/Ratings'
import Comments from './chapter/Comments'
import Report from '../shared/Report';
import ShareButtons from '../shared/ShareButtons'
import Moment from 'react-moment'


const StoryDetails = ({ story, id, auth, deleteChapter, isFavorite, changeRating, UI, innerWidth, innerHeight, chapter, match, comments, category, isDraft, chapid}) => {
  const chapters = story.chapters.filter(chap => auth.uid !== story.authorId ? chap.status === "published" : chap)
  const height = innerHeight <= 720 ? 'calc(100vh - 90px)': '80vh'
  const language = languages.find(l => l.code === story.language)
  const title = `Read: ${story.title} - ${chapter.title} on ${siteName}`
  return innerWidth >= 850 ?
    <SimpleBar style={{ height: height }}>
      <section className="story-details p-4">
      <div className="upper-band flex as spb">
        {auth.uid === story.authorId ?
          <Link className="square-btn primary-btn outlined" to={`/story/${id}/edit`}>
            <i className="far fa-edit"></i> Edit
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
        <small className="storyTags">Tags: {story.tags.map((tag, i) => <Link key={i} to={`/tags/${tag}`}>{`#${decodeURIComponent(tag)} `}</Link>)}</small>
      <ShareButtons title={`Read: ${story.title} on ${siteName}`} image={story.banner ? story.banner: defaultBanner}/>
      <hr/>
      <div className="story-details-chapter">
      { auth.uid === story.authorId && 
        <div className="add-btn-group mb-3">
          {(story.oneShot && !chapter.title && !isDraft) && 
          <React.Fragment>
            <i className="fas fa-plus-circle"></i> <Link to={`/story/${id}/add`}>{story.oneShot && !chapter.title ? 'Start writing': 'Add a new chapter'}</Link><br/>
          </React.Fragment>
          }
          {(!story.oneShot) && 
          <React.Fragment>
            <i className="fas fa-plus-circle"></i> <Link to={`/story/${id}/add`}>Add a new chapter</Link><br/>
          </React.Fragment>
          }
          {(story.oneShot && chapter.title) || (isDraft) ?
            !chapid ?
            <React.Fragment>
              <i className="far fa-edit"></i> <Link to={`/story/${id}/chapter/${chapter.id}/edit`}>Edit chapter</Link><br />
            </React.Fragment>:
            <React.Fragment>
              <i className="far fa-edit"></i> <Link to={`/story/${id}/chapter/${chapid}/edit`}>Edit chapter</Link><br />
            </React.Fragment>:
            null
          }
          <i className="fas fa-plus-circle"></i> <Link to={`/character/add`}>Add a new character</Link><br />
          <i className="fas fa-plus-circle"></i> <AddLocation currentId={id}/>
        </div>
      }
        {!story.oneShot ? 
        <React.Fragment>
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
            <Squares />
          }
        </React.Fragment>:
        !isDraft ?
        <div className="chapter">
          <div className="chapter-content one-shot">
            <h3 className="text-center mb-4 title">{chapter && chapter.title}</h3>
            <div className="meta">
              <small>
                Posted on: <Moment format="YYYY-MM-DD, HH:mm">{new Date(chapter.createdAt)}</Moment>
              </small>
              <br />
            </div>
            <hr />
            <p dangerouslySetInnerHTML={{ __html: chapter && chapter.body }} className="body"></p>
            {chapter.id && <Ratings chapter={chapter} id={match.params.id} chapid={chapter.id} />}
            <hr />
            <CharactersAndLocationsInChapter locations={chapter.locations} auth={auth} characters={chapter.characters} />
            <hr />
            {story.public && <Comments story={story} chapter={chapter} params={match.params} comments={comments} />}
          </div>
        </div>:
        <p>No chapter for the moment...</p>
        }
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
            {(story.oneShot || !chapter.title) && 
            <React.Fragment>
              <i className="fas fa-plus-circle"></i> <Link to={`/story/${id}/add`}>{story.oneShot && !chapter.title ? 'Star writing': 'Add a new chapter'}</Link><br/>
            </React.Fragment>
            }
            {story.oneShot && chapter.title &&
              <React.Fragment>
                <i className="far fa-edit"></i> <Link to={`/story/${id}/chapter/${chapter.id}/edit`}>Edit chapter</Link><br />
              </React.Fragment>
            }
            <i className="fas fa-plus-circle"></i> <Link to={`/character/add`}>Add a new character</Link><br />
            <i className="fas fa-plus-circle"></i> <AddLocation currentId={id}/>
          </div>
        }
        {!story.oneShot ? 
        <React.Fragment>
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
            <Squares />
          }
        </React.Fragment>:
        <div className="chapter">
          <div className="chapter-content one-shot">
            <h3 className="text-center mb-4 title">{chapter && chapter.title}</h3>
            <div className="meta">
              <small>
                Posted on: <Moment format="YYYY-MM-DD, HH:mm">{new Date(chapter.createdAt)}</Moment>
              </small>
              <br />
              <small className="meta-responsive">
                Author: <Link className="td-underline" to={`/profile/${story.authorId}`}> {story.authorName}</Link>  /
                Genre: <Link className="td-underline" to={`/categories/${category && category.id}`}>{category && category.name}</Link> / 
                Status: {story.status} /
                Rating: {story.rating} /
                Language: {`${language && language.lang} (${language && language.code})`} 
              </small>
            </div>
            <hr />
            <p dangerouslySetInnerHTML={{ __html: chapter && chapter.body }} className="body"></p>
            {chapter.id && <Ratings chapter={chapter} id={match.params.id} chapid={chapter.id} />}
            <small>Share this chapter on social media</small>
            <ShareButtons title={title} image={story.banner ? story.banner: defaultBanner}/>
            <hr />
            <CharactersAndLocationsInChapter locations={chapter.locations} auth={auth} characters={chapter.characters} />
            <hr />
            {story.public && <Comments story={story} chapter={chapter} params={match.params} comments={comments} />}
          </div>
        </div>
        }
      </div>
    </section>
}

export default StoryDetails
