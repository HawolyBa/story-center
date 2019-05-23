import React, {Fragment} from 'react'
import { NavLink } from 'react-router-dom';

const LogoutLinks = ({ menuIcon }) => {
  return (
    <Fragment>
      <NavLink onClick={menuIcon} to="/">Home</NavLink>
      <NavLink onClick={menuIcon} to="/browse">Browse</NavLink>
      <NavLink onClick={menuIcon} className="auth-btn" to="/auth">Login/Register</NavLink>
    </Fragment>
  )
}

export default LogoutLinks
