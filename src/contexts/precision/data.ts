export interface IInitialPrecisions {
  KLV: number;
  KFI: number;
  [key: string]: number;
}
export let initialPrecisions: IInitialPrecisions = {
  KLV: 6,
  KFI: 6,
};

const otherPrecisions = {
  'DVK-34ZH': 6,
  'KUSD-2S58': 6,
  'DVKNFT-1SW5': 0,
  'LMT-KGIA': 6,
  'LMNFT-SM99': 0,
};
if (process.env.DEFAULT_API_HOST === 'https://api.mainnet.klever.finance') {
  initialPrecisions = {
    ...initialPrecisions,
    ...otherPrecisions,
  };
}
export interface IPrecisions extends IInitialPrecisions {
  [key: string]: number;
}
