import { AIR_O2_RATIO } from '../constants/diving'

export default class O2 {
  static MAX_DECO_PO2 = 1.6;
  static MAX_PO2 = 1.4;

  constructor(ratio) {
    this.fraction = ratio / 100.0;
    this.ratio = ratio;
  }

  isAirO2() {
    return this.ratio === AIR_O2_RATIO;
  }

  MOD(deco = false) {
    const maxPO2 = deco ? O2.MAX_DECO_PO2 : O2.MAX_PO2;

    return ((maxPO2 / this.fraction) - 1) * 10;
  }
}
