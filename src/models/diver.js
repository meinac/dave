export default class Diver {
  constructor(compartments, gasses) {
    this.currentDepth = 0;
    this.compartments = compartments;
    this.history = [];
    this.gasses = gasses;
    this.currentGas = gasses[0];

    this.updateHistory();
  }

  moveTo(depth) {
    this.compartments.forEach(compartment => compartment.moveTo(depth, this.currentGas));

    this.currentDepth = depth;
    this.updateHistory();
  }

  stay(duration) {
    this.compartments.forEach(compartment => compartment.stay(duration, this.currentGas));
    this.updateHistory();
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

  updateHistory() {
    this.history.push({
      depth: this.currentDepth,
      compartments: this.cloneCompartments()
    });
  }

  cloneCompartments() {
    return this.compartments.map(compartment => {
      const prototype = Object.getPrototypeOf(compartment);
      const props = Object.getOwnPropertyDescriptors(structuredClone(compartment));

      return Object.create(prototype, props);
    });
  }
}
