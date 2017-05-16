import { observable } from 'mobx'

const map = Symbol()

class ObservableShallowSet {

  constructor() {
    this[map] = observable.shallowMap()
  }

  backingMap() { return this[map] }

  add(value) { return this[map].set(value, null) }
  addAll(values) { values.forEach(val => this[map].set(val, null)) }
  delete(value) { return this[map].delete(value) }
  clear() { return this[map].clear() }
  contains(value) { return this[map].has(value) }
  values() { return this[map].keys() }
  get size() { return this[map].size }

  forEach(callback, thisArg = this) {
    for (const value of this)
      callback.call(thisArg, value)
  }

  map(callback, thisArg = this) {
    return this[map].keys().map(callback, thisArg)
  }

  [Symbol.iterator]() {
    return this[map].keys()
  }

}

export default ObservableShallowSet