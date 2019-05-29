import React from 'react'
import { Row } from 'reactstrap'
import LocationCard from './LocationCard'

const LocationCards = ({ locations, toggle, lg, md, xs, type, deleteLocation }) => {
  return (
    <Row>
      { locations.map(loc => (
        <LocationCard deleteLocation={deleteLocation} type={type} key={loc.id} lg={lg} md={md} xs={xs} toggle={toggle} location={loc}/>
      )) }
    </Row>
  )
}

export default LocationCards
