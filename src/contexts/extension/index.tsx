import { PropsWithChildren } from 'react';
import { useKlever } from '@klever/connect-react';
import { BrowserWallet } from '@klever/connect';
import { createContext, useContext, useState } from 'react';

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
  } = useKlever();

  const [openDrawer, setOpenDrawer] = useState(false);

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
