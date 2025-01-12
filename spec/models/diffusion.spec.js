import Diffusion from '../../src/models/diffusion';
import Gas from '../../src/models/gas';
import N2 from '../../src/models/N2';

describe('Diffusion', () => {
  const n2 = new N2(79);
  const gas = new Gas('Temporary Gas', null, n2);

  describe('.reverseScheiner', () => {
    test('it returns the maximum nitrogen partial pressure to ascend without deco obligation', () => {
      const targetPPN2 = 2.9625; //M(1)
      const halfTime = 5;
      const gasExchangeRate = Math.log(2, Math.E) / halfTime;
      const fromDepth = 54;
      const toDepth = 0;

      const time = Diffusion.reverseSchreiner(gas, targetPPN2, gasExchangeRate, fromDepth, toDepth);

      expect(time).toBe(3.4572948762123215);
    });
  });
});
