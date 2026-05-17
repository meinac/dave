import { AIR_O2_RATIO } from '../constants/diving';

export default class Blend {
  constructor(startPressure, startO2Ratio, startHeRatio, targetPressure, targetO2Ratio, targetHeRatio) {
    this.startPressure = startPressure;
    this.startO2Ratio = startO2Ratio;
    this.startHeRatio = startHeRatio;
    this.targetPressure = targetPressure;
    this.targetO2Ratio = targetO2Ratio;
    this.targetHeRatio = targetHeRatio;
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

  startHeFraction() {
    return this.startHeRatio / 100.0;
  }

  targetHeFraction() {
    return this.targetHeRatio / 100.0;
  }

  heToAdd() {
    return this.targetPressure * this.targetHeFraction() - this.startPressure * this.startHeFraction();
  }

  pressureAfterHe() {
    return this.startPressure + this.heToAdd();
  }

  o2ToAdd() {
    const targetPP = this.targetPressure * this.targetO2Fraction();
    const startPP = this.startPressure * this.startO2Fraction();
    const airFraction = this.airO2Fraction();

    return (targetPP - startPP - airFraction * (this.targetPressure - this.pressureAfterHe())) / (1 - airFraction);
  }

  pressureAfterO2() {
    return this.pressureAfterHe() + this.o2ToAdd();
  }

  airToAdd() {
    return this.targetPressure - this.pressureAfterO2();
  }

  valid() {
    return this.targetPressure > this.startPressure &&
      this.startO2Ratio + this.startHeRatio <= 100 &&
      this.targetO2Ratio + this.targetHeRatio <= 100 &&
      this.heToAdd() >= 0 &&
      this.o2ToAdd() >= 0 &&
      this.airToAdd() >= 0;
  }
}
