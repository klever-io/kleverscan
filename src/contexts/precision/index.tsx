import { getPrecision } from '@/utils/index';
import { createContext, useContext, useState } from 'react';

export const PrecisionContext = createContext({} as IUsePrecisions);

interface IInitialPrecisions {
  KLV: number;
  KFI: number;
  'DVK-34ZH': number;
  'KUSD-2S58': number;
  'DVKNFT-1SW5': number;
  'LMT-KGIA': number;
  'LMNFT-SM99': number;
  [key: string]: number;
}

interface IPrecisions extends IInitialPrecisions {
  [key: string]: number;
}

interface IUsePrecisions {
  precisions: IPrecisions;
  getContextPrecision: (assetId: string) => Promise<number | void>;
}

export const PrecisionProvider: React.FC = ({ children }) => {
  const initialPrecisions: IInitialPrecisions = {
    KLV: 6,
    KFI: 6,
    'DVK-34ZH': 6,
    'KUSD-2S58': 6,
    'DVKNFT-1SW5': 0,
    'LMT-KGIA': 6,
    'LMNFT-SM99': 0,
  };
  const [precisions, setPrecisions] = useState(initialPrecisions);

  const getContextPrecision = async (assetId: string) => {
    if (precisions[assetId]) {
      return precisions[assetId];
    }
    const newPrecision = await getPrecision(assetId);
    if (typeof newPrecision === 'number') {
      setPrecisions({ ...precisions, assetId: newPrecision });
    }
  };

  const values = {
    precisions,
    getContextPrecision,
  };

  return (
    <PrecisionContext.Provider value={values}>
      {children}
    </PrecisionContext.Provider>
  );
};

export const usePrecisions = (): IUsePrecisions => useContext(PrecisionContext);
