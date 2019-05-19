import React from 'react'
import { Form, Col, Row, FormGroup, Label, FormText } from 'reactstrap'
import { Sentry } from 'react-activity';
import 'react-activity/lib/Sentry/Sentry.css';
import { defaultAvatar } from '../default/defaultImages'

import CharacterInput from './CharacterInput'
import RelativesForm from './RelativesForm';
import SwitchButton from '../shared/SwitchButton'
//{ filename }
const CharacterForm = ({ onChange, onSubmit, handleImageChange, addRelation, relatives, remove, onRelationChange, onChangeSelect, characters, checked, switched, character, description, characterRelatives, deleteCharacter, filename, loading, triggerClick }) => {
  return (
    <Form className="mt-4">
      <Row>
        <Col md="9">
        <FormGroup>
          <div className="thumb" onClick={triggerClick}>
            <img src={character && character.image ? character.image : defaultAvatar} alt=""/>
            <div className="image-upload">
              <input hidden type='file' id="photo" onChange={handleImageChange} name='photo' />
            </div>
          </div>
            {filename && <FormText color="muted">By adding your own illustration, you acknowledge that you own the rights to the image or have an authorization to use it.</FormText>}
        </FormGroup>
        </Col> 
        <Col md="3">
          <SwitchButton text={'Public character ?'} checked={checked} switched={switched} />
        </Col>
      </Row>
      <Row>
        <Col md="4">
          <CharacterInput defaultValue={character && character.firstname ? character.firstname: ''} name={'First Name'} type={'text'} onChange={onChange} />
        </Col>
        <Col md="4">
          <CharacterInput defaultValue={character && character.lastname ? character.lastname: ''} name={'Last Name'} type={'text'} onChange={onChange} />
        </Col>
        <Col md="4">
          <CharacterInput defaultValue={character && character.nickname? character.nickname: ''} name={'Nickname'} type={'text'} onChange={onChange} />
        </Col>
      </Row>
      <Row>
        <Col md="4">
          <CharacterInput defaultValue={character && character.age ? character.age: ''} name={'Age'} type={'number'} onChange={onChange} />
        </Col>
        <Col md="4">
          <CharacterInput defaultValue={character && character.gender ? character.gender: ''} name={'Gender'} type={'text'} onChange={onChange} />
        </Col>
        <Col md="4">
          <CharacterInput defaultValue={character && character.ethnicity ? character.ethnicity: ''} name={'Ethnicity'} type={'text'} onChange={onChange} />
        </Col>
      </Row>
      <Row>
        <Col md="4">
          <CharacterInput defaultValue={character && character.occupation ? character.occupation: ''} name={'Occupation'} type={'text'} onChange={onChange} />
        </Col>
        <Col md="4">
          <CharacterInput defaultValue={character && character.residence ? character.residence: ''} name={'Residence'} type={'text'} onChange={onChange} />
        </Col>
        <Col md="4">
          <CharacterInput defaultValue={character && character.group ? character.group: ''} name={'Group'} type={'text'} onChange={onChange}/>
        </Col>
      </Row>
      <Row>
        <Col md="6">
          <CharacterInput defaultValue={character && character.likes ? character.likes.join(', '): ''} name={'Likes'} type={'text'} onChange={onChange}/>
        </Col>
        <Col md="6">
          <CharacterInput defaultValue={character && character.dislikes ? character.dislikes.join(', '): ''} name={'Dislikes'} type={'text'} onChange={onChange}/>
        </Col>
      </Row>
        <FormGroup>
          <Label>Description</Label>
          <textarea value={description && description} type={'textarea'} onInput={onChange} name={'description'} ></textarea>
        </FormGroup>
      <Row>
        <Col md="2">
          <FormGroup>
            <p className="add-circle" onClick={addRelation}><i className="fas fa-plus-circle"></i> Add a new relation</p>
          </FormGroup>
        </Col>
      </Row>
      { relatives.map((el, i) => <RelativesForm characters={characters} key={i} onRelationChange={onRelationChange.bind(this, i)} onChangeSelect={onChangeSelect.bind(this, i)} remove={remove.bind(this, i)} /> ) }
      { characterRelatives && characterRelatives.map((rel, i) =>  <RelativesForm relative={rel} key={rel.id} id={i} characters={characters} onRelationChange={onRelationChange.bind(this, i)} onChangeSelect={onChangeSelect.bind(this, i)} remove={remove.bind(this, i)}/>) 
          }

          <hr/>
      <Row>
        <Col md="2">
          { loading ? <Sentry/>: <button className="custom-btn" onClick={onSubmit}>Submit</button> }
        </Col>
        <Col md={{ size: 2, order: 2, offset: 8 }}>
          {character && <button onClick={deleteCharacter} className="custom-btn danger-btn">Delete character</button>}
        </Col>
      </Row>
    </Form>
  )
}

export default CharacterForm
