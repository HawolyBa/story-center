import React from 'react'
import NewLocation from '../shared/NewLocation';

const CallToActions = ({ history }) => {
  return (
    <div className="call-to-action flex spb frn ac mt-4">
      <div className="add-btn flex fc ac jc custom-btn" role="button" onClick={() => history.push('/story/add')}>
        <i className="fas fa-pencil-alt"></i>
        <span>Add a new story</span>
      </div>
      <div className="add-btn flex fc ac jc custom-btn" role="button" onClick={() => history.push('/character/add')}>
        <i className="fas fa-user"></i>
        <span>Add a new character</span>
      </div>
      <div className="add-btn flex fc ac jc custom-btn" role="button">
        <i className="fas fa-map-pin"></i>
        <NewLocation />
      </div>
    </div>
  )
}

export default CallToActions
