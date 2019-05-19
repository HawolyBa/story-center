import React from 'react'
import { Sentry } from 'react-activity';
import 'react-activity/lib/Sentry/Sentry.css';

const Login = ({ login, onChange, loading, errors, toggleModal }) => {
  return (
    <div className="form-container login-container">
      <form onSubmit={login}>
        <h1>Story <span>Center</span></h1>
        <h2>Login</h2>
        {errors && errors.general ? <p className="errors">{errors.general}</p>: null}
        <input onChange={onChange} type="email" name="email" placeholder="Email address"/>
        {errors && errors.email ? <p className="errors">{errors.email}</p>: null}
        <input onChange={onChange} type="password" name="password" placeholder="Password"/>
        {errors && errors.password ? <p className="errors">{errors.password}</p>: null}
        <p style={{cursor: 'pointer'}} onClick={toggleModal}>Password lost ? Click here</p>
        <button className="custom-btn">{loading ? <Sentry/>: 'Login'}</button>
      </form>
    </div>
  )
}

export default Login
