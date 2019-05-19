import React, {useEffect, useState} from 'react'
import {connect} from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import { login, register, resetPassword } from '../../redux/actions/authActions'
import { cleanup } from '../../redux/actions/storyActions'
import PropTypes from 'prop-types'

import Login from './Login';
import Register from './Register';
import Social from './Social';
import PasswordLost from './PasswordLost';


const Authentication = (props) => {

  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [registerData, setRegisterData] = useState({ email: '', password: '', username:'', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [alerts, setAlerts] = useState({ message: '', alert: '' })
  const [isOpen, setModal] = useState(false)

  useEffect(() => {
    setErrors(props.UI.errors)
    setAlerts(props.alerts)
  }, [props.UI.errors, props.alerts])

  const login = e => {
    e.preventDefault()
    props.login(loginData, props.history)
  }

  const register = e => {
    e.preventDefault()
    const usernames = props.users && props.users.map(user => user.username)
    props.register(registerData, usernames, props.history)
  }

  const onChange = e => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value.trim() })
  }

  const onChangeRegister = e => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value.trim() })
  }

  const changeRightPanel = () => {
    document.querySelector('#container').classList.add('right-panel-active')
  }

  const changeLeftPanel = () => {
    document.querySelector('#container').classList.remove('right-panel-active')
  }

  const toggleModal = () => {
    setModal(!isOpen)
    setAlerts({ message: '', alert: '' })
  }

  const resetPassword = e => {
    e.preventDefault()
    props.resetPassword(e.target.email.value)
  }

  const { UI: {loading} } = props
  return (
    <div className="authentication flex fc jc ac">
      <PasswordLost resetPassword={resetPassword} alerts={alerts} toggleModal={toggleModal} isOpen={isOpen}/>
      <div id="container">
        <Register errors={errors} onChangeRegister={onChangeRegister} register={register} />
        <Login toggleModal={toggleModal} errors={errors} onChange={onChange} login={login} loading={loading} />
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome back</h1>
              <p>Login to keep working with all your stories, characters and locations</p>
              <button className="ghost" id="login" onClick={changeLeftPanel}>Login</button>
              <Social/>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hi there</h1>
              <p>New on this website ? Register an account to start working on your stories and characters</p>
              <button className="ghost" id="register" onClick={changeRightPanel}>Register</button>
              <Social/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

Authentication.defaultProps = {
  users: []
}

Authentication.propTypes = {
  auth: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
  users: PropTypes.array.isRequired
}

const mapStateToProps = state => ({
  auth: state.firebase.auth,
  UI: state.UI,
  users: state.firestore.ordered.users,
  alerts: state.alerts
})

export default compose(connect(mapStateToProps, { login, register, resetPassword, cleanup }), firestoreConnect([ { collection: 'users' } ]))(Authentication)