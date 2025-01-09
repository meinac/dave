export default class Gas {
  constructor(o2, n2, volume, pressure, deco = false) {
    this.o2 = o2;
    this.n2 = n2;
    this.volume = volume;
    this.pressure = pressure;
    this.deco = deco;
  }

  /*
  * Maximum operating depth.
  * This is the maximum depth the gas can be used.
  * (There is always the risk of oxygen toxicity though).
  */
  MOD() {
    return this.o2.MOD(this.deco);
  }

  /*
  * Returns the equivalent air depth of the gas.
  */
  EAD(depth) {
    const ead = (depth + 10) * this.n2.EADRate() - 10;

    return ead < 0 ? 0 : ead;
  }
}
