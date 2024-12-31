import Environment from './environment'

export default class N2 {
  static FRACTION = 0.79;

  static ppAt(depth) {
    return this.FRACTION * Environment.pressureAt(depth)
  }
}
