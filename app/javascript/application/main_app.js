import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import UsersIndexPage from 'users/index_page'

class MainApp extends Component {
  render() {
    return (
      <BrowserRouter>
        <Route exact path="/users" component={UsersIndexPage} />
      </BrowserRouter>
    )
  }
}

export default MainApp