import { WalletProvider } from '@/contexts/wallet/index';
import { web } from '@klever/sdk-web';
import { createContext, PropsWithChildren, useContext, useState } from 'react';
import { toast } from 'react-toastify';

const KleverExtensionContext = createContext<WalletProvider>(
  {} as WalletProvider,
);

export const KleverExtensionContextProvider = ({
  children,
}: PropsWithChildren<any>): JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [address, setAddress] = useState<string>('');

  const isAvailable = (): boolean => {
    return window.kleverWeb !== undefined;
  };

  const isRunning = (): boolean => {
    return isAvailable() && web.isKleverWebActive();
  };

  const getAddress = (): string => {
    if (!isRunning()) {
      return '';
    }
    if (address) {
      return address;
    }
    // if everything fails, try to get the address from the extension
    const newAddress = window.kleverWeb.getWalletAddress();
    setAddress(newAddress);
    return newAddress;
  };

  const getProviderName = (): string => {
    return 'Klever Extension';
  };

  const connect = async () => {
    window.kleverWeb.provider = {
      api:
        process.env.DEFAULT_API_HOST ||
        'https://api.testnet.klever.finance/v1.0',
      node:
        process.env.DEFAULT_NODE_HOST || 'https://node.testnet.klever.finance',
    };

    try {
      setIsLoading(true);
      if (!web.isKleverWebActive()) {
        const _ = await web.initialize();
      }
      // pre-load address in state
      const address: string = await window.kleverWeb.getWalletAddress();
      if (address.startsWith('klv') && address.length === 62) {
        setAddress(address);
      } else {
        toast.error('Invalid wallet address, please switch to a klv wallet');
      }
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      toast.error(String(e).split(':')[1]);
    }
  };

  const logout = () => {
    setAddress('');
    sessionStorage.removeItem('walletAddress');
  };

  return (
    <KleverExtensionContext.Provider
      value={{
        isAvailable,
        connect,
        isLoading,
        getAddress,
        getProviderName,
        logout,
      }}
    >
      {children}
    </KleverExtensionContext.Provider>
  );
};

export const useKleverExtension = (): WalletProvider => {
  const context = useContext(KleverExtensionContext);
  if (context === undefined) {
    throw new Error(
      'useKleverExtension must be used within a KleverExtensionContextProvider',
    );
  }
  return context;
};
