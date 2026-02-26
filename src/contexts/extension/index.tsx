import { PropsWithChildren } from 'react';
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
  searchingExtension: boolean;
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

export const ExtensionProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [extensionInstalled, setExtensionInstalled] = useState<boolean>();
  const [extensionLoading, setExtensionLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [openDrawer, setOpenDrawer] = useState(false);
  const [searchingExtension, setSearchingExtension] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (typeof window !== 'undefined') {
        doIf({
          success: () => {
            setExtensionInstalled(true);
          },
          failure: () => {
            logoutExtension();
            setExtensionInstalled(false);
          },
          finallyCb: () => setSearchingExtension(false),
          condition: () => window.kleverWeb !== undefined,
        });
      }
    };

    init();
  }, []);

  const logoutExtension = useCallback(async () => {
    setWalletAddress('');
  }, [walletAddress]);

  const connectExtension = async () => {
    if (typeof window !== 'undefined' && window.kleverWeb?.provider) {
      window.kleverWeb.provider = {
        api:
          process.env.DEFAULT_API_HOST || 'https://api.testnet.klever.org/v1.0',
        node:
          process.env.DEFAULT_NODE_HOST || 'https://node.testnet.klever.org',
      };
    }

    try {
      if (!web.isKleverWebActive()) {
        setExtensionLoading(true);

        if (window.kleverHub !== undefined) {
          await window.kleverHub.initialize();

          window.kleverHub.onAccountChanged((e: any) => {
            if (
              (e.chain === 'KLV' || e.chain === 1) &&
              e.address.length === 62
            ) {
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
      const address: string = await web.getWalletAddress();
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
    searchingExtension,
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
