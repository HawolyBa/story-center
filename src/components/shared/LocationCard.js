import React, { Component } from 'react'
import { Col, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { defaultLocationImage } from '../default/defaultImages'

class LocationCard extends Component {

  state = {
    modal: false,
  }

  toggle = (id) => {
    this.setState({
      modal: !this.state.modal,
      checked: false,
      currentLocation: this.props.location
    });
  }

  render() {
    const { location, lg, md, xs } = this.props
    const { currentLocation, modal } = this.state
    return (
      <React.Fragment>
        <Modal isOpen={modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>{currentLocation && currentLocation.name}</ModalHeader>
          <ModalBody>
            <img className="modal-image" src={currentLocation && currentLocation.image ? currentLocation.image : defaultLocationImage} alt={currentLocation && currentLocation.name} />
            <hr />
            <p>Description: {currentLocation && currentLocation.description}</p>
          </ModalBody>
          <ModalFooter>
            <small>Image copyright: {currentLocation && currentLocation.imageCopyright}</small>
          </ModalFooter>
        </Modal>
        <Col lg={lg} md={md} xs={xs} onClick={this.toggle}>
          <figure className="item-card location-card">
            <div className="image" >
              <div className="inner-image" style={{ background: `url(${location.image ? location.image : defaultLocationImage}) no-repeat center / cover` }} id={location.id} />
            </div>
            <figcaption>
              <h4>{location.name}</h4>
            </figcaption>
          </figure>
        </Col>
      </React.Fragment>
    )
  }
}

export default LocationCard
