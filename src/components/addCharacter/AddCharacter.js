import React, { Component } from 'react'
import { addCharacter, getUserCharacters } from '../../redux/actions/charactersActions'
import { cleanup } from '../../redux/actions/storyActions'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import CharacterForm from './CharacterForm';
import FlashMessage from '../shared/FlashMessage';

class AddCharacter extends Component {

  state = {
    relatives: [],
    checked: true, 
    filename: '',
    image: '',
    lastname: '',
    firstname: '',
    imageCopyright: '',
    age: '',
    gender: '',
    ethnicity: '',
    occupation: '',
    residence: '',
    group: ''
  }

  componentDidMount() {
    this.props.getUserCharacters(this.props.auth.uid)
  }

  componentWillUnmount() {
    this.props.cleanup()
  }

  switched = e => {
    this.setState({ checked: !this.state.checked })
  }

  addRelation = e => {
    e.preventDefault()
    this.setState(prevState => ({ relatives: [...prevState.relatives, '']}))
  } 

  setImageAlerts = (message) => {
    this.setState({ flash: true, message, alert: 'danger' })
    setTimeout(() => this.setState({ flash: false, alert: '' }), 3000)
  }

  handleImageChange = e => {
    const img = e.target.files[0]
    if (img.name.includes('jpg') || img.name.includes('png') || img.name.includes('jpeg')) {
      this.setState({ image: img, filename: img.name, alert: '' })
    } else {
      this.setImageAlerts('Invalid image format')
    }
    // const reader = new FileReader();
    // reader.onload = ( (theFile) => {
    //   var image = new Image();
    //   image.src = theFile.target.result;
    //   image.onload = () => {
    //     if (image.width > image.height) {
    //       if (image.height > 600 || image.width < 300) {
    //         this.setImageAlerts('Your image does not respect the size requirements')
    //       } else {
    //         this.setState({ image: img, filename: img.name, alert: '', alert: false })
    //       }
    //     } else if (image.width < image.height) {
    //         if (image.width < 300) {
    //           this.setImageAlerts('Your image does not respect the size requirements')
    //         } else if (image.width >= 300 && image.height > 600) {
    //           this.setImageAlerts('Your image does not respect the size requirements')
    //         } else {
    //           this.setState({ image: img, filename: img.name, alert: '', alert: false })
    //         }
    //     }
    //   };
    // });
    //   reader.readAsDataURL(img);
    // } else {
    //   this.setState({ flash: true, message: 'Invalid image format', alert: 'danger' })
    //   setTimeout(() => this.setState({ flash: false, message: '', alert: '' }), 3000)
    // 

    // 
    //   this.setState({ image: image, filename: image.name, alert: '' })
    // } else {
    //   this.setState({ flash: true, message: 'Invalid image format', alert: 'danger' })
    //   setTimeout(() => this.setState({ flash: false, message: '' }), 3000)
    // 
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value })
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

  triggerClick = () => {
    document.getElementById('photo').click()
  }

  onSubmit = e => {
    e.preventDefault()

    let {likes, dislikes, checked, added, filename, errors,...remain} = this.state
    likes = likes ? likes.split(',').map(l => l.trim()): []
    dislikes = dislikes ? dislikes.split(',').map(d => d.trim()): []
    const characterData = { ...remain, likes, dislikes, public: checked }
    if (this.state.alert !== 'danger') {
      this.props.addCharacter(characterData, this.props.history)
    }
  }

  render() {
    const { characters, loading, errors } = this.props
    const { flash, message, alert } = this.state
    return (
      <main className="inner-main">
        <div className="add-story">
          <h2 className="text-center">Add a new character</h2>
          <hr/>
          <CharacterForm
            errors={errors}
            triggerClick={this.triggerClick}
            loading={loading}
            filename={this.state.filename}
            characters={characters} 
            handleImageChange={this.handleImageChange} 
            onChange={this.onChange} 
            onSubmit={this.onSubmit}
            addRelation={this.addRelation}
            relatives={this.state.relatives}
            remove={this.remove}
            onRelationChange={this.onRelationChange}
            onChangeSelect={this.onChangeSelect}
            switched={this.switched}
            checked={this.state.checked}
          />
        </div>
        <FlashMessage flash={flash} message={message} alert={alert}/>
      </main>
    )
  }
}

AddCharacter.defaultProps = {
  character: { 
    relatives: [],
    dislikes: [],
    likes: []
  }
}

AddCharacter.propTypes = {
  characters: PropTypes.array.isRequired,
  auth: PropTypes.object.isRequired,
  addCharacter: PropTypes.func.isRequired,
  getUserCharacters: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  characters: state.characters.userCharacters,
  characterAdded: state.characters.characterAdded,
  auth: state.firebase.auth,
  loading: state.characters.loading,
  errors: state.UI.errors
})

export default connect(mapStateToProps, { addCharacter, getUserCharacters, cleanup })(AddCharacter)
