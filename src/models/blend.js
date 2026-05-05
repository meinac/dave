import { AIR_O2_RATIO } from '../constants/diving';

export default class Blend {
  constructor(startPressure, startO2Ratio, targetPressure, targetO2Ratio) {
    this.startPressure = startPressure;
    this.startO2Ratio = startO2Ratio;
    this.targetPressure = targetPressure;
    this.targetO2Ratio = targetO2Ratio;
  }

  airO2Fraction() {
    return AIR_O2_RATIO / 100.0;
  }

  startO2Fraction() {
    return this.startO2Ratio / 100.0;
  }

  targetO2Fraction() {
    return this.targetO2Ratio / 100.0;
  }

  o2ToAdd() {
    const targetPP = this.targetPressure * this.targetO2Fraction();
    const startPP = this.startPressure * this.startO2Fraction();
    const airFraction = this.airO2Fraction();

    return (targetPP - startPP - airFraction * (this.targetPressure - this.startPressure)) / (1 - airFraction);
  }

  pressureAfterO2() {
    return this.startPressure + this.o2ToAdd();
  }

  airToAdd() {
    return this.targetPressure - this.pressureAfterO2();
  }

  valid() {
    return this.targetPressure > this.startPressure && this.o2ToAdd() >= 0 && this.airToAdd() >= 0;
  }
}
