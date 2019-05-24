import React from 'react'
import CharacterCards from '../../shared/CharacterCards'
import LocationCards from '../../shared/LocationCards'

const CharactersAndLocationsInChapter = ({ characters, locations, auth }) => {
  const charactersList = characters.filter(char => (!auth && !char.public) || (auth && !char.public && auth.uid !== char.authorId) ? char.public : char)
  return (
    <div className="chapter-grid characters-grid">
      <h3>Characters in this chapter</h3>
      <CharacterCards lg="3" md="4" xs="6" type="chapter" characters={charactersList} auth={auth}/>
      <hr/>
      <h3>Locations in this chapter</h3>
      <LocationCards lg="3" md="4" xs="6" locations={locations} />
    </div>
  )
}

export default CharactersAndLocationsInChapter
