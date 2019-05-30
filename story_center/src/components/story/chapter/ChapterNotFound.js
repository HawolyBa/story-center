import React from 'react'
import {Link} from 'react-router-dom'

const ChapterNotFound = ({ link }) => {
  return (
    <div className="restricted">
      <div className="inner flex fc ac jc">
        <h2>4<span>0</span>4</h2>
        <p>This chapter does not exist</p>
        <Link to={link} className="square-btn custom-btn mt-4" size="sm"><i className="fas fa-long-arrow-alt-left"></i> Go back to story</Link>
      </div>
    </div>
  )
}

export default ChapterNotFound