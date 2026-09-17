import { LinkEntity, MENU_BY_ENTITY, menuForEntity } from '../menu';

// Read off the table rather than restated by hand: a hand-kept list is still a
// valid LinkEntity[] when it is missing a member, and __tests__ is excluded
// from tsconfig, so the annotation would check nothing.
const ALL_ENTITIES = Object.keys(MENU_BY_ENTITY) as LinkEntity[];

describe('link hover menu per entity', () => {
  it('covers the entities ExplorerLink can route to', () => {
    expect(ALL_ENTITIES.sort()).toEqual(
      [
        'account',
        'asset',
        'block',
        'proposal',
        'smart-contract',
        'transaction',
        'validator',
      ].sort(),
    );
  });

  it('offers QR and Transfer only for wallet-format addresses', () => {
    // A QR of a block number scans to nothing, and a Transfer prefilled with
    // a transaction hash as its receiver is a form that cannot be submitted
    // correctly. Both existed for every link before this split.
    const addressLike = ALL_ENTITIES.filter(e => menuForEntity(e).addressLike);

    expect(addressLike.sort()).toEqual(
      ['account', 'smart-contract', 'validator'].sort(),
    );
  });

  it('never names the copy action after something it does not copy', () => {
    // The defect this replaced: every menu said "Copy Address", including on
    // hashes and block numbers.
    for (const entity of ALL_ENTITIES) {
      const { copyLabel, copyInfo, addressLike } = menuForEntity(entity);

      expect(copyLabel.startsWith('Copy ')).toBe(true);
      expect(copyInfo).toBeTruthy();
      if (!addressLike) {
        expect(copyLabel).not.toContain('Address');
        expect(copyInfo).not.toContain('Address');
      }
    }
  });

  it('reads as prose for a screen reader, not as an identifier', () => {
    // ExplorerLink builds "Open <noun> in a new tab" from this. The union
    // members are identifiers, so reading `type` straight out gave
    // "Open smart-contract in a new tab".
    for (const entity of ALL_ENTITIES) {
      const { noun } = menuForEntity(entity);
      expect(noun).toBeTruthy();
      expect(noun).not.toContain('-');
      expect(noun).toBe(noun.toLowerCase());
    }
  });

  it.each([
    ['transaction', 'Copy Transaction Hash', 'Transaction Hash'],
    ['block', 'Copy Block Number', 'Block Number'],
    ['asset', 'Copy Asset ID', 'Asset ID'],
  ] as const)(
    'names the %s action and its confirmation after the same thing',
    (entity, label, info) => {
      expect(menuForEntity(entity)).toMatchObject({
        copyLabel: label,
        copyInfo: info,
      });
    },
  );
});
