import React, { Component, Fragment } from 'react'
import StarRatings from 'react-star-ratings';
import { connect } from 'react-redux'
import { addToFavorite, removeFavorite, isItemFavorite } from '../../redux/actions/listActions'
import FlashMessage from './FlashMessage';
import { capitalizeFirstLetter } from '../../utils/helpers'

class Favorite extends Component {

  state = {
    flash: false,
    alert: '',
    message: ''
  }


  componentDidMount() {
    if (this.props.auth.uid) {
      this.props.isItemFavorite(this.props.id, this.props.type)
    }
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (!this.state.hasOwnProperty('rating') && nextProps.isItFavorite) {
      this.setState({ rating: 1 })
    }
  }

  changeRating = async ( newRating, name ) => {
    const { id, addToFavorite, removeFavorite, type, auth } = this.props

    if (auth.emailVerified) {
      if (this.state.rating !== 1) {
        addToFavorite(id, type)
        this.setState({
          rating: 1,
          alert: 'alert-success',
          flash: true,
          message: `${capitalizeFirstLetter(type)} successfully added to your favorites`
        });
        setTimeout(() => this.setState({ flash: false }), 3000)
      } else {
        removeFavorite(id, type)
        this.setState({
          rating: 0,
          alert: 'alert-success',
          flash: true,
          message: `${capitalizeFirstLetter(type)} successfully removed from your favorites`
        });
        setTimeout(() => this.setState({ flash: false }), 3000)
      }
    } else {
      this.setState({ alert: 'alert-danger', flash: true, message: `You need to verify your email to add this ${type} to your favorites` })
      setTimeout(() => this.setState({ flash: false }), 3000)
    }
  }

  render() {
    const { profile, id, type, likedBy, character, story } = this.props
    const item = type === 'character' ? character: type !== 'story ?' ? story : null
    const title = profile ? (profile.favoritesStories && profile.favoritesStories.includes(id)) || (profile.favoritesUsers && profile.favoritesUsers.includes(id))  ? 'Unfollow ': 'Follow ': ''
    return (
      <div className="favorite flex fc ac jc">
        {type === 'profile' ? <Fragment><small> { title + 'this ' + type}</small><span className="likedBy">{likedBy && likedBy.length}</span></Fragment> : null} 
        <br/>
        <StarRatings
          rating={this.state.rating }
          starRatedColor="#27bab0"
          changeRating={this.changeRating}
          numberOfStars={1}
          name='rating'
          starDimension={'30px'}
          /> <br/>
        {/* <small>{favoriteError ? favoriteError: null}</small> */}
        {type !== 'profile' ? <small>Liked by {item && item.likedBy ? item.likedBy.length: 0} people</small>: null}
        <FlashMessage id={id} message={this.state.message} alert={this.state.alert} flash={this.state.flash}/>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  //favoriteError: state.list.,
  isItFavorite: state.list.isFavorite,
})

export default connect(mapStateToProps, { addToFavorite, removeFavorite, isItemFavorite })(Favorite)
