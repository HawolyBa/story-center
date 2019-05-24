import React from 'react'
import { Form, Col, Row, FormGroup, Label, FormText } from 'reactstrap'
import { Sentry } from 'react-activity';
import 'react-activity/lib/Sentry/Sentry.css';
import { defaultAvatar } from '../default/defaultImages'

import CharacterInput from './CharacterInput'
import RelativesForm from './RelativesForm';
import SwitchButton from '../shared/SwitchButton'
import CustomTooltip from '../hoc/CustomTooltip'
//{ filename }
const CharacterForm = ({ onChange, onSubmit, handleImageChange, addRelation, relatives, remove, onRelationChange, onChangeSelect, characters, checked, switched, character, description, characterRelatives, deleteCharacter, filename, loading, triggerClick, errors, image }) => {

  return (
    <Form className="mt-4">
      <Row>
        <Col md="9">
        <FormGroup>
          <Label>Illustration <i className="fas fa-info-circle" id="illustration"></i></Label>
          <div className="thumb" onClick={triggerClick}>
              {filename ? filename: <img src={image ? image : defaultAvatar} alt=""/>}
            <div className="image-upload">
              <input hidden type='file' id="photo" onChange={handleImageChange} name='photo' />
            </div>
          </div>
          {filename && <FormText color="muted">By adding your own illustration, you acknowledge that you own the rights to the image or have an authorization to use it.</FormText>}
          <CustomTooltip placement="top" target="illustration">
            <small>
              <strong>Minimum width</strong>: 300px<br />
              <strong>Maximum width</strong>: 1200px<br />
              <strong>Minimum height</strong>: 200px<br />
              <strong>Maximum height</strong>: 1200px
            </small>
          </CustomTooltip>
        </FormGroup>
        </Col> 
        <Col md="3">
          <SwitchButton text={'Public character ?'} checked={checked} switched={switched} />
        </Col>
      </Row>
      <Row>
        <Col md="4">
          <FormGroup>
            <Label>Image copyright</Label>
            <input defaultValue={character && character.imageCopyright ? character.imageCopyright: ''} type="text" name="imageCopyright" onChange={onChange} />
            {errors && errors.imageCopyright && <p className="warning">{errors.imageCopyright}</p>}
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md="4">
          <CharacterInput errors={errors} defaultValue={character && character.firstname ? character.firstname: ''} name={'First Name'} type={'text'} onChange={onChange} />
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
          <CharacterInput defaultValue={character && character.likes ? character.likes: ''} name={'Likes'} type={'text'} onChange={onChange}/>
        </Col>
        <Col md="6">
          <CharacterInput defaultValue={character && character.dislikes ? character.dislikes: ''} name={'Dislikes'} type={'text'} onChange={onChange}/>
        </Col>
      </Row>
        <FormGroup>
          <Label>Description</Label>
          <textarea value={description && description} type={'textarea'} onChange={onChange} name={'description'} ></textarea>
        </FormGroup>
      <Row>
        <Col md="2">
          <FormGroup>
            <p className="add-circle" onClick={addRelation}><i className="fas fa-plus-circle"></i> Add a new relation</p>
          </FormGroup>
        </Col>
      </Row>
      { relatives && relatives.map((rel, i) => (
      <RelativesForm
        characters={characters}
        key={i}
        onRelationChange={onRelationChange.bind(this, i)}
        remove={remove.bind(this, i)}
        id={i}
        relative={rel}
        onChangeSelect={onChangeSelect.bind(this, i)}
      />))}
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
