import { observable, computed } from 'mobx'
import axios from 'axios'

class TestStore {
  @observable text = ""
}

export default new TestStore