import { PropsWithChildren, useEffect, useRef } from 'react';
import { useKlever } from '@klever/connect-react';
import { BrowserWallet } from '@klever/connect';
import { createContext, useContext, useState } from 'react';

// Same key @klever/connect-react writes after a successful connect, and
// removes on disconnect. A missing key means the visitor never agreed.
const CONNECTED_FLAG = 'klever-connected';

// Private mode and blocked storage throw on access. A throw must not surface
// from the effect: skip the restore, and ignore a failed cleanup.
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

  // connect() asks the extension to show its popup. Do that on load only to
  // restore a session the visitor already accepted. Otherwise wait for a click.
  useEffect(() => {
    if (reconnectAttempted.current) return;
    if (!extensionInstalled || isConnected || isConnecting) return;
    if (!readConnectedFlag()) return;
    reconnectAttempted.current = true;
    void connect();
  }, [extensionInstalled, isConnected, isConnecting, connect]);

  // A rejected restore leaves the flag in place, so the next page load would
  // open the popup again. Drop it. The next connect is a click on the button.
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
