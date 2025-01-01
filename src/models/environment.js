export default class Environment {
  static P_H2O = 0.0627

  static pressureAt(depth) {
    return (depth / 10.0 + 1) - this.P_H2O;
  }
}
