import Blend from '../models/blend';

export default class BlendFactory {
  static create(startPressure, startO2Ratio, targetPressure, targetO2Ratio) {
    return new Blend(startPressure, startO2Ratio, targetPressure, targetO2Ratio);
  }
}
