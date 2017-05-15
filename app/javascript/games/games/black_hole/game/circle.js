import { BOARD_SIZE, CIRCLE_RADIUS, EMPTY_CIRCLE_COLOR, PLAYER_COLORS } from '../config'
import Color from 'tinycolor2'


class Circle {

  constructor(value = 0, player = null) {
    this.setValueAndPlayer(value, player)
    this.fx = Circle.FX.none
  }

  setValueAndPlayer(value, player) {
    this.value = value
    this.player = player
    this.color = player == null ? EMPTY_CIRCLE_COLOR : PLAYER_COLORS[player.num]
    this.borderWeight = this.value + 1
    this.radius = CIRCLE_RADIUS - Math.floor(this.value / 2)
  }

  transformInto(circle) {
    this.setValueAndPlayer(circle.value, circle.player)
  }

  empty() { this.setValueAndPlayer(0, null) }

  isEmpty() { return this.value == 0 }

  calculateCoordinates() {
    this.x = this.calculateX()
    this.y = this.calculateY()
  }

  isMouseInside(p5) {
    const dx = this.x - p5.mouseX
    const dy = this.y - p5.mouseY
    return Math.sqrt(dx * dx + dy * dy) < CIRCLE_RADIUS
  }

  draw(p5) {
    let color = this.color
    if (this.fx == Circle.FX.blink) {
      if (this.color1.constructor === String) {
        this.color1 = p5.color(this.color1)
        this.color2 = p5.color(this.color2)
      }
      this.colorBlend += this.colorBlendStep
      if (this.colorBlend <= 0 || this.colorBlend >= 1) this.colorBlendStep *= -1
      color = p5.lerpColor(this.color1, this.color2, this.colorBlend)
    }

    const x = this.x
    const y = this.y
    p5.fill(color)
    p5.strokeWeight(this.borderWeight)
    p5.ellipse(x, y, this.radius * 2, this.radius * 2)
    p5.fill(0)

    if (this.i != null) {
      p5.textSize(12)
      p5.fill("white")
      p5.text(`${this.i}, ${this.j}`, this.x - 10, this.y + 20)
      p5.fill("yellow")
      const idx = (this.i / 2) * (this.i + 1) + this.j
      p5.text(`${idx}`, this.x - 3, this.y + 35)
      p5.fill("black")
    }
    if (this.value > 0) {
      p5.textSize(52)
      p5.text(this.value, x - CIRCLE_RADIUS / 3 - Math.floor(Math.log10(this.value)) * 17, y + CIRCLE_RADIUS / 2)
    }
  }

  stopFx() { this.fx = Circle.FX.none }

  blink() {
    this.fx = Circle.FX.blink
    this.color1 = this.color
    this.color2 = Color(this.color).spin(6).saturate(100).darken(10).toHexString()
    this.colorBlend = 0
    this.colorBlendStep = 0.02
  }

}
Circle.FX = { none: 0, blink: 1 }


export class RackCircle extends Circle {

  constructor(value, player) {
    super(value, player)
    this.calculateCoordinates()
  }

  calculateX() {
    let x = this.player.num == 0 ? CIRCLE_RADIUS : CIRCLE_RADIUS + 2 * CIRCLE_RADIUS * BOARD_SIZE + 4 * CIRCLE_RADIUS
    if (this.value % 2 == 0) x += CIRCLE_RADIUS * (this.player.num == 0 ? 1.74 : -1.74)
    return x + 1
  }
  calculateY() {
    return CIRCLE_RADIUS + CIRCLE_RADIUS * this.value
  }

}


export class BoardCircle extends Circle {

  constructor(i, j) {
    super()
    this.i = i
    this.j = j
    this.calculateCoordinates()
  }

  calculateX() {
    return CIRCLE_RADIUS * 4 + this.i * CIRCLE_RADIUS * 2 - this.j * CIRCLE_RADIUS
  }
  calculateY() {
    return CIRCLE_RADIUS + this.j * CIRCLE_RADIUS * 1.74 + 1
  }

}