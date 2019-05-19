import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import { getUserVote, rateChapter } from '../../../redux/actions/storyActions'
import firebase from '../../../config/fbConfig'
import StarRatings from 'react-star-ratings';
import PropTypes from 'prop-types'

class Ratings extends Component {

  state = {}

  componentDidMount() {
    if (this.props.auth.uid) {
      this.props.getUserVote(this.props.id, this.props.chapid)
    }
    this.setState({ voters: this.getVote() })
  }

  getVote = () => {
    let voters = []
    firebase
      .firestore()
      .collection('chapters')
      .doc(this.props.chapid)
      .onSnapshot(snap => {
        if (snap.exists) voters = snap.data().voters
      })
    return voters
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    if (nextProps.newInfo.hasOwnProperty('newVoters')) {
      return {
        voters: nextProps.newInfo.newVoters,
        rating: nextProps.newInfo.newRating,
        userVote: nextProps.newInfo.userVote
      }
    } else return null
  }

  changeRating = async ( newRating, name ) => {
    const { chapid } = this.props
    this.setState({
      rating: newRating
    });

    this.props.rateChapter(chapid, newRating)
  }
  
  checkVote = () => {
    const { chapter, userVote, auth } = this.props

    if (!userVote.hasOwnProperty('note') && auth.uid && chapter.authorId !== auth.uid) {
      return (
        <Fragment>
          <small>Rate this chapter (Careful, you can't change your vote !)</small><br/>
          <StarRatings
          rating={0}
          starRatedColor="#27bab0"
          changeRating={this.changeRating}
          starDimension={"20px"}
          numberOfStars={5}
          starSpacing={'2px'}
          name='rating'
          />
        </Fragment>
      )
    } else if (userVote.hasOwnProperty('note')) {
      return (
        <Fragment>
          <div className="flex fs ac frn rating-line">
            <StarRatings
            rating={this.state.rating ? this.state.rating: chapter.note }
            starRatedColor="#27bab0"
            numberOfStars={5}
            name='rating'
            starDimension={"20px"}
            isSelectable={false}
            starSpacing={'2px'}
            /> 
            {
              this.state.rating ? 
              <span className="note">{this.state.rating}</span>: 
              <span className="note">{chapter.note && chapter.note.toFixed(1)}</span>
            }
            <br/>
          </div>
          <small>
          {`${this.props.chapter.votesCount} vote${this.props.chapter.votesCount > 1 ? 's': ''} / Your vote: ${this.state.userVote ? this.state.userVote: userVote && userVote.note}`}
          </small><br/>
        </Fragment>
      )
    } else if (chapter.authorId === auth.uid) {
      return (
        <Fragment>
        <div className="flex frn ac fs">
          <StarRatings
          rating={chapter && chapter.note}
          starRatedColor="#27bab0"
          numberOfStars={5}
          starSpacing={'2px'}
          name='rating'
          starDimension={"20px"}
          /> <span className="note">{ chapter && chapter.note.toFixed(1) }</span>
        </div>
          <small>{chapter && chapter.voters && chapter.voters.length} vote{this.state.voters && this.state.voters.length > 1 ? 's' : ''}</small>
        </Fragment>
      )
    } else if (!auth.uid) {
      return <small>You have to <a href='/register'>register</a> to vote</small>
    }
    
  }


  render() {
    return (
      <div className="chapter-rating">
        {this.checkVote()}
      </div>
    )
  }
}

Ratings.defaultProps = {
  userVote: {}
}

Ratings.propTypes = {
  userVote: PropTypes.object.isRequired,
  newInfo: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
}

const mapStateToProps = state => {
  return {
    userVote: state.story.userVote,
    newInfo: state.story.newInfo,
    auth: state.firebase.auth
  }
}

export default compose(connect(mapStateToProps, { getUserVote, rateChapter }), firestoreConnect([{ collection: 'users' }, {collection: 'stories'}]))(Ratings)
