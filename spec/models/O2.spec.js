import O2 from '../../src/models/O2';

describe('O2', () => {
  let o2;

  beforeEach(() => {
    o2 = new O2(21);
  });

  test('#fraction', () => {
    expect(o2.fraction).toBe(0.21);
  });

  describe('#MOD', () => {
    describe('when the MOD is not requested for deco', () => {
      test('it returns the maximum operating depth for 1.4 PO2', () => {
        expect(o2.MOD()).toBe(56.66666666666666);
      });
    });

    describe('when the MOD is requested for deco', () => {
      test('it returns the maximum operating depth for 1.6 PO2', () => {
        expect(o2.MOD(true)).toBe(66.19047619047619);
      });
    });
  });
});
