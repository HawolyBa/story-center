import React from 'react'
import { Form, Row, Col, Button, FormGroup, Label } from 'reactstrap'
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css'; 
import SimpleBar from 'simplebar-react';
import { Link } from 'react-router-dom'
import LocationsCards from '../../shared/LocationsCards';

const ChapterForm = ({ body, onSubmit, onChange, handleEditorChange, onSelect, charactersSelected, pathname, addCharacterToStory, match, locationsSelected, addLocations, onLocationSelect, charactersInSelect, locationsInSelect, chapter, removeFromCharacters, removeFromLocations, errors }) => {
  return (
    <SimpleBar style={{ height: '80vh' }}>
      <div className="edit-story add-story">
        <div className="upper-band flex as spb">
          {pathname.includes('edit') ? 
          <Link className="square-btn primary-btn outlined" to={`/story/${match.params.id}/chapter/${match.params.chapid}`}>
          Back to chapter
          </Link> 
          : 
          pathname.includes('add') ?
          <Link className="square-btn primary-btn outlined" to={`/story/${match.params.id}`}>
            Back to story
          </Link>: 
          null}
        </div>
        <hr/>
        <h2 className="text-center">{pathname.includes('add') ? 'Add a new chapter': 'Edit your chapter'}</h2>
        <Form>
          <FormGroup>
            <Row>
              <Col md="2">
                <Label>Number</Label>
                <input defaultValue={chapter ? chapter.number: ''} onInput={onChange} name="chap_number" type="number"/>
                { errors && errors.number && <p className="warning">{errors.number}</p> }
              </Col>
              <Col md="10">
                <Label>Enter a title</Label>
                <input defaultValue={chapter ? chapter.title : ''} type="text" onInput={onChange} name="title" />
                {errors && errors.title && <p className="warning">{errors.title}</p>}
              </Col>
            </Row>
          </FormGroup>
          <FormGroup>
            <ReactQuill value={body || ''} onChange={handleEditorChange} />
          </FormGroup>
          <Row>
            <Col md="6">
              <FormGroup>
                <Label>Add characters</Label>
                <Row className="ac">
                  <Col xs="9">
                    <div className="select">
                      <select onChange={onSelect} id="selectCharacter">
                        <option hidden>Choose...</option>
                        { charactersInSelect && charactersInSelect.map(char => (
                          <option value={char.id} key={char.id}>{`${char.firstname} ${char.lastname ? char.lastname: ''}`}</option>
                        )) }
                      </select>
                    </div>
                  </Col>
                  <Col xs="1">
                    <button onClick={addCharacterToStory} className="square-btn secondary-btn">Add</button>
                  </Col>
                </Row>
              </FormGroup>
              <table className="chosen">
                <tbody>
                  {charactersSelected && charactersSelected.map(chara => (
                    <tr key={chara.id}>
                      <td>
                        <Link to={`/character/${chara.id}`}>{`${chara.firstname} ${chara.lastname ? chara.lastname : ''}`}</Link>
                      </td>
                      <td><span className="circle delete" onClick={removeFromCharacters.bind(this, chara.id)}>&times;</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Col>
            <Col md="6">
              <FormGroup>
              <Label>Add location</Label>
              <Row className="ac">
                <Col xs="9">
                  <div className="select">
                    <select onChange={onLocationSelect} id="selectLocation">
                      <option hidden>Choose...</option>
                      { locationsInSelect && locationsInSelect.map(char => (
                        <option value={char.id} key={char.id}>{char.name}</option>
                      )) }
                    </select>
                  </div>
                </Col>
                <Col xs="1">
                  <button className="square-btn secondary-btn" onClick={addLocations}>Add</button>
                </Col>
              </Row>
            </FormGroup>
            <LocationsCards removeFromLocations={removeFromLocations} pathname={pathname} locations={locationsSelected}/> 
          </Col>
        </Row>
        <hr/>
          <Button onClick={onSubmit} className="mt-3 square-btn primary-btn">Submit</Button>
        </Form>
      </div>
    </SimpleBar>
  )
}

export default ChapterForm
