import React, { Component } from 'react'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import { getStory, deleteChapter, cleanup, getOneShot } from '../../redux/actions/storyActions'
import { addStoryToFavorite, removeStoryFormFavorite } from '../../redux/actions/listActions'
import { setProgressBar } from '../../redux/actions/profileActions'
import PropTypes from 'prop-types'

import StoryBanner from './StoryBanner'
import StoryDetails from './StoryDetails'
import Loading from '../shared/Loading'
import NotFound from '../shared/NotFound'
import Private from '../shared/Private'

class Story extends Component {

  _isMounted = false;

  state = {
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight
  }

  updateDimensions = () => {
    this.setState({ windowWidth: window.innerWidth });
  }

  componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      this.props.getStory(this.props.match.params.id)
      this.props.getOneShot(this.props.match.params.id)
    }

    
    window.addEventListener("resize", this.updateDimensions)
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (!this.state.hasOwnProperty('rating') && nextProps.isFavorite) {
      this.setState({ rating: 1 })
    }

    if (nextProps.match.params.id !== this.props.match.params.id) {
      this.props.getStory(nextProps.match.params.id)
    }

    if (this.props.loading !== nextProps.loading) {
      const open = nextProps.loading === false ? '' : 'OPEN'
      this.props.setProgressBar(open)
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.props.cleanup()
    window.removeEventListener("resize", this.updateDimensions);
  }

  deleteChapter = (id, e) => {
    const confirmation = window.confirm("Do you really want to delete this chapter ?")
    if (confirmation) {
      this.props.deleteChapter(this.props.match.params.id, id, this.props.history)
    }
  }

  changeRating = e => {
    if (!this.props.isFavorite) {
      this.props.addStoryToFavorite(this.props.match.params.id, this.props.isFavorite)
      this.setState({ rating: 1 })
    } else {
      this.props.removeStoryFormFavorite(this.props.match.params.id, this.props.isFavorite)
      this.setState({ rating: 0 })
    }
  }

  render() {
    return (
      <main className="inner-main inner-main-story">
      {!this.props.loading ?
        !this.props.notFound ?
        this.props.story.public || (this.props.story.authorId === this.props.auth.uid) ?
        <div className="story">
          <StoryBanner story={this.props.story} id={this.props.match.params.id}/>
          <StoryDetails 
            chapter={this.props.chapter}
            innerHeight={this.state.windowHeight}
            innerWidth={this.state.windowWidth}
            chapters={this.props.chapters}
            profile={this.props.profile} 
            deleteChapter={this.deleteChapter} 
            isFavorite={this.props.isFavorite}
            auth={this.props.auth} 
            story={this.props.story} 
            id={this.props.match.params.id} 
            chapid={this.props.match.params.chapid}
            changeRating={this.changeRating}
            UI={this.props.UI}
            match={this.props.match}
            category={this.props.category}
            comments={this.props.comments}
          />
        </div>:
      <Private type="Private story" data={this.props.auth} />:
      <NotFound />:
      <Loading /> }
      </main>
    )
  }
}

Story.propTypes = {
  story: PropTypes.shape({
    summary: PropTypes.string,
    chapters: PropTypes.array,
    likesCount: PropTypes.number
  }),
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  getStory: PropTypes.func.isRequired,
  deleteChapter: PropTypes.func.isRequired,
  notFound: PropTypes.bool.isRequired
}

const mapStateToProps = (state, ownProps) => {
  const auth = state.firebase.auth
  const story = state.story.story
  const chapter = state.story.chapter
  const storiesLikes = state.firestore.ordered.storiesLikes
  const isFavorite = storiesLikes && storiesLikes.some(like => like.senderId === auth.uid && like.storyId === ownProps.match.params.id)
  const categories = state.firestore.ordered.categories
  const category = story && categories && categories.filter(gen => gen.id === story.category)[0]
  const users = state.firestore.ordered.users
  const comments = !story.oneShot ? []: state.firestore.ordered.comments
  
  let allcomments = comments && comments.filter(comm => comm.storyId === ownProps.match.params.id && comm.chapterId === chapter.id && comm.answer === false).map(com => ({
    ...com, 
    username: users && users.filter(user => user.id === com.userId)[0].username,
    userImage: users && users.filter(user => user.id === com.userId)[0].image
  }))

  let responses = comments && comments.filter(comm => comm.storyId === ownProps.match.params.id && comm.chapterId === chapter.id && comm.answer === true).map(com => ({
    ...com, 
    username: users && users.filter(user => user.id === com.userId)[0].username,
    userImage: users && users.filter(user => user.id === com.userId)[0].image
  }))
  
  allcomments = allcomments && allcomments.map(comm => {
    let answers = []
    
    responses.forEach(answer => comm.id === answer.commentAnsweredId ? answers.push(answer) : null)
      return {...comm, answers}
    })
    allcomments = allcomments && [...allcomments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(c => ({...c, answers: c.answers.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))}))
  return {
    story,
    auth,
    category,
    profile: state.firebase.profile,
    chapters: state.story.chapters,
    isFavorite,
    loading: state.story.loading,
    notFound: state.story.notFound,
    UI: state.UI,
    chapter,
    comments: allcomments
  }
}

export default compose(connect(mapStateToProps, { getOneShot, getStory, deleteChapter, addStoryToFavorite, removeStoryFormFavorite, cleanup, setProgressBar }), firestoreConnect([{collection: 'stories'}, {collection: 'storiesLikes'}, {collection: 'comments'}, { collection: 'categories' }]))(Story)

