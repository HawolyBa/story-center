import React, {Component} from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { followUser, unfollowUser, getFollowers, getFollowings } from '../../redux/actions/listActions'
import { cleanup, getPublicLocations, getFavoriteStories, getPublicStories } from '../../redux/actions/storyActions'
import { getPublicCharacters, getFavoriteCharacters } from '../../redux/actions/charactersActions'
import { array, bool, object, func, shape } from "prop-types";


import Stories from './Stories'
import Characters from './Characters'
import Locations from './Locations'
import Followers from './Followers'
import Banner from './Banner'
import Favorites from './Favorites'
import ProfileLoading from './ProfileLoading'


class Profile extends Component {

  state = {
    userInfo: {},
    perPage: 4,
    items: [],
    activeTab: 'stories',
    orientation: 'circular--square'
  }

  componentDidMount() {
    this.props.getPublicStories(this.props.match.params.id)
    this.props.getPublicCharacters(this.props.match.params.id)
    this.props.getPublicLocations(this.props.match.params.id)
    this.props.getFollowers(this.props.match.params.id)
    this.props.getFollowings(this.props.match.params.id)
    this.props.getFavoriteStories(this.props.match.params.id)
    this.props.getFavoriteCharacters(this.props.match.params.id)
    if (this.props.user.image) {
      this.handleSize(this.props.user.image)
    }
    //window.addEventListener("resize", this.resizeAllGridItems);
  }
  
  componentDidUpdate(prevProps) {
    //this.resizeAllGridItems();
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.props.getPublicStories(this.props.match.params.id)
      this.props.getPublicCharacters(this.props.match.params.id)
      this.props.getPublicLocations(this.props.match.params.id)
      this.props.getFollowers(this.props.match.params.id)
      this.props.getFollowings(this.props.match.params.id)
      this.props.getFavoriteStories(this.props.match.params.id)
      this.props.getFavoriteCharacters(this.props.match.params.id)
      // window.addEventListener("resize", this.resizeAllGridItems);
      this.setState({ activeTab: 'stories' })
    }
    // if (!this.props.loading && this.state.activeTab === 'stories') {
    //   document.querySelector("#stories").style.background = "#303030";
    //   document.querySelector("#stories").style.color = "#fefefe";
    // }
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
    if (this.props.user.image !== nextProps.user.image) {
      const img = new Image();
      img.src = nextProps.user.image;
      this.setState({ orientation: img.width > img.height ? 'circular--landscape' : img.width < img.height ? 'circular--portrait' : 'circular--square' })
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

  handleSize = (image) => {
    const img = new Image();
    img.src = image;
    this.setState({ orientation: img.width > img.height ? 'circular--landscape' : img.width < img.height ? 'circular--portrait' : 'circular--square' })
  }

  // resizeGridItem = item => {
  //   const grid = document.getElementById("masonry");
  //   let rowHeight = parseInt(
  //     window.getComputedStyle(grid).getPropertyValue("grid-auto-rows")
  //   );
  //   let rowGap = parseInt(
  //     window.getComputedStyle(grid).getPropertyValue("grid-row-gap")
  //   );
  //   let rowSpan =
  //     Math.ceil(
  //       (item.querySelector(".inner").getBoundingClientRect().height + rowGap) /
  //         (rowHeight + rowGap)
  //     ) + 1;
  //   item.style.gridRowEnd = "span " + rowSpan;
  // };

  // resizeAllGridItems = () => {
  //   const allItems = document.getElementsByClassName("grid-item");
  //   for (let x = 0; x < allItems.length; x++) {
  //     this.resizeGridItem(allItems[x]);
  //   }
  // };

  // resizeInstance = instance => {
  //   let item = instance.elements[0];
  //   this.resizeGridItem(item);
  // };

  // loadItems = () => {
  //   this.setState({
  //     items: this.state.items.concat(Array(this.state.perPage).fill())
  //   });
  // };

  toggleFollow = () => {
    if (!this.props.isFavorite) {
      const newFollower = { id: this.props.auth.uid, image: this.props.profile.image, username: this.props.profile.username }
      this.props.followUser(this.props.match.params.id, this.props.isFavorite, newFollower)
    } else {
      this.props.unfollowUser(this.props.match.params.id, this.props.isFavorite)
    }
  }
  

  render() {
  const { user, auth, loading, UI, isFavorite } = this.props
  const { activeTab, orientation } = this.state
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
        {
          activeTab === 'stories' ?
          <Stories auth={auth} stories={user.stories}/>:
          activeTab === 'characters' ?
          <Characters characters={user.characters}/>:
          activeTab === 'locations' ?
          <Locations deleteLocation={this.props.deleteLocation} locations={user.locations} id={id}/>:
          activeTab === 'followers' ?
          <Followers followers={user.followers}/>:
          activeTab === 'favorites' ?
          <Favorites favorites={user.favorites} auth={auth}/>:
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

export default compose(connect(mapStateToProps, { getFavoriteStories, getFollowings, getFollowers, followUser, unfollowUser, cleanup, getPublicCharacters, getPublicLocations, getPublicStories, getFavoriteCharacters }), firestoreConnect([{collection: 'usersLikes'}, {collection: 'users'}]))(Profile);
