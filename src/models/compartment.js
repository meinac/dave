import N2 from './N2'
import Diffusion from './diffusion'

export default class Compartment {
  constructor(name, depth, halfTime, mValue, gValue) {
    this.name = name;
    this.depth = depth;
    this.halfTime = halfTime;
    this.mValue = mValue;
    this.gValue = gValue;
    this.ppN2 = N2.ppAt(0);
    this.gasExchangeRate = Math.log(2, Math.E) / halfTime;
  }

  stay(duration) {
    this.ppN2 = Diffusion.haldane(this.ppN2, this.gasExchangeRate, this.depth, duration);
  }

  moveTo(toDepth) {
    this.ppN2 = Diffusion.schreiner(this.ppN2, this.gasExchangeRate, this.depth, toDepth);
    this.depth = toDepth;
  }

  loadPercentage() {
    return 100.0 * this.ppN2 / this.m(0);
  }

  ndl() {
    return Diffusion.reverseHaldane(this.ppN2, this.m(0), this.gasExchangeRate, this.depth);
  }

  /*
  * Returns the M value for the given depth.
  * `M(0)` is different than `M0`. `M(0)` means the maximum allowed inert gas partial pressure
  * at 0 depth while M0 is an empirical Buhlmann constant which means the maximum allowed inert
  * gas partial pressure at 0 ATM.
  *
  * M(d) = M0 + G*d
  */
  m(depth) {
    return this.mValue + (depth / 10 + 1) * this.gValue;
  }
}
