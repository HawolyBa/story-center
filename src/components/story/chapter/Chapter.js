import React, { Component } from 'react'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import { getStory, getChapter, cleanup } from '../../../redux/actions/storyActions'
import { string, shape, array, number, object, bool, func } from 'prop-types'
import 'simplebar';
import 'simplebar/dist/simplebar.min.css';

import StoryBanner from '../StoryBanner';
import ChapterDetails from './ChapterDetails'
import NotFound from '../../shared/NotFound';
import Loading from '../../shared/Loading';


class Chapter extends Component {

  state = {
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight
  }

  updateDimensions = () => {
    this.setState({ windowWidth: window.innerWidth, windowHeight: window.innerHeight });
  }

  componentDidMount() {
    this.props.getChapter(this.props.match.params.id, this.props.match.params.chapid)
    this.props.getStory(this.props.match.params.id)
    window.addEventListener("resize", this.updateDimensions)
  }

  componentDidUpdate(prevProps, prevState) {

    if(prevProps.match.params.chapid !== this.props.match.params.chapid) {
      document.querySelector('.inner-main').scrollTop = 0
      this.props.getChapter(this.props.match.params.id, this.props.match.params.chapid)
      this.props.getStory(this.props.match.params.id)
    }
  }

  componentWillUnmount() {
    this.props.cleanup()
    window.removeEventListener("resize", this.updateDimensions);
  }

  render() {
    return !this.props.loading && this.props.chapter.status ?
    !this.props.notFound && this.props.chapter.status === 'published' ?
      <main className="inner-main inner-main-story">
        <div className="story chapter">
          <StoryBanner 
            story={this.props.story} 
            id={this.props.match.params.id}
          /> 
          <ChapterDetails 
            chapterNotFound={this.props.chapterNotFound} 
            innerWidth={this.state.windowWidth}
            innerHeight={this.state.windowHeight}
            loading={this.props.loading} 
            story={this.props.story} 
            params={this.props.match.params} 
            comments={this.props.comments} 
            match={this.props.match} 
            chapter={this.props.chapter} 
            category={this.props.category} 
            previous={this.props.previous} 
            next={this.props.next}
            auth={this.props.auth}
          />
        </div>
      </main>:
    <NotFound/>:
    <Loading/>
  }
}

Chapter.defaultProps = {
  comments: []
}


Chapter.propTypes = {
  chapter: shape({
    authorId: string.isRequired,
    storyId: string.isRequired,
    title: string.isRequired,
    status: string.isRequired,
    createdAt: string.isRequired,
    body: string,
    note: number,
    voters: array,
    votersCount: number,
    locations: array.isRequired,
    characters: array.isRequired
  }).isRequired,
  story: shape({
    authorId: string,
    title: string.isRequired,
    id: string,
    date: object,
    public: bool,
    summary: string,
    language: string,
    rating: string,
    status: string,
    genre: string,
    authorName: string,
    banner: string,
    chapters: array,
  }).isRequired,
  comments: array.isRequired,
  notFound: bool.isRequired,
  getChapter: func.isRequired,
  getStory: func.isRequired,
}

const mapStateToProps = (state, ownProps) => {
  const story = state.story.story
  const currentIndex = story && story.chapters.findIndex(chap => chap.id === ownProps.match.params.chapid)
  const previous = state.story.chapter && story && story.chapters[ currentIndex - 1]
  const next = state.story.chapter && story && story.chapters[currentIndex + 1] 
  const categories = state.firestore.ordered.categories
  const category = story && categories && categories.filter(gen => gen.id === story.category)[0]
  const users = state.firestore.ordered.users
  const comments = state.firestore.ordered.comments

  let allcomments = comments && comments.filter(comm => comm.storyId === ownProps.match.params.id && comm.chapterId === ownProps.match.params.chapid && comm.answer === false).map(com => ({
    ...com, 
    username: users && users.filter(user => user.id === com.userId)[0].username,
    userImage: users && users.filter(user => user.id === com.userId)[0].image
  }))

  let responses = comments && comments.filter(comm => comm.storyId === ownProps.match.params.id && comm.chapterId === ownProps.match.params.chapid && comm.answer === true).map(com => ({
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
    previous,
    next,
    story,
    chapter: state.story.chapter,
    comments: allcomments,
    category,
    loading: state.story.loading,
    notFound: state.story.notFound,
    chapterNotFound: state.story.chapterNotFound,
    auth: state.firebase.auth
  }
}

export default compose(connect(mapStateToProps, { getChapter, getStory, cleanup }), firestoreConnect([{ collection: 'users' }, { collection: 'categories' }, {collection: 'stories'}]))(Chapter)
