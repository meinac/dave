import Blend from '../../src/models/blend';

describe('Blend', () => {
  describe('#o2ToAdd', () => {
    describe('blending into an empty tank', () => {
      const blend = new Blend(0, 21, 200, 32);

      test('returns the amount of pure O2 to add in bar', () => {
        expect(blend.o2ToAdd()).toBeCloseTo(27.848, 2);
      });
    });

    describe('topping up a tank with residual nitrox', () => {
      const blend = new Blend(50, 30, 200, 32);

      test('returns the amount of pure O2 to add in bar', () => {
        expect(blend.o2ToAdd()).toBeCloseTo(22.151, 2);
      });
    });

    describe('when starting and target O2 are both air', () => {
      const blend = new Blend(0, 21, 200, 21);

      test('no pure O2 needs to be added', () => {
        expect(blend.o2ToAdd()).toBeCloseTo(0, 5);
      });
    });
  });

  describe('#pressureAfterO2', () => {
    const blend = new Blend(0, 21, 200, 32);

    test('returns the tank pressure after pure O2 is added', () => {
      expect(blend.pressureAfterO2()).toBeCloseTo(27.848, 2);
    });
  });

  describe('#airToAdd', () => {
    const blend = new Blend(0, 21, 200, 32);

    test('returns the air top-up amount in bar', () => {
      expect(blend.airToAdd()).toBeCloseTo(172.151, 2);
    });
  });

  describe('#valid', () => {
    describe('with a valid blend', () => {
      const blend = new Blend(0, 21, 200, 32);

      test('returns true', () => {
        expect(blend.valid()).toBe(true);
      });
    });

    describe('when target pressure is less than start pressure', () => {
      const blend = new Blend(200, 21, 100, 32);

      test('returns false', () => {
        expect(blend.valid()).toBe(false);
      });
    });

    describe('when starting O2 ratio is higher than target', () => {
      const blend = new Blend(100, 50, 200, 32);

      test('returns false', () => {
        expect(blend.valid()).toBe(false);
      });
    });
  });
});
