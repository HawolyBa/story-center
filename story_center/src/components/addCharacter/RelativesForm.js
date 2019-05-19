import React from 'react'
import { Button, FormGroup, Label, Row, Col } from 'reactstrap'

const RelativesForm = props => {
  const { characters, onRelationChange, id, relative, onChangeSelect, remove } = props
  return (
    <Row className="ac">
      <Col md="5">
        <FormGroup>
          <Label for="relatives">Select</Label>
          <div className="select">
            <select value={relative && relative.id} name="relatives" id={`relatives-${id}`} onChange={onChangeSelect}>
              <option hidden>Choose...</option>
            { characters && characters.map(character => (
              <option key={character.id} value={character.id}>{character.firstname} {character.lastname}</option>
            )) }
            </select>
          </div>
        </FormGroup>
      </Col>
      <Col md="5">
        <FormGroup>
          <Label for="relation">Relation</Label>
          <input defaultValue={relative && relative.relation} type="text" name="relation" id={`relation-${id}`} onInput={onRelationChange} />
        </FormGroup>
      </Col>
      <Col md="2">
        <Button className="custom-btn danger-btn" id={id} onClick={remove} size="sm">Delete</Button>
      </Col>
    </Row>
  )
}

export default RelativesForm

