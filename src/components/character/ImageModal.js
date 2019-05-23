import React from 'react'
import { Modal, ModalBody, ModalFooter } from 'reactstrap'

const ImageModal = ({ isOpen, toggle, image, name, copyright }) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalBody>
        <center><img className="modal-image" src={image} alt={name}/></center>
      </ModalBody>
      <ModalFooter>
        Image: {name}<br/>
        Copyright: {copyright}
      </ModalFooter>
    </Modal>
  )
}

export default ImageModal