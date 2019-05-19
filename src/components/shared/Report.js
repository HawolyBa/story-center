import React, { Component } from 'react'
import { Form, Label, FormGroup, Modal, Button, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { report } from '../../redux/actions/profileActions'
import { connect } from 'react-redux';
import Upload from './Upload';

class Report extends Component {

  state = {
    modal: false,
    authorName: this.props.data.authorName || '',
    authorId: this.props.data.authorId || '',
    itemId: this.props.data.id,
    type: this.props.type,
    content: '',
    image: '',
    filename: ''
  }

  toggle = () => {
    this.setState({ modal: !this.state.modal })
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  onSubmit = e => {
    e.preventDefault()
    const {modal,filename,...remain} = this.state
    if (this.props.type === 'profile') {
      const { authorId, authorName,...remainprofile } = remain
      this.props.report(remainprofile)
    } else this.props.report(remain)
    this.toggle()
  }

  handleImageChange = e => {
    const image = e.target.files[0]
    if (image.name.includes('jpg') || image.name.includes('png') || image.name.includes('jpeg')) {
      this.setState({ image: image, filename: image.name })
    } else {
      this.setState({ flash: true, message: 'Invalid image format', alert: 'danger' })
      setTimeout(() => this.setState({ flash: false, message: '' }), 3000)
    }
  }

  render() {
    return (
      <React.Fragment>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Report your problem</ModalHeader>
            <Form onSubmit={this.onSubmit}>
              <ModalBody>
                { !this.props.auth.uid &&
                <React.Fragment>
                  <FormGroup>
                    <Label>Your name</Label>
                    <input type="text" name="username" onChange={this.onChange}/>
                  </FormGroup>
                  <FormGroup>
                    <Label>Your email</Label>
                    <input type="email" required name="email" onChange={this.onChange}/>
                  </FormGroup>
                </React.Fragment>
                }
                <FormGroup>
                  <Label>Describe your problem with this {this.props.type}</Label>
                  <textarea value={this.state.content} name="content" onChange={this.onChange}></textarea>
                </FormGroup>
                <Upload filename={this.state.filename} onChange={this.handleImageChange} name="image"/>
              </ModalBody>
              <ModalFooter>
                <Button>Submit</Button>
              </ModalFooter>
            </Form>
        </Modal>
        <div>
          <p className="report" onClick={this.toggle}><i className="fas fa-flag"></i> Report</p>
        </div>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({ auth: state.firebase.auth })


export default connect(mapStateToProps, { report })(Report)
