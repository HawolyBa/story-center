import React, {Component} from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { followUser, unfollowUser, getFollowers, getFollowings } from '../../redux/actions/listActions'
import { cleanup, getPublicLocations, getFavoriteStories, getPublicStories } from '../../redux/actions/storyActions'
import { getPublicCharacters, getFavoriteCharacters } from '../../redux/actions/charactersActions'
import { setProgressBar } from '../../redux/actions/profileActions'
import { array, bool, object, func, shape } from "prop-types";


import Stories from './Stories'
import Characters from './Characters'
import Locations from './Locations'
import Followers from './Followers'
import Banner from './Banner'
import Favorites from './Favorites'
import ProfileLoading from './ProfileLoading'
import Tabs from './Tabs';


class Profile extends Component {

  state = {
    userInfo: {},
    perPage: 4,
    items: [],
    activeTab: 'stories',
    activeView: 'grid'
  }

  componentDidMount() {
    this.props.getPublicStories(this.props.match.params.id)
    this.props.getPublicCharacters(this.props.match.params.id)
    this.props.getPublicLocations(this.props.match.params.id)
    this.props.getFollowers(this.props.match.params.id)
    this.props.getFollowings(this.props.match.params.id)
    this.props.getFavoriteStories(this.props.match.params.id)
    this.props.getFavoriteCharacters(this.props.match.params.id)
  }
  
  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.props.getPublicStories(this.props.match.params.id)
      this.props.getPublicCharacters(this.props.match.params.id)
      this.props.getPublicLocations(this.props.match.params.id)
      this.props.getFollowers(this.props.match.params.id)
      this.props.getFollowings(this.props.match.params.id)
      this.props.getFavoriteStories(this.props.match.params.id)
      this.props.getFavoriteCharacters(this.props.match.params.id)
      this.setState({ activeTab: 'stories', activeView: 'grid' })
    }
    if (this.props.loading !== prevProps.loading) {
      const open = this.props.loading === false ? '' : 'OPEN'
      this.props.setProgressBar(open)
    }
  }

  componentWillReceiveProps(nextProps) {
    
    if (nextProps.profile !== this.props.profile) {
      this.setState({
        twitter: this.props.profile.twitter,
        facebook: this.props.profile.facebook, 
        instagram: this.props.profile.instagram, 
        biography: this.props.profile.biography, 
        nightMode: this.props.profile.nightMode
      })
    }
  }

  componentWillUnmount() {
    this.props.cleanup()
  }

  changeTab = (tabClicked, i) => {
    this.setState({activeTab: tabClicked})
  }

  changeTabSelect = e => {
    this.setState({ activeTab: e.target.value })
  };

  toggleFollow = () => {
    if (!this.props.isFavorite) {
      const newFollower = { id: this.props.auth.uid, image: this.props.profile.image, username: this.props.profile.username }
      this.props.followUser(this.props.match.params.id, this.props.isFavorite, newFollower)
    } else {
      this.props.unfollowUser(this.props.match.params.id, this.props.isFavorite)
    }
  }
  
  changeView = view => {
    this.setState({ activeView: view })
  }

  render() {
  const { user, auth, loading, UI, isFavorite } = this.props
  const { activeTab, orientation, activeView } = this.state
  const { id } = this.props.match.params
  return (
    <main className="inner-main-profile">
      <Banner 
        UI={UI}
        user={user}
        auth={auth}
        id={this.props.match.params.id}
        toggleFollow={this.toggleFollow}
        isFavorite={isFavorite}
        changeAvatar={this.changeAvatar}
        verifyEmail={this.props.verifyEmail}
        changeTab={this.changeTab}
        imageLoading={user.imageLoading}
        changeTabSelect={this.changeTabSelect}
        loading={loading}
        orientation={orientation}
        activeTab={this.state.activeTab}
      />
      <div className="profile-content">
      {!loading ?
        <React.Fragment>
          <Tabs activeTab={activeTab} changeTab={this.changeTab} changeTabSelect={this.changeTabSelect} id={id} />
        {
          activeTab === 'stories' ?
          <Stories activeView={activeView} changeView={this.changeView} id={id} auth={auth} stories={user.stories}/>:
          activeTab === 'characters' ?
          <Characters id={id} characters={user.characters}/>:
          activeTab === 'locations' ?
          <Locations type='public' deleteLocation={this.props.deleteLocation} locations={user.locations} id={id}/>:
          activeTab === 'followers' ?
          <Followers followers={user.followers}/>:
          activeTab === 'favorites' ?
          <Favorites favorites={user.favorites} auth={auth} id={id}/>:
          <div></div>
        }
        </React.Fragment>:
        <ProfileLoading />}
      </div>
    </main>
    )
  }
}

Profile.defaultProps = {
  profile: {},
  isFavorite: false
};

Profile.propTypes = {
  auth: object.isRequired,
  user: shape({
    characters: shape({
      allCharacters: array.isRequired,
      charaByStory: array.isRequired
    }).isRequired,
    stories: array.isRequired,
    favorites: shape({
      stories: array.isRequired,
      characters: array.isRequired,
      followings: array.isRequired
    }).isRequired,
    followers: array.isRequired,
    locations: shape({
      allLocations: array.isRequired,
      locByStory: array.isRequired
    }).isRequired,
  }),
  followUser: func.isRequired,
  unfollowUser: func.isRequired,
  loading: bool.isRequired,
  isFavorite: bool.isRequired
};

const mapStateToProps = (state, ownProps) => {
  const auth = state.firebase.auth
  const users = state.firestore.ordered.users
  const profile = users && users.find(user => user.id === ownProps.match.params.id)
  const usersLikes = state.firestore.ordered.usersLikes
  const isFavorite = usersLikes && usersLikes.some(like => like.senderId === auth.uid && like.recipient === ownProps.match.params.id)
  return {
    auth: state.firebase.auth,
    profile: state.firebase.profile,
    user: { ...state.profile.user, ...profile},
    loading: state.profile.loading,
    UI: state.UI,
    isFavorite
  }
};

export default compose(connect(mapStateToProps, { getFavoriteStories, getFollowings, getFollowers, followUser, unfollowUser, cleanup, getPublicCharacters, getPublicLocations, getPublicStories, getFavoriteCharacters, setProgressBar }), firestoreConnect([{collection: 'usersLikes'}, {collection: 'users'}]))(Profile);
