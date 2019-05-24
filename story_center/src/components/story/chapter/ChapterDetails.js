import React, {Fragment} from 'react'
import CharactersAndLocationsInChapter from './CharactersAndLocationsInChapter';
import Comments from './Comments'
import { Link } from 'react-router-dom'
import Moment from 'react-moment';
import { Squares } from 'react-activity';
import 'react-activity/lib/Squares/Squares.css';
import SimpleBar from 'simplebar-react';
import { languages } from '../addStory/metadatas'

import ChapterNotFound from './ChapterNotFound'
import Ratings from './Ratings'

const ChapterDetails = ({ previous, next, locations, characters, story, chapter, match, comments, params, category, loading, auth, chapterNotFound, innerWidth }) => {
  const language = languages.find(l => l.code === story.language)
  return innerWidth >= 850 ?
    <SimpleBar style={{ height: '80vh' }}>
      <section className="story-details p-4">
        { !chapterNotFound ?
          !loading ? 
        <Fragment>
          <div className="upper-band flex as spb">
            <Link className="square-btn primary-btn outlined" to={`/story/${match.params.id}/`}>
              Back to story
            </Link>
            {auth.uid === chapter.authorId &&
              <Link className="square-btn primary-btn outlined" to={`/story/${story.id}/chapter/${chapter.id}/edit`}>
                Edit
              </Link>
            }
          </div>
          <hr/>
          <div className="chapter-content">
            <h3 className="text-center mb-4">{chapter && chapter.title}</h3>
            <div className="meta">
              <small>
                Posted on: <Moment format="YYYY-MM-DD, HH:mm">{new Date(chapter.createdAt)}</Moment>
              </small>
              <br/>
              <small className="meta-responsive">
                Author: <Link to={`/profile/${story.authorId}`}> {story.authorName}</Link>  / 
                Status: {story.status} / 
                Genre: <Link to={`/categories/${category && category.id}`}>{category && category.name}</Link> / 
                Rating: {story.rating} / 
                Language: {`${language && language.lang} (${language && language.code})`}
              </small>
            </div>
            <hr/>
              <p dangerouslySetInnerHTML={{__html: chapter && chapter.body}} className="body"></p>
          </div>
          <Ratings chapter={chapter} id={params.id} chapid={params.chapid}/>
          <nav className="chapter-nav flex spb ac frn mt-4">
            <Link className={`square-btn primary-btn outlined ${!previous ? 'hidden': null}`} to={`/story/${story.id}/chapter/${previous && previous.id}`}>Prev</Link>
            <Link className={`square-btn primary-btn outlined ${!next ? 'hidden': null}`} to={`/story/${story.id}/chapter/${next && next.id}`}>Next</Link>
          </nav>
          <hr/>
          <CharactersAndLocationsInChapter locations={chapter.locations} auth={auth} characters={chapter.characters}/>
          <hr/>
          {story.public && <Comments story={story} chapter={chapter} params={params} comments={comments}/>}
        </Fragment>: 
        <Squares/>:
        <ChapterNotFound link={`/story/${story.id}`}/>}
      </section>
    </SimpleBar>:
    <section className="story-details p-4">
      {!chapterNotFound ?
        !loading ?
          <Fragment>
            <div className="upper-band flex as spb">
              <Link className="square-btn primary-btn outlined" to={`/story/${match.params.id}/`}>
                Back to story
            </Link>
              {auth.uid === chapter.authorId &&
                <Link className="square-btn primary-btn outlined" to={`/story/${story.id}/chapter/${chapter.id}/edit`}>
                  Edit
              </Link>
              }
            </div>
            <hr />
            <div className="chapter-content">
              <h3 className="text-center mb-4">{chapter && chapter.title}</h3>
              <div className="meta">
                <small>
                  Posted on: <Moment format="YYYY-MM-DD, HH:mm">{new Date(chapter.createdAt)}</Moment>
                </small>
                <br />
                <small className="meta-responsive">
                  Author: <Link to={`/profile/${story.authorId}`}> {story.authorName}</Link>  /
                Status: {story.status} /
                Genre: <Link to={`/categories/${category && category.id}`}>{category && category.name}</Link> /
                Rating: {story.rating} /
                Language: {`${language && language.lang} (${language && language.code})`}
                </small>
              </div>
              <hr />
              <p dangerouslySetInnerHTML={{ __html: chapter && chapter.body }} className="body"></p>
            </div>
            <Ratings chapter={chapter} id={params.id} chapid={params.chapid} />
            <nav className="chapter-nav flex spb ac frn mt-4">
              <Link className={`square-btn primary-btn outlined ${!previous ? 'hidden' : null}`} to={`/story/${story.id}/chapter/${previous && previous.id}`}>Prev</Link>
              <Link className={`square-btn primary-btn outlined ${!next ? 'hidden' : null}`} to={`/story/${story.id}/chapter/${next && next.id}`}>Next</Link>
            </nav>
            <hr />
            <CharactersAndLocationsInChapter locations={chapter.locations} auth={auth} characters={chapter.characters} />
            <hr />
            {story.public && <Comments story={story} chapter={chapter} params={params} comments={comments} />}
          </Fragment> :
          <Squares /> :
        <ChapterNotFound link={`/story/${story.id}`} />}
    </section>
}

export default ChapterDetails
