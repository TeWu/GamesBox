import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import { observer } from 'mobx-react'
import testStore from './test_store'


@observer
class Test extends Component {
  constructor(props) {
    super(props)
    this.store = testStore
  }

  onTextChange(e) {
    this.store.text = e.target.value
  }

  render() {
    const { text } = this.store
    return <div>
      <div>Hello {text}!</div>
      <div><input value={text} onChange={this.onTextChange.bind(this)} /></div>
      <div><Link to="/users/2">Go to Test2</Link></div>
    </div>
  }
}


const Test2 = props => (
  <div>
    <h2>Test2</h2>
    <pre>{JSON.stringify(props)}</pre>
    <div><Link to="/users">Go to Test</Link></div>
  </div>
)


class TestRoot extends Component {
  constructor(props) {
    super(props)
    this.store = testStore
    this.store.text = props.text
  }

  render() {
    return (
      <Router>
        <div>
          <Route exact path="/users" component={Test} />
          <Route exact path="/users/2" component={Test2} />
        </div>
      </Router>
    )
  }
}

export default TestRoot