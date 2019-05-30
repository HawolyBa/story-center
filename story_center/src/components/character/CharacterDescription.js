import React from 'react'
import Relatives from './Relatives';
import CharaStories from './CharaStories';
import { Link } from 'react-router-dom'
import SimpleBar from 'simplebar-react';

const CharacterDescription = ({ charaAuthorId, id, auth, character }) => {
  return (
    <section className="character-description">
      <SimpleBar style={{ height: '80vh' }}>
        <div className="chara-stories">
          {charaAuthorId === auth.uid ? <Link className="square-btn outlined" to={`/character/edit/${id}`}><i className="far fa-edit"></i> Edit</Link>: null}
          <hr/>
          <CharaStories charaStories={character.stories} />
          <hr/>
          <Relatives auth={auth} characterRelatives={character.relatives}/>
        </div>
      </SimpleBar>
    </section>
  )
}

export default CharacterDescription
