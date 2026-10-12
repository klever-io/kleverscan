import { PropsWithChildren, useEffect, useRef } from 'react';
import { useKlever } from '@klever/connect-react';
import { BrowserWallet } from '@klever/connect';
import { useRouter } from 'next/router';
import { createContext, useContext, useState } from 'react';

// Same key @klever/connect-react writes after a successful connect, and
// removes on disconnect. A missing key means the visitor never agreed.
const CONNECTED_FLAG = 'klever-connected';

// Private mode and blocked storage throw on access. KleverProvider reads
// localStorage during its own render, with no catch, so a blocked store
// throws there before this provider runs. The catch still matters when this
// provider is mounted on its own, which is what the tests do.
const readConnectedFlag = (): boolean => {
  try {
    return window.localStorage.getItem(CONNECTED_FLAG) === 'true';
  } catch {
    return false;
  }
};

const clearConnectedFlag = (): void => {
  try {
    window.localStorage.removeItem(CONNECTED_FLAG);
  } catch {
    // The marker stays. The next load hits the same block and stays quiet.
  }
};

interface IExtension {
  searchingExtension: boolean;
  extensionInstalled: boolean | undefined;
  connectExtension: () => Promise<void>;
  logoutExtension: () => void;
  walletAddress: string;
  extensionLoading: boolean;
  openDrawer: boolean;
  setOpenDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  checkKleverWebObject: () => boolean;
  wallet: BrowserWallet | null;
}

export const Extension = createContext({} as IExtension);

export const ExtensionProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const {
    wallet,
    address,
    isConnected,
    isConnecting,
    connect,
    disconnect,
    extensionInstalled,
    searchingExtension,
    error,
  } = useKlever();

  const [openDrawer, setOpenDrawer] = useState(false);
  const reconnectAttempted = useRef(false);
  const router = useRouter();
  // The K5 wallet opens KleverScan through this query. It is consent to
  // connect, the same as a saved session. A desktop visit has no such query.
  const deepLinkConnect = router.isReady && router.query.autoconnect === 'true';

  // Not KleverProvider reconnectOnMount. That effect runs on the provider's
  // first render, sets its ref, and calls connect() before the extension
  // check has found kleverWeb. A miss is never retried. This waits until the
  // extension is actually there.
  useEffect(() => {
    if (reconnectAttempted.current) return;
    if (!extensionInstalled || isConnected || isConnecting) return;
    if (!deepLinkConnect && !readConnectedFlag()) return;
    reconnectAttempted.current = true;
    void connect();
  }, [extensionInstalled, isConnected, isConnecting, connect, deepLinkConnect]);

  // Any failed restore drops the saved session, not only a refusal. The
  // library keeps one error for the life of the provider and does not say
  // whether the wallet was locked, timed out, or refused. Leaving the flag
  // would open the popup again on the next load.
  useEffect(() => {
    if (!reconnectAttempted.current || isConnecting || isConnected || !error) {
      return;
    }
    clearConnectedFlag();
  }, [error, isConnecting, isConnected]);

  const checkKleverWebObject = () => {
    return typeof window !== 'undefined' && window.kleverWeb !== undefined;
  };

  const values: IExtension = {
    searchingExtension,
    extensionInstalled,
    connectExtension: connect,
    logoutExtension: disconnect,
    walletAddress: address || '',
    extensionLoading: isConnecting,
    openDrawer,
    setOpenDrawer,
    checkKleverWebObject,
    wallet: (wallet as BrowserWallet) || null,
  };

  return <Extension.Provider value={values}>{children}</Extension.Provider>;
};

export const useExtension = (): IExtension => useContext(Extension);
