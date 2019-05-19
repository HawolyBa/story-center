import React from 'react'

const Register = ({ register, onChangeRegister, errors }) => {
  return (
    <div className="form-container register-container">
      <form onSubmit={register}>
        <h1>Story <span>Center</span></h1>
        <h2>Register</h2>
        {errors && errors.general ? <p className="errors">{errors.general}</p>: null}
        <input onInput={onChangeRegister} type="text" name="username" placeholder="Username"/>
        {errors && errors.username ? <p className="errors">{errors.username}</p>: null}
        <input onInput={onChangeRegister} type="email" name="email" placeholder="Email address"/>
        {errors && errors.email ? <p className="errors">{errors.email}</p>: null}
        <input onInput={onChangeRegister} type="password" name="password" placeholder="Password"/>
        {errors && errors.password ? <p className="errors">{errors.password}</p>: null}
        <input onInput={onChangeRegister} type="password" name="confirmPassword" placeholder="Confirm Password"/>
        {errors && errors.confirmPassword ? <p className="errors">{errors.confirmPassword}</p>: null}
        <button className="custom-btn">Register</button>
      </form>
    </div>
  )
}

export default Register
