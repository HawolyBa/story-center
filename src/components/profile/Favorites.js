import React from 'react'
import {Link} from 'react-router-dom';
import { Row, Col } from 'reactstrap'
import CharacterCards from '../shared/CharacterCards'
import UsersCards from '../shared/UsersCards'

const Favorites = ({ favorites, auth }) => {
  return (
    <section className="favorites">
      <Row>
        <Col md="9">
          <div className="fav-characters">
            <h5 className="mb-3">{favorites.characters.length} Favorite characters</h5>
            <CharacterCards lg='3' md='4' xs='6' auth={auth} type={'favorites'} characters={favorites.characters}/>
          </div>
          <hr/>
          <div className="followings">
            <h5>{ favorites.followings.length } Favorite author{ favorites.followings.length > 1 ? 's':'' }</h5>
            <UsersCards type={'favorites'} users={favorites.followings} />
          </div>
        </Col>
        <div className="col-md-3 bg-white favstories">
          <h5>{ favorites.stories.length } favorite stories</h5>
          <table className="stories">
            <tbody>
              {favorites.stories.map(story => (
                <tr key={story.id}>
                  <td>{story.title} <br/>by {auth.uid && (auth.uid === story.authorId) ? 'you' : story.authorName}</td>
                  <td><Link className="story-name" to={`/story/${story.id}`}>Read</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Row>
    </section>
  )
}

export default Favorites
