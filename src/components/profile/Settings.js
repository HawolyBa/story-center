import React from 'react'
import { Form, Button, Label, FormGroup, Row, Col, FormText } from 'reactstrap'

const Settings = ({ user, onChange, onSubmit, deleteAccount, checked, switched, onChangeBio, charactersLeft, bio }) => {
  return (
    <section className="settings bg-white">
      <h5 className="mb-4">Settings</h5>
      <Form>
        <FormGroup>
          <Label>Username</Label>
          <input defaultValue={user && user.username} onInput={onChange} type="text" name="username" id="username"/>
        </FormGroup>
        <FormGroup>
          <Label>Biography</Label>
          <textarea maxLength="240" value={bio} name="biography" id="biography" onChange={onChangeBio}></textarea>
          <FormText className="ta-right">{charactersLeft}/240 characters left</FormText>
        </FormGroup>
        <Row>
          <Col md="4">
            <FormGroup>
              <Label>Facebook link</Label>
              <input defaultValue={user && user.facebook} type="text" name="facebook" id="facebook" onInput={onChange}/>
            </FormGroup>
          </Col>
          <Col md="4">
            <FormGroup>
              <Label>Twitter link</Label>
              <input defaultValue={user && user.twitter} type="text" name="twitter" id="twitter" onInput={onChange}/>
            </FormGroup>
          </Col>
          <Col md="4">
            <FormGroup>
              <Label>Instagram link</Label>
              <input defaultValue={user && user.instagram} type="text" name="instagram" id="instagram" onInput={onChange}/>
            </FormGroup>
          </Col>
        </Row>
        <FormGroup>
          <Label>Actual password</Label>
          <input onInput={onChange} type="password" name="actualPassword" id="actualPassword"/>
        </FormGroup>
        <FormGroup>
          <Label>New password</Label>
          <input onInput={onChange} type="password" name="newPassword" id="newPassword"/>
        </FormGroup>
        <div className="button-group flex ac frw spb">
          <Button className="custom-btn" onClick={onSubmit}>Submit</Button>
          <Button className="custom-btn danger-btn" onClick={deleteAccount}>Delete account</Button>
        </div>
      </Form>
    </section>
  )
}

export default Settings
