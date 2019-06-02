import React from 'react'
import {Link} from 'react-router-dom';
import { Row, Col } from 'reactstrap'
import CharacterCards from '../shared/CharacterCards'
import UsersCards from '../shared/UsersCards'

import styled, { keyframes } from 'styled-components';
import fadeIn from 'react-animations/lib/fadeIn'
const animation = keyframes`${fadeIn}`;
const AnimatedSection = styled.section`
  animation: 0.6s ${animation}
`;

const Favorites = ({ favorites, auth, id }) => {
  const characters = id ? favorites.characters.filter(char => char.public) : favorites.characters
  return (
    <AnimatedSection className="favorites">
      <Row>
        <Col md="9">
          <div className="fav-characters">
            <h5 className="mb-3">{characters.length} Favorite characters</h5>
            {characters.length > 0 ?
              <CharacterCards lg='3' md='4' xs='6' auth={auth} type={'favorites'} characters={characters}/>:
              <p>No favorite character</p>
            }
          </div>
          <hr/>
          <div className="followings">
            <h5 className="mb-3">{ favorites.followings.length } Followed author{ favorites.followings.length > 1 ? 's':'' }</h5>
            {favorites.followings.length > 0 ? 
              <UsersCards type={'favorites'} users={favorites.followings} />:
              <p>No following</p>
            }
          </div>
        </Col>
        <div className="col-md-3 bg-white favstories">
          <h5>{ favorites.stories.length } favorite stories</h5>
          <table className="stories">
            <tbody>
              {favorites.stories.length > 0 ? favorites.stories.map(story => (
                <tr key={story.id}>
                  <td><i>{story.title}</i> <br/>by {auth.uid && (auth.uid === story.authorId) ? 'you' : story.authorName}</td>
                  <td><Link className="story-name" to={`/story/${story.id}`}>Read</Link></td>
                </tr>
              )):
              <tr>
                <td>No favorite story</td>
                <td></td>
              </tr>}
            </tbody>
          </table>
        </div>
      </Row>
    </AnimatedSection>
  )
}

export default Favorites
