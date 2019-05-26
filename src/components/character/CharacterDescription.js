import React from 'react'
import Relatives from './Relatives';
import CharaStories from './CharaStories';
import { Link } from 'react-router-dom'
import SimpleBar from 'simplebar-react';

const CharacterDescription = ({ charaAuthorId, id, auth, character }) => {
  return (
    <section className="character-description">
        <div className="chara-stories">
          {charaAuthorId === auth.uid ? <Link className="square-btn outlined" to={`/character/edit/${id}`}>Edit</Link>: null}
          <hr/>
          <CharaStories charaStories={character.stories} />
          <hr/>
          <Relatives auth={auth} characterRelatives={character.relatives}/>
        </div>
    </section>
  )
}

export default CharacterDescription
