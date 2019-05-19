import React, { Component } from 'react'
import { connect } from 'react-redux'
import {  getStoryLocations, addChapter, getStory, cleanup } from '../../../redux/actions/storyActions'
import { getUserCharacters } from '../../../redux/actions/charactersActions'
import { arrayOf, string, bool, object, func, shape } from 'prop-types'

import StoryBanner from '../StoryBanner'
import ChapterForm from './ChapterForm';
import Loading from '../../shared/Loading';
import NotFound from '../../shared/NotFound';
import Private from '../../shared/Private';

class AddChapter extends Component {

  state = {
    storyId: this.props.match.params.id,
    charactersSelected: [],
    locationsSelected: [],
    idSelected: [],
    idLocations: [],
    body: '',
    title: ''
  }

  componentDidMount() {
    if (this.props.auth.uid) {
      this.props.getStory(this.props.match.params.id)
      this.props.getUserCharacters(this.props.auth.uid)
      this.props.getStoryLocations(this.props.match.params.id)
    }
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    if ( nextProps.chapterId !== '' ) {
      window.location.pathname = `/story/${nextProps.match.params.id}/chapter/${nextProps.chapterId}`
    } else return null
  }

  componentWillUnmount() {
    this.props.cleanup()
  }

  onSubmit = e => {
    e.preventDefault()
    if (this.state.title !== '') {
      const { idSelected, storyId, body, title, chap_number, idLocations } = this.state
      const info = { locations: idLocations, characters: idSelected, storyId, body, title, number: chap_number }
      this.props.addChapter(this.props.match.params.id, info, this.props.history)
    }
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value.trim() })
  }

  handleEditorChange = (value ) => {
    this.setState({ body: value })
  }

  onLocationSelect = e => {
    this.setState({ locationId: e.target.value })
  }

  onSelect = e => {
    this.setState({ charaId: e.target.value })
  }

  addCharacterToStory = e => {
    e.preventDefault()
    const { charaId, idSelected } = this.state
    const { characters } = this.props
    const charactersSelected = charaId && characters && characters.filter(char => char.id === charaId)[0]
    if (!idSelected.includes(charaId)){
      this.setState({ charactersSelected: [...this.state.charactersSelected, charactersSelected ], idSelected: [...this.state.idSelected, charaId]})
    }
  }

  addLocations = e => {
    e.preventDefault()
    const { locationId, idLocations } = this.state
    const { locations } = this.props
    const locationsSelected = locationId && locations && locations.filter(loca => loca.id === locationId)[0]
    if (!idLocations.includes(locationId)){
      this.setState({ locationsSelected: [...this.state.locationsSelected, locationsSelected ], idLocations: [...this.state.idLocations, locationId]})
    }
  }

  removeFromCharacters = (id, e) => {
    this.setState({ 
      idSelected: this.state.idSelected.filter(char => char !== id),
      charactersSelected: this.state.charactersSelected.filter(char => char.id !== id)
    })
  }

  removeFromLocations = (id, e) => {
    e.stopPropagation()
    this.setState({ 
      idLocations: this.state.idLocations.filter(loc => loc !== id),
      locationsSelected: this.state.locationsSelected.filter(loc => loc.id !== id)
    })
  }

  render() {
    const { match, characters, locations, story } = this.props
    const { charactersSelected, idSelected, locationsSelected, idLocations } = this.state
    const charactersInSelect = characters && characters.filter(char => !idSelected.includes(char.id))
    const locationsInSelect = locations && locations.filter(loca => !idLocations.includes(loca.id))
    const pathname = match.path
    return (
      <main className="inner-main">
        { !this.props.loading ?
          !this.props.notFound ?
          (this.props.auth && this.props.story && this.props.story.authorId === this.props.auth.uid) ? 
        <div className="story add-chapter">
          <StoryBanner story={story} id={this.props.match.params.id}/>
          <ChapterForm
            removeFromCharacters={this.removeFromCharacters}
            removeFromLocations={this.removeFromLocations}
            onSubmit={this.onSubmit}
            onChange={this.onChange}
            handleEditorChange={this.handleEditorChange}
            onSelect={this.onSelect}
            addLocations={this.addLocations}
            addCharacterToStory={this.addCharacterToStory}
            onLocationSelect={this.onLocationSelect}
            match={match}
            charactersInSelect={charactersInSelect}
            charactersSelected={charactersSelected}
            pathname={pathname}
            characters={characters}
            locations={locations}
            locationsSelected={locationsSelected}
            locationsInSelect={locationsInSelect}
            body={this.state.body}
          />
        </div>:
        <Private data={this.props.auth} type="Unauthorized"/>:
        <NotFound/>:
        <Loading/>
        }
      </main>
    )
  }
}

AddChapter.propTypes = {
  auth: object.isRequired,
  chapterId: string,
  characters: arrayOf(
    shape({
      id: string.isRequired,
      firstname: string.isRequired,
      lastname: string,
      public: bool.isRequired,
      authorId: string.isRequired,
      authorName: string.isRequired,
    })
  ),
  locations: arrayOf(
    shape({
      authorId: string.isRequired,
      name: string.isRequired,
      id: string.isRequired,
      image: string.isRequired,
      storyId: string.isRequired
    })
  ),
  getUserCharacters: func.isRequired,
  getStoryLocations: func.isRequired,
  addChapter: func.isRequired
}

const mapStateToProps = state => {
  return {
    auth: state.firebase.auth,
    characters: state.story.userCharacters,
    locations: state.story.storyLocations,
    chapterId: state.story.chapterId,
    story: state.story.story,
    loading: state.story.loading,
    notFound: state.story.notFound
  }
}

export default connect(mapStateToProps, { getUserCharacters, getStoryLocations, addChapter, getStory, cleanup })(AddChapter)

