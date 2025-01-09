import O2 from '../../src/models/O2';

describe('O2', () => {
  let o2;

  beforeEach(() => {
    o2 = new O2(21);
  });

  test('#fraction', () => {
    expect(o2.fraction).toBe(0.21);
  });

  test('#MOD', () => {
    expect(o2.MOD()).toBe(56.66666666666666);
  });
});
