import Gas from '../../src/models/gas';
import O2 from '../../src/models/O2';
import N2 from '../../src/models/N2';

describe('Gas', () => {
  let o2 = new O2(21);
  let n2 = new N2(79);

  describe('#MOD', () => {
    const spy = jest.spyOn(o2, 'MOD').mockImplementation(() => 100);

    describe('when the gas is a deco gas', () => {
      let gas = new Gas(null, o2, n2, null, null, false);

      test('it delegates the call to the O2 object', () => {
        expect(gas.MOD()).toBe(100);
        expect(spy).toHaveBeenCalledWith(false);
      });
    });

    describe('when the gas is a deco gas', () => {
      let gas = new Gas(null, o2, n2, null, null, true);

      test('it delegates the call to the O2 object', () => {
        expect(gas.MOD()).toBe(100);
        expect(spy).toHaveBeenCalledWith(true);
      });
    });
  });

  describe('#name', () => {
    describe('when the name is already provided', () => {
      let gas = new Gas('Test Gas', o2, n2, null, null, true);

      test('it returns the given name', () => {
        expect(gas.name()).toBe('Test Gas');
      });
    });

    describe('when the name is not provided', () => {
      describe('when the gas is Air', () => {
        let gas = new Gas(null, o2, n2, null, null, true);

        test('it returns Air', () => {
          expect(gas.name()).toBe('Air');
        });
      });

      describe('when the gas is Nitrox', () => {
        let o2 = new O2(40);
        let gas = new Gas(null, o2, n2, null, null, true);

        test('it returns EANx40', () => {
          expect(gas.name()).toBe('EANx40');
        });
      });
    });
  });

  describe('#EAD', () => {
    const spy = jest.spyOn(n2, 'EADRate').mockImplementation(() => 0.5);
    let gas = new Gas(null, o2, n2, null, null, false);

    describe('when the equivalent air depth is lower than 0', () => {
      test('it returns the equivalent air depth', () => {
        expect(gas.EAD(5)).toBe(0);
        expect(spy).toHaveBeenCalled();
      });
    });

    describe('when the equivalent air depth is higher than 0', () => {
      test('it returns the equivalent air depth', () => {
        expect(gas.EAD(20)).toBe(5);
        expect(spy).toHaveBeenCalled();
      });
    });
  });
});
