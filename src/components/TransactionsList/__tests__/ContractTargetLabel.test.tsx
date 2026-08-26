import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, render, screen } from '@testing-library/react';
import React from 'react';

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

// The installed testing-library still calls the removed ReactDOM.render; every
// component suite in this repo carries the same createRoot shim.
jest.mock('react-dom', () => {
  const actual = jest.requireActual('react-dom');
  const client = jest.requireActual('react-dom/client');
  const ReactLib = jest.requireActual('react');
  const roots = new Map<
    Element,
    { render: (ui: React.ReactNode) => void; unmount: () => void }
  >();

  return {
    ...actual,
    render: (ui: React.ReactNode, container: Element) => {
      let root = roots.get(container);
      if (!root) {
        root = client.createRoot(container);
        roots.set(container, root);
      }
      ReactLib.act(() => {
        root.render(ui);
      });
      return root;
    },
    unmountComponentAtNode: (container: Element) => {
      const root = roots.get(container);
      if (!root) return false;
      ReactLib.act(() => {
        root.unmount();
      });
      roots.delete(container);
      return true;
    },
  };
});

// Its real implementation reaches @/utils/precisionFunctions and from there
// an ESM chain Jest cannot transform, the same wall every other suite here
// works around. Shortening is not what this suite is about.
jest.mock('@/utils/parseValues', () => ({
  parseAddress: (value: string) => `${value.slice(0, 6)}...`,
}));

const nameCall = jest.fn();

jest.mock('@/services/requests/smartContracts/names', () => ({
  CONTRACT_NAME_STALE_TIME: 1000,
  contractNameQueryKey: (address: string) => ['smartContractName', address],
  smartContractNameCall: (address: string) => nameCall(address),
}));

import ContractTargetLabel from '../ContractTargetLabel';

const ADDRESS =
  'klv1qqqqqqqqqqqqqpgqu34l5t0w5qjajuk5w7j9jy4rxxhj974rx04sdw565h';

const renderLabel = (
  props: Partial<{ address: string; isContract: boolean }>,
) =>
  render(
    <QueryClientProvider
      client={
        new QueryClient({
          defaultOptions: { queries: { retry: false, gcTime: 0 } },
        })
      }
    >
      <ContractTargetLabel
        address={props.address ?? ADDRESS}
        isContract={props.isContract ?? true}
        truncateTo={12}
      />
    </QueryClientProvider>,
  );

/**
 * Renders and lets the name request answer before the caller asserts.
 *
 * A row shows its address until the name lands, so "the address is still
 * there" is true for an instant whatever the name was. Asserting that without
 * waiting made the refusal tests pass with the refusal deleted.
 */
const renderSettled = async (
  props: Partial<{ address: string; isContract: boolean }>,
): Promise<void> => {
  renderLabel(props);
  // A macrotask, not a microtask: react-query hands the answer on through its
  // own scheduler, so draining the microtask queue lands before the row has
  // seen the name and the assertion is vacuous again.
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 0));
  });
};

beforeEach(() => {
  nameCall.mockReset();
});

