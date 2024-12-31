import Diver from '../models/diver';
import CompartmentFactory from './compartmentFactory.js';

export default class DiverFactory {
  static create() {
    const compartments = CompartmentFactory.createAll();

    return new Diver(compartments);
  }
}
