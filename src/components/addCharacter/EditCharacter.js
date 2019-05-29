import React, { Component } from 'react'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import { getCharacter, getUserCharacters, updateCharacter, deleteRelation, deleteCharacter } from '../../redux/actions/charactersActions'
import { setProgressBar } from '../../redux/actions/profileActions'
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
    filename: '',
    checked: false
  }

  componentDidMount() {
    this.props.getCharacter(this.props.match.params.id)
    this.props.auth.uid && this.props.getUserCharacters(this.props.auth.uid)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.character !== this.props.character) {
      const { relatives, image, authorName, authorId, createdAt, id, stories, ...remain } = nextProps.character
      this.setState({ ...remain, checked: nextProps.character.public, relatives: nextProps.character.relatives.map(rel => ({ character_id: rel.character_id, relation: rel.relation })), likes: nextProps.character.likes.join(', '), dislikes: nextProps.character.dislikes.join(', ') })
    }

    if (this.props.loading !== nextProps.loading) {
      const open = nextProps.loading === false ? '' : 'OPEN'
      this.props.setProgressBar(open)
    }
  }

  componentWillUnmount() {
    this.props.cleanup()
  }

  switched = e => {
    this.setState({ checked: !this.state.checked })
  } 

  // RELATION 
  addRelation = e => {
    e.preventDefault()
    this.setState(prevState => ({ relatives: [...prevState.relatives, {character_id: '', relation: ''}]}))
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
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }
 
  // SUBMIT THE FORM
  onSubmit = e => {
    e.preventDefault()
    // Get current character id
    const id = this.props.match.params.id
    let { checked, message, flash, alert,imageFormat,filename,...remain } = this.state
   
    // Likes
    remain.likes = remain.likes ? remain.likes.split(',').map(l => l.trim()): []
    // Dislikes
    remain.dislikes = remain.dislikes ? remain.dislikes.split(',').map(l => l.trim()): []

    // Public or private
    const publicCharacter = this.state.checked ? true: false
    // Image
    remain.image = remain.image && remain.image ? remain.image: null

   const characterData = { ...remain, public: publicCharacter }
    if (this.state.alert !== 'danger') {
      this.props.updateCharacter(id, characterData)
    }
  }

  // DELETE CHARACTER
  deleteCharacter = e => {
    e.preventDefault()
    const conf = window.confirm('Do you really want to delete this character ?')
    if (conf) {
      this.props.deleteCharacter(this.props.match.params.id, this.props.history)
    }
  }

  // TRIGGER THE CLICK ON IMAGE
  triggerClick = () => {
    document.getElementById('photo').click()
  }

  handleImageChange = e => {
    const img = e.target.files[0]
    const reader = new FileReader();

    if (img.name.includes('jpg') || img.name.includes('png') || img.name.includes('jpeg')) {
      reader.onload = (imgFile => {
        const image = new Image();
        image.src = imgFile.target.result

        image.onload = () => {
          if (image.width < 300 || image.width > 1200 || image.height < 200 || image.height > 1200) {
            this.setState({ flash: true, message: 'Your image does not respect the size requirements', alert: 'danger' })
            setTimeout(() => this.setState({ flash: false }), 3000)
          } else {
            this.setState({ image: img, filename: img.name, alert: '' })
          }
        }
      })
      reader.readAsDataURL(img);
    } else {
      this.setState({ flash: true, message: 'The format of your image is not supported', alert: 'danger' })
      setTimeout(() => this.setState({ flash: false }), 3000)
    }
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
            checked={this.state.checked }
            character={this.state}
            characterRelatives={this.props.characterRelatives}
            image={this.props.character.image}
            errors={this.props.errors}
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
    notFound: state.characters.notFound,
    errors: state.UI.errors
  }
}

export default compose(connect(mapStateToProps, { setProgressBar, getCharacter, getUserCharacters, updateCharacter, deleteRelation, deleteCharacter, cleanup }), firestoreConnect([ {collection: 'characters'} ]))(EditCharacter)