import React, { Component } from 'react'
//import { string } from 'prop-types'
import { connect } from 'react-redux'
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";

class Guidances extends Component {

  submit = e => {
    e.preventDefault()
  }
  
  render() {
    return (
      <div className="inner-main">
        <div className="guidances">
          <h2>Rules</h2>
          <p>Before posting your first stories, characters and locations, you must accept the rules of this website.</p>
          <ul>
            <li>You must not post an image that doesn't belong to you or that you haven't the right. We recommend you look for story banners on free stock photo websites like <a href="https://www.pexels.com/" target="_blank" rel="noopener noreferrer">Pexels</a> or <a href="https://unsplash.com/" target="_blank" rel="noopener noreferrer">Unsplash</a> to avoid any problems.<br/>
            If an author posts a copyrighted image, he or she may face a permanent ban.</li>
          </ul>
        </div>
      </div>
    )
  }
}

Guidances.defaultProps = {
   
}

Guidances.propTypes = {
  
}

const mapStateToProps = (state) => ({
  
})
export default compose(connect(mapStateToProps), firestoreConnect([]) )(Guidances)