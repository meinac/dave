import Environment from './environment'

export default class N2 {
  static FRACTION_IN_AIR = 0.79;

  constructor(ratio) {
    this.fraction = ratio / 100.0;
  }

  ppAt(depth) {
    return this.fraction * Environment.pressureAt(depth);
  }

  static ppAt(depth) {
    return this.FRACTION_IN_AIR * Environment.pressureAt(depth)
  }
}
