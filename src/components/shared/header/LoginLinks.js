import React, {Fragment} from 'react'
import { NavLink } from 'react-router-dom'
import { Dropdown, DropdownToggle, DropdownMenu,  DropdownItem } from 'reactstrap'
import SwitchButton from '../SwitchButton'

const LoginLinks = ({ logout, toggle, isOpen, isOpenNotification, auth, profile, toggleNightmode, toggleNotif, notifications, markedAsSeen, checked, menuIcon }) => {
  return (
    <Fragment>
      <NavLink onClick={menuIcon} exact to="/">Home</NavLink>
      <NavLink onClick={menuIcon} to="/browse">Browse</NavLink>
      <NavLink onClick={menuIcon} className="mobile-link" to="/profile">Profile</NavLink>
      <NavLink onClick={menuIcon} className="mobile-link" to={`/profile/${auth}`}>Public Profile</NavLink>
      <NavLink onClick={menuIcon} className="mobile-link" to='notifications'>Notifications <span className="mobile-notif">{notifications.length}</span></NavLink>
      <p onClick={menuIcon} className="mobile-link" onClick={logout}>Logout</p>
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
      <Dropdown direction="left" isOpen={isOpenNotification} toggle={toggleNotif}>
        <DropdownToggle caret tag="span" data-toggle="dropdown" aria-expanded={isOpenNotification}>
        <span className="notif"><i className="far fa-bell"></i>{notifications.length > 0 && <span>{notifications.length}</span>}</span>
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem header>Notifications / <span className="c-pointer" onClick={markedAsSeen}>Mark as read</span></DropdownItem>
          { notifications.length > 0 ? notifications.map(notif => (
            <DropdownItem key={notif.id}>{notif.message}</DropdownItem>
          )):  <DropdownItem>No notification</DropdownItem>}
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
