import Blend from '../../src/models/blend';

describe('Blend', () => {
  describe('#o2ToAdd', () => {
    describe('blending into an empty tank', () => {
      const blend = new Blend(0, 21, 0, 200, 32, 0);

      test('returns the amount of pure O2 to add in bar', () => {
        expect(blend.o2ToAdd()).toBeCloseTo(27.848, 2);
      });
    });

    describe('topping up a tank with residual nitrox', () => {
      const blend = new Blend(50, 30, 0, 200, 32, 0);

      test('returns the amount of pure O2 to add in bar', () => {
        expect(blend.o2ToAdd()).toBeCloseTo(22.151, 2);
      });
    });

    describe('when starting and target O2 are both air', () => {
      const blend = new Blend(0, 21, 0, 200, 21, 0);

      test('no pure O2 needs to be added', () => {
        expect(blend.o2ToAdd()).toBeCloseTo(0, 5);
      });
    });

    describe('blending trimix into an empty tank', () => {
      const blend = new Blend(0, 21, 0, 200, 18, 45);

      test('returns the amount of pure O2 to add in bar', () => {
        expect(blend.o2ToAdd()).toBeCloseTo(16.329, 2);
      });
    });
  });

  describe('#pressureAfterO2', () => {
    const blend = new Blend(0, 21, 0, 200, 32, 0);

    test('returns the tank pressure after pure O2 is added', () => {
      expect(blend.pressureAfterO2()).toBeCloseTo(27.848, 2);
    });

    describe('with a trimix blend', () => {
      const blend = new Blend(0, 21, 0, 200, 18, 45);

      test('returns the tank pressure after He and pure O2 are added', () => {
        expect(blend.pressureAfterO2()).toBeCloseTo(106.329, 2);
      });
    });
  });

  describe('#airToAdd', () => {
    const blend = new Blend(0, 21, 0, 200, 32, 0);

    test('returns the air top-up amount in bar', () => {
      expect(blend.airToAdd()).toBeCloseTo(172.151, 2);
    });

    describe('with a trimix blend', () => {
      const blend = new Blend(0, 21, 0, 200, 18, 45);

      test('returns the air top-up amount in bar', () => {
        expect(blend.airToAdd()).toBeCloseTo(93.670, 2);
      });
    });
  });

  describe('#heToAdd', () => {
    describe('blending trimix into an empty tank', () => {
      const blend = new Blend(0, 21, 0, 200, 18, 45);

      test('returns the amount of pure He to add in bar', () => {
        expect(blend.heToAdd()).toBeCloseTo(90, 5);
      });
    });

    describe('topping up a tank with residual trimix', () => {
      const blend = new Blend(50, 21, 35, 200, 18, 45);

      test('returns the amount of pure He to add in bar', () => {
        expect(blend.heToAdd()).toBeCloseTo(72.5, 5);
      });
    });

    describe('with no helium in start or target', () => {
      const blend = new Blend(0, 21, 0, 200, 32, 0);

      test('returns zero', () => {
        expect(blend.heToAdd()).toBeCloseTo(0, 5);
      });
    });
  });

  describe('#pressureAfterHe', () => {
    const blend = new Blend(0, 21, 0, 200, 18, 45);

    test('returns the tank pressure after pure He is added', () => {
      expect(blend.pressureAfterHe()).toBeCloseTo(90, 5);
    });
  });

  describe('#valid', () => {
    describe('with a valid blend', () => {
      const blend = new Blend(0, 21, 0, 200, 32, 0);

      test('returns true', () => {
        expect(blend.valid()).toBe(true);
      });
    });

    describe('when target pressure is less than start pressure', () => {
      const blend = new Blend(200, 21, 0, 100, 32, 0);

      test('returns false', () => {
        expect(blend.valid()).toBe(false);
      });
    });

    describe('when starting O2 ratio is higher than target', () => {
      const blend = new Blend(100, 50, 0, 200, 32, 0);

      test('returns false', () => {
        expect(blend.valid()).toBe(false);
      });
    });

    describe('with a valid trimix blend', () => {
      const blend = new Blend(0, 21, 0, 200, 18, 45);

      test('returns true', () => {
        expect(blend.valid()).toBe(true);
      });
    });

    describe('when starting O2 + He ratio exceeds 100', () => {
      const blend = new Blend(50, 60, 50, 200, 18, 45);

      test('returns false', () => {
        expect(blend.valid()).toBe(false);
      });
    });

    describe('when target O2 + He ratio exceeds 100', () => {
      const blend = new Blend(0, 21, 0, 200, 60, 50);

      test('returns false', () => {
        expect(blend.valid()).toBe(false);
      });
    });

    describe('when starting He partial pressure exceeds target He partial pressure', () => {
      const blend = new Blend(100, 18, 50, 200, 18, 20);

      test('returns false', () => {
        expect(blend.valid()).toBe(false);
      });
    });
  });
});
