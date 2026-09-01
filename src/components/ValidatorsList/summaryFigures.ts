import { HeartbeatEntry } from '@/services/requests/heartbeat';
import { IValidator } from '@/types/index';
import { validatorCapacity } from './capacity';

/** The chain's own list states, in the order they read as a lifecycle. */
/* The five the list endpoint returns, not the seven the detail page's switch
   guards against: counted over all 209 validators on mainnet (2026-08-31,
   three pages of validator/list) the values are elected 21, eligible 106,
   waiting 1, inactive 52, jailed 29. `leaving` and `observer` never appear on
   this endpoint, and anything unexpected still lands in `other`. */
export const LIST_STATES = [
  'elected',
  'eligible',
  'waiting',
  'inactive',
  'jailed',
] as const;

export type ListState = (typeof LIST_STATES)[number];

export interface IListComposition {
  state: ListState | 'other';
  count: number;
  /** 0..100 of the validator count. */
  share: number;
  /** 0..100 of the set's stake, which is a different picture: measured on
   *  mainnet the 21 elected validators are 10 percent of the count but hold
   *  15,3 percent of the stake, while 105 eligible ones hold 73,8. */
  stakeShare: number;
}

/**
 * How the validator set breaks down by list state. Measured on mainnet:
 * elected 21, eligible 105, waiting 2, inactive 52, jailed 29.
 *
 * Source is the proxy's `list`, not the node's `peerType`: the node reports
 * neither `jailed` nor `inactive` and folds both into `observer`, so it cannot
 * answer this. Anything the chain adds later lands in `other` rather than
 * vanishing from a total that is supposed to add up.
 */
export const listComposition = (
  validators: IValidator[],
): IListComposition[] => {
  const counts = new Map<string, number>();
  const stakes = new Map<string, number>();
  let totalStake = 0;

  validators.forEach(validator => {
    const key = (LIST_STATES as readonly string[]).includes(validator.status)
      ? validator.status
      : 'other';
    counts.set(key, (counts.get(key) ?? 0) + 1);
    const staked = Number.isFinite(validator.staked) ? validator.staked : 0;
    stakes.set(key, (stakes.get(key) ?? 0) + staked);
    totalStake += staked;
  });

  const total = validators.length;
  const ordered: (ListState | 'other')[] = [...LIST_STATES, 'other'];

  return ordered
    .filter(state => counts.has(state))
    .map(state => {
      const count = counts.get(state) ?? 0;
      const stake = stakes.get(state) ?? 0;
      return {
        state,
        count,
        share: total > 0 ? (count / total) * 100 : 0,
        stakeShare: totalStake > 0 ? (stake / totalStake) * 100 : 0,
      };
    });
};

export interface IStakeFigures {
  totalStaked: number;
  /** 0..100 of the network total, or undefined when the network total is
   *  unusable rather than a misleading 0. */
  shareOfNetwork?: number;
}

/**
 * What this set holds, and how much of the network that is.
 *
 * `shareOfNetwork` is 100 percent whenever the set is the whole validator
 * list, because `networkTotalStake` IS the sum of every validator's stake
 * (verified against mainnet: both are 3414365636957119 to the digit). It is
 * kept for callers that pass a subset, and the summary shows the per-state
 * stake share instead, which actually varies.
 */
export const stakeFigures = (
  validators: IValidator[],
  networkTotalStake: number,
): IStakeFigures => {
  const totalStaked = validators.reduce(
    (sum, validator) =>
      sum + (Number.isFinite(validator.staked) ? validator.staked : 0),
    0,
  );
  if (!Number.isFinite(networkTotalStake) || networkTotalStake <= 0) {
    return { totalStaked };
  }
  return {
    totalStaked,
    shareOfNetwork: Math.min((totalStaked / networkTotalStake) * 100, 100),
  };
};

export interface IBlockResult {
  produced: number;
  missed: number;
  /** 0..100 of the leader slots that produced a block, or undefined when
   *  nothing was attempted yet: a 100 percent success rate on zero slots reads
   *  as flawless, which is the opposite of unknown. */
  successShare?: number;
}

/**
 * The network's block record, aggregated.
 *
 * Counts leader slots only. `totalProduced` adds consensus signatures to them,
 * which summed over the set is roughly 21 blocks per block: measured on
 * mainnet it reached 687.379.910 against a chain height of 32.806.707, so a
 * tile built on it announced twenty times more blocks than the chain has.
 * `blocksProduced` tracks the height instead (32.804.821 against 32.806.707).
 */
