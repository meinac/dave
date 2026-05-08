/*
* Density of fresh water at ~4 degrees in Celsius in kg/L (reference density, 1 g/cm^3).
*/
const FRESH_WATER_DENSITY = 1.000;

/*
* Typical density of sea water in kg/L.
*/
const SALT_WATER_DENSITY = 1.030;

/*
* Standard atmospheric pressure at sea level (1 atm = 1.01325 bar).
*/
const ATMOSPHERIC_PRESSURE_AT_SEA_LEVEL = 1.01325;

/*
* Standard temperature lapse rate in the troposphere (K/m): air cools
* 6.5 degrees in Celsius per 1000 m of altitude (International Standard Atmosphere).
*/
const TEMPERATURE_LAPSE_RATE = 0.0065;

/*
* Standard sea-level temperature in Kelvin (15 degrees in Celsius).
*/
const SEA_LEVEL_TEMPERATURE_K = 288.15;

/*
* Exponent in the barometric formula: g*M / (R*L), where g is gravity,
* M is the molar mass of dry air, R is the universal gas constant and
* L is the temperature lapse rate. Fixed value for Earth's atmosphere.
*/
const BAROMETRIC_EXPONENT = 5.255;

/*
* Meters of fresh water column equivalent to 1 bar of pressure.
*
* Derived from P = rho*g*h with rho = 1000 kg/m^3 and g ~ 9.80665 m/s^2:
*   1 m of fresh water ~ 9806.65 Pa ~ 0.0980665 bar
*   => 1 bar ~ 10.197 m of fresh water
*/
const METERS_OF_FRESH_WATER_PER_BAR = 10.197;

export default class WaterColumn {
  static FRESH_WATER = 'fresh';
  static SALT_WATER = 'salt';

  static density(waterType) {
    return waterType === this.SALT_WATER ? SALT_WATER_DENSITY : FRESH_WATER_DENSITY;
  }

  static surfacePressure(altitude = 0) {
    const lapseRatio = (TEMPERATURE_LAPSE_RATE * altitude) / SEA_LEVEL_TEMPERATURE_K;

    return ATMOSPHERIC_PRESSURE_AT_SEA_LEVEL * Math.pow(1 - lapseRatio, BAROMETRIC_EXPONENT);
  }

  static absolutePressureAt(depth, waterType = this.SALT_WATER, altitude = 0) {
    return this.surfacePressure(altitude) + this.gaugePressureAt(depth, waterType);
  }

  static gaugePressureAt(depth, waterType = this.SALT_WATER) {
    return (depth * this.density(waterType)) / METERS_OF_FRESH_WATER_PER_BAR;
  }

  static depthFromAbsolutePressure(pressure, waterType = this.SALT_WATER, altitude = 0) {
    const gaugePressure = pressure - this.surfacePressure(altitude);

    return this.depthFromGaugePressure(gaugePressure, waterType);
  }

  static depthFromGaugePressure(pressure, waterType = this.SALT_WATER) {
    return (pressure * METERS_OF_FRESH_WATER_PER_BAR) / this.density(waterType);
  }
}
