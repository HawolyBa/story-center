import React from 'react'
import { FormGroup, Label, FormText } from 'reactstrap'

const CharacterInput = ({ type, name, onChange, defaultValue }) => {
  return (
    <FormGroup>
      <Label>{name}</Label>
      <input defaultValue={defaultValue} type={type} onInput={onChange} name={name.split(' ').join('').toLowerCase()} />
      { name === 'Likes' || name === 'Dislikes'? <FormText>Enter each value separated by a comma</FormText>: null }
    </FormGroup>
  )
}

export default CharacterInput
