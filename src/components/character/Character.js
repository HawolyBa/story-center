import React, { Component } from 'react'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import { getCharacter } from '../../redux/actions/charactersActions'
import { cleanup as characterCleanup } from '../../redux/actions/storyActions'
import { addCharacterToFavorite, removeCharacterFromFavorite } from '../../redux/actions/listActions'
import { string, func, array, object, shape, number } from 'prop-types'

import CharacterDetails from './CharacterDetails';
import CharacterDescription from './CharacterDescription';
import Loading from '../shared/Loading'
import Private from '../shared/Private';
import NotFound from '../shared/NotFound'
import ResponsiveCharacter from './ResponsiveCharacter'

class Character extends Component {

  state = {
    character: {},
    innerWidth: window.innerWidth, 
    isOpen: false
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if ( prevState.character !== nextProps.character) {
      return {
        character: nextProps.character
      }
    } else {
      return null
    }
  }

  toggle = () => {
    this.setState({ isOpen: !this.state.isOpen })
  }

  updateDimensions = () => {
    this.setState({ innerWidth: window.innerWidth});
  }

  componentDidMount() {
    this.props.getCharacter(this.props.match.params.id)
    window.addEventListener("resize", this.updateDimensions)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.setState({ loaded: false})
      this.props.getCharacter(this.props.match.params.id)
    }
  }

  componentWillUnmount() {
    this.props.characterCleanup()
    window.removeEventListener("resize", this.updateDimensions);
  }


  changeRating = e => {
    if (!this.props.isFavorite) {
      this.props.addCharacterToFavorite(this.props.match.params.id, this.props.isFavorite)
    } else {
      this.props.removeCharacterFromFavorite(this.props.match.params.id, this.props.isFavorite)
    }
  }

  render() {
    const { character, profile, match, auth, isFavorite, notFound } = this.props
    const id = match.params.id 
    return (
    <main className="inner-main inner-main-character">
      {!this.props.loading ? 
      !notFound ?
      (auth.uid === character.authorId) || character.public ?
      this.state.innerWidth >= 768 ? 
      <div className="character flex spb">
        <CharacterDetails
          toggle={this.toggle}
          isOpen={this.state.isOpen}
          isFavorite={isFavorite} 
          auth={auth} id={id} 
          character={character} 
          profile={profile} 
          changeRating={this.changeRating}
          imageHeight={this.state.imageHeight}
        />
        <CharacterDescription 
          charaAuthorId={character.authorId} 
          id={id} 
          auth={auth} 
          character={character} 
        />
      </div>:
      <ResponsiveCharacter
        toggle={this.toggle}
        isOpen={this.state.isOpen}
        isFavorite={isFavorite}
        character={character}
        profile={profile}
        changeRating={this.changeRating}
        myRef={this.myRef}
        imageHeight={this.state.imageHeight}
        charaAuthorId={character.authorId}
        id={id}
        auth={auth}
      />:
            <Private data={auth} type="Private Character" /> :
      <NotFound />:
      <Loading /> }
    </main>
    )
  }
}

Character.propTypes = {
  profile: object.isRequired,
  auth: object.isRequired,
  character: shape({
    id: string.isRequired,
    authorId: string.isRequired,
    firstname: string.isRequired,
    image: string.isRequired,
    likesCount: number.isRequired,
    likes: array.isRequired,
    dislikes: array.isRequired,
    lastname: string,
    age: string,
    description: string,
    birth: string,
    gender: string,
    occupation: string,
    relatives: array.isRequired,
    stories: array.isRequired
  }).isRequired,
  getCharacter: func.isRequired,
}

const mapStateToProps = (state, ownProps) => {
  const auth = state.firebase.auth
  const charactersLikes = state.firestore.ordered.charactersLikes
  const isFavorite = charactersLikes && charactersLikes.some(like => like.senderId === auth.uid && ownProps.match.params.id === like.characterId)
  
  return {
    character: state.characters.character,
    profile: state.firebase.profile,
    auth,
    isFavorite,
    loading: state.characters.loading,
    notFound: state.characters.notFound
  }
}


export default compose(connect(mapStateToProps, { getCharacter, addCharacterToFavorite, removeCharacterFromFavorite, characterCleanup }), firestoreConnect([ { collection: 'charactersLikes' } ]))(Character)
