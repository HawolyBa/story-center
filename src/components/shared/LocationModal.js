import React from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { Link } from 'react-router-dom'
import { defaultLocationImage } from '../default/defaultImages'

const LocationModal = ({deleteLocation, currentLocation, toggle, modal,id}) => {
  return (
    <Modal isOpen={modal} toggle={toggle}>
      <ModalHeader toggle={toggle}>{currentLocation && currentLocation.name}</ModalHeader>
      <ModalBody>
        <img className="modal-image" src={currentLocation && currentLocation.image ? currentLocation.image: defaultLocationImage} alt={currentLocation && currentLocation.name}/>
        <hr/>
        <p>Description: {currentLocation && currentLocation.description}</p>
        <p>Story: <Link to={`/story/${currentLocation && currentLocation.storyId}`}>{currentLocation && currentLocation.storyTitle}</Link></p>
      </ModalBody>
      <ModalFooter>
        <small>Image copyright: {currentLocation && currentLocation.imageCopyright}</small>
        {!id &&
          <button className="danger-btn custom-btn ml-2" onClick={deleteLocation}>
            Delete
          </button>}
      </ModalFooter>
    </Modal>
  )
}

export default LocationModal
