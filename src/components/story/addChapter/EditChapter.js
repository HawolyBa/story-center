import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getStoryLocations, addChapter, getChapter, editChapter, getStory, cleanup } from '../../../redux/actions/storyActions'
import { getUserCharacters } from '../../../redux/actions/charactersActions'
import { arrayOf, array, string, bool, object, func, shape } from 'prop-types'
import { replaceAll } from '../../../utils/helpers'

import StoryBanner from '../StoryBanner'
import ChapterForm from './ChapterForm';
import Private from '../../shared/Private';
import Loading from '../../shared/Loading';
import NotFound from '../../shared/NotFound';
import { compose } from 'redux'
import { firestoreConnect } from 'react-redux-firebase';

class EditChapter extends Component {

  _isMounted = false;

  state = {
    idSelected: [],
    idLocations: [],
    body: '',
    title: '',
    chap_number: 0,
    status: 'draft',
    charactersSelected: [],
    locationsSelected: []
  }


  componentWillReceiveProps(nextProps) {
    if (!this.props.loading && !this.props.notFound) {
      if (this.props.chapter.characters !== nextProps.chapter.characters) {
        this.setState({ idSelected: nextProps.chapter.characters.map(c => c.id), charactersSelected: nextProps.chapter.characters && nextProps.chapter.characters.length > 0 ?  nextProps.chapter.characters: []})
      }

      if (this.props.chapter.locations !== nextProps.chapter.locations) {
        this.setState({ idLocations: nextProps.chapter.locations.map(c => c.id), locationsSelected: nextProps.chapter.locations && nextProps.chapter.locations.length > 0 ?  nextProps.chapter.locations: []})
      }

      if (this.props.chapter || nextProps.chapter) {
        this.setState({ 
          body: nextProps.chapter.body, 
          title: nextProps.chapter.title,
          chap_number: nextProps.chapter.number,
          status: nextProps.chapter.status
        })
      }
    }
  }

  componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      this.props.getChapter(this.props.match.params.id, this.props.match.params.chapid)
      this.props.getStory(this.props.match.params.id)
      if (this.props.auth.uid) {
      this.props.getUserCharacters(this.props.auth.uid)
      this.props.getStoryLocations(this.props.match.params.id)
      }
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.props.cleanup()
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleEditorChange = (value) => {
    this.setState({ body: replaceAll(value, "<p><br></p><p><br></p>", "<p><br></p>") })
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
      this.setState({ charactersSelected: this.state.charactersSelected ? [...this.state.charactersSelected, charactersSelected ]: charactersSelected, idSelected: [...this.state.idSelected, charaId]})
    }
  }

  addLocations = e => {
    e.preventDefault()
    const { locationId, idLocations } = this.state
    const { locations } = this.props
    const locationsSelected = locationId && locations && locations.filter(loca => loca.id === locationId)[0]
    if (!idLocations.includes(locationId)){
      this.setState({ locationsSelected: this.state.locationsSelected ? [...this.state.locationsSelected, locationsSelected ]: locationsSelected, idLocations: [...this.state.idLocations, locationId]})
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

  onSubmit = e => {
    e.preventDefault()
    let { idSelected, body, title, idLocations, chap_number, status } = this.state
    const info = { status, storyId: this.props.match.params.id, locations: idLocations, characters: idSelected, body: replaceAll(body, "<p><br></p>", ""), title, number: chap_number }
    this.props.editChapter(this.props.match.params.chapid, info, this.props.storyChapNumbers, this.props.storyChapTitles)
  }

  render() {
    const { match, chapter, characters, locations, loading, chapterLoading, auth, notFound, chapterNotFound, errors, status } = this.props
    const { charactersSelected, idSelected, locationsSelected, idLocations, body } = this.state
    const charactersInSelect = characters && characters.filter(char => !idSelected.includes(char.id))
    const locationsInSelect = locations && locations.filter(loca => !idLocations.includes(loca.id))
    const pathname = match.path
    return (
      <main className="inner-main">
        {!loading && !chapterLoading ? 
        !notFound && !chapterNotFound ?
        (auth && chapter) && auth.uid === chapter.authorId ?
        <div className="add-chapter story">
          <StoryBanner story={this.props.story} id={this.props.match.params.id}/>
          <ChapterForm
            errors={errors}
            body={body}
            status={status}
            chapter={chapter}
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
            characters={chapter.characters}
            locations={chapter.locations}
            locationsSelected={locationsSelected}
            locationsInSelect={locationsInSelect}
          />
        </div>:
        <Private data={auth} type="Unauthorized" />:
        <NotFound />:
        <Loading /> }
      </main>
    )
  }
}

EditChapter.defaultProps = {
  status: 'draft'
}

EditChapter.propTypes = {
  auth: object.isRequired,
  chapterEdited: string,
  characters: arrayOf(
    shape({
      id: string.isRequired,
      firstname: string.isRequired,
      lastname: string.isRequired,
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
  chapter: shape({
    authorId: string.isRequired,
    body: string,
    charArray: array,
    locations: array,
    storyId: string.isRequired,
    title: string.isRequired,
    number: string
  }).isRequired,
  getUserCharacters: func.isRequired,
  getStoryLocations: func.isRequired,
  addChapter: func.isRequired,
  getChapter: func.isRequired,
  editChapter: func.isRequired
}

const mapStateToProps = (state, ownProps) => {
  const chapter = state.firestore.ordered.chapters && state.firestore.ordered.chapters.find(chap => chap.id === state.story.chapter.id)
  const status = chapter && chapter.status
  return {
    auth: state.firebase.auth,
    characters: state.story.userCharacters,
    locations: state.story.storyLocations,
    chapter: state.story.chapter,
    chapterEdited: state.story.chapterEdited,
    story: state.story.story,
    loading: state.story.loading,
    chapterLoading: state.story.chapterLoading,
    notFound: state.story.notFound,
    chapterNotFound: state.story.chapterNotFound,
    errors: state.UI.errors,
    status,
    storyChapNumbers: state.firestore.ordered.chapters && state.firestore.ordered.chapters.filter(chap => chap.storyId === ownProps.match.params.id && chap.number !== state.story.chapter.number).map(chap => chap.number),
    storyChapTitles: state.firestore.ordered.chapters && state.firestore.ordered.chapters.filter(chap => chap.storyId === ownProps.match.params.id && chap.title !== state.story.chapter.title).map(chap => chap.title)
  }
}

export default compose(connect(mapStateToProps, { getUserCharacters, getStoryLocations, addChapter, getChapter, editChapter, getStory, cleanup }), firestoreConnect([{collection: 'chapters'}]))(EditChapter)

