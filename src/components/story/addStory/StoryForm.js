import React from 'react'
import { FormGroup, Col, Row, Label, FormText } from 'reactstrap'
import SwitchButton from '../../shared/SwitchButton'

const StoryForm = ({ categories, errors, onSelect, languages, copyrights, tagsChange, checked, switched, mature, turnMature, title, language, category, copyright, summary, tags, status, type, statuses }) => {
  return (
    <React.Fragment>
      <Row>
        <Col md="12">
          <FormGroup>
            <Label>Story title</Label>
            <input defaultValue={title} type="text" name="title" onInput={onSelect}/>
            { errors && errors.title && <p className="errors">{errors.title}</p> }
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={type === "edit" ? 3: 4}>
          <FormGroup>
            <Label>Language</Label>
            <div className="select">
              <select value={language} type="select" onChange={onSelect} name="language">
                <option hidden>Choose...</option>
                { languages.map((lang, i) => (
                  <option key={i} value={lang.code}>{lang.lang}</option>
                ))}
              </select>
            </div>
            { errors && errors.language && <p className="errors">{errors.language}</p> }
          </FormGroup>
        </Col>
        <Col md={type === "edit" ? 3: 4}>
          <FormGroup>
            <Label>Category</Label>
            <div className="select">
              <select value={category} type="select" onChange={onSelect} name="category">
                <option hidden>Choose...</option>
                { categories && categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            { errors && errors.category && <p className="errors">{errors.category}</p> }
          </FormGroup>
        </Col>
        <Col md={type === "edit" ? 3: 4}>
          <FormGroup>
            <Label>Copyright</Label>
            <div className="select">
              <select value={copyright} type="select" onChange={onSelect} name="copyright">
                <option hidden>Choose...</option>
                { copyrights.map((copy, i) => (
                  <option key={i} value={copy}>{copy}</option>
                ))}
              </select>
            </div>
            { errors && errors.copyright && <p className="errors">{errors.copyright}</p> }
          </FormGroup>
        </Col>
        { type === "edit" && 
        <Col md="3">
          <FormGroup>
            <Label>Status</Label>
            <div className="select">
              <select value={status} type="select" onChange={onSelect} name="status">
                <option hidden>Choose...</option>
                { statuses.map((s, i) => (
                  <option key={i} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>
          </FormGroup>
        </Col>
        }
      </Row>
      <FormGroup>
        <Label>Summary</Label>
        <textarea value={summary} name="summary" onChange={onSelect}></textarea>
      </FormGroup>
      <FormGroup>
        <Label>Tags</Label>
        <input defaultValue={tags ? decodeURIComponent(tags.join(', ')): ''} type="text" name="tags" onInput={tagsChange}/>
        <FormText color="muted">Add tags separated with commas.</FormText>
      </FormGroup>
      <Row>
        <Col md="6">
          <FormGroup>
            <SwitchButton text={'Public story ?'} checked={ checked } switched={switched} />
          </FormGroup>
        </Col>
        <Col md="6">
          <FormGroup>
            <SwitchButton text={'Mature content ?'} checked={ mature || false } switched={turnMature} />
          </FormGroup>
        </Col>
      </Row>
    </React.Fragment>
  )
}

export default StoryForm
