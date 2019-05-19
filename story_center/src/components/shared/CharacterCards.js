import React from 'react'
import { Row } from 'reactstrap'
import CharacterCard from './CharacterCard'

const CharacterCards = ({ characters, type, auth }) => {
  return (
    <Row>
      { characters.map((chara, i) => (
        <CharacterCard auth={auth} type={type} key={i} character={chara}/>
      )) }
    </Row>
  )
}

export default CharacterCards
