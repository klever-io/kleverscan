import { IAsset, IParsedMetrics, IEpochInfo, IContractOption } from '../types';

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

export const parseData = (data: any) => {
  const dataEntries = Object.entries(data);

  dataEntries.forEach(([key, value]) => {
    if (value === '') {
      delete data[key];
    } else if (typeof value === 'object') {
      parseData(value);
    } else if (
      typeof value === 'string' &&
      new RegExp(
        '^((19|20)\\d\\d)[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])',
      ).test(value)
    ) {
      data[key] = new Date(value).getTime() / 1000;
    } else if (isNaN(value as any)) {
      switch (value) {
        case 'true':
          data[key] = true;
          break;
        case 'false':
          data[key] = false;
          break;
        default:
          data[key] = value;
          break;
      }
    } else {
      data[key] = Number(value);
    }
  });

  return data;
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

  const formatedstr = str.charAt(0).toUpperCase() + str.slice(1);
  let label = '';
  formatedstr?.split(/(?=[A-Z])/).forEach((item: string, index: number) => {
    label += item;
    if (index < formatedstr?.split(/(?=[A-Z])/).length - 1) {
      label += ' ';
    }
  });

  return label;
};

export const contractOptions: IContractOption[] = [
  {
    label: 'Transfer',
    value: 'TransferContract',
  },
  {
    label: 'Create Asset',
    value: 'CreateAssetContract',
  },
  {
    label: 'Create Validator',
    value: 'CreateValidatorContract',
  },
  {
    label: 'Validator Config',
    value: 'ValidatorConfigContract',
  },
  {
    label: 'Freeze',
    value: 'FreezeContract',
  },
  {
    label: 'Unfreeze',
    value: 'UnfreezeContract',
  },
  {
    label: 'Delegate',
    value: 'DelegateContract',
  },
  {
    label: 'Undelegate',
    value: 'UndelegateContract',
  },
  {
    label: 'Withdraw',
    value: 'WithdrawContract',
  },
  {
    label: 'Claim',
    value: 'ClaimContract',
  },
  {
    label: 'Unjail',
    value: 'UnjailContract',
  },
  {
    label: 'Asset Trigger',
    value: 'AssetTriggerContract',
  },
  {
    label: 'Set Account Name',
    value: 'SetAccountNameContract',
  },
  {
    label: 'Proposal',
    value: 'ProposalContract',
  },
  {
    label: 'Vote',
    value: 'VoteContract',
  },
  {
    label: 'Config ITO',
    value: 'ConfigITOContract',
  },
  {
    label: 'Set ITO Prices',
    value: 'SetITOPricesContract',
  },
  {
    label: 'Buy',
    value: 'BuyContract',
  },
  {
    label: 'Sell',
    value: 'SellContract',
  },
  {
    label: 'Cancel Market Order',
    value: 'CancelMarketOrderContract',
  },
  {
    label: 'Create Marketplace',
    value: 'CreateMarketplaceContract',
  },
  {
    label: 'Config Marketplace',
    value: 'ConfigMarketplaceContract',
  },
  {
    label: 'Update Account Permission',
    value: 'UpdateAccountPermissionContract',
  },
];

export const isDataEmpty = (data: string[]): boolean => {
  if (data?.length === 0) {
    return true;
  }

  if (data !== undefined) {
    for (let i = 0; i < data?.length; i++) {
      if (data[i].length > 0) {
        return false;
      }
    }
  }

  return true;
};

export const claimTypes = [
  {
    label: 'Staking Claim (0)',
    value: 0,
  },
  {
    label: 'Allowance Claim (1)',
    value: 1,
  },
  {
    label: 'Market Claim (2)',
    value: 2,
  },
];

export const assetTriggerTypes = [
  {
    label: 'Mint (0)',
    value: 0,
  },
  {
    label: 'Burn (1)',
    value: 1,
  },
  {
    label: 'Wipe (2)',
    value: 2,
  },
  {
    label: 'Pause (3)',
    value: 3,
  },
  {
    label: 'Resume (4)',
    value: 4,
  },
  {
    label: 'Change Owner (5)',
    value: 5,
  },
  {
    label: 'Add Role (6)',
    value: 6,
  },
  {
    label: 'Remove Role (7)',
    value: 7,
  },
  {
    label: 'Update Metadata (8)',
    value: 8,
  },
  {
    label: 'Stop NFT Mint (9)',
    value: 9,
  },
  {
    label: 'Update Logo (10)',
    value: 10,
  },
  {
    label: 'Update URIs (11)',
    value: 11,
  },
  {
    label: 'Change Royalties Receiver (12)',
    value: 12,
  },
  {
    label: 'Update Staking (13)',
    value: 13,
  },
];