describe('ContractTargetLabel', () => {
  it('shows the contract name once the chain answers with one', async () => {
    nameCall.mockResolvedValue('Bitcoin.me');

    renderLabel({});

    expect(await screen.findByText('Bitcoin.me')).toBeTruthy();
  });

  it('keeps the shortened address for a contract that has no name', async () => {
    // The ordinary case: most contracts on chain are unnamed.
    nameCall.mockResolvedValue(null);

    renderLabel({});

    expect(await screen.findByText(/klv1qq/)).toBeTruthy();
    expect(nameCall).toHaveBeenCalled();
    expect(screen.queryByText('Bitcoin.me')).toBeNull();
  });

  it('asks for no name at all when the target is a plain account', () => {
    renderLabel({ isContract: false });

    expect(nameCall).not.toHaveBeenCalled();
    expect(screen.getByText(/klv1qq/)).toBeTruthy();
  });

  it('survives an empty address without asking for a name', () => {
    // Guards the fallback the query key uses: an address the row could not
    // resolve must not become a request for the name of nothing.
    renderLabel({ address: '' });

    expect(nameCall).not.toHaveBeenCalled();
  });

  it('caps a name long enough to widen the whole page', async () => {
    // Whoever deploys a contract picks its name. A 200 character one was
    // measured to push the page from 800px to 1838px, because the cell clips
    // instead of ellipsising and nothing bounds the text.
    nameCall.mockResolvedValue('A'.repeat(200));

    renderLabel({});

    const shown = await screen.findByText(/^A+…$/);
    expect(shown.textContent?.length).toBeLessThanOrEqual(33);
    // The address rides in the tooltip, so the cell never becomes the only
    // place the counterparty is named.
    expect(shown.getAttribute('title')).toContain(ADDRESS);
  });

  it('collapses whitespace so a name cannot set the row height', async () => {
    nameCall.mockResolvedValue('Klever\n\n   Bridge');

    renderLabel({});

    expect(await screen.findByText('Klever Bridge')).toBeTruthy();
  });

  it('falls back to the address for a name that is only whitespace', async () => {
    nameCall.mockResolvedValue('   ');

    renderLabel({});

    expect(await screen.findByText(/klv1qq/)).toBeTruthy();
  });

  it('strips the bidi override that paints a name backwards', async () => {
    // U+202E reverses what follows, so this paints as "klever.com" in the one
    // field a reader uses to identify the counterparty. \s does not match it.
    nameCall.mockResolvedValue('‮moc.revelk');

    renderLabel({});

    expect(await screen.findByText('moc.revelk')).toBeTruthy();
  });

  it('refuses a name shaped like a wallet address', async () => {
    // Names are set through SetAccountName by anyone, and mainnet already
    // carries full bech32 strings as names. One standing where the real
    // counterparty address stands would be a lie the reader cannot see.
    nameCall.mockResolvedValue(
      'klv1fqeupef8haxequ0nvsxlmt2gl07mqjhrr38p2l4r8daguxjjvk7q7zhups',
    );

    await renderSettled({});

    expect(screen.getByText(/klv1qq/)).toBeTruthy();
    expect(screen.queryByText(/^klv1fqeupef/)).toBeNull();
  });

  it('refuses a name that is an address with one odd character past the cap', async () => {
    // The cap runs before the address check now. Judging the whole name and
    // drawing a shortened one asked the question about a string the reader
    // never sees: an address with a trailing underscore failed the address
    // test and was then drawn as 32 characters of plain bech32.
    nameCall.mockResolvedValue(
      'klv1fqeupef8haxequ0nvsxlmt2gl07mqjhrr38p2l4r8daguxjjvk7q7zhups_',
    );

    await renderSettled({});

    expect(screen.getByText(/klv1qq/)).toBeTruthy();
    expect(screen.queryByText(/^klv1fqeupef/)).toBeNull();
  });

  it('refuses one that hides its odd character in a homoglyph', async () => {
    // Same bypass with a Cyrillic a as the disqualifying character, which no
    // ASCII-shaped test catches.
    nameCall.mockResolvedValue(
      'klv1fqeupef8haxequ0nvsxlmt2gl07mqjhrr38p2l4r8daguxjjvk7q7zhup\u0430',
    );

    await renderSettled({});

    expect(screen.getByText(/klv1qq/)).toBeTruthy();
    expect(screen.queryByText(/^klv1fqeupef/)).toBeNull();
  });

  it('strips a Hangul filler, which draws as a blank and is not a space', async () => {
    // U+3164 is a letter, not a formatting character, so neither \s nor the
    // control blocks reach it. Left in, it breaks up an address just enough
    // to pass the address check while still reading as one.
    nameCall.mockResolvedValue('Klever\u3164Bridge');

    renderLabel({});

    expect(await screen.findByText('KleverBridge')).toBeTruthy();
  });

  it('strips the word joiner and the Arabic letter mark', async () => {
    // Both are formatting characters the enumerated ranges missed: U+2060
    // joins glyphs across a boundary, U+061C reorders the neutrals around it
    // exactly as the right-to-left mark does.
    nameCall.mockResolvedValue('Klever\u2060Bri\u061Cdge');

    renderLabel({});

    expect(await screen.findByText('KleverBridge')).toBeTruthy();
  });

  it('keeps the address out of reach of a zero-width character', async () => {
    nameCall.mockResolvedValue('Klever​Bridge');

    renderLabel({});

    expect(await screen.findByText('KleverBridge')).toBeTruthy();
  });

  it('renders the address before the name has arrived', () => {
    // The name must never be something the row waits for.
    nameCall.mockReturnValue(new Promise(() => undefined));

    renderLabel({});

    expect(screen.getByText(/klv1qq/)).toBeTruthy();
  });
});
