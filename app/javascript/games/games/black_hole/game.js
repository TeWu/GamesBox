import BlackHoleGameChannel from './channel'


class BlackHoleGame {

  constructor(component) {
    this.component = component
    this.channel = new BlackHoleGameChannel(component, self).subscribe()

    this.sketch = function (initialProps, p) {
      p.setup = function () {
        p.frameRate(1)
        p.createCanvas(200, 150)
        p.background(220)
      }

      p.draw = function () {
        p.fill("#" + (Math.round(Math.random() * 1000000)))
        p.ellipse(20, 20, 100, 100)
        p.fill(p.color(initialProps.bigC || '#7c9'))
        p.ellipse(140, 140, 200, 200)
      }

      p.mousePressed = function () {
        p.redraw()
      }
    }

  }

  finalize() {
    this.channel.unsubscribe()
    this.channel = null
  }

}

export default BlackHoleGame