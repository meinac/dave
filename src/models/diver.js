import { MIN_TIME } from '../constants/diving';
import TTS from './TTS';

export default class Diver {
  constructor(compartments, currentGas) {
    this.currentDepth = 0;
    this.compartments = compartments;
    this.history = [];
    this.currentGas = currentGas;

    this.updateHistory();
  }

  moveTo(depth, duration = null) {
    this.compartments.forEach(compartment => compartment.moveTo(depth, this.currentGas, duration));

    this.currentDepth = depth;
    this.updateHistory();
  }

  stay(duration) {
    this.compartments.forEach(compartment => compartment.stay(duration, this.currentGas));
    this.updateHistory();
  }

  stayMaxNoDeco() {
    const ndl = this.ndl();

    this.stay(ndl);

    return ndl;
  }

  /*
  * Remaining time for a no-deco dive (Deco ceiling is 0 meters).
  */
  ndl() {
    const ndls = this.compartments.map(compartment => compartment.ndl(this.currentGas));

    return Math.min(...ndls);
  }

  hasDeco() {
    return this.decoCeiling() > 0;
  }

  /*
  * Time to surface.
  * We simulate all the decompression obligations because while doing
  * decompression, we can get new obligations so we can't just sum
  * existing decompression obligations.
  */
  TTS() {
    const timeToSurface = new TTS(this.cloneCompartments(), this.currentGas);

    return timeToSurface.duration();
  }

  currentDecoDuration() {
    const times = this.compartments.map(compartment => compartment.ndlToDepth(this.currentGas, this.previousDecoCeilingThreshold()))
                      .filter(time => time > 0 && time != Infinity);

    return Math.max(...times, MIN_TIME);
  }

  /*
  * Returns the time left before a new deco obligation starts
  * at a deeper depth while ascending or descending on the water column.
  *
  * For example, if the current deco ceiling is 3 meters, this gives
  * us the time left for the deco obligation at 6 meters.
  */
  timeToNextDecoDepthWhileMoving(toDepth, duration) {
    const remainingTimes = this.compartments.map(compartment => compartment.ndlToDepthWhileMoving(this.currentGas, toDepth, duration, this.nextDecoCeilingThreshold()))
                                            .filter(time => time > -1);

    return Math.min(...remainingTimes);
  }

  /*
  * Returns the time left before a new deco obligation starts
  * at a deeper depth while staying at a constant depth.
  *
  * For example, if the current deco ceiling is 3 meters, this gives
  * us the time left for the deco obligation at 6 meters.
  */
  timeToNextDecoDepth() {
    const remainingTimes = this.compartments.map(compartment => compartment.ndlToDepth(this.currentGas, this.nextDecoCeilingThreshold()));

    return Math.min(...remainingTimes);
  }

  previousDecoCeilingThreshold() {
    const depth = this.decoCeiling() - 3.5;

    return depth > 0 ? depth : 0;
  }

  nextDecoCeilingThreshold() {
    const nextDecoCeiling = this.decoCeiling() - 0.5;

    if(nextDecoCeiling < 0) return 0;

    return nextDecoCeiling;
  }

  decoCeiling() {
    const decoCeilings = this.compartments.map(compartment => compartment.decoCeiling());

    return Math.max(...decoCeilings);
  }

  updateHistory() {
    this.history.push({
      depth: this.currentDepth,
      compartments: this.cloneCompartments()
    });
  }

  cloneCompartments() {
    return this.compartments.map(compartment => {
      const prototype = Object.getPrototypeOf(compartment);
      const props = Object.getOwnPropertyDescriptors(structuredClone(compartment));

      return Object.create(prototype, props);
    });
  }
}
