import { useKleverExtension } from '@/contexts/wallet/kleverExtension';
import { doIf } from '@/utils/promiseFunctions';
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';

export interface WalletProvider {
  isAvailable(): boolean;
  connect(): Promise<void>;
  logout(): void;
  getAddress(): string;
  getProviderName(): string;
  isLoading: boolean;
}

interface WalletContextData {
  availableProviders: WalletProvider[];
  provider: WalletProvider | null;
  connectProvider(provider: WalletProvider): Promise<void>;
  logoutProvider(): void;
}

const WalletContext = createContext<WalletContextData>({} as WalletContextData);

export const WalletContextProvider = ({
  children,
}: PropsWithChildren<any>): JSX.Element => {
  const kleverExtension = useKleverExtension();
  const [availableProviders, setAvailableProviders] = useState<
    WalletProvider[]
  >([]);
  const [currentProvider, setCurrentProvider] = useState<WalletProvider | null>(
    null,
  );

  useEffect(() => {
    const checkProvidersAvailability = async () => {
      const providers: WalletProvider[] = [];

      // check if klever extension is available (retry every 100ms and timeout after 1500ms)
      const kleverExtensionPromise = doIf(
        () => {
          providers.push(kleverExtension);
          console.debug('Klever extension available');
        },
        () => {
          console.debug('Klever extension not detected');
        },
        () => kleverExtension.isAvailable(),
        15500, //timeout
      );

      // run and wait for all promises to resolve
      await Promise.all([kleverExtensionPromise]);
      setAvailableProviders(providers);

      if (providers.length === 0) {
        cleanCache();
        console.debug('No providers available');
      } else {
        console.debug('Providers available', providers);
        tryReconnectLastProvider(providers);
      }
    };
    checkProvidersAvailability().then(r =>
      console.debug('Providers check ended'),
    );
  }, []);

  const tryReconnectLastProvider = (providers: WalletProvider[]) => {
    const lastProvider = sessionStorage.getItem('lastProvider');
    if (lastProvider) {
      const provider = providers.find(
        p => p.getProviderName() === lastProvider,
      );
      if (provider) {
        console.debug('Reconnecting last provider', provider.getProviderName());
        connectProvider(provider);
      } else {
        cleanCache();
      }
    }
  };

  const cleanCache = () => {
    sessionStorage.removeItem('walletAddress');
    sessionStorage.removeItem('lastProvider');
  };

  const connectProvider = async (provider: WalletProvider) => {
    await provider.connect();
    setCurrentProvider(provider);
    sessionStorage.setItem('lastProvider', provider.getProviderName());
  };

  const logoutProvider = () => {
    if (currentProvider) {
      currentProvider.logout();
    }
    setCurrentProvider(null);
    cleanCache();
  };

  return (
    <WalletContext.Provider
      value={{
        connectProvider,
        provider: currentProvider,
        availableProviders,
        logoutProvider,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextData => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletContextProvider');
  }
  return context;
};
