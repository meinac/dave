import Blend from '../models/blend';

export default class BlendFactory {
  static create(startPressure, startO2Ratio, startHeRatio, targetPressure, targetO2Ratio, targetHeRatio) {
    return new Blend(startPressure, startO2Ratio, startHeRatio, targetPressure, targetO2Ratio, targetHeRatio);
  }
}
