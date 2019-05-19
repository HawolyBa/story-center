import React, { Component } from 'react'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import { getCharacter, getUserCharacters, updateCharacter, deleteRelation, deleteCharacter } from '../../redux/actions/charactersActions'
import { cleanup } from '../../redux/actions/storyActions'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import CharacterForm from './CharacterForm'
import FlashMessage from '../shared/FlashMessage'
import NotFound from '../shared/NotFound';
import Loading from '../shared/Loading';
import Private from '../shared/Private';

class EditCharacter extends Component {

  state = {
    relatives: [],
    flash: false,
    message: '',
    alert: '',
    imageFormat: '',
    filename: 'Add a photo'
  }

  componentDidMount() {
    this.props.getCharacter(this.props.match.params.id)
    this.props.auth.uid && this.props.getUserCharacters(this.props.auth.uid)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if ((nextProps.character && nextProps.character.description !== prevState.description) && !prevState.hasOwnProperty('description')) {
      return {
        description: nextProps.character.description
      }
    } 

    if (nextProps.character.public && !prevState.hasOwnProperty('checked')) {
      return {
        checked: nextProps.character.public
      }
    } else return null
  }

  componentWillUnmount() {
    this.props.cleanup()
  }

  switched = e => {
    this.setState({ checked: !this.state.checked })
  } 

  handleImageChange = e => {
    const image = e.target.files[0]
    if (image.name.includes('jpg') || image.name.includes('png') || image.name.includes('jpeg')) {
      this.setState({ image: image, imageFormat: 'valid', filename: image.name })
    } else {
      this.setState({ flash: true, message: 'Invalid image format', alert: 'danger', imageFormat: 'invalid', image: null })
      setTimeout(() => this.setState({ flash: false }), 3000)
    }
  }

  addRelation = e => {
    e.preventDefault()
    this.setState(prevState => ({ relatives: [...prevState.relatives, '']}))
  } 

  onChangeSelect = (i, e) => {
    let relatives = [...this.state.relatives];
    relatives[i] = e.target.value !== undefined ? { ...relatives[i], character_id: e.target.value }: null;
    this.setState({ relatives });
  }

  onRelationChange = (i, e) => {
    let relatives = [...this.state.relatives];
    relatives[i] = { ...relatives[i], relation: e.target.value };
    this.setState({ relatives });
  }

  remove = (i, e)=> {
    let relatives = [...this.state.relatives];
    relatives.splice(i,1);
    this.setState({ relatives });
    this.props.deleteRelation(this.props.match.params.id, e.target.id, this.props.character.relatives)
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value.trim() })
  }

  onSubmit = e => {
    e.preventDefault()
    // Get current character id
    const id = this.props.match.params.id
    let { firstname, checked, message, flash, alert,imageFormat,...remain } = this.state
    firstname = firstname && firstname ? firstname: this.props.character.firstname
    // Relatives
    let concatRelatives = this.props.character && this.props.character.relatives ? this.props.character.relatives : []
    remain.relatives.map(rel => remain.relatives.length > 0 ? concatRelatives = [...concatRelatives, rel]: null)
    remain.relatives = concatRelatives
    // Likes
    remain.likes = remain.likes ? remain.likes.split(',').map(l => l.trim()): this.props.character.likes
    // Dislikes
    remain.dislikes = remain.dislikes ? remain.dislikes.split(',').map(l => l.trim()): this.props.character.dislikes
    // Public or private
    const publicCharacter = this.state.checked ? true: false
    // Image
    remain.image = remain.image && remain.image ? remain.image: null

    const characterData = { ...remain, firstname, public: publicCharacter }

    if (characterData.firstname !== '') {
      this.props.updateCharacter(id, characterData)
      this.setState({ relatives: [] })
    }
  }

  deleteCharacter = e => {
    e.preventDefault()
    const conf = window.confirm('Do you really want to delete this character ?')
    if (conf) {
      this.props.deleteCharacter(this.props.match.params.id, this.props.history)
    }
  }

  triggerClick = () => {
    document.getElementById('photo').click()
  }

  render() {
    return (
      <main className="inner-main">
        { !this.props.loading ? 
          !this.props.notFound ?
          (this.props.auth && this.props.character && this.props.character.authorId === this.props.auth.uid) || !this.props.auth ?
        <div className="add-story add-character">
          <h2 className="text-center">Add a new character</h2>
          <hr />
          <Link className="mb-3 square-btn outlined" to={`/character/${this.props.character && this.props.character.id}`}>Back to character</Link>
          <CharacterForm 
            triggerClick={this.triggerClick}
            filename={this.state.filename}
            deleteCharacter={this.deleteCharacter}
            characters={this.props.characters} 
            handleImageChange={this.handleImageChange} 
            onChange={this.onChange} 
            onSubmit={this.onSubmit}
            addRelation={this.addRelation}
            relatives={this.state.relatives}
            remove={this.remove}
            onRelationChange={this.onRelationChange}
            onChangeSelect={this.onChangeSelect}
            switched={this.switched}
            description={this.state.description}
            checked={this.state.checked ? this.state.checked: this.props.checked }
            character={this.props.character}
            characterRelatives={this.props.characterRelatives}
          />
          <FlashMessage flash={this.state.flash} id={this.props.match.params.id} message={this.state.message} alert={this.state.alert}/>
        </div>:
        <Private data={this.props.auth} type="Unauthorized" />:
        <NotFound />:
        <Loading />}
      </main>
    )  
  }
}

EditCharacter.defaultProps = {
  character: {},
  checked: false,
  characterRelatives: [],
  characters: []
}

EditCharacter.propTypes = {
  character: PropTypes.object.isRequired,
  characters: PropTypes.array.isRequired,
  characterRelatives: PropTypes.array.isRequired
}

const mapStateToProps = (state, ownProps) => {
  const id = ownProps.match.params.id
  const characters = state.characters.userCharacters && state.characters.userCharacters.filter(c => c.id !== id)
  const character = state.characters.character
  const relatives = character && character.relatives
  const relativesArr = relatives && relatives.map(rel => ({id: rel.character_id, character: characters[rel.character_id], relation: rel.relation}))
  return {
    character,
    characters,
    characterRelatives: relativesArr,
    auth: state.firebase.auth,
    loading: state.characters.loading,
    notFound: state.characters.notFound
  }
}

export default compose(connect(mapStateToProps, { getCharacter, getUserCharacters, updateCharacter, deleteRelation, deleteCharacter, cleanup }), firestoreConnect([ {collection: 'characters'} ]))(EditCharacter)