import React from 'react'
import { Link } from 'react-router-dom'
import StarRatings from 'react-star-ratings';
import { defaultAvatar } from '../default/defaultImages'
import Report from '../shared/Report';
import SimpleBar from 'simplebar-react';
import ImageModal from './ImageModal'

const CharacterDetails = ({ character, auth, changeRating, isFavorite, toggle, isOpen }) => {
  return (
    <React.Fragment>
      <ImageModal copyright={character.imageCopyright} isOpen={isOpen} toggle={toggle} name={`${character.firstname} ${character.lastname && character.lastname}`} image={character.image ? character.image: defaultAvatar}/>
      <section className="character-details">
        <div onClick={toggle} className="image" id="chara-image" style={{ background: `url(${character && character.image ? character.image: defaultAvatar}) no-repeat center / cover`}}>
          {!character.public && <span className="private-tag"><i className="fas fa-lock"></i></span>}
        </div>
        <SimpleBar data-simplebar-auto-hide="false" style={{ height: `calc(80vh - 400px)` }}>
          <div className="info">
            <h2 className="text-center">
              {character && character.firstname} {character && character.lastname && character.lastname}
            </h2>
            <p className="text-center mb-0 mt-0">By <Link className="secondary td-underline" to={`/profile/${character.authorId}`}>{character.authorName}</Link></p>
            <hr/>
            {(auth.uid === character.authorId || character.public) &&
              <div className="flex ac jc fc">
                <div className="favorite flex ac spb frn">
                  <StarRatings
                    rating={isFavorite ? 1 : 0}
                    starRatedColor="#27bab0"
                    changeRating={changeRating}
                    numberOfStars={1}
                    name='rating'
                    starDimension={'30px'}
                /> {isFavorite ? 'Remove from favorite' : 'Add to favorite' }
              </div>
              <small className="mt-2">{character.likesCount > 0 ? `${character.likesCount} people already like this character`: 'Be the first to like this character'} </small>
              </div>
            }
            <div className="bio">
              <p><span>Biography</span>: {character && character.description}</p>
            </div>
            <ul>
              <li>Nickname: {character && character.nickname}</li>
              <li>Age: {character && character.age ? character.age: 'Unknown'}</li>
              <li>Gender: {character && character.gender}</li>
              <li>Ethnicity: {character && character.ethnicity}</li>
              <li>Occupation: {character && character.occupation}</li>
              <li>Group: {character && character.group}</li>
              <li>Residence: {character && character.residence}</li>
              <li>Likes: {character && character.likes && character.likes.join(', ')}</li>
              <li>Dislikes: {character && character.dislikes && character.dislikes.join(', ')}</li>
            </ul>
            <Report type="character" data={character}/>
          </div>
        </SimpleBar>
      </section>
    </React.Fragment>
  )
}

export default CharacterDetails
