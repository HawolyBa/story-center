import React, { Fragment } from 'react'

const FlashMessage = props => {
  const {  message, flash, alert } = props
  if ( message && flash ) {
    return (
      <div id="flash" className={`alert alert-${alert}`}>{ message }</div> 
    ) 
  } else {
    return <Fragment></Fragment>
  }
}

export default FlashMessage
