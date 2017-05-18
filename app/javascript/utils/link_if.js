import React from 'react'
import { Link } from 'react-router-dom'

export default (props) => {
  if (props.if) return <Link to={props.to}>{props.children}</Link>
  return <span>{props.children}</span>
}