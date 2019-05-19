import React from 'react'
import { Link } from 'react-router-dom'

const LinkButton = ({cn, link, text}) => {
  return (
    <Link className={cn} to={link} onClick={() => this.history.push(link)}>
      {text}
    </Link>
  )
}

export default LinkButton
