import Environment from './environment'

export default class N2 {
  static FRACTION = 0.79;

  constructor(fraction) {
    this.fraction = fraction;
  }

  ppAt(depth) {
    return this.fraction * Environment.pressureAt(depth);
  }

  static ppAt(depth) {
    return this.FRACTION * Environment.pressureAt(depth)
  }
}
