import React, { Component } from 'react'
import { Col, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { defaultLocationImage } from '../default/defaultImages'
import { Link } from 'react-router-dom'

import styled, { keyframes } from 'styled-components';
import zoomIn from 'react-animations/lib/zoomIn'
const animation = keyframes`${zoomIn}`;
const AnimatedDiv = styled.figure`
  animation: 0.6s ${animation}
`;
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
    const { location, lg, md, xs, type, deleteLocation } = this.props
    const { currentLocation, modal } = this.state
    return (
      <React.Fragment>
        <Modal isOpen={modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>{currentLocation && currentLocation.name}</ModalHeader>
          <ModalBody>
            <img className="modal-image" src={currentLocation && currentLocation.image ? currentLocation.image : defaultLocationImage} alt={currentLocation && currentLocation.name} />
            <hr />
            <p>Description: {currentLocation && currentLocation.description}</p>
            { (type === 'public' || type === 'private') &&
              <p>Story: <Link className="td-underline" to={`/story/${currentLocation && currentLocation.storyId}`}>{currentLocation && currentLocation.storyTitle}</Link></p>
            }
            <small>Image copyright: {currentLocation && currentLocation.imageCopyright}</small><br />
          </ModalBody>
          {type === 'private' &&
          <ModalFooter>
            <button onClick={deleteLocation.bind(this, currentLocation && currentLocation.id)} className="custom-btn danger-btn">Delete location</button>
          </ModalFooter>
          }
        </Modal>
        <Col lg={lg} md={md} xs={xs} onClick={this.toggle}>
          <AnimatedDiv className="item-card location-card">
            <div className="image" >
              <div className="inner-image" style={{ background: `url(${location.image ? location.image : defaultLocationImage}) no-repeat center / cover` }} id={location.id} />
            </div>
            <figcaption>
              <h4>{location.name}</h4>
            </figcaption>
          </AnimatedDiv>
        </Col>
      </React.Fragment>
    )
  }
}

export default LocationCard
