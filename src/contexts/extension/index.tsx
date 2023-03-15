import { doIf } from '@/utils/promiseFunctions';
import { web } from '@klever/sdk';
import { useRouter } from 'next/router';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { toast } from 'react-toastify';

interface IExtension {
  extensionInstalled: boolean;
  connectExtension: () => void;
  logoutExtension: () => void;
  walletAddress: string | null;
  extensionLoading: boolean;
}

export const Extension = createContext({} as IExtension);

export const ExtensionProvider: React.FC = ({ children }) => {
  const [extensionInstalled, setExtensionInstalled] = useState(false);
  const [extensionLoading, setExtensionLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      if (typeof window !== 'undefined') {
        await doIf(
          () => setExtensionInstalled(true),
          () => walletNotConnected(),
          () => window.kleverWeb !== undefined,
        );
      }
    };
    init();
  }, []);

  const logoutExtension = useCallback(async () => {
    setWalletAddress('');
    sessionStorage.removeItem('walletAddress');

    if (router.pathname.includes('/create-transaction')) {
      toast.error('Wallet Disconnected');

      const timeout = new Promise(resolve => setTimeout(resolve, 1000));
      await Promise.resolve(timeout);

      router.push('/');
    }
  }, [walletAddress]);

  const walletNotConnected = useCallback(async () => {
    setWalletAddress('');
    sessionStorage.removeItem('walletAddress');

    if (router.pathname.includes('/create-transaction')) {
      toast.error('Wallet Not Connected.');

      const timeout = new Promise(resolve => setTimeout(resolve, 1000));
      await Promise.resolve(timeout);

      router.push('/');
    }
  }, [walletAddress]);

  useEffect(() => {
    if (extensionInstalled) {
      const address = sessionStorage.getItem('walletAddress');
      if (address) {
        setWalletAddress(address);
      }
    }
  }, [extensionInstalled]);

  const connectExtension = async () => {
    window.kleverWeb.provider = {
      api:
        process.env.DEFAULT_API_HOST ||
        'https://api.testnet.klever.finance/v1.0',
      node:
        process.env.DEFAULT_NODE_HOST || 'https://node.testnet.klever.finance',
    };

    try {
      if (!web.isKleverWebActive()) {
        setExtensionLoading(true);
        await web.initialize();
        setExtensionLoading(false);
      }
      const address: string = await window.kleverWeb.getWalletAddress();
      if (address.startsWith('klv') && address.length === 62) {
        setWalletAddress(address);
        sessionStorage.setItem('walletAddress', address);
      } else {
        toast.error('Invalid wallet address, please switch to a klv wallet');
      }
    } catch (e) {
      setExtensionLoading(false);
      toast.error(String(e).split(':')[1]);
    }
  };

  const values: IExtension = {
    extensionInstalled,
    connectExtension,
    logoutExtension,
    walletAddress,
    extensionLoading,
  };

  return <Extension.Provider value={values}>{children}</Extension.Provider>;
};

export const useExtension = (): IExtension => useContext(Extension);
