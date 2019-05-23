import React, {useState} from 'react'
import CharacterCards from '../shared/CharacterCards'
import DataByStory from '../shared/DataByStory'

const Characters = ({ characters, auth }) => {

  const [activeTab, setActiveTab] = useState('allCharacters')

  const changeTab = tab => {
    setActiveTab(tab)
    const tabs = document.querySelectorAll(`.subTab`);

    tabs.forEach(tab => {
      tab.style.background = "white";
      tab.style.color = "#303030";
    })

    document.getElementById(tab).style.background = "#303030";
    document.getElementById(tab).style.color = "#fefefe";
  }

  return (
    <section className="characters">
      <nav className="profile-nav mb-5 flex ac jc frn">
        <span id="allCharacters" className="mr-3 subTab" onClick={changeTab.bind(this, 'allCharacters')}>All Characters</span>
        <span id="charactersByStory" className="subTab" onClick={changeTab.bind(this, 'charactersByStory')}>Characters by story</span>
      </nav>
      <div className="profile-cards">
      { activeTab === 'allCharacters' ?
      <div id="allCharacters">
        <h5>{characters.allCharacters.length} character{characters.allCharacters.length > 1 ? 's' : ''}</h5>
        <CharacterCards lg='2' md='3' xs='6' auth={auth} type='characters' characters={characters.allCharacters}/>
      </div>:
      activeTab === 'charactersByStory' ?
      <div className="chara-by-story">
      {characters && characters.charaByStory.map(chara => {
        return chara.characters && chara.characters.length > 0 ?
          <DataByStory lg='2' md='3' xs='6' auth={auth} key={chara.id} type="characters" data={chara}/>:
        null
      })}
      </div>:
        null}
      </div>
    </section>
  )
}

export default Characters
