import Dive from '../models/dive';
import DiverFactory from './diverFactory';

export default class DiveFactory {
  static create(startGas, sacRate, decoSacRate) {
    const diver = DiverFactory.create(startGas, sacRate, decoSacRate);

    return new Dive(diver);
  }
}
