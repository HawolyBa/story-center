import React from 'react'
import CharacterCards from '../../shared/CharacterCards'
import LocationCards from '../../shared/LocationCards'

const CharactersAndLocationsInChapter = ({ characters, locations, auth }) => {
  const charactersList = characters.filter(char => (!auth && !char.public) || (auth && !char.public && auth.uid !== char.authorId) ? char.public : char)
  return (
    <div className="chapter-grid characters-grid">
      <h3 className="mb-3">Characters in this chapter</h3>
      <CharacterCards lg="2" md="3" xs="4" type="chapter" characters={charactersList} auth={auth}/>
      <hr/>
      <h3 className="mb-3">Locations in this chapter</h3>
      <LocationCards lg="2" md="3" xs="4" locations={locations} />
    </div>
  )
}

export default CharactersAndLocationsInChapter
