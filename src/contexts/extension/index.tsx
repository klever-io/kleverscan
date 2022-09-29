import { doIf } from '@/utils/index';
import { core } from '@klever/sdk';
import { useMobile } from 'contexts/mobile';
import router from 'next/router';
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

  const { closeMenu } = useMobile();

  useEffect(() => {
    const init = async () => {
      if (typeof window !== 'undefined') {
        await doIf(
          () => setExtensionInstalled(true),
          () => logoutExtension(),
          () => window.kleverWeb !== undefined,
        );
      }
    };
    init();
  }, []);

  const logoutExtension = useCallback(() => {
    if (router.pathname.includes('/create-transaction')) {
      window.innerWidth < 1025 && closeMenu && closeMenu();
      router.push('/');
    }
  }, [router, closeMenu]);

  const connectExtension = async () => {
    if (!walletAddress) {
      window.kleverWeb.provider = {
        api:
          process.env.DEFAULT_API_HOST ||
          'https://api.testnet.klever.finance/v1.0',
        node:
          process.env.DEFAULT_NODE_HOST ||
          'https://node.testnet.klever.finance',
      };

      try {
        if (!core.isKleverWebActive()) {
          setExtensionLoading(true);
          await core.initialize();
          setExtensionLoading(false);
        }

        const address: string = await window.kleverWeb.getWalletAddress();

        if (address.startsWith('klv') && address.length === 62) {
          setWalletAddress(address);
        } else {
          toast.error('Invalid wallet address, please switch to a klv wallet');
        }
      } catch (e) {
        setExtensionLoading(false);
        toast.error(String(e).split(':')[1]);
      }
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