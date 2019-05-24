import React, { Component } from 'react'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import { withRouter } from 'react-router-dom'
import CookieConsent from "react-cookie-consent";

import Header from './header/Header'
import FloatingButton from './FloatingButton';
import FlashMessage from './FlashMessage';

class Layout extends Component {

  _isMounted = false

  state = {
    alert: '',
    flash: false,
    message: ''
  }

  componentDidMount() {
    this._isMounted = true
  }

  componentDidUpdate(prevProps) {
    if( prevProps.currentUser !== this.props.currentUser ) {
      if (this.props.currentUser.nightMode) {
        document.body.classList.add('nightmode')
      } else {
        document.body.classList.remove('nightmode')
      }
    }
    if (this.props.alerts !== prevProps.alerts) {
      this.setState({ message: this.props.alerts.message, flash: true, alert: this.props.alerts.alert })
      if (this._isMounted) {
        setTimeout(() => this.setState({ flash: false }), 3000)
      }
    }
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  render() {
    const { flash, message, alert } = this.state
    return (
      <div className='main-content'>
        <Header history={this.props.history}/>
        {this.props.children}
        {this.props.auth.uid && <FloatingButton userId={this.props.auth.uid} />}
        <FlashMessage flash={flash} message={message} alert={alert}/>
        <CookieConsent
          enableDeclineButton
          location="bottom"
          buttonText="I understand"
          cookieName="storycentercookie"
          style={{ background: "#2B373B" }}
          expires={150}
          buttonClasses="cookie-btn"
          buttonStyle={{ backgroundColor: '#27bab0', color: "#fff", fontSize: "13px"  }}
          declineButtonStyle={{ backgroundColor: '#cf3a3a', fontSize: "13px" }}
      >
        This website uses cookies to enhance the user experience
        </CookieConsent>
      </div>
    )
  }
}

Layout.defaultProps = {
  currentUser: {}
}

const mapStateToProps = state => {
  const auth = state.firebase.auth
  const users = state.firestore.ordered.users
  const currentUser = users && users.filter(user => user.id === auth.uid)[0]
  return {
    auth,
    currentUser,
    alerts: state.alerts
  }
}

export default withRouter(compose(connect(mapStateToProps), firestoreConnect([  { collection: 'users' }]))(Layout))