import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <main className="inner-main">
      <div className="restricted flex fc jc ac">
        <h2>4<span>0</span>4</h2>
        <p>This page doesn't exist</p>
        <Link className="mt-5 square-btn primary-btn" to='/'>Go to homepage</Link>
      </div>
    </main>
  )
}

export default NotFound
