import { IAsset, IParsedMetrics, IEpochInfo } from '../types';
import { contracts } from '../components/ContractSpecific/contracts';

export const breakText = (text: string, limit: number): string => {
  return text.length > limit ? `${text.substring(0, limit)}...` : text;
};

export const timestampToDate = (timestamp: number): string => {
  const time = new Date(timestamp * 1000);

  return time.toLocaleString();
};

export const getVariation = (variation: number): string => {
  const precision = 2;

  if (variation < 0) {
    return `- ${Math.abs(variation).toFixed(precision)}%`;
  }

  return `+ ${variation ? variation.toFixed(precision) : '--'}%`;
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

export const typeVoteColors = {
  Yes: '#B039BF',
  No: '#FF4A4A',
};

export const formatAmount = (number: number): string => {
  if (number <= 0) {
    return '0';
  }

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
  const item =
    lookup
      .slice()
      .reverse()
      .find(i => number >= i.value) || lookup[0];

  return `${(number / item.value).toFixed(2).replace(regex, '$1')} ${
    item.symbol
  }`;
};

export const toLocaleFixed = (value: number, precision: number): string => {
  return value?.toLocaleString(undefined, {
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
    asset.assetId = encodeURIComponent(asset.assetId);
    return asset;
  });
};

export const parseAddress = (address: string, maxLen: number): string => {
  return address.length > maxLen
    ? `${address.slice(0, maxLen / 2)}...${address.slice(-(maxLen / 2))}`
    : address;
};

export const capitalizeString = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getEpochInfo = (parseMetrics: IParsedMetrics): IEpochInfo => {
  const {
    klv_slot_at_epoch_start,
    klv_slots_per_epoch,
    klv_current_slot,
    klv_slot_duration,
  } = parseMetrics;

  const epochFinishSlot = klv_slot_at_epoch_start + klv_slots_per_epoch;
  let slotsRemained = epochFinishSlot - klv_current_slot;
  if (epochFinishSlot < klv_current_slot) {
    slotsRemained = 0;
  }

  const secondsRemainedInEpoch = (slotsRemained * klv_slot_duration) / 1000;

  const remainingTime = secondsToHourMinSec(secondsRemainedInEpoch);

  const epochLoadPercent = 100 - (slotsRemained / klv_slots_per_epoch) * 100.0;

  return {
    currentSlot: klv_current_slot,
    epochFinishSlot: epochFinishSlot,
    epochLoadPercent,
    remainingTime,
  };
};

const secondsToHourMinSec = (input: number): string => {
  const numSecondsInAMinute = 60;
  const numMinutesInAHour = 60;
  const numSecondsInAHour = numSecondsInAMinute * numMinutesInAHour;
  let result = '';

  const hours = Math.floor(input / numSecondsInAMinute / numMinutesInAHour);
  let seconds = input % numSecondsInAHour;
  const minutes = Math.floor(seconds / numSecondsInAMinute);
  seconds = input % numSecondsInAMinute;

  if (hours > 0) {
    result = plural(hours, 'hour');
  }
  if (minutes > 0) {
    result += plural(minutes, 'minute');
  }
  if (seconds > 0) {
    result += plural(seconds, 'second');
  }

  result += ' ';

  return result;
};

const plural = (count: number, singular: string): string => {
  if (count < 2) {
    return `${count} ${singular} `;
  }

  return `${count} ${singular}s `;
};

export const addCommasToNumber = (numb: number): string => {
  return numb.toLocaleString();
};

export const formatLabel = (str: string) => {
  switch (str) {
    case 'assetID':
      return 'AssetID';
    case 'assetId':
      return 'AssetID';
    case 'bucketID':
      return 'BucketID';
    case 'isNFTMintStopped':
      return 'Is NFT Mint Stopped';
    case 'APR':
      return 'APR';
    case 'BLSPublicKey':
      return 'BLS Public Key';
    case 'marketplaceID':
      return 'MarketplaceID';
    default:
      break;
  }

  if (str === 'assetID') {
    return 'AssetID';
  }

  let formatedstr = str.charAt(0).toUpperCase() + str.slice(1);
  let label = '';
  formatedstr?.split(/(?=[A-Z])/).forEach((item: string, index: number) => {
    label += item;
    if (index < formatedstr?.split(/(?=[A-Z])/).length - 1) {
      label += ' ';
    }
  });

  return label;
};

export const changeObject = (
  obj: any,
  key: any,
  value: any,
  lastParent: any = '',
  parent: any = '',
) => {
  let type = '';

  const searchType = (obj: any, field: string) => {
    Object.keys(obj).forEach(item => {
      if (item === field) {
        type = typeof obj[item];
      } else if (
        typeof obj[item] === 'object' &&
        obj[item] !== null &&
        !Array.isArray(obj[item])
      ) {
        searchType(obj[item], field);
      } else if (Array.isArray(obj[item])) {
        if (
          typeof obj[item][0] === 'object' &&
          obj[item][0] !== null &&
          !Array.isArray(obj[item][0])
        ) {
          searchType(Object.keys(obj[item][0]), field);
        }
      }
    });
  };

  searchType(contracts, key);

  Object.keys(obj).map((item: any) => {
    if (item === key) {
      if (parent !== '' && parent) {
        if (lastParent === parent) {
          if (value === '') {
            if (type === 'number') {
              obj[item] = null;
            } else {
              obj[item] = '';
            }
          } else {
            if (typeof value === 'boolean') {
              obj[item] = Boolean(value);
            } else if (!isNaN(Number(value)) && value.length !== 0) {
              obj[item] = Number(value);
            } else {
              obj[item] = value;
            }
          }
        }
      } else {
        if (value === '') {
          if (type === 'number') {
            obj[item] = null;
          } else {
            obj[item] = '';
          }
        } else {
          if (typeof value === 'boolean') {
            obj[item] = Boolean(value);
          } else if (!isNaN(Number(value)) && value.length !== 0) {
            obj[item] = Number(value);
          } else {
            obj[item] = value;
          }
        }
      }
    }
    if (
      typeof obj[item] === 'object' &&
      !Array.isArray(obj[item]) &&
      obj[item] !== null
    ) {
      if (parent) {
        changeObject(obj[item], key, value, item, parent);
      }
    }
  });
};
