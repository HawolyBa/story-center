import React, { Component } from 'react'
import { connect } from 'react-redux'
import { addFeedback } from '../../redux/actions/profileActions'
import { FormGroup, Label, ModalBody, Modal, ModalHeader } from 'reactstrap'
import satisfaction from '../../images/satisfaction.png'

class Feedback extends Component {

  state = {
    modal: false,
    content: '',
    userId: this.props.userId
  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  }

  onChange = e => this.setState({ content: e.target.value })

  onSubmit = e => {
    e.preventDefault()
    this.props.addFeedback(this.state.userId, this.state.content)
    this.setState({
      modal: false,
      content: '',
    });
  }

  render() {
    return (
      <div>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className="modal-floating">
          <ModalHeader toggle={this.toggle}>Send your feedback</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label>Feedback</Label>
              <textarea value={this.state.content} onChange={this.onChange}></textarea>
            </FormGroup>
            <button onClick={this.onSubmit} className="custom-btn">Submit</button>
          </ModalBody>
        </Modal>
        {this.props.type !== 'floating' ?
          <div className="column" onClick={this.toggle}>
            <img src={satisfaction} alt="feedback-icon" />
            <span className="add-location-btn"> Send feedback</span>
          </div>:
          <i onClick={this.toggle} className="fas fa-comment-dots"></i>
        }
      </div>
    )
  }
}

export default connect(null, { addFeedback })(Feedback)
