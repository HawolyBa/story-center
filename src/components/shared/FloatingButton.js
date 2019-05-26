import React, { Component } from 'react'
import { Modal, ModalHeader, ModalBody } from 'reactstrap'
import story from '../../images/story.png'
import mask from '../../images/mask.png'
import location from '../../images/location.png'
import { Link } from 'react-router-dom'
import NewLocation from './NewLocation'
import Feedback from './Feedback'
import { siteName, slogan } from '../../config/keys'

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

  triggerClick = () => {
    document.getElementById('add-location-btn').click()
  }

  getWindowOptions = () => {
    const width = 500;
    const height = 350;
    const left = (window.innerWidth / 2) - (width / 2);
    const top = (window.innerHeight / 2) - (height / 2);

    return [
      'resizable,scrollbars,status',
      'height=' + height,
      'width=' + width,
      'left=' + left,
      'top=' + top,
    ].join();
  };

  render() {
    const text = encodeURIComponent(`${siteName} - ${slogan}`);
    const shareUrl = 'https://twitter.com/intent/tweet?url=' + location.href + '&text=' + text;
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
              <Link onClick={this.toggle} className="column" to={'/character/add'}>
                <img src={mask} alt="mask-icon"/>
<<<<<<< HEAD
                Add a charatcer
=======
                Add a character
>>>>>>> Fixed import issue
              </Link>
              <div className="column" onClick={this.triggerClick}>
                <img src={location} alt="location-icon" />
                <NewLocation />
              </div>
              <Feedback userId={this.props.userId} />
            </div>
          </ModalBody>
        </Modal>
        <div className="floating-btn-group">
          {this.props.userId && <div onClick={this.toggle} className="floating-btn">+</div>}
          <div onClick={() => window.open(shareUrl, 'ShareOnTwitter', this.getWindowOptions())} className="floating-btn floating-twitter"><i className="fab fa-twitter"></i></div>
          <div className="floating-btn floating-facebook"><i className="fab fa-facebook"></i></div>
        </div>
      </div>
    )
  }
}

export default FloatingButton