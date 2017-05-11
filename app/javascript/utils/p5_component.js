import React, { Component } from 'react'
import p5 from 'p5'

class P5 extends Component {

  componentDidMount() {
    this.p5 = new p5(this.props.sketch.bind(this, this.props), this.wrapper)
  }

  componentWillUnmount() {
    this.p5.remove()
    this.p5 = null
  }

  componentWillReceiveProps(newProps) {
    if (newProps.sketch !== this.props.sketch) {
      this.p5.remove()
      this.p5 = new p5(newProps.sketch.bind(this, newProps), this.wrapper)
    }
    else if (this.p5.receiveProps)
      this.p5.receiveProps(newProps)
  }

  render() {
    return <div ref={r => this.wrapper = r}></div>
  }

}

export default P5