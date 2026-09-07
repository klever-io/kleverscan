import { validatorCapacity } from '../capacity';

describe('validatorCapacity', () => {
  it('fills the cap proportionally', () => {
    // The measured mainnet shape: 12T staked against a 12T cap reads as full.
    expect(validatorCapacity(14_000_000, 15_000_000).fill).toBeCloseTo(93.333);
    expect(validatorCapacity(12_000_000, 12_000_000).fill).toBe(100);
    expect(validatorCapacity(0, 12_000_000).fill).toBe(0);
  });

  it('reports the room left, never negative', () => {
    expect(validatorCapacity(14_000_000, 15_000_000).room).toBe(1_000_000);
    expect(validatorCapacity(12_000_000, 12_000_000).room).toBe(0);
  });

  // The guard's purpose: no cap must read as unlimited, not as full and not as
  // empty. The inverse case is the one that matters, because both wrong
  // answers are plausible-looking numbers rather than a crash.
  it('treats a missing cap as uncapped, not as a 0 or 100 percent fill', () => {
    const none = validatorCapacity(270_615_942_002_966, 0);
    expect(none.uncapped).toBe(true);
    expect(none.fill).toBeUndefined();
  });

  it('treats a negative or non-finite cap as uncapped too', () => {
    [-1, NaN, Infinity, -Infinity].forEach(cap => {
      expect(validatorCapacity(1_000, cap).uncapped).toBe(true);
    });
  });

  // A cap that exists but a stake that does not. Both directions are wrong,
  // so the guard picks the one that does not advertise room: unusable reads as
  // full. A negative stake is the exception, that is a zero stake.
  it('reads an unusable stake as full, and a negative one as empty', () => {
    expect(validatorCapacity(NaN, 12_000_000).fill).toBe(100);
    expect(validatorCapacity(NaN, 12_000_000).room).toBe(0);
    expect(validatorCapacity(Infinity, 12_000_000).fill).toBe(100);
    expect(validatorCapacity(-5, 12_000_000).fill).toBe(0);
    expect(validatorCapacity(-5, 12_000_000).room).toBe(12_000_000);
    expect(validatorCapacity(99_000_000, 12_000_000).fill).toBe(100);
  });

  it('never returns a NaN room', () => {
    [NaN, Infinity, -Infinity, -5, 0, 1e30].forEach(staked => {
      expect(Number.isNaN(validatorCapacity(staked, 12_000_000).room)).toBe(
        false,
      );
    });
  });

  it('never returns a fill outside 0..100', () => {
    [0, 1, 5_000_000, 12_000_000, 99_000_000, Infinity, NaN, -7].forEach(
      staked => {
        const { fill } = validatorCapacity(staked, 12_000_000);
        expect(fill).toBeGreaterThanOrEqual(0);
        expect(fill).toBeLessThanOrEqual(100);
      },
    );
  });
});
