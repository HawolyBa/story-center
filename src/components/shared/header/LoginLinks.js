import React, {Fragment} from 'react'
import { NavLink } from 'react-router-dom'
import { Dropdown, DropdownToggle, DropdownMenu,  DropdownItem } from 'reactstrap'
import SwitchButton from '../SwitchButton'

const LoginLinks = ({ logout, toggle, isOpen, isOpenNotification, auth, profile, toggleNightmode, toggleNotif, notifications, markedAsSeen, checked, menuIcon }) => {
  const notificationLenght = notifications.length
  const notifica = notifications.slice(0,10)
  return (
    <Fragment>
      <NavLink onClick={menuIcon} exact to="/">Home</NavLink>
      <NavLink onClick={menuIcon} to="/browse">Browse</NavLink>
      <NavLink onClick={menuIcon} className="mobile-link" to="/profile">Profile</NavLink>
      <NavLink onClick={menuIcon} className="mobile-link" to={`/profile/${auth}`}>Public Profile</NavLink>
      <NavLink onClick={menuIcon} className="mobile-link" to='/notifications'>Notifications <span className="mobile-notif">{notificationLenght}</span></NavLink>
      <p className="mobile-link c-pointer" onClick={logout}>Logout</p>
      <Dropdown direction="left" isOpen={isOpen} toggle={toggle} className="mr-2">
        <DropdownToggle caret tag="span" data-toggle="dropdown" aria-expanded={isOpen}>
          <i className="far fa-user"></i>
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem header>Hello {profile.username}</DropdownItem>
          <DropdownItem><NavLink to="/profile">Profile</NavLink></DropdownItem>
          <DropdownItem><NavLink to={`/profile/${auth}`}>Public Profile</NavLink></DropdownItem>
          <DropdownItem><SwitchButton text={`${profile.nightMode ? 'Disable': 'Enable'} night mode ?`} checked={checked} switched={toggleNightmode} /></DropdownItem>
          <DropdownItem divider />
          <DropdownItem onClick={logout}>Logout</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Dropdown direction="left" isOpen={isOpenNotification} toggle={toggleNotif} className="notification-dropdown">
        <DropdownToggle caret tag="span" data-toggle="dropdown" aria-expanded={isOpenNotification}>
        <span className="notif"><i className="far fa-bell"></i>{notificationLenght > 0 && <span>{notificationLenght}</span>}</span>
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem header>Notifications / <span className="c-pointer td-underline bold" onClick={markedAsSeen}>Mark as read</span></DropdownItem>
          {notificationLenght > 0 ? notifica.map(notif => (
            <DropdownItem key={notif.id}>{notif.message}</DropdownItem>
          )):  <DropdownItem>No notification</DropdownItem>}
          <DropdownItem divider />
          <DropdownItem><NavLink to="/notifications">See all notifications</NavLink></DropdownItem>
        </DropdownMenu>
      </Dropdown>
      
    </Fragment>
  )
}

LoginLinks.defaultProps = {
  profile: {
    nightMode: false
  }
}

export default LoginLinks
