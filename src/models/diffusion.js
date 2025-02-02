import N2 from './N2';
import { ASCENT_RATE, DESCENT_RATE } from '../constants/diving';

export default class Diffusion {
  /*
  * Returns the new PPN2 after time at constant depth.
  *
  * The gas uptaking can also be calculated by schereiner equation as it turns
  * into haldane when the `toDepth` equals to `fromDepth` but I'm leaving this
  * function here as I'm learning the algorithms.
  *
  * P(new) = P(gas) - (P(gas) - P(old)) * (e^-kt)
  */
  static haldane(gas, initialPPN2, gasExchangeRate, depth, duration) {
    return gas.n2.ppAt(depth) - (gas.n2.ppAt(depth) - initialPPN2) * (Math.E ** (-duration * gasExchangeRate));
  }

  /*
  * Returns the maximum amount of time the diver can spend at depth
  * without deco obligation.
  *
  * time = ln((P(gas) - P(new)) / (P(gas) - P(old))) / -k
  */
  static reverseHaldane(gas, initialPPN2, targetPPN2, gasExchangeRate, depth) {
    const gasUptakeRatio = (gas.n2.ppAt(depth) - targetPPN2) / (gas.n2.ppAt(depth) - initialPPN2);

    if(gasUptakeRatio < 0) return Infinity;

    return Math.log(gasUptakeRatio) / -gasExchangeRate;
  }

  /*
  * Returns the new PPN2 after time while changing depth.
  *
  * P(new) = P(i_gas) + R(t - 1 / k) - [P(i_gas) - P(old) - (R / k)] * (e^-kt)
  */
  static schreiner(gas, initialPPN2, gasExchangeRate, fromDepth, toDepth, duration) {
    if(duration === null) duration = Diffusion.calculateDuration(fromDepth, toDepth);
    if(duration == 0) return initialPPN2;

    const fromPPN2 = gas.n2.ppAt(fromDepth);
    const toPPN2 = gas.n2.ppAt(toDepth);
    const rate = (toPPN2 - fromPPN2) / duration;

    return (
      fromPPN2 +
        (rate * (duration - 1 / gasExchangeRate)) -
        ((fromPPN2 - initialPPN2 - (rate / gasExchangeRate)) * (Math.E ** (-duration * gasExchangeRate)))
    );
  }

  /*
  * Returns the maximum PPN2 to be able to ascend from given depth without deco obligation.
  *
  * P(old) = P(i_gas) - (R / k) - [P(i_gas) + R(t - 1 / k) - P(new)] / (e^-kt)
  */
  static reverseSchreiner(gas, targetPPN2, gasExchangeRate, fromDepth, toDepth) {
    const duration = this.calculateDuration(fromDepth, toDepth);

    if (duration == 0) return initialPPN2;

    const fromPPN2 = gas.n2.ppAt(fromDepth);
    const toPPN2 = gas.n2.ppAt(toDepth);
    const rate = (toPPN2 - fromPPN2) / duration;

    return (
      fromPPN2 -
        (rate / gasExchangeRate) -
        ((fromPPN2 + (rate * (duration - 1 / gasExchangeRate)) - targetPPN2) / (Math.E ** (-duration * gasExchangeRate)))
    );
  }

  /**********************************************************
  * Everything below this point are part of the private API.
  ***********************************************************/

  static schreinerTime(gas, initialPPN2, targetPPN2, gasExchangeRate, fromDepth, toDepth, duration) {
    /*
    * First check if we can already move to target depth without a new deco obligation
    */
    const max = this.schreiner(gas, initialPPN2, gasExchangeRate, fromDepth, toDepth, duration);

    if(max <= targetPPN2) return duration;

    const maxIterations = 1000000;
    const tolerance = 0.00001;
    const rate = (toDepth - fromDepth) / duration;

    let lowPoint = fromDepth;
    let highPoint = toDepth;

    for(let i = 0; i < maxIterations; i++) {
      const currentDepth = (lowPoint + highPoint) / 2.0;
      const currentDuration = (currentDepth - fromDepth) / rate;

      const currentValue = this.schreiner(gas, initialPPN2, gasExchangeRate, fromDepth, currentDepth, currentDuration);

      if(Math.abs(currentValue - targetPPN2) <= tolerance) return currentDuration;

      (currentValue < targetPPN2) ? lowPoint = currentDepth : highPoint = currentDepth;
    }

    return duration;
  }

  /*
  * TODO: This must be encapsulated in Diver model.
  */
  static calculateDuration(fromDepth, toDepth) {
    const movementRate = fromDepth > toDepth ? -ASCENT_RATE : DESCENT_RATE;
    const duration = (toDepth - fromDepth) / movementRate;

    return duration;
  }
}
