import React, {Component} from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firestoreConnect } from 'react-redux-firebase';
import { verifyEmail, deleteAccount } from '../../redux/actions/authActions'
import { changeImage, updateUserProfile} from '../../redux/actions/profileActions'
import { deleteLocation, getPrivateLocations, cleanup, getFavoriteStories, getPrivateStories } from '../../redux/actions/storyActions'
import { getPrivateCharacters, getFavoriteCharacters } from '../../redux/actions/charactersActions'
import { getFollowers, getFollowings } from '../../redux/actions/listActions'
import { array, bool, object, func, shape } from "prop-types";


import Stories from './Stories'
import Characters from './Characters'
import Locations from './Locations'
import Followers from './Followers'
import Banner from './Banner'
import Favorites from './Favorites'
import Settings from './Settings'
import Flash from '../shared/FlashMessage'
import ProfileLoading from './ProfileLoading'

class PrivateProfile extends Component {

  state = {
    userInfo: {
      biography: ''
    },
    perPage: 4,
    items: [],
    activeTab: 'stories',
    image: '',
    orientation: '',
    charactersLeft: 240
  }

  componentDidMount() {
    this.props.getPrivateStories()
    this.props.getPrivateCharacters()
    this.props.getPrivateLocations()
    this.props.getFollowers()
    this.props.getFollowings()
    this.props.getFavoriteStories()
    this.props.getFavoriteCharacters()
    if (this.props.user.image) {
      this.handleSize(this.props.user.image)
    }

    if (this.props.user.biography) {
      let letterCount = this.props.user.biography.replace(/\s+/g, '').length;
      this.setState({
        userInfo: { ...this.state.userInfo, biography: this.props.user.biography },
        charactersLeft: 240 - Number(letterCount)
      })
    }
  }
  
  componentDidUpdate(prevProps) {
    if (this.props.user.image !== prevProps.user.image) {
      this.handleSize(this.props.user.image)
    }
    if (prevProps.newImage !== this.props.newImage) {
      const { newImage } = this.props
      this.setState({ orientation: newImage.imageWidth > newImage.imageHeight ? 'circular--landscape' : newImage.imageWidth < newImage.imageHeight ? 'circular--portrait' : 'circular--square' })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.user.biography !== nextProps.user.biography) {
      let letterCount = nextProps.user.biography.replace(/\s+/g, '').length;
      this.setState({
        userInfo: { ...this.state.userInfo, biography: nextProps.user.biography}, 
        charactersLeft: 240 - Number(letterCount) })
    }
  }

  componentWillUnmount() {
    this.props.cleanup()
  }


  changeAvatar = (e) => {
    const image = e.target.files[0]
    if (image.name.includes('jpg') || image.name.includes('png') || image.name.includes('jpeg')) {
      this.props.changeImage(image)
    } else {
      this.setState({ flash: true, message: 'Invalid image format', alert: 'danger' })
      setTimeout(() => this.setState({ flash: false }), 3000)
    }
    
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

  onChange = e => {
    this.setState({ userInfo: {...this.state.userInfo, [e.target.name]: e.target.value.trim().toString()} });

    if (
      (e.target.name === "facebook" &&
        e.target.value &&
        !e.target.value.includes("facebook.com")) ||
      (e.target.name === "twitter" &&
        e.target.value &&
        !e.target.value.includes("twitter.com")) ||
      (e.target.name === "instagram" &&
        e.target.value &&
        !e.target.value.includes("instagram.com"))
    ) {
      this.setState({
        alert: "danger",
        message: "One or many of your social links are not valid",
        flash: true
      });
    } else {
      this.setState({
        alert: "",
        message: "",
        flash: false
      });
    }
  };

  onChangeBio = e => {
    let letterCount = e.target.value.replace(/\s+/g, '').length;
    if (this.state.charactersLeft > 0) {
      this.setState({ charactersLeft: 240 - Number(letterCount) })
      this.setState({ userInfo: {...this.state.userInfo, biography: e.target.value} })
    }
  }

  onSubmit = e => {
    e.preventDefault()
    if (this.state.alert !== "danger") {
      this.props.updateUserProfile(this.state.userInfo, this.props.usernames)
    } else {
      this.setState({ alert: 'danger', flash: true, message: "Please change the format of your social link"});
    }
  }
  
  deleteAccount = e => {
    const confirm = window.confirm("Do you really want to delete your account ?");
    if (confirm) {
      const doubleConfirm = window.confirm("All your content will be delete forever !!!")
      if (doubleConfirm) this.props.deleteAccount(this.props.history);
    }
  };

  triggerClick = e => {
    document.getElementById('changeAvatar').click()
  }

  render() {
    
  const { user, auth, loading, UI } = this.props
  const { activeTab, flash, message, alert, orientation, charactersLeft, userInfo } = this.state
  const { id } = this.props.match.params
  return (
    <main className="inner-main-profile">
      <Banner 
        UI={UI}
        profile={user}
        user={user}
        auth={auth}
        changeAvatar={this.changeAvatar}
        verifyEmail={this.props.verifyEmail}
        changeTab={this.changeTab}
        changeTabSelect={this.changeTabSelect}
        triggerClick={this.triggerClick}
        loading={loading}
        handleSize={this.handleSize}
        orientation={orientation}
        toggle={this.toggle}
        activeTab={this.state.activeTab}
      />
        <div className="profile-content">
        {!loading ?
          <React.Fragment>
          {
            activeTab === 'stories' ?
            <Stories auth={auth} stories={user.stories}/>:
            activeTab === 'characters' ?
            <Characters auth={auth} characters={user.characters}/>:
            activeTab === 'locations' ?
            <Locations deleteLocation={this.props.deleteLocation} locations={user.locations} id={id}/>:
            activeTab === 'followers' ?
            <Followers followers={user.followers}/>:
            activeTab === 'favorites' ?
            <Favorites auth={auth} favorites={user.favorites}/>:
            activeTab === 'settings' ?
                          <Settings bio={userInfo.biography} charactersLeft={charactersLeft} onChangeBio={this.onChangeBio} deleteAccount={this.deleteAccount} onSubmit={this.onSubmit}  onChange={this.onChange} user={user} />:
            <div></div>
          }
          </React.Fragment>:
          <ProfileLoading />}
        </div>
        <Flash flash={flash} message={message} alert={alert}/>
    </main>
    )
  }
}

PrivateProfile.propTypes = {
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
    }).isRequired
  }),
  deleteAccount: func.isRequired,
  verifyEmail: func.isRequired,
  updateUserProfile: func.isRequired,
  changeImage: func.isRequired,
  loading: bool.isRequired,
};

const mapStateToProps = state => ({
  auth: state.firebase.auth,
  user: {...state.profile.user, ...state.firebase.profile},
  loading: state.profile.loading,
  UI: state.UI,
  usernames: state.firestore.ordered.users && state.firestore.ordered.users.map(user => user.username.toLowerCase()),
  newImage: state.profile.newImage
});

export default compose(connect(mapStateToProps, { getFavoriteCharacters, getFavoriteStories, getFollowings, changeImage, updateUserProfile, deleteAccount, verifyEmail, deleteLocation, cleanup, getPrivateCharacters, getPrivateLocations, getFollowers, getPrivateStories }), firestoreConnect([{collection: 'users'}]))(PrivateProfile);
