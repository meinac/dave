import Compartment from '../models/compartment';
import { HALF_TIMES, M_VALUES, G_VALUES } from '../constants/buhlmann'

export default class CompartmentFactory {
  static createAll() {
    return HALF_TIMES.map((halfTime, index) => {
      return new Compartment(index, 0, halfTime, M_VALUES[index], G_VALUES[index]);
    });
  }
}
