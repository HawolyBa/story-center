import React from 'react'
import { Link } from 'react-router-dom'

const Private = ({ data, type }) => {
  return (
    <div className="restricted flex fc jc ac">
      <React.Fragment>
        <h2 className="text-center">{type}</h2>
        <p>{type !== 'Unauthorized' ? `You cannot view this ${type}`: 'Acces limited' }</p>
        <div className="button-group flex jc ac mt-4">
          <Link className="square-btn primary-btn mr-5" to='/'>Go to the homepage</Link>
          {data && data.uid && <Link className="square-btn outlined" to='/profile'>Go to your profile</Link>}
          {data && !data.uid && <Link className="square-btn outlined" to='/auth'>Login</Link>}
        </div>
      </React.Fragment>
    </div>
  )
}

export default Private
