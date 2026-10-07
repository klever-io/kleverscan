import { ExtensionProvider } from '@/contexts/extension';
import fs from 'fs';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

/**
 * Pages used to call connect() as soon as the extension existed. connect()
 * opens the extension popup. These files are the ones that did that on mount.
 */
const AUTO_CONNECT_FILES = [
  'src/pages/account/[account].tsx',
  'src/pages/create-transaction/index.tsx',
  'src/components/Asset/AssetSummary/index.tsx',
  'src/components/Asset/ITOTab.tsx',
  'src/components/Contract/ModalContract/index.tsx',
  'src/components/Wizard/index.tsx',
  'src/components/MultsignComponent/MultSign/index.tsx',
];

const MOUNT_CONNECT =
  /if\s*\(\s*extensionInstalled\s*\)\s*\{[^}]*connectExtension\s*\(/;

const connect = jest.fn().mockResolvedValue(undefined);

const klever = {
  wallet: null as unknown,
  address: undefined as string | undefined,
  isConnected: false,
  isConnecting: false,
  connect,
  disconnect: jest.fn(),
  extensionInstalled: true as boolean | undefined,
  searchingExtension: false,
  error: undefined as Error | undefined,
};

jest.mock('@klever/connect-react', () => ({
  useKlever: () => klever,
}));

const resetKlever = () => {
  connect.mockClear();
  klever.connect = connect;
  klever.wallet = null;
  klever.address = undefined;
  klever.isConnected = false;
  klever.isConnecting = false;
  klever.extensionInstalled = true;
  klever.searchingExtension = false;
  klever.error = undefined;
};

const mount = () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root: Root = createRoot(container);
  const renderTree = () => {
    act(() => {
      root.render(
        <ExtensionProvider>
          <span>child</span>
        </ExtensionProvider>,
      );
    });
  };
  renderTree();
  return {
    rerender: renderTree,
    unmount: () => {
      act(() => root.unmount());
      container.remove();
    },
  };
};

describe('wallet reconnect', () => {
  const mounted: Array<{ unmount: () => void }> = [];

  beforeEach(() => {
    resetKlever();
    window.localStorage.clear();
  });

  afterEach(() => {
    mounted.splice(0).forEach(view => view.unmount());
  });

  it('does not open the extension when the visitor never connected', () => {
    mounted.push(mount());

    expect(connect).not.toHaveBeenCalled();
  });

  it('restores a previous session once the extension is installed', () => {
    window.localStorage.setItem('klever-connected', 'true');
    klever.extensionInstalled = false;

    const view = mount();
    mounted.push(view);
    expect(connect).not.toHaveBeenCalled();

    klever.extensionInstalled = true;
    view.rerender();

    expect(connect).toHaveBeenCalledTimes(1);
    expect(window.localStorage.getItem('klever-connected')).toBe('true');

    const secondConnect = jest.fn().mockResolvedValue(undefined);
    klever.connect = secondConnect;
    view.rerender();

    expect(connect).toHaveBeenCalledTimes(1);
    expect(secondConnect).not.toHaveBeenCalled();
    expect(window.localStorage.getItem('klever-connected')).toBe('true');
  });

  it('does not open the extension when a session is already connected', () => {
    window.localStorage.setItem('klever-connected', 'true');
    klever.isConnected = true;

    mounted.push(mount());

    expect(connect).not.toHaveBeenCalled();
    expect(window.localStorage.getItem('klever-connected')).toBe('true');
  });

  it('does not start a second connect while one is already in progress', () => {
    window.localStorage.setItem('klever-connected', 'true');
    klever.isConnecting = true;

    mounted.push(mount());

    expect(connect).not.toHaveBeenCalled();
  });

  it('forgets the session when the restore is rejected, so the next load stays quiet', () => {
    window.localStorage.setItem('klever-connected', 'true');

    const view = mount();
    mounted.push(view);
    expect(connect).toHaveBeenCalledTimes(1);

    klever.error = new Error('User rejected the connection');
    view.rerender();

    expect(window.localStorage.getItem('klever-connected')).toBeNull();
  });

  it('stays quiet when the browser blocks reading storage', () => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('storage blocked');
    });

    try {
      mounted.push(mount());
      expect(connect).not.toHaveBeenCalled();
      expect(console.error).not.toHaveBeenCalled();
    } finally {
      jest.restoreAllMocks();
    }
  });

  it('finishes a rejected restore when the browser blocks clearing storage', () => {
    window.localStorage.setItem('klever-connected', 'true');
    const view = mount();
    mounted.push(view);

    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    jest.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new Error('storage blocked');
    });

    try {
      klever.error = new Error('User rejected the connection');
      view.rerender();
      expect(console.error).not.toHaveBeenCalled();
    } finally {
      jest.restoreAllMocks();
    }
  });

  it('does not call connect on mount from the pages that used to do that', () => {
    const offenders = AUTO_CONNECT_FILES.filter(file => {
      const source = fs.readFileSync(file, 'utf8');
      return MOUNT_CONNECT.test(source);
    });

    expect(offenders).toEqual([]);
  });
});
