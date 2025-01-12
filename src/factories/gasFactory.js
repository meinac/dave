import { AIR_O2_RATIO, AIR_N2_RATIO } from '../constants/diving'
import Gas from '../models/gas';
import O2 from '../models/O2';
import N2 from '../models/N2';

export default class GasFactory {
  static createTmpAir() {
    const o2 = new O2(AIR_O2_RATIO);
    const n2 = new N2(AIR_N2_RATIO);

    return new Gas(null, o2, n2, null, null);
  }

  static createTmpNitrox(o2Ratio, isDeco = false) {
    const n2Ratio = 100 - o2Ratio;

    const o2 = new O2(o2Ratio);
    const n2 = new N2(n2Ratio);

    return new Gas(null, o2, n2, null, null, isDeco);
  }

  static create(name, o2Ratio, volume, pressure, isDeco) {
    const n2Ratio = 100 - o2Ratio;
    const o2 = new O2(o2Ratio);
    const n2 = new N2(n2Ratio);

    return new Gas(name, o2, n2, volume, pressure, isDeco);
  }

  static update(gas, name, o2Ratio, volume, pressure, isDeco) {
    const n2Ratio = 100 - o2Ratio;
    const o2 = new O2(o2Ratio);
    const n2 = new N2(n2Ratio);

    /*
    * If the gas doesn't have a given name and we receive the auto-generated
    * name here, we don't assign that name because it's probably coming from
    * auto filled form input.
    */
    if(gas.givenNameEmpty() && gas.name() === name) name = null;

    gas.givenName = name;
    gas.o2 = o2;
    gas.n2 = n2;
    gas.volume = volume;
    gas.pressure = pressure;
    gas.deco = isDeco;
  }
}
