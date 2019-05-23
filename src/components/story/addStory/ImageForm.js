import React from 'react'
import { FormGroup, Col, Row, Label, FormText } from 'reactstrap'
import CustomTooltip from '../../hoc/CustomTooltip'

const imageForm = ({ triggerClick, thumb, filename, addBanner, errors, imageCopyright, onSelect, setImage, searchImages }) => {
  return (
    <React.Fragment>
      <Row className="afe">
        <Col md="4">
          <FormGroup>
            <Label>Add your own illustration <i>(optional)</i></Label>
            <div className="thumb" onClick={triggerClick}>
              {thumb ? <img src={thumb} alt={thumb} /> : filename ? filename : <span>+</span>}
              <input id="addImage" hidden type="file" name="banner" onChange={addBanner} />
            </div>
              { filename && <FormText color="muted">By adding your own illustration, you acknowledge that you own the rights to the image or have an authorization to use it.</FormText> }
          </FormGroup>
        </Col>
        <Col md={{ size: 4, offset: 4}}>
          <FormGroup>
            <Label>Image credit <i className="fas fa-info-circle" id="imageCopyright"></i></Label>
            <input defaultValue={imageCopyright} type='text' name='imageCopyright' onChange={onSelect}/>
            { errors && errors.imageCopyright && <p className="errors">{errors.imageCopyright}</p> }
            <CustomTooltip placement="top" target="imageCopyright">
              <small>
                Person who owns the rights to the image you want to upload<br/>
                (Required if you post a custom illustration)
              </small>
            </CustomTooltip>
          </FormGroup>
        </Col>
      </Row>
      <Row className="afe">
        <Col md="10" sm="9" xs="9">
          <FormGroup className="mb-0">
            <Label>Or choose a free image:</Label>
            <input onInput={setImage} type="text" name="searchImage"/>
          </FormGroup>
        </Col>
        <Col md="2">
          <button className="square-btn primary-btn outlined" onClick={searchImages}>Search</button>
        </Col>
      </Row>
    </React.Fragment>
  )
}

export default imageForm
