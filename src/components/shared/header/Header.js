import React, { Component } from 'react'
import { object, func, array } from 'prop-types'
import { connect } from 'react-redux'
import { logout } from '../../../redux/actions/authActions'
import { changeNightmode, getNotifications, markedAsSeen } from '../../../redux/actions/profileActions'
import { cleanup } from '../../../redux/actions/storyActions'

import { Link } from 'react-router-dom';
import Search from '../Search'
import LoginLinks from './LoginLinks';
import LogoutLinks from './LogoutLinks';

export class Header extends Component {

  state = {
    windoWidth: window.innerWidth,
    dropdownOpen: false,
    notifIsOpen: false,
    checked: false,
    menuIsOpen: false
  }

  updateDimensions = e => {
    this.setState({windoWidth: window.innerWidth });
  }

  componentWillMount() {
    this.updateDimensions()
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.profile.nightMode !== nextProps.profile.nightMode) {
      this.setState({ checked: nextProps.profile.nightMode })
    }
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);
    if (this.props.auth.uid) this.props.getNotifications()
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.auth.uid && this.props.auth.uid) {
      this.props.getNotifications()
    }
  }

  componentWillUnmount() {
    this.props.cleanup()
  }

  menuIcon = e => {
    document.querySelector('#menuBar1').classList.toggle('transMenuBar1')
    document.querySelector('#menuBar2').classList.toggle('transMenuBar2')
    document.querySelector('#menuBar3').classList.toggle('transMenuBar3')
    document.querySelector('#main-nav').classList.toggle('flex')
    document.querySelector('#main-nav').classList.toggle('open')
    document.querySelector('.search-form').classList.toggle('open')

 }

  toggle = () => {
    this.setState({ dropdownOpen: !this.state.dropdownOpen });
  }

  toggleNotif = () => {
    this.setState({ notifIsOpen: !this.state.notifIsOpen });
  }

  toggleNightmode = () => {
    this.props.changeNightmode()
  }

  markedAsSeen = () => {
    this.props.markedAsSeen(this.props.notifications)
  }

  logout = () => {
    this.props.logout()
    this.state.windoWidth < 850 && this.menuIcon()
  }

  render() {
    return (
      <header id="main-header">
        <div className="inner flex ac frn spb">
          <h1><Link className="logo" to='/'>Story <span>Center</span></Link></h1>
          <div className="flex ac spb frw">
            <Search cn="search-form" history={this.props.history}/>
            <nav id="main-nav" className="flex fs ac frn">
              {this.props.auth.uid ?
              <LoginLinks 
                windoWidth={this.state.windoWidth}
                auth={this.props.auth.uid} 
                logout={this.logout} 
                isOpen={this.state.dropdownOpen} 
                toggle={this.toggle}
                profile={this.props.profile}
                toggleNightmode={this.toggleNightmode}
                toggleNotif={this.toggleNotif}
                isOpenNotification={this.state.notifIsOpen}
                notifications={this.props.notifications}
                markedAsSeen={this.markedAsSeen}
                checked={this.state.checked}
                menuIcon={this.menuIcon}
              />: 
              <LogoutLinks menuIcon={this.menuIcon} />}
              <Search cn="search-form responsive-searchbar"/>
            </nav>
            <div id="menu-icon" onClick={this.menuIcon} className="navbar-toggler"  data-toggle="collapse" data-target="#mainNavbar" aria-controls="mainNavbar" role="button" aria-expanded="false" aria-label="Toggle navigation">
              <span className="menu-bar" id="menuBar1"></span>
              <span className="menu-bar" id="menuBar2"></span>
              <span className="menu-bar" id="menuBar3"></span>
            </div>
          </div>
        </div>
      </header>
    )
  }
}

Header.defaultProps = {
  profile: {
    nightMode: false
  }
}


Header.propTypes = {
  logout: func.isRequired,
  changeNightmode: func.isRequired,
  getNotifications: func.isRequired,
  auth: object.isRequired,
  profile: object.isRequired,
  notifications: array.isRequired,
  markedAsSeen: func.isRequired
}

const mapStateToProps = state => ({
  auth: state.firebase.auth,
  profile: state.firebase.profile,
  notifications: state.profile.notifications
})

export default connect(mapStateToProps, { logout, changeNightmode, getNotifications, markedAsSeen, cleanup })(Header)
