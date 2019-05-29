import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import { getArchiveStories, getStoriesByTag, getStoriesByCategory, getStoriesBySearch, cleanup } from '../../redux/actions/storyActions'
import { getCharactersBySearch } from '../../redux/actions/charactersActions'
import { getUsersBySearch, setProgressBar } from '../../redux/actions/profileActions'
import { array, object, func } from 'prop-types'
import Filter from './Filter'
import Pagination from '../shared/Pagination'
import { deleteSpaces } from '../../utils/helpers'

class Archive extends Component {
  state = {
    stories: [],
    checked: false
  }

  getStories = () => {
    if  (this.props.match.params.search) {
      this.props.getStoriesBySearch(this.props.match.params.search)
      this.props.getCharactersBySearch(this.props.match.params.search)
      this.props.getUsersBySearch(this.props.match.params.search)
    } else if (this.props.match.params.catid) { 
      this.props.getStoriesByCategory(this.props.match.params.catid)
    } else if (this.props.match.params.tag) {
      this.props.getStoriesByTag(encodeURIComponent(this.props.match.params.tag))
    } else if (this.props.location.pathname.includes('browse')) {
      this.props.getArchiveStories()
    }
  }

  switched = e => {
    this.setState({ checked: !this.state.checked })
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.archives !== nextProps.archives) {
      this.setState({ stories: nextProps.archives.filter(story => !story.mature) })
    }
  }

  componentDidMount() {
    this.getStories()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params !== this.props.match.params) {
      this.getStories()
    }

    if (this.props.loading !== prevProps.loading) {
      const open = this.props.loading === false ? '' : 'OPEN'
      this.props.setProgressBar(open)
    }
  }

  componentWillUnmount() {
    this.props.cleanup()
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  onSubmit = e => {
    e.preventDefault()
    
    if (this.state.hasOwnProperty('chosenLanguage')){
      this.setState({ stories: this.props.archives.filter(story => story.language === this.state.chosenLanguage && !story.mature) })
    } else if (this.state.hasOwnProperty('chosenCategory')) {
      this.setState({ stories: this.props.archives.filter(story => story.category === this.state.chosenCategory && !story.mature ) })
    } else if (this.state.checked && !this.state.hasOwnProperty('chosenCategory') && !this.state.hasOwnProperty('chosenLanguage')) {
      this.setState({ stories: this.props.archives })
    } else if (this.state.hasOwnProperty('chosenLanguage') && this.state.hasOwnProperty('chosenCategory')) {
      this.setState({ stories: this.props.archives.filter(story => story.language === this.state.chosenLanguage && story.category === this.state.chosenCategory && !story.mature) })
    } else if (this.state.hasOwnProperty('chosenLanguage') && this.state.checked) {
      this.setState({ stories: this.props.archives.filter(story => story.language === this.state.chosenLanguage) })
    } else if (this.state.hasOwnProperty('chosenCategory') && this.state.checked) {
      this.setState({ stories: this.props.archives.filter(story => story.category === this.state.chosenCategory) })
    } else if (this.state.hasOwnProperty('chosenCategory') && this.state.checked && this.state.hasOwnProperty('chosenLanguage')) {
      this.setState({ stories: this.props.archives.filter(story => story.category === this.state.chosenCategory  && story.language === this.state.chosenLanguage) })
    } else if (!this.state.checked && !this.state.hasOwnProperty('chosenCategory') && !this.state.hasOwnProperty('chosenLanguage')) {
      this.setState({ stories: this.props.archives.filter(story => !story.mature) })
    }
  }

  purge = e => {
    e.preventDefault()
    this.setState({ stories: [], checked: false })
    this.getStories()
  }

  render() {
    const { match, categories, loading, users, characters } = this.props
    const { stories } = this.state
    return (
      <main className="inner-main">
        <div className="archive pl-4 pr-4 pb-4 pt-4">
          <header className="archive-header">
            <h2>{match.params.catid ? `Category: ${this.state.category ? this.state.category : ''}` : match.params.search ? `Search results for: ${match.params.search}` : match.params.tag ? `Search results for: #${deleteSpaces(decodeURIComponent(match.params.tag))}` : null}</h2>
            <hr />
          </header>
          <Filter switched={this.switched} checked={this.state.checked} purge={this.purge} onSubmit={this.onSubmit} onChange={this.onChange} stories={stories} cat={categories} path={match.path}/>
          <hr/>
          <Pagination wait={loading} checked={this.state.checked} pathname={match.path} data={stories} type="stories"/>
          { match.params.search &&
            <Fragment>
              <hr/>
              <Pagination wait={loading} pathname={match.path} data={users} type="users"/>
              <hr/>
              <Pagination wait={loading} pathname={match.path} data={characters} type="characters"/>
            </Fragment>
          }
        </div>
      </main>
    )
  }
}

Archive.defaultProps = {
  categories: []
}

Archive.propTypes = {
  auth: object.isRequired,
  categories: array.isRequired,
  archives: array.isRequired,
  getCharactersBySearch: func.isRequired,
  getUsersBySearch: func.isRequired
}

const mapStateToProps = state => ({
  auth: state.firebase.auth,
  categories: state.firestore.ordered.categories,
  archives: state.story.archives,
  loading: state.story.loading,
  characters: state.characters.characters,
  users: state.profile.users
})


export default compose(connect(mapStateToProps, { setProgressBar, getArchiveStories, getStoriesByTag, getStoriesByCategory, getStoriesBySearch, getCharactersBySearch, getUsersBySearch, cleanup }), firestoreConnect([ {collection: 'stories'}, {collection: 'categories'} ]))(Archive)