import { HeartbeatEntry } from '@/services/requests/heartbeat';
import { IValidator } from '@/types/index';
import {
  blockResult,
  delegationRoom,
  displayNameFor,
  entriesByPublicKey,
  listComposition,
  nodeFigures,
  sumStaked,
} from '../summaryFigures';

const validator = (overrides: Partial<IValidator> = {}): IValidator =>
  ({
    ownerAddress: 'klv1owner',
    parsedAddress: 'klv1...owner',
    name: 'Node',
    rank: 1,
    staked: 1_000,
    cumulativeStaked: 1,
    rating: 10_000_000,
    selfStake: 100,
    status: 'elected',
    totalProduced: 100,
    totalMissed: 0,
    blocksProduced: 100,
    blocksMissed: 0,
    canDelegate: true,
    commission: 500,
    maxDelegation: 2_000,
    blsPublicKey: 'BLS1',
    ...overrides,
  }) as IValidator;

const beat = (overrides: Partial<HeartbeatEntry> = {}): HeartbeatEntry =>
  ({
    publicKey: 'BLS1',
    versionNumber: 'v1.7.21',
    isActive: true,
    timestamp: '2026-08-31T00:00:00Z',
    ...overrides,
  }) as HeartbeatEntry;

describe('listComposition', () => {
  it('counts each state and shares that add to 100', () => {
    const set = [
      validator({ status: 'elected' }),
      validator({ status: 'eligible' }),
      validator({ status: 'eligible' }),
      validator({ status: 'jailed' }),
    ];
    const composition = listComposition(set);
    expect(composition.map(c => [c.state, c.count])).toEqual([
      ['elected', 1],
      ['eligible', 2],
      ['jailed', 1],
    ]);
    expect(composition.reduce((sum, c) => sum + c.share, 0)).toBeCloseTo(100);
  });

  it('keeps the lifecycle order regardless of input order', () => {
    const set = [
      validator({ status: 'jailed' }),
      validator({ status: 'elected' }),
      validator({ status: 'waiting' }),
    ];
    expect(listComposition(set).map(c => c.state)).toEqual([
      'elected',
      'waiting',
      'jailed',
    ]);
  });

  // The inverse of the guard's purpose: an unrecognised state must still be
  // counted, or the segments stop adding up to the number beside them.
  it('files an unknown state under other instead of dropping it', () => {
    const set = [
      validator({ status: 'elected' }),
      validator({ status: 'ufo' }),
    ];
    const composition = listComposition(set);
    expect(composition.map(c => c.state)).toEqual(['elected', 'other']);
    expect(composition.reduce((sum, c) => sum + c.count, 0)).toBe(2);
  });

  it('returns nothing for an empty set rather than a row of zeroes', () => {
    expect(listComposition([])).toEqual([]);
  });

  // Count and stake are different pictures, which is the whole reason the
  // stake share is carried separately: on mainnet 21 elected validators are
  // 10 percent of the count and 15,3 percent of the stake.
  it('shares stake separately from headcount', () => {
    const set = [
      validator({ status: 'elected', staked: 900 }),
      validator({ status: 'eligible', staked: 50 }),
      validator({ status: 'eligible', staked: 50 }),
    ];
    const composition = listComposition(set);
    expect(composition.map(c => [c.state, Math.round(c.share)])).toEqual([
      ['elected', 33],
      ['eligible', 67],
    ]);
    expect(composition.map(c => [c.state, Math.round(c.stakeShare)])).toEqual([
      ['elected', 90],
      ['eligible', 10],
    ]);
  });

  it('leaves every stake share at zero when nothing is staked', () => {
    const set = [validator({ status: 'elected', staked: 0 })];
    expect(listComposition(set)[0].stakeShare).toBe(0);
  });
});

describe('sumStaked', () => {
  it('adds the staked amounts', () => {
    const set = [validator({ staked: 300 }), validator({ staked: 200 })];
    expect(sumStaked(set)).toBe(500);
  });

  it('ignores an unusable stake instead of totalling to NaN', () => {
    const set = [validator({ staked: NaN }), validator({ staked: 200 })];
    expect(sumStaked(set)).toBe(200);
  });

  it('is zero for an empty set', () => {
    expect(sumStaked([])).toBe(0);
  });
});

describe('blockResult', () => {
  it('aggregates produced and missed into a miss rate', () => {
    const set = [
      validator({ blocksProduced: 90, blocksMissed: 10 }),
      validator({ blocksProduced: 100, blocksMissed: 0 }),
    ];
    expect(blockResult(set)).toEqual({
      produced: 190,
      missed: 10,
      successShare: 95,
    });
  });

  // The bug this guards, measured on mainnet: `totalProduced` adds the
  // consensus signatures to the leader slots, so summed over the set it
  // reached 687.379.910 against a chain height of 32.806.707. Counting those
  // would announce twenty times more blocks than the chain has.
  it('counts leader slots, not consensus signatures', () => {
    const set = [
      validator({
        blocksProduced: 100,
        blocksMissed: 5,
        totalProduced: 2_100,
        totalMissed: 40,
      }),
    ];
    const result = blockResult(set);
    expect(result.produced).toBe(100);
    expect(result.missed).toBe(5);
    expect(result.successShare).toBeCloseTo((100 / 105) * 100);
  });

  // The inverse case: nothing produced is unknown, not perfect. A 100 percent
  // success rate on an empty record reads as a flawless network.
  it('leaves the rate out when nothing was attempted', () => {
    const set = [validator({ blocksProduced: 0, blocksMissed: 0 })];
    expect(blockResult(set).successShare).toBeUndefined();
    expect(blockResult([]).successShare).toBeUndefined();
  });
});

describe('delegationRoom', () => {
  it('counts validators that accept delegation and are not full', () => {
    const set = [
      validator({ canDelegate: true, staked: 500, maxDelegation: 1_000 }),
      validator({ canDelegate: true, staked: 1_000, maxDelegation: 1_000 }),
      validator({ canDelegate: false, staked: 0, maxDelegation: 1_000 }),
    ];
    expect(delegationRoom(set)).toEqual({ open: 1, uncapped: 0, room: 500 });
  });

  // Uncapped room is unbounded, so it is counted apart. Folding it into the
  // total would make that total a number nobody can act on.
  it('counts an uncapped validator as open without inflating the room', () => {
    const set = [
      validator({ canDelegate: true, staked: 9_000, maxDelegation: 0 }),
      validator({ canDelegate: true, staked: 500, maxDelegation: 1_000 }),
    ];
    expect(delegationRoom(set)).toEqual({ open: 2, uncapped: 1, room: 500 });
  });

  it('ignores a validator that refuses delegation even with room', () => {
    const set = [
      validator({ canDelegate: false, staked: 0, maxDelegation: 5_000 }),
    ];
    expect(delegationRoom(set)).toEqual({ open: 0, uncapped: 0, room: 0 });
  });
});

describe('nodeFigures', () => {
  it('counts nodes and active nodes', () => {
    const entries = [
      beat({ publicKey: 'BLS1' }),
      beat({ publicKey: 'BLS2', isActive: false }),
    ];
    const figures = nodeFigures(entries, [validator({ blsPublicKey: 'BLS1' })]);
    expect(figures.total).toBe(2);
    expect(figures.active).toBe(1);
  });

  it('counts an observer as a node that is not in the validator list', () => {
    const entries = [beat({ publicKey: 'BLS1' }), beat({ publicKey: 'BLSX' })];
    expect(
      nodeFigures(entries, [validator({ blsPublicKey: 'BLS1' })]).observers,
    ).toBe(1);
  });

  // The reason observers are counted from the keys and not from the node's
  // `peerType`: the node calls a jailed validator an observer too, and counting
  // that way would report a validator as a non-validator.
  it('does not count a jailed validator as an observer', () => {
    const entries = [beat({ publicKey: 'BLS1' })];
    const set = [validator({ blsPublicKey: 'BLS1', status: 'jailed' })];
    expect(nodeFigures(entries, set).observers).toBe(0);
  });

  it('matches keys case-insensitively, as the version map does', () => {
    const entries = [beat({ publicKey: 'bls1' })];
    expect(
      nodeFigures(entries, [validator({ blsPublicKey: 'BLS1' })]).observers,
    ).toBe(0);
  });
});

describe('displayNameFor', () => {
  const map = entriesByPublicKey([
    beat({ publicKey: 'BLS1', nodeDisplayName: 'klever-usable-mink' }),
  ]);

  it('prefers the chain name', () => {
    expect(displayNameFor(validator({ name: 'Klever One' }), map)).toBe(
      'Klever One',
    );
  });

  it('falls back to the node display name', () => {
    const nameless = validator({ name: undefined, blsPublicKey: 'BLS1' });
    expect(displayNameFor(nameless, map)).toBe('klever-usable-mink');
  });

  it('falls back to the address when the node is unknown to us', () => {
    const nameless = validator({ name: undefined, blsPublicKey: 'BLSX' });
    expect(displayNameFor(nameless, map)).toBe('klv1...owner');
  });

  it('falls back to the address when there is no key at all', () => {
    const nameless = validator({ name: undefined, blsPublicKey: undefined });
    expect(displayNameFor(nameless, map)).toBe('klv1...owner');
  });
});
