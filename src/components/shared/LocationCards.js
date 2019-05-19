import React from 'react'
import { Row } from 'reactstrap'
import LocationCard from './LocationCard'

const LocationCards = ({ locations, toggle }) => {
  return (
    <Row>
      { locations.map(loc => (
        <LocationCard key={loc.id} toggle={toggle} location={loc}/>
      )) }
    </Row>
  )
}

export default LocationCards
