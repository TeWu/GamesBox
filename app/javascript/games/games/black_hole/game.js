import BlackHoleGameChannel from './channel'


class BlackHoleGame {

  constructor(component) {
    this.component = component
    this.channel = new BlackHoleGameChannel(component, self).subscribe()
  }

  finalize() {
    this.channel.unsubscribe()
    this.channel = null
  }

}

export default BlackHoleGame