import { MIN_TIME } from '../constants/diving';

export default class PseudoDeco {
  constructor(compartments, gas) {
    this.compartments = compartments;
    this.gas = gas;
  }

  TTS() {
    let tts = 0;

    while(this.decoCeiling() > 0)
      tts += this.doDeco();

    return tts;
  }

  doDeco() {
    this.moveToDecoCeiling();

    const time = this.decoTime();

    this.stayAtDecoStop(time);

    return time;
  }

  decoCeiling() {
    const decoCeilings = this.compartments.map(compartment => compartment.decoCeiling());

    return Math.max(...decoCeilings);
  }

  moveToDecoCeiling() {
    this.compartments.forEach(compartment => compartment.moveTo(this.decoCeiling(), this.gas, 0));
  }

  stayAtDecoStop(time) {
    this.compartments.forEach(compartment => compartment.stay(time, this.gas));
  }

  decoTime() {
    const times = this.compartments.map(compartment => compartment.ndlToDepth(this.gas, this.previousDecoCeilingThreshold()))
                                   .filter(time => time > 0 && time != Infinity);

    return Math.max(...times, MIN_TIME);
  }

  previousDecoCeilingThreshold() {
    return Math.max(this.decoCeiling() - 3.5, 0);
  }
}
