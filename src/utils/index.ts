import { IAsset } from '../types';

export const breakText = (text: string, limit: number): string => {
  return text.length > limit ? `${text.substring(0, limit)}...` : text;
};

export const getAge = (date: Date): string => {
  const diff = Math.abs(new Date().getTime() - date.getTime());

  const sec = Math.ceil(diff / 1000);
  const min = Math.ceil(diff / (1000 * 60));
  const hour = Math.ceil(diff / (1000 * 60 * 60));
  const day = Math.ceil(diff / (1000 * 60 * 60 * 24));

  let val = 0;
  let suffix = '';

  if (sec <= 59) {
    val = sec;
    suffix = 'sec';
  } else if (sec > 59 && min <= 59) {
    val = min;
    suffix = 'min';
  } else if (min > 59 && hour <= 23) {
    val = hour;
    suffix = 'hour';
  } else if (hour > 24) {
    val = day;
    suffix = 'day';
  }

  return `${val} ${suffix}${val > 1 ? 's' : ''}`;
};

export const formatAmount = (number: number): string => {
  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'K' },
    { value: 1e6, symbol: 'Mi' },
    { value: 1e9, symbol: 'Bi' },
    { value: 1e12, symbol: 'Tri' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' },
  ];

  const regex = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const item = lookup
    .slice()
    .reverse()
    .find(i => number >= i.value);

  return item
    ? `${(number / item.value).toFixed(1).replace(regex, '$1')} ${item.symbol}`
    : '0';
};

export const toLocaleFixed = (value: number, precision: number): string => {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: precision,
  });
};

export const hexToString = (hex: string): string => {
  const stringHex = hex.toString();
  let ret = '';

  for (let i = 0; i < stringHex.length; i += 2) {
    ret += String.fromCharCode(parseInt(stringHex.substr(i, 2), 16));
  }

  return ret;
};

export const parseHardCodedInfo = (assets: IAsset[]): IAsset[] => {
  return assets.map(asset => {
    if (asset.assetId === 'KLV') {
      asset.maxSupply = 10000000000000000;
    } else if (asset.assetId === 'KFI') {
      asset.maxSupply = 21000000000000;
    }

    asset.assetId = encodeURIComponent(asset.assetId);

    return asset;
  });
};
