import React, {Fragment} from 'react'
import {Link} from 'react-router-dom'

const CharaStories = ({ charaStories }) => {
  return (
    <Fragment>
      <h3>Stories & chapters</h3>
      { charaStories.length > 0 ? charaStories.map(story => (
        <div className="rel-story" key={story.id}>
          <div className="story-details">
            <div className="story-title">
              <h4><span className='circle' style={{ backgroundColor: story.status ? story.status === 'Complete' ? 'red' : 'yellow' : 'black' }}></span>{story.title}</h4>
              <span className="story-status">{story.status}</span>
            </div>
            <Link className="button" to={`/story/${story.id}`}>Go to story</Link>
          </div>
          <hr/>
          <ul>
            { story.chapters.map((chap, i) => (
              <li key={i} className="chapter">
                <span>{chap.title}</span>
                <hr/>
                <Link to={`/story/${story.id}/chapter/${chap.id}`} className="button button-read">Read</Link>
              </li>
            )) }
          </ul>
        </div>
      )):
      <Fragment>
      <p>No stories for the moment</p>
      </Fragment> }
    </Fragment>
  )
}

export default CharaStories
