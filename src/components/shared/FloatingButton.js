import React, { Component } from 'react'
import { Modal, ModalHeader, ModalBody } from 'reactstrap'
import story from '../../images/story.png'
import mask from '../../images/mask.png'
import location from '../../images/location.png'
import { Link } from 'react-router-dom'
import NewLocation from './NewLocation'

class FloatingButton extends Component {

  state = {
    modal:false
  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal,
      checked: false
    });
  }

  render() {
    return (
      <div className="floating-add">
        <Modal isOpen={this.state.modal} toggle={this.toggle} className="modal-floating">
          <ModalHeader toggle={this.toggle}>What do you want to do ?</ModalHeader>
          <ModalBody>
            <div className="columns">
              <Link onClick={this.toggle} className="column" to={'/story/add'}>
                <img src={story} alt="story-icon"/>
                Add a story
              </Link>
              <div className="column">
                <img src={location} alt="location-icon"/>
                <NewLocation/>
              </div>
              <Link onClick={this.toggle} className="column" to={'/character/add'}>
                <img src={mask} alt="mask-icon"/>
                Add a charatcer
              </Link>
            </div>
          </ModalBody>
        </Modal>
        <div onClick={this.toggle} className="floating-btn">+</div>
      </div>
    )
  }
}

export default FloatingButton