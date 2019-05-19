import React, { Fragment, useState } from 'react'

import LocationModal from '../shared/LocationModal'
import LocationCards from '../shared/LocationCards'
import DataByStory from '../shared/DataByStory'

const Locations = ({ id, locations, deleteLocation }) => {

  const [locationState, setLocationState] = useState({modal: false, currentLocation: '' })
  const [activeTab, setActiveTab] = useState('allLocations')

  const toggle = e => {
    setLocationState({ modal: !locationState.modal, currentLocation: locations.allLocations.filter(
      item => item.id === e.target.id
    )[0]})
  };

  const deleteLoc = id => {
    const confirm = window.confirm('Do you really want to delete this location ?')

    if (confirm) {
      deleteLocation(locationState.currentLocation.id, id)
      setLocationState({modal: false})
    }
  }

  const changeLocSubTab = tab => {
    setActiveTab(tab)
    const tabs = document.querySelectorAll(`.locSubTab`);

    tabs.forEach(tab => {
      tab.style.background = "white";
      tab.style.color = "#303030";
    })

    document.getElementById(tab).style.background = "#303030";
    document.getElementById(tab).style.color = "#fefefe";
  }

  return (
    <section className="locations">
      <nav className="profile-nav mb-5 flex frn ac jc">
        <span id="allLocations" className="mr-3 locSubTab" onClick={changeLocSubTab.bind(this, 'allLocations')}>
          All Locations
        </span>
        <span id="locationsByStory" className="locSubTab" onClick={changeLocSubTab.bind(this, 'locationsByStory')}>
          Locations by story
        </span>
      </nav>
      <LocationModal deleteLocation={deleteLoc} currentLocation={locationState.currentLocation} toggle={toggle} modal={locationState.modal} id={id} />
      { activeTab === 'allLocations' ? 
      <div id ="allLocations">
        <h5 className="mb-4">{locations.allLocations ? locations.allLocations.length : 0} location{locations && locations.allLocations.length > 1 ? 's': ''}</h5>
        <LocationCards locations={locations.allLocations} toggle={toggle} />
      </div>:
      <Fragment>
      { 
        locations.locByStory && locations.locByStory.map(loc => (
          <DataByStory key={loc.storyId} toggle={toggle} type="locations" data={loc}/>
        ))
      }
      </Fragment>
      }
    </section>
  )
}

export default Locations
