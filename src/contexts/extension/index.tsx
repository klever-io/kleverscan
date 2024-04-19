import { doIf } from '@/utils/promiseFunctions';
import { web } from '@klever/sdk-web';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { toast } from 'react-toastify';

interface IExtension {
  extensionInstalled: boolean | undefined;
  connectExtension: () => Promise<void>;
  logoutExtension: () => void;
  walletAddress: string;
  extensionLoading: boolean;
  openDrawer: boolean;
  setOpenDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  checkKleverWebObject: () => boolean;
}

export const Extension = createContext({} as IExtension);

export const ExtensionProvider: React.FC = ({ children }) => {
  const [extensionInstalled, setExtensionInstalled] = useState<boolean>();
  const [extensionLoading, setExtensionLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [openDrawer, setOpenDrawer] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (typeof window !== 'undefined') {
        await doIf(
          () => setExtensionInstalled(true),
          () => {
            logoutExtension();
            setExtensionInstalled(false);
          },
          () => window.kleverWeb !== undefined,
          1500, //timeout
        );
      }
    };
    init();
  }, []);

  const logoutExtension = useCallback(async () => {
    setWalletAddress('');
    sessionStorage.removeItem('walletAddress');
  }, [walletAddress]);

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

        if (window.kleverHub !== undefined) {
          await window.kleverHub.initialize();

          window.kleverHub.onAccountChanged((e: any) => {
            if (e.chain === 'KLV' && e.address.length === 62) {
              setWalletAddress(e.address);
            } else {
              logoutExtension();
            }
          });
          setExtensionLoading(false);
        } else {
          await web.initialize();
          setExtensionLoading(false);
        }
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
  };

  const checkKleverWebObject = () => {
    return window.kleverWeb !== undefined;
  };

  const values: IExtension = {
    extensionInstalled,
    connectExtension,
    logoutExtension,
    walletAddress,
    extensionLoading,
    openDrawer,
    setOpenDrawer,
    checkKleverWebObject,
  };

  return <Extension.Provider value={values}>{children}</Extension.Provider>;
};

export const useExtension = (): IExtension => useContext(Extension);
