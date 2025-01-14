import { MIN_TIME, ASCENT_RATE } from '../constants/diving';

/*
* Calculates the TTS from given point by compartments.
* TTS also accounts for time to ascend to the deco depth.
*/
export default class TTS {
  constructor(compartments, gas) {
    this.compartments = compartments;
    this.gas = gas;
  }

  duration() {
    let tts = 0;

    while(this.decoCeiling() > 0)
      tts += this.doDeco();

    return tts;
  }

  doDeco() {
    const decoCeiling = this.decoCeiling();
    const ascentDuration = this.ascentDuration();

    this.moveTo(decoCeiling, ascentDuration);

    const decoTime = this.decoTime();

    this.stayAtDecoStop(decoTime);

    return ascentDuration + decoTime;
  }

  decoCeiling() {
    const decoCeilings = this.compartments.map(compartment => compartment.decoCeiling());

    return Math.max(...decoCeilings);
  }

  moveTo(decoCeiling, ascentDuration) {
    this.compartments.forEach(compartment => compartment.moveTo(decoCeiling, this.gas, ascentDuration));
  }

  stayAtDecoStop(duration) {
    this.compartments.forEach(compartment => compartment.stay(duration, this.gas));
  }

  decoTime() {
    const times = this.compartments.map(compartment => compartment.ndlToDepth(this.gas, this.previousDecoCeilingThreshold()))
                                   .filter(time => time > 0 && time != Infinity);

    return Math.max(...times, MIN_TIME);
  }

  previousDecoCeilingThreshold() {
    return Math.max(this.decoCeiling() - 3.5, 0);
  }

  ascentDuration() {
    return this.distanceToDecoCeiling() / ASCENT_RATE;
  }

  distanceToDecoCeiling() {
    return this.compartments[0].depth - this.decoCeiling();
  }
}
