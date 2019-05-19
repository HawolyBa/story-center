import React from 'react'
import { Row } from 'reactstrap'

import CharacterCard from '../shared/CharacterCard'

const PopularCharacters = ({ popularCharacters }) => {
  return (
    <div className="popular-characters">
      <h2 className="mb-4">Popular characters</h2>
      <Row>
        {popularCharacters.map(char => (
          <CharacterCard type='home' key={char.id} character={char}/>
        ))}
      </Row>
    </div>
  )
}

export default PopularCharacters
