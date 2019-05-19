import React from 'react'
import CharacterCards from '../../shared/CharacterCards'
import LocationsCards from '../../shared/LocationsCards'

const CharactersAndLocationsInChapter = ({ characters, locations, auth }) => {
  return (
    <div className="chapter-grid characters-grid">
      <h3>Characters in this chapter</h3>
      <CharacterCards type="chapter" characters={characters} auth={auth}/>
      <hr/>
      <h3>Locations in this chapter</h3>
      <LocationsCards locations={locations} />
    </div>
  )
}

export default CharactersAndLocationsInChapter
