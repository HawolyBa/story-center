import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

const AuthRoute = ({component: Component, auth, ...rest}) => {
  return (
    <Route {...rest} render={(props) => !auth.uid ?  <Redirect to='/auth'/>:<Component {...props}/>}/> 
  )
}
const mapStateToProps = state => ({
  auth: state.firebase.auth
})

AuthRoute.propTypes = {
  auth: PropTypes.object.isRequired
}

export default connect(mapStateToProps)(AuthRoute)
