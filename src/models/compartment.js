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

  stay(duration, gas) {
    this.ppN2 = Diffusion.haldane(gas, this.ppN2, this.gasExchangeRate, this.depth, duration);
  }

  moveTo(toDepth, gas, duration) {
    this.ppN2 = Diffusion.schreiner(gas, this.ppN2, this.gasExchangeRate, this.depth, toDepth, duration);
    this.depth = toDepth;
  }

  loadPercentage() {
    return 100.0 * this.ppN2 / this.m(0);
  }

  ndl(gas) {
    return Diffusion.reverseHaldane(gas, this.ppN2, this.m(0), this.gasExchangeRate, this.depth);
  }

  ndlToDepthWhileMoving(gas, toDepth, duration, nextDecoDepth) {
    return Diffusion.schreinerTime(
      gas,
      this.ppN2,
      this.m(nextDecoDepth),
      this.gasExchangeRate,
      this.depth,
      toDepth,
      duration
    );
  }

  /*
  * Returns the time left before a new deco obligation starts
  * at given depth.
  */
  ndlToDepth(gas, toDepth) {
    return Diffusion.reverseHaldane(gas, this.ppN2, this.m(toDepth), this.gasExchangeRate, this.depth);
  }

  /*
  * Returns the deco ceiling as multiple of 3 meters.
  */
  decoCeiling() {
    if(this.exactDecoCeiling() === 0) return 0;

    return Math.ceil((this.exactDecoCeiling() + 0.5) / 3) * 3
  }

  /*
  * Returns the exact deco ceiling (e.g. 1.23 meters).
  */
  exactDecoCeiling() {
    const ceiling = (this.tolerableAmbientPressure() - 1) * 10;

    if(ceiling <= 0) return 0;

    return ceiling;
  }

  /*
  * Returns the tolerable ambient pressure for the tissue
  * without the risk of bubble formation.
  * P(ambtol) = (P(tissue) - M0) / G
  */
  tolerableAmbientPressure() {
    return (this.ppN2 - this.mValue) / this.gValue;
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
