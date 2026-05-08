import WaterColumn from '../../src/models/waterColumn';

describe('WaterColumn', () => {
  describe('.density', () => {
    test('returns salt water density when salt water is given', () => {
      expect(WaterColumn.density(WaterColumn.SALT_WATER)).toBeCloseTo(1.030, 3);
    });

    test('returns fresh water density when fresh water is given', () => {
      expect(WaterColumn.density(WaterColumn.FRESH_WATER)).toBeCloseTo(1.000, 3);
    });
  });

  describe('.surfacePressure', () => {
    test('returns ~1.01325 bar at sea level', () => {
      expect(WaterColumn.surfacePressure(0)).toBeCloseTo(1.01325, 4);
    });

    test('decreases with altitude', () => {
      const p2000 = WaterColumn.surfacePressure(2000);

      expect(p2000).toBeLessThan(WaterColumn.surfacePressure(0));
      expect(p2000).toBeGreaterThan(0.5);
    });
  });

  describe('.absolutePressureAt', () => {
    test('returns surface pressure at depth 0', () => {
      expect(WaterColumn.absolutePressureAt(0, WaterColumn.SALT_WATER)).toBeCloseTo(1.01325, 4);
    });

    test('returns higher pressure in salt water than fresh water at same depth', () => {
      const salt = WaterColumn.absolutePressureAt(30, WaterColumn.SALT_WATER);
      const fresh = WaterColumn.absolutePressureAt(30, WaterColumn.FRESH_WATER);

      expect(salt).toBeGreaterThan(fresh);
    });
  });

  describe('.depthFromAbsolutePressure', () => {
    test('returns 0 depth at surface pressure', () => {
      const surface = WaterColumn.surfacePressure(0);

      expect(WaterColumn.depthFromAbsolutePressure(surface, WaterColumn.SALT_WATER, 0)).toBeCloseTo(0, 3);
    });

    test('is the inverse of absolutePressureAt', () => {
      const depth = 25;
      const pressure = WaterColumn.absolutePressureAt(depth, WaterColumn.SALT_WATER, 0);
      const computedDepth = WaterColumn.depthFromAbsolutePressure(pressure, WaterColumn.SALT_WATER, 0);

      expect(computedDepth).toBeCloseTo(depth, 3);
    });
  });

  describe('.gaugePressureAt and .depthFromGaugePressure', () => {
    test('are inverses of each other', () => {
      const depth = 40;
      const pressure = WaterColumn.gaugePressureAt(depth, WaterColumn.SALT_WATER);
      const computedDepth = WaterColumn.depthFromGaugePressure(pressure, WaterColumn.SALT_WATER);

      expect(computedDepth).toBeCloseTo(depth, 3);
    });
  });
});
