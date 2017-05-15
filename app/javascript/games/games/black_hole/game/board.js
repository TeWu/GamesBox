import { BoardCircle } from './circle'
import { BOARD_SIZE } from '../config'


class Board {

  constructor() {
    this.content = {}
    for (let i = 0; i < BOARD_SIZE; i++) {
      this.content[i] = {}
      for (let j = 0; j <= i; j++)
        this.content[i][j] = new BoardCircle(i, j)
    }
  }

  get(i, j) { return this.content[i][j] }

  findCircleUnderTheMouse(p5) {
    for (let i = 0; i < BOARD_SIZE; i++)
      for (let j = 0; j <= i; j++)
        if (this.content[i][j].isMouseInside(p5))
          return this.content[i][j]
  }

  draw(p5) {
    let row = null, circle = null
    for (row of Object.values(this.content)) {
      for (circle of Object.values(row)) {
        circle.draw(p5)
      }
    }
  }

}

export default Board