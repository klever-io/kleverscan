import { getPrecision } from '@/utils/index';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react';
import { IInitialPrecisions, initialPrecisions, IPrecisions } from './data';

export const PrecisionContext = createContext({} as IUsePrecisions);

interface IUsePrecisions {
  precisions: IPrecisions;
  getContextPrecision: (assetId: string) => Promise<number | void>;
  setPrecisions: Dispatch<SetStateAction<IInitialPrecisions>>;
}

export const PrecisionProvider: React.FC = ({ children }) => {
  const [precisions, setPrecisions] = useState(initialPrecisions);

  const getContextPrecision = async (assetId: string) => {
    if (assetId.includes('/')) {
      return 0;
    }
    if (precisions[assetId]) {
      return precisions[assetId];
    }
    const newPrecision = await getPrecision(assetId);
    if (typeof newPrecision === 'number') {
      setPrecisions({ ...precisions, [assetId]: newPrecision });
    }
  };

  const values = {
    precisions,
    getContextPrecision,
    setPrecisions,
  };

  return (
    <PrecisionContext.Provider value={values}>
      {children}
    </PrecisionContext.Provider>
  );
};

export const usePrecisions = (): IUsePrecisions => useContext(PrecisionContext);
