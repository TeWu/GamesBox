import { RackCircle } from './circle'
import { CIRCLES_IN_RACK } from '../config'


class Rack {

  constructor(player) {
    this.player = player
    this.content = []
  }

  fill(startingValue) {
    for (let i = startingValue; i <= CIRCLES_IN_RACK; i++)
      this.content.push(new RackCircle(i, this.player))
  }

  get head() { return this.content[0] }
  get(i) { return this.content[i] }
  shift() { return this.content.shift() }
  unshift() { return this.content.unshift() }

  isEmpty() { return this.content.length == 0 }
  nonEmpty() { return this.content.length > 0 }

  draw(p5) {
    for (let i = 0; i < this.content.length; i++)
      this.content[i].draw(p5)
  }

}

export default Rack