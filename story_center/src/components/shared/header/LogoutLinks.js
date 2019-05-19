import React, {Fragment} from 'react'
import { NavLink } from 'react-router-dom';

const LogoutLinks = () => {
  return (
    <Fragment>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/browse">Browse</NavLink>
      <NavLink className="auth-btn" to="/auth">Login/Register</NavLink>
    </Fragment>
  )
}

export default LogoutLinks
