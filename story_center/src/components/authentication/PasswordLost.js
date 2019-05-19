import React from 'react'
import { Modal, ModalHeader, ModalBody, Button, Input, FormGroup, Form, Alert } from 'reactstrap'

const PasswordLost = ({ isOpen, toggleModal, alerts, resetPassword }) => {
  return (
    <Modal isOpen={isOpen} toggle={toggleModal}>
      <ModalHeader toggle={toggleModal}>Reset your password</ModalHeader>
      <ModalBody>
        <Form onSubmit={resetPassword}>
          <FormGroup>
            <Input type="text" name="email" placeholder="Entre your email address" />
          </FormGroup>
          <Button>Submit</Button>
        </Form>
        { alerts.message && <Alert color={alerts.alert}>{ alerts.message }</Alert>  }
      </ModalBody>
    </Modal>
  )
}

export default PasswordLost
