import N2 from './N2';
import { ASCENT_RATE, DESCENT_RATE } from '../constants/diving';

export default class Diffusion {
  /*
  * Returns the new PPN2 after time at constant depth.
  *
  * P(new) = P(gas) - (P(gas) - P(old)) * (e^-kt)
  */
  static haldane(initialPPN2, gasExchangeRate, depth, duration) {
    return N2.ppAt(depth) - (N2.ppAt(depth) - initialPPN2) * (Math.E ** (-duration * gasExchangeRate));
  }

  /*
  * Returns the maximum amount of time the diver can spend at depth
  * without deco obligation.
  *
  * time = ln((P(gas) - P(new)) / (P(gas) - P(old))) / -k
  */
  static reverseHaldane(initialPPN2, targetPPN2, gasExchangeRate, depth) {
    const gasUptakeRatio = (N2.ppAt(depth) - targetPPN2) / (N2.ppAt(depth) - initialPPN2);

    if(gasUptakeRatio < 0) return Infinity;

    return Math.log(gasUptakeRatio) / -gasExchangeRate;
  }

  /*
  * Returns the new PPN2 after time while changing depth.
  *
  * P(new) = P(i_gas) + R(t - 1 / k) - [P(i_gas) - P(old) - (R / k)] * (e^-kt)
  */
  static schreiner(initialPPN2, gasExchangeRate, fromDepth, toDepth) {
    const movementRate = fromDepth > toDepth ? -ASCENT_RATE : DESCENT_RATE;
    const duration = (toDepth - fromDepth) / movementRate;

    if (duration == 0) return initialPPN2;

    const fromPPN2 = N2.ppAt(fromDepth);
    const toPPN2 = N2.ppAt(toDepth);
    const rate = (toPPN2 - fromPPN2) / duration;

    return (
      fromPPN2 +
        (rate * (duration - 1 / gasExchangeRate)) -
        ((fromPPN2 - initialPPN2 - (rate / gasExchangeRate)) * (Math.E ** (-duration * gasExchangeRate)))
    );
  }
}
