import React from 'react'
import { FormGroup, Label } from 'reactstrap'

const Upload = ({ name, filename, onChange, thumb }) => {

  const triggerClick = () => {
    document.getElementById('photo').click()
  }

  return (
    <FormGroup>
      <Label>Add your own illustration:</Label>
      <div className="thumb" onClick={triggerClick}>
        {thumb ? <img src={thumb} alt={thumb} /> : filename ? filename : <span>+</span>}
        <input id="photo" hidden type="file" name={name} onChange={onChange} />
      </div>
    </FormGroup>
  )
}

export default Upload
