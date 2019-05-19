import React from 'react'
import { Form, FormGroup, Label, Row, Col } from 'reactstrap'
import { onlyUnique } from '../../utils/helpers'
import SwitchButton from '../shared/SwitchButton'
import { languages as languagesData } from '../story/addStory/metadatas'

const Filter = props => {
  const { stories, cat, onChange, onSubmit, path, purge, checked, switched } = props
  const languages = stories.map(story => story.language).filter(onlyUnique).map(lang => languagesData.find(l => l.code === lang))
  let categories = stories.map(story => story.category).filter(onlyUnique)
  categories = cat && cat.filter(c => categories.includes(c.id) )
  return (
    <section className="filter">
      <Form onSubmit={onSubmit}>
        <h3 className="mb-3">Filter your search</h3>
        <Row className="ac">
          {(path.includes('search') || path.includes('browse') || path.includes('tag'))  && 
          <Col md="5">
            <FormGroup>
              <Label>Categories</Label>
              <div className="select">
                <select onInput={onChange} name="chosenCategory">
                  <option hidden>Select...</option>
                { categories && categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                )) }
                </select>
              </div>
            </FormGroup>
          </Col>}
          <Col md="5">
            <FormGroup>
              <Label>Languages</Label>
              <div className="select">
                <select onInput={onChange} name="chosenLanguage">
                  <option hidden>Select...</option>
                { languages && languages.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.lang}</option>
                )) }
                </select>
              </div>
            </FormGroup>
          </Col>
          <Col md="2">
            <FormGroup className="switch-group">
              <div className="flex ac fc jc">
                <Label>Mature content ?</Label>
                <SwitchButton checked={checked} switched={switched}/>
              </div>
            </FormGroup>
          </Col>
        </Row>
        <FormGroup className="flex fs ac frn btn-group">
          <button className="square-btn outlined mr-3">Filter</button>
          <button className="square-btn outlined" onClick={purge}>Purge</button>
        </FormGroup>
      </Form>
    </section>
  )
}

export default Filter
