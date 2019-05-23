import React, { Component, Fragment } from 'react'
import { Form, Label, FormGroup, Modal, Button, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firestoreConnect } from 'react-redux-firebase'
import { addLocation } from '../../redux/actions/storyActions'

import FlashMessage from './FlashMessage'

class AddLocation extends Component {

  state = {
    modal:false,
    image: '',
    info: {
      storyId: this.props.currentId ? this.props.currentId: '',
      name: '',
      description: ''
    }
  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal,
      checked: false
    });
  }

  onSubmit = e => {
    e.preventDefault()
    this.props.addLocation(this.state.info, this.state.image)
    this.setState({
      modal: false,
      info: {
        storyId: this.props.currentId ? this.props.currentId: ''
      },
      image: ''
    });
  }

  handleImageChange = e => {
    const image = e.target.files[0]
    if (image.name.includes('jpg') || image.name.includes('png') || image.name.includes('jpeg')) {
      this.setState({ image })
    } else {
      this.setState({ flash: true, message: 'Invalid image format', alert: 'danger' })
      setTimeout(() => this.setState({ flash: false }), 3000)
    }
  }

  onChange = e => {
    this.setState({ info: {...this.state.info, [e.target.name]: e.target.value} })
  }

  triggerClick = () => {
    document.getElementById('photo').click()
  }

  render() {
    const { stories, currentId } = this.props
    return (
      <Fragment>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Add new location</ModalHeader>
            <Form onSubmit={this.onSubmit}>
              <ModalBody>
                <FormGroup>
                  <div className="select">
                    <select value={currentId && currentId} name="storyId" onChange={this.onChange}>
                      <option hidden>Choose a story...</option>
                      { stories && stories.map(story => (
                        <option key={story.id} value={story.id}>{story.title}</option>
                      ))}
                    </select>
                  </div>
                </FormGroup>
                <FormGroup>
                  <Label>Location Name</Label>
                  <input onInput={this.onChange} name="name" type="text"/>
                </FormGroup>
                <FormGroup>
                  <Label>Location Description</Label>
                  <textarea onInput={this.onChange} name="description"></textarea>
                </FormGroup>
                <FormGroup>
                  <div className="image-upload">
                    <Label for="photo">Add a photo</Label>
                    <div className="thumb" onClick={this.triggerClick}>
                      <span>+</span>
                      <input hidden type={'file'} id="photo" onChange={this.handleImageChange} name={'photo'} />
                    </div>
                  </div>
                </FormGroup>
              </ModalBody>
              <ModalFooter>
                <Button>Submit</Button>
              </ModalFooter>
            </Form>
        </Modal>
        <span className="add-location-btn" onClick={this.toggle}> Add a new location</span>
        <FlashMessage flash={this.state.flash} message={this.state.message} alert={this.state.alert}/>
      </Fragment>
    )
  }
}

const mapStateToProps = state => {
  const stories = state.firestore.ordered.stories
  const userId = state.firebase.auth.uid
  const userStories = stories && stories.filter(story => story.authorId === userId)
  return {
    stories: userStories,
    loading: state.UI.loading
  }
}

export default compose(connect(mapStateToProps, { addLocation }), firestoreConnect([ { collection: 'stories' } ]))(AddLocation)
