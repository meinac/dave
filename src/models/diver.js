export default class Diver {
  constructor(compartments, gasses) {
    this.currentDepth = 0;
    this.compartments = compartments;
    this.gasses = gasses;
    this.currentGas = gasses[0];
  }

  moveTo(depth) {
    this.compartments.forEach(compartment => compartment.moveTo(depth, this.currentGas));

    this.currentDepth = depth;
  }

  stay(duration) {
    this.compartments.forEach(compartment => compartment.stay(duration, this.currentGas));
  }

  stayMaxNoDeco() {
    const ndl = this.ndl();

    this.stay(ndl);

    return ndl;
  }

  ndl() {
    const ndls = this.compartments.map(compartment => compartment.ndl(this.currentGas));

    return Math.min(...ndls);
  }
}
