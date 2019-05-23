import React from 'react'
import { Row } from 'reactstrap'
import CharacterCard from './CharacterCard'

const CharacterCards = ({ characters, type, auth, lg, md, xs }) => {
  return (
    <Row>
      {characters.map((chara, i) => (
        <CharacterCard lg={lg} md={md} xs={xs} auth={auth} type={type} key={i} character={chara}/>
      )) }
    </Row>
  )
}

export default CharacterCards
