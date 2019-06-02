import React, { Fragment, useState } from 'react'

import LocationModal from '../shared/LocationModal'
import LocationCards from '../shared/LocationCards'
import DataByStory from '../shared/DataByStory'
import NewLocation from '../shared/NewLocation'

import styled, { keyframes } from 'styled-components';
import fadeIn from 'react-animations/lib/fadeIn'
const animation = keyframes`${fadeIn}`;
const AnimatedSection = styled.section`
  animation: 0.6s ${animation}
`;

const Locations = ({ id, locations, deleteLocation, type }) => {

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
    <AnimatedSection className="locations">
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
        <div className="flex frw spb ac mb-4">
          <h5>{locations.allLocations ? locations.allLocations.length : 0} location{locations && locations.allLocations.length > 1 ? 's': ''}</h5>
          {!id && <button className="custom-btn"><i className="fas fa-plus-circle"></i> <NewLocation /></button>}
        </div>
        {locations.allLocations.length > 0 ? 
          <LocationCards type={type} deleteLocation={deleteLocation} id={id} lg="2" md="3" xs="6" locations={locations.allLocations} toggle={toggle} />:
          <p>No location for the moment</p>
        }
      </div>:
      <Fragment>
      { 
        locations.locByStory.length > 0 ? locations.locByStory.map(loc => (
          <DataByStory comp={type} deleteLocation={deleteLocation} id={id} lg="2" md="3" xs="6" key={loc.id} toggle={toggle} type="locations" data={loc}/>
        )):
        <p>No location in your stories</p>
      }
      </Fragment>
      }
    </AnimatedSection>
  )
}

export default Locations