export const blockResult = (validators: IValidator[]): IBlockResult => {
  let produced = 0;
  let missed = 0;
  validators.forEach(validator => {
    if (Number.isFinite(validator.blocksProduced))
      produced += validator.blocksProduced;
    if (Number.isFinite(validator.blocksMissed))
      missed += validator.blocksMissed;
  });
  const attempts = produced + missed;
  return {
    produced,
    missed,
    successShare: attempts > 0 ? (produced / attempts) * 100 : undefined,
  };
};

export interface IDelegationRoom {
  /** Validators that both accept delegation and still have room under a cap. */
  open: number;
  /** Validators with no cap at all, which always have room. */
  uncapped: number;
  /** Room left under the caps, in the chain's smallest unit. */
  room: number;
}

/**
 * Where a delegation could still go. Measured on mainnet: 165 of 209 accept
 * delegation and are not yet full.
 *
 * An uncapped validator is counted separately rather than folded in, because
 * its room is unbounded and adding it to a total would make that total
 * meaningless.
 */
export const delegationRoom = (validators: IValidator[]): IDelegationRoom => {
  let open = 0;
  let uncapped = 0;
  let room = 0;

  validators.forEach(validator => {
    if (!validator.canDelegate) return;
    const capacity = validatorCapacity(
      validator.staked,
      validator.maxDelegation,
    );
    if (capacity.uncapped) {
      uncapped += 1;
      open += 1;
      return;
    }
    if (capacity.room > 0) {
      open += 1;
      room += capacity.room;
    }
  });

  return { open, uncapped, room };
};

export interface INodeFigures {
  /** Nodes the network heard from at all. */
  total: number;
  active: number;
  /** Nodes with a heartbeat that are not in the validator list. */
  observers: number;
  /** 0..100 across every node, or undefined when no node reported any time. */
  uptime?: number;
}

/**
 * What the node itself reports, none of which the page reads today. Measured
 * on mainnet 2026-08-31: 214 heartbeats, 212 active, 70 observers, 97,33
 * percent uptime.
 *
 * `observers` is counted from the keys rather than from `peerType`, and the
 * two do not agree: `peerType === 'observer'` gives 86, because the node has
 * no jailed or inactive state and files those 16 validators as observers too.
 * Counting them here would report a validator as a non-validator.
 */
export const nodeFigures = (
  entries: HeartbeatEntry[],
  validators: IValidator[],
): INodeFigures => {
  const validatorKeys = new Set(
    validators
      .map(validator => validator.blsPublicKey?.toLowerCase())
      .filter((key): key is string => !!key),
  );

  let active = 0;
  let observers = 0;
  let up = 0;
  let down = 0;

  entries.forEach(entry => {
    if (entry.isActive) active += 1;
    if (entry.publicKey && !validatorKeys.has(entry.publicKey.toLowerCase())) {
      observers += 1;
    }
    if (Number.isFinite(entry.totalUpTimeSec)) up += entry.totalUpTimeSec ?? 0;
    if (Number.isFinite(entry.totalDownTimeSec)) {
      down += entry.totalDownTimeSec ?? 0;
    }
  });

  const measured = up + down;
  return {
    total: entries.length,
    active,
    observers,
    uptime: measured > 0 ? (up / measured) * 100 : undefined,
  };
};

/**
 * A validator's display name, falling back to what the node calls the box.
 *
 * `identity` is empty on all 214 mainnet nodes while `nodeDisplayName` is set
 * on all of them, so the fallback order puts the chain name first and the node
 * name second, and never reaches `identity` in practice.
 */
export const displayNameFor = (
  validator: Pick<IValidator, 'name' | 'parsedAddress' | 'blsPublicKey'>,
  entriesByKey: Map<string, HeartbeatEntry>,
): string => {
  if (validator.name) return validator.name;
  const entry = validator.blsPublicKey
    ? entriesByKey.get(validator.blsPublicKey.toLowerCase())
    : undefined;
  return entry?.nodeDisplayName || entry?.identity || validator.parsedAddress;
};

export const entriesByPublicKey = (
  entries: HeartbeatEntry[],
): Map<string, HeartbeatEntry> => {
  const map = new Map<string, HeartbeatEntry>();
  entries.forEach(entry => {
    if (entry.publicKey) map.set(entry.publicKey.toLowerCase(), entry);
  });
  return map;
};
