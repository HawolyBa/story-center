import React, { Component } from 'react'
import { Modal, ModalHeader, ModalBody } from 'reactstrap'
import { defaultLocationImage } from '../default/defaultImages'

import LocationCards from './LocationCards'

class LocationsCards extends Component {

  state = {
    modal: false,
  }

  toggle = (id) => {
    this.setState({
      modal: !this.state.modal,
      checked: false,
      currentLocation: this.props.locations.find(item => item.id === id )
    });
  }

  render() {
    const { modal, currentLocation } = this.state
    const { locations, pathname, removeFromLocations } = this.props
    return (
      <div className="locations-cards locations">
        <Modal isOpen={modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>{currentLocation && currentLocation.name}</ModalHeader>
          <ModalBody>
            <img className="modal-image" src={currentLocation && currentLocation.image ? currentLocation.image: defaultLocationImage} alt={currentLocation && currentLocation.name}/>
            <hr/>
            <p>Description: {currentLocation && currentLocation.description}</p>
          </ModalBody>
        </Modal>
        { (pathname && pathname.includes('add')) || (pathname && pathname.includes('edit')) ?
          <table className="chosen">
            <tbody>
              {locations && locations.map(loca => (
                <tr key={loca.id}>
                  <td onClick={this.toggle} id={loca.id}>
                    {loca.name}
                  </td>
                  <td><span className="circle delete" onClick={removeFromLocations.bind(this, loca.id)}>&times;</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>: 
          <LocationCards locations={locations} toggle={this.toggle} />}
      </div>
    )
  }
}

export default LocationsCards
