export default class Diver {
  constructor(compartments) {
    this.currentDepth = 0;
    this.compartments = compartments;
  }

  moveTo(depth) {
    this.compartments.forEach(compartment => compartment.moveTo(depth));

    this.currentDepth = depth;
  }

  stay(duration) {
    this.compartments.forEach(compartment => compartment.stay(duration));
  }

  stayMaxNoDeco() {
    const ndl = this.ndl();

    this.stay(ndl);

    return ndl;
  }

  ndl() {
    const ndls = this.compartments.map(compartment => compartment.ndl());

    return Math.min(...ndls);
  }
}
