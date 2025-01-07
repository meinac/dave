import { AIR_O2_RATIO, AIR_N2_RATIO } from '../constants/diving'
import Gas from '../models/gas';
import O2 from '../models/O2';
import N2 from '../models/N2';

export default class GasFactory {
  static createTmpAir() {
    const o2 = new O2(AIR_O2_RATIO);
    const n2 = new N2(AIR_N2_RATIO);

    return new Gas(o2, n2, null, null);
  }
}
