import React from 'react'
import { defaultAvatar } from '../default/defaultImages'
import { Link } from 'react-router-dom'
import StarRatings from 'react-star-ratings';
import Report from '../shared/Report';
import Relatives from './Relatives';
import CharaStories from './CharaStories';
import ImageModal from './ImageModal'

const ResponsiveCharacter = ({ character, auth, isFavorite, changeRating, charaAuthorId, id, isOpen, toggle }) => {
  return (
    <React.Fragment>
      <ImageModal copyright={character.imageCopyright} isOpen={isOpen} toggle={toggle} name={`${character.firstname} ${character.lastname && character.lastname}`} image={character.image ? character.image: defaultAvatar}/>
      <div className="character-responsive">
        <section className="r-character-details">
          <header className="flex spa ac frn mb-2">
            <div className="flex fc ac jc">
              <div className="image mb-4" onClick={toggle}>
                <img className='c-pointer' src={character && character.image ? character.image : defaultAvatar} alt={character && character.firstname} />
              </div>
              {charaAuthorId === auth.uid ? <Link className="square-btn outlined mb-4" to={`/character/edit/${id}`}><i className="far fa-edit"></i> Edit</Link> : null}
              <Report type="character" data={character} />
            </div>
            <div className="title">
              <h2>{character && character.firstname} {character && character.lastname}</h2>
              <p className="text-center mb-0 mt-0">By: <Link className="secondary td-underline" to={`/profile/${character.authorId}`}>{character.authorName}</Link></p>
              <hr/>
              {(auth.uid === character.authorId || character.public) &&
                <div className="flex ac jc fc r-favorite">
                  <div className="favorite flex ac spb frn">
                    <StarRatings
                      rating={isFavorite ? 1 : 0}
                      starRatedColor="#27bab0"
                      changeRating={changeRating}
                      numberOfStars={1}
                      name='rating'
                      starDimension={'30px'}
                    /> Add to favorite
                  </div>
                  <small className="mt-2">{character.likesCount} people already like this character</small>
                </div>
              }
            </div>
          </header>
          <div className="info bg-white">
            <div className="flex spb fc frw">
              <div className="bio">
                <p><span>Biography</span>: {character && character.description}</p>
              </div>
              <hr/>
              <ul>
                <li><strong>Nickname</strong>: {character && character.nickname}</li>
                <li><strong>Age</strong>: {character && character.age ? character.age : 'Unknown'}</li>
                <li><strong>Gender</strong>: {character && character.gender}</li>
                <li><strong>Ethnicity</strong>: {character && character.ethnicity}</li>
                <li><strong>Occupation</strong>: {character && character.occupation}</li>
                <li><strong>Group</strong>: {character && character.group}</li>
                <li><strong>Residence</strong>: {character && character.group}</li>
                <li><strong>Likes</strong>: {character && character.likes && character.likes.join(', ')}</li>
                <li><strong>Dislikes</strong>: {character && character.dislikes && character.dislikes.join(', ')}</li>
              </ul>
            </div>
          </div>
        </section>
        <section className="character-description">
          <div className="chara-stories">
            <hr />
            <CharaStories charaStories={character.stories} />
            <hr />
            <Relatives auth={auth} characterRelatives={character.relatives} />
          </div>
        </section>
      </div>
    </React.Fragment>
  )
}

export default ResponsiveCharacter
