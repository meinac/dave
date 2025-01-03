import Diver from '../models/diver';
import CompartmentFactory from './compartmentFactory';
import GasFactory from './gasFactory';

export default class DiverFactory {
  static createTmpRecreationalDiver() {
    const air = GasFactory.createTmpAir();
    const compartments = CompartmentFactory.createAll();

    return new Diver(compartments, [air]);
  }
}
