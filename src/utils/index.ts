import { ISelectedDays } from '@/components/DateFilter';
import api from '@/services/api';
import {
  BuyReceiptData,
  IKAppTransferReceipt,
  ITransferReceipt,
} from '@/types/receipts';
import { TFunction } from 'next-i18next';
import { NextParsedUrlQuery } from 'next/dist/server/request-meta';
import { NextRouter } from 'next/router';
import { toast } from 'react-toastify';
import {
  IAccountAsset,
  IAsset,
  IAssetOne,
  IAssetResponse,
  IBalance,
  IBuyReceipt,
  ICustomStyles,
  IDelegationsResponse,
  IEpochInfo,
  IFilterDater,
  IFormData,
  IMetrics,
  IPagination,
  IPrecisionResponse,
  IReceipt,
  ITransaction,
  IValidator,
  IValidatorResponse,
} from '../types';
import {
  ContractsIndex,
  IBuyContractPayload,
  IBuyITOsTotalPrices,
} from '../types/contracts';
import {
  contractsList,
  getCells,
  getHeaderForCSV,
  initialsTableHeaders,
} from './contracts';
import { findNextSiblingReceipt, findPreviousSiblingReceipt } from './findKey';

/**
 * Emulates CSS ellipsis by receiving a string and a limit, if the string length is bigger then the limit, the exceeded characters will be replaced by the ellipsis.
 * @param text
 * @param limit
 * @returns string
 */
export const breakText = (text: string, limit: number): string => {
  return text.length > limit ? `${text.substring(0, limit)}...` : text;
};

/**
 * Converts a timestamp number into a Date instance and returns it's time based on user locale.
 * @param timestamp
 * @returns string
 */
export const timestampToDate = (timestamp: number): string => {
  const time = new Date(timestamp * 1000);
  return time.toLocaleString();
};

/**
 * Receives a variation number that should be the result from a subtraction between two variables in percent value. If variation is positive returns a string representing a positive variation, otherwise, a negative variation. In case variation equals to zero, returns a string with two dashes.
 * @param variation
 * @returns string
 */
export const getVariation = (variation: number): string => {
  const precision = 2;

  if (variation < 0) {
    return `- ${Math.abs(variation).toFixed(precision)}%`;
  }

  return `+ ${variation ? variation.toFixed(precision) : '--'}%`;
};

/**
 * Receives a Date instance and calculate how many time has passed between now and this Date. Will return a string indicating how many time passed. Second arg is for translation option (optional).
 * @param date
 * @param t
 * @returns string
 */
export const getAge = (date: Date, t?: TFunction): string => {
  const diff = Math.abs(new Date().getTime() - date.getTime());
  const sec = Math.floor(diff / 1000);
  const min = Math.floor(diff / (1000 * 60));
  const hour = Math.floor(diff / (1000 * 60 * 60));
  const day = Math.floor(diff / (1000 * 60 * 60 * 24));

  let val = 0;
  let suffix = '';

  if (sec <= 59) {
    val = sec;
    suffix = t ? t('Date.Time.sec') : 'sec';
  } else if (sec > 59 && min <= 59) {
    val = min;
    suffix = t ? t('Date.Time.min') : 'min';
  } else if (min > 59 && hour <= 23) {
    val = hour;
    suffix = t ? t('Date.Time.hour') : 'hour';
  } else if (hour > 24) {
    val = day;
    suffix = t ? t('Date.Time.day') : 'day';
  }
  return `${val} ${suffix}${val > 1 ? 's' : ''}`;
};

export const typeVoteColors = {
  Yes: '#B039BF',
  No: '#FF4A4A',
};

/**
 * Formats a number and returns it's string representation in short scale (Million, Billion...) with 2 decimals points when number is not integer.
 * Example: 8874165276.908615 --> "8.87 Bi"
 * @param number
 * @returns string
 */
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

/**
 * Shorthand version of toLocaleString for passing precision and always using user locale. It receives a number that will be formatted having a minimal precision according to the precision arg passed.
 * @param value
 * @param precision
 * @returns string
 */
export const toLocaleFixed = (value: number, precision: number): string => {
  return value?.toLocaleString(undefined, {
    minimumFractionDigits: precision,
  });
};

/**
 * Converts hexadecimal bytes into human readable string.
 * @param hex
 * @returns string
 */
export const hexToString = (hex: string): string => {
  const stringHex = hex.toString();
  let ret = '';

  for (let i = 0; i < stringHex.length; i += 2) {
    ret += String.fromCharCode(parseInt(stringHex.substr(i, 2), 16));
  }

  return ret;
};

/**
 * Sanitizes the assetId's from an IAsset array so they can be valid as URI components.
 * @param assets
 * @returns IAsset[]
 */
export const parseHardCodedInfo = (assets: IAsset[]): IAsset[] => {
  return assets.map(asset => {
    asset.assetId = encodeURIComponent(asset.assetId);
    return asset;
  });
};

/**
 * Splits an address in two parts, if the address length is greater than the maxLen. The first part is the beginning of the address. The last part is the end of the address. Ellipsis is between the splitted address.
 * @param address
 * @param maxLen
 * @returns string
 */
export const parseAddress = (address: string, maxLen: number): string => {
  return address.length > maxLen
    ? `${address.slice(0, maxLen / 2)}...${address.slice(-(maxLen / 2))}`
    : address;
};

/**
 * Receives an string as an argument and returns it with it's first character capitalized.
 * @param str
 * @returns string
 */
export const capitalizeString = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Receives an IMetrics object as an argument and use it to return an IEpochInfo object.
 *
 * DEFAULT VALUES FOR MAINNET (some may change):
 *
 * slotDuration = 4000 --> 4 sec --> time for a block to be produced
 *
 * slotsPerEpoch = 5400 --> 5400 x 4 --> 21600 sec for every epoch, which is the time for the network to choose it's new block producers
 *
 * currentSlot --> current slot network is in, changes every 4 sec
 *
 * slotAtEpochStart --> slot in which actual epoch started, changes every 21600 sec
 * @param metrics
 * @returns IEpochInfo object
 */
export const getEpochInfo = (metrics: IMetrics): IEpochInfo => {
  const { slotAtEpochStart, slotsPerEpoch, currentSlot, slotDuration } =
    metrics;

  const epochFinishSlot = slotAtEpochStart + slotsPerEpoch;
  let slotsRemained = epochFinishSlot - currentSlot;
  if (epochFinishSlot < currentSlot) {
    slotsRemained = 0;
  }

  const secondsRemainedInEpoch = (slotsRemained * slotDuration) / 1000;

  const remainingTime = secondsToHourMinSec(secondsRemainedInEpoch);

  const epochLoadPercent = 100 - (slotsRemained / slotsPerEpoch) * 100.0;

  return {
    currentSlot: currentSlot,
    epochFinishSlot: epochFinishSlot,
    epochLoadPercent,
    remainingTime,
  };
};

/**
 * Receive a number as first arg that represents seconds, process this number to returns it's representation in hours, minutes and seconds as a string. Second argument is if translation option was passed.
 * @param input
 * @param t
 * @returns string
 */
const secondsToHourMinSec = (input: number, t?: TFunction): string => {
  const numSecondsInAMinute = 60;
  const numMinutesInAHour = 60;
  const numSecondsInAHour = numSecondsInAMinute * numMinutesInAHour;
  let result = '';

  const hours = Math.floor(input / numSecondsInAMinute / numMinutesInAHour);
  let seconds = input % numSecondsInAHour;
  const minutes = Math.floor(seconds / numSecondsInAMinute);
  seconds = input % numSecondsInAMinute;

  if (hours > 0) {
    result = `${hours}h`;
  }
  if (minutes > 0) {
    result += ` ${minutes}m`;
  }
  if (seconds > 0) {
    result += ` ${seconds}s`;
  }

  result += ' ';
  return result;
};

/**
 * Simply add commas to a number by calling toLocaleString method.
 * @param numb
 * @returns string
 */
export const addCommasToNumber = (numb: number): string => {
  return numb.toLocaleString();
};

/** Parse data from an Object whose values are saved as string and convert them to their content. Example: "true" --> true */
export const parseData = (data: IFormData): IFormData => {
  const dataEntries = Object.entries(data);

  dataEntries.forEach(([key, value]) => {
    if (value === '' || value === null) {
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

/**
 * Throws a string into a switch case statement to return the hardcoded parsed version of this string. In case none of the cases matches, function will execute default parse mode, which it splits the string by it's capital letters and join all words by empty spaces.
 * @param str
 * @returns string
 */
export const formatLabel = (str: string): string => {
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

/**
 * Verifies not only if an array of strings is empty, but also if it's content is full of empty strings, in that case it will still return true as well.
 * @param data
 * @returns boolean
 */
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

/**
 * Wraps the content and params of a promise and put it inside a loop. The loop will break and return if promise succeeds or it will end after the third try(or the number passed as arg). There is a timeout of 500 milliseconds between each try.
 * @param success callback fn for promise fulfilled
 * @param failure callback fn for promise rejection
 * @param condition the content of the promise
 * @param tries number of tries for the passed promise
 * @returns Promise void
 */
export const asyncDoIf = async (
  success: (result?: any) => any,
  failure: (error?: any) => any,
  condition: () => Promise<any>,
  tries = 3,
): Promise<void> => {
  const array = Array.from({ length: tries }, (_, i) => i);
  let error = '';

  for (const i of array) {
    const result = await condition();
    if (result && !result.error) {
      success(result);
      return;
    } else if (result.error) {
      error = result;
    }
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  failure(error);
  return;
};

export const setCharAt = (
  str: string,
  index: number,
  newChar: string,
): string => {
  if (index > str.length - 1) return str;
  return str.substring(0, index) + newChar + str.substring(index + 1);
};

/**
 * Makes your promise race with a timeout promise. If it loses, your promise will be rejected. Default timeout is 5 seconds.
 * @param success callback fn for promise fulfilled
 * @param failure callback fn for promise rejection
 * @param condition the content of the promise
 * @param timeoutMS time limit for the timeout promise, indicates how much time your promise has until it fails.
 * @param intervalMS time interval between your promise calls
 * @returns Promise void
 */

export const doIf = async (
  success: () => any,
  failure: () => any,
  condition: () => boolean,
  timeoutMS = 5000,
  intervalMS = 100,
): Promise<void> => {
  let interval: any;

  const IntervalPromise = new Promise(resolve => {
    interval = setInterval(() => {
      if (condition()) {
        resolve(
          (() => {
            success();
            clearInterval(interval);
            clearTimeout(timeout);
          })(),
        );
      }
    }, intervalMS);
  });

  let timeout: any;

  const TimeoutPromise = new Promise(resolve => {
    timeout = setTimeout(() => {
      resolve(
        (() => {
          failure();
          clearInterval(interval);
        })(),
      );
    }, timeoutMS);
  });

  await Promise.race([IntervalPromise, TimeoutPromise]);
};

/**
 * Get an asset's precision and use it as an exponent to the base 10, the result is returned. In case of error returns undefined and a toast error.
 * @param asset
 * @returns Promise < number | undefined >
 */
export const getPrecisionFromApi = async (
  assets: string[],
): Promise<IPrecisionResponse> => {
  try {
    const response = await api.post({
      route: `assets/precisions`,
      body: { assets },
    });
    if (response.error) {
      const messageError =
        response.error.charAt(0).toUpperCase() + response.error.slice(1);
      toast.error(messageError);
      throw new Error(response.error);
    }

    return response.data;
  } catch (error: any) {
    console.error(error);
    throw error;
  }
};

export function getPrecision<T extends string | string[]>(
  assetIds: T,
): T extends string ? Promise<number> : Promise<{ [assetId: string]: number }>;
export async function getPrecision(
  assetIds: string | string[],
): Promise<number | { [assetId: string]: number }> {
  const storedPrecisions: any = localStorage.getItem('precisions')
    ? JSON.parse(localStorage.getItem('precisions') || '{}')
    : {};

  if (typeof assetIds === 'object' && assetIds.length) {
    const aux: string[] = [];
    assetIds.forEach(assetId => {
      if (!Object.keys(storedPrecisions).includes(assetId)) {
        aux.push(assetId);
      }
    });

    try {
      const { precisions } = await getPrecisionFromApi(aux);
      const newPrecisions = { ...storedPrecisions, ...precisions };
      localStorage.setItem('precisions', JSON.stringify(newPrecisions));
      return assetIds.reduce((prev, current) => {
        return {
          ...prev,
          [current]: storedPrecisions[current] || newPrecisions[current],
        };
      }, {});
    } catch (error: any) {
      console.error(error);
      throw new Error(error);
    }
  } else if (typeof assetIds === 'string') {
    const assetId = assetIds;

    if (
      !storedPrecisions ||
      !Object.keys(storedPrecisions).includes(assetId.split('/')[0])
    ) {
      try {
        const { precisions } = (await getPrecisionFromApi([assetId])) || 0;
        const newPrecisions = { ...storedPrecisions, ...precisions };
        localStorage.setItem('precisions', JSON.stringify(newPrecisions));
        return precisions[assetId];
      } catch (error: any) {
        console.error(error);
        throw new Error(error);
      }
    } else {
      return storedPrecisions[assetId.split('/')[0]];
    }
  } else {
    throw new Error('Invalid Param');
  }
}

/**
 * Validates URL extension with regex. Accepted formats: gif|jpg|jpeg|tiff|png|webp
 * @param url
 * @returns boolean
 */
export const regexImgUrl = (url: string): boolean => {
  const regex = /[\/.](gif|jpg|jpeg|tiff|png|webp)$/i;
  if (regex.test(url)) {
    return true;
  }
  return false;
};

/**
 * Check if the header 'content-type' of a specified URL is of type 'image'. Must pass a timeout arg for this check.
 * @param url
 * @param timeout
 * @returns Promise < boolean >
 */
export const validateImgRequestHeader = async (
  url: string,
  timeout: number,
): Promise<boolean> => {
  try {
    const fetchHeaders = fetch(url, { method: 'HEAD' });
    const timeoutPromise = new Promise(resolve => {
      setTimeout(() => resolve(false), timeout);
    });
    const headers: any = await Promise.race([fetchHeaders, timeoutPromise]);
    if (
      typeof headers === 'object' &&
      headers?.headers?.get('content-type').startsWith('image')
    ) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

/**
 * Checks if an URL can be used as an html image src. Must pass a timeout arg for this check.
 * @param url
 * @param timeout
 * @returns although TS says unknown, it should return Promise < boolean >
 */
export const isImage = async (
  url: string,
  timeout: number,
): Promise<unknown> => {
  const imgPromise = new Promise(resolve => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
  });
  const timeoutPromise = new Promise(resolve => {
    setTimeout(() => resolve(false), timeout);
  });
  return Promise.race([imgPromise, timeoutPromise]);
};

/**
 * Compiles all URL image validators functions and use it as the definitive URL image validator function.
 * @param url
 * @param timeout
 * @returns Promise < boolean >
 */
export const validateImgUrl = async (
  url: string,
  timeout: number,
): Promise<boolean> => {
  if (regexImgUrl(url)) {
    return true;
  }

  if (await validateImgRequestHeader(url, timeout)) {
    return true;
  }

  if (await isImage(url, timeout)) {
    return true;
  }
  return false;
};

/**
 * Checks if the contractType is Transfer or Freeze. Otherwise returns false.
 * @param contract
 * @returns boolean
 */
export const getContractType = (contract: string): boolean => {
  if (
    contract === 'TransferContractType' ||
    contract === 'FreezeContractType'
  ) {
    return true;
  }
  return false;
};

/**
 * Receive a list of transactions and add precision field to the contracts of the transactions, unless the contract is Multi Transaction (transaction.contract.length > 1 case).
 * @param transactions
 * @returns ITransaction[] with precision key in contracts.
 */
// parameter must necessarily contain assetId

export const addPrecisionTransactions = (
  transactions: ITransaction[],
): ITransaction[] => {
  return transactions.map(transaction => {
    if (transaction.contract.length > 1) {
      return transaction;
    }
    transaction?.contract.map(async contrct => {
      const parameter = contrct?.parameter as any;
      if (parameter?.assetId) {
        const response: IAssetOne = await api.get({
          route: `assets/${parameter?.assetId}`,
        });
        if (!response.error && response.code === 'successful') {
          contrct.precision = response.data?.asset?.precision || 0;
        }
        return contrct;
      }
      contrct.precision = 6;
      return contrct;
    });
    return transaction;
  });
};

/**
 * Receives an IValidatorResponse with data from all validators and parse it adding new fields: parsedAddress, rank, staked, cumulativeStaked and status.
 * @param validators
 * @returns IValidator[]
 */
export const parseValidators = (
  validators: IValidatorResponse,
): IValidator[] => {
  return validators.data['validators'].map(
    (delegation: IDelegationsResponse, index: number): IValidator => {
      const totalProduced =
        delegation.totalLeaderSuccessRate.numSuccess +
        delegation.totalValidatorSuccessRate.numSuccess;
      const totalMissed =
        delegation.totalLeaderSuccessRate.numFailure +
        delegation.totalValidatorSuccessRate.numFailure;

      return {
        ownerAddress: delegation.ownerAddress,
        parsedAddress: parseAddress(delegation.ownerAddress, 20),
        name: delegation.name,
        rank:
          index +
          (validators.pagination.self - 1) * validators.pagination.perPage +
          1,
        cumulativeStaked: parseFloat(
          (
            (delegation.totalStake / validators.data.networkTotalStake) *
            100
          ).toFixed(4),
        ),
        staked: delegation.totalStake,
        rating: delegation.rating,
        canDelegate: delegation.canDelegate,
        selfStake: delegation.selfStake,
        status: delegation.list,
        totalProduced,
        totalMissed,
        commission: delegation.commission,
      };
    },
  );
};

/**
 *  Receives an IAccountAsset[] (which comes from an IAssetsHoldersResponse) and returns a new array of objects only with index, address, balance and rank properties.
 * @param holders
 * @param assetId is required to check if the holder asset is really from the correct asset.
 * @param pagination is required because is used to calculate the rank of the asset holder.
 * @returns IBalance[] which is the data necessary for the frontend to show the holders of an asset.
 */
export const parseHolders = (
  holders: IAccountAsset[] | [],
  assetId: string,
  pagination: IPagination,
): IBalance[] =>
  holders.map((holder: IAccountAsset, index: number) => {
    if (holder.assetId === assetId) {
      return {
        index,
        address: holder.address,
        balance: 0,
        frozenBalance: holder.frozenBalance,
        rank: index + 1 + (pagination.self - 1) * pagination.perPage,
      };
    } else
      return {
        index,
        address: '',
        balance: 0,
        frozenBalance: 0,
        rank: 0,
      };
  });

/**
 * Receives timeout, value and assets (IAssets[]) and check if the value is in the array. If not then fetch the value from API
 * @param timeout is required to do a debounce function
 * @param value is required to search on the array.
 * @param assets is required because is used to find the value.
 * @returns return false if find the value in the array(assets) or return the assets from API response (IAssets[])
 */
export const fetchPartialAsset = (
  timeout: ReturnType<typeof setTimeout>,
  value: string,
  assets: IAsset[],
): Promise<IAsset[] | false> => {
  clearTimeout(timeout);
  return new Promise(res => {
    timeout = setTimeout(async () => {
      let response: IAssetResponse;
      if (
        value &&
        !assets.find((asset: any) =>
          asset.assetId.includes(value.toUpperCase()),
        )
      ) {
        response = await api.getCached({
          route: `assets/kassets?asset=${value}`,
        });
        res(response.data.assets);
      }
      res(false);
    }, 500);
  });
};

/**
 * Receive tab from next router query and find the selected tab.
 * @param tab is required to use next router query
 * @returns return number corresponding to the tab selected.
 */
export const getSelectedTab = (tab: string | string[] | undefined): number => {
  if (tab === 'Assets' || tab === undefined) {
    return 0;
  } else if (tab === 'Transactions') {
    return 1;
  }
  return 2;
};

/**
 * Receive selectedDays
 * @param selectedDays is required to format the date filter
 * @returns return the filter as object with "startdate" and "enddate"
 */
export const filterDate = (selectedDays: ISelectedDays): IFilterDater => {
  return {
    startdate: selectedDays.start.getTime().toString(),
    enddate: selectedDays.end
      ? (selectedDays.end.getTime() + 24 * 60 * 60 * 1000).toString()
      : (selectedDays.start.getTime() + 24 * 60 * 60 * 1000).toString(),
  };
};

/**
 * Receive query as object with filters and "RESET" the date filter
 * @param query is required to reset the date filter
 * @returns return object with all filters and the new date
 */
export const resetDate = (query: NextParsedUrlQuery): NextParsedUrlQuery => {
  const updatedQuery = { ...query };
  delete updatedQuery.startdate;
  delete updatedQuery.enddate;
  return updatedQuery;
};

/**
 * Receive the asset with fpr values to calculate the apr
 * @param asset is required to use the totalStaked and totalAmount values of each epoch
 * @param epochQty  is required and it's the number of epoch to use to calculate the estimared apr, by default it'll use 10 epoch
 * @param start is required to know which epoch should start to calc the before last epoch. This is the last epoch before the 24h ( last 5th epoch)
 * @returns return a number that is the estimated APR
 */
export const calcApr = (
  asset: IAsset,
  epochQty: number,
  start: number,
): number => {
  const values = {
    totalStaked: 0,
    totalAmount: 0,
  };
  for (let index = 1 + start; index <= epochQty + start; index += 1) {
    values.totalStaked +=
      asset?.staking?.fpr[asset?.staking?.fpr.length - index].totalStaked;
    values.totalAmount +=
      asset?.staking?.fpr[asset?.staking?.fpr.length - index].totalAmount;
  }

  values.totalStaked = values.totalStaked / epochQty;
  values.totalAmount = values.totalAmount / epochQty;

  return (values.totalAmount / values.totalStaked) * 4 * 365;
};

const processHeaders = (router: NextRouter) => {
  const deafultHeaders = [...initialsTableHeaders];
  deafultHeaders.push('kApp Fee', 'Bandwidth Fee');
  const headers = getHeaderForCSV(router, deafultHeaders);
  const sanitizedHeaders = headers.filter(header => header !== '');
  return sanitizedHeaders;
};

const processRow = async (row: ITransaction, router: NextRouter) => {
  let finalVal = '';
  const parsedRow = await getCells(row, router);
  for (let j = 0; j < parsedRow.length; j++) {
    const innerValue =
      parsedRow[j] === null || parsedRow[j] === undefined
        ? ''
        : parsedRow[j].toString();

    let result = innerValue.replace(/"/g, '""');
    if (result.search(/("|,|\n)/g) >= 0) result = '"' + result + '"';
    if (j > 0) finalVal += ',';
    finalVal += result;
  }
  return finalVal + '\n';
};

export const exportToCsv = async (
  filename: string,
  rows: any[] | null,
  router: NextRouter,
): Promise<void> => {
  if (!rows || rows.length === 0) {
    window.alert('No data to export!');
    return;
  }
  let csvFile = '';
  for (let i = -1; i < rows.length; i++) {
    if (i === -1) {
      const headers = processHeaders(router);
      csvFile += headers + '\n';
    } else {
      csvFile += await processRow(rows[i], router);
    }
  }
  if (typeof window !== undefined) {
    const blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
};

export const getTotalAssetsPrices = (
  ITOBuyPrices: IBuyITOsTotalPrices,
  receipts: IReceipt[],
  sender: string,
): IBuyITOsTotalPrices => {
  receipts.map(receipt => {
    const buyITOReceipt = receipt as unknown as IBuyReceipt;
    if (buyITOReceipt.assetId && buyITOReceipt.from === sender) {
      ITOBuyPrices[buyITOReceipt.assetId].price +=
        (buyITOReceipt?.value ?? 0) /
        10 ** ITOBuyPrices[buyITOReceipt.assetId].precision;
    }
  });
  return ITOBuyPrices;
};

export const getAmountFromReceipts = async (
  assetId: string,
  contractType: number,
  receipts: IReceipt[] | undefined,
): Promise<number> => {
  if (!receipts || !receipts.length) {
    return 0;
  }
  const correctReceipt: any = receipts.find(
    receipt => receipt.type === contractType,
  );
  const amount = Number(correctReceipt?.amount) || 0;
  const precision = (await getPrecision(assetId)) as number;
  return amount / 10 ** precision;
};

export const calculatePermissionOperations = (
  operations: string,
): typeof contractsList => {
  const stringContracts: typeof contractsList = [];
  if (typeof operations === 'string' && operations.match(/^[0-9A-Fa-f]+$/g)) {
    const binaryOperations = parseInt(operations, 16).toString(2);
    const reversedBinaryOperationsArray = binaryOperations.split('').reverse();
    reversedBinaryOperationsArray.forEach((char, index) => {
      if (char === '1') {
        stringContracts.push(ContractsIndex[index]);
      }
    });
  }
  return stringContracts;
};

/**
 * Pass custom styles object to the tooltip for mobile and tablet cases.
 * @param mobileStyles mobile object offset styles for tooltip
 * @param tabletStyles tablet object offset styles for tooltip
 * @param isMobile boolean to know if viewport is mobile
 * @param isTablet boolean to know if viewport is tablet
 */
export const passViewportStyles = (
  isMobile: boolean,
  isTablet: boolean,
  mobileStyles: ICustomStyles = {},
  tabletStyles: ICustomStyles = {},
  desktopStyles: ICustomStyles = {},
): ICustomStyles => {
  if (isMobile) {
    return mobileStyles;
  }
  if (isTablet) {
    return tabletStyles;
  }
  return desktopStyles;
};

export const receiverIsSender = (
  sender: string,
  receipt: IKAppTransferReceipt | ITransferReceipt,
): boolean => sender === receipt?.to;

export const getBuyReceipt = (
  parameter: IBuyContractPayload,
  receipts: IBuyReceipt[],
  contractIndex: number,
  sender: string,
  receiverIsSender: (
    sender: string,
    receipt: IKAppTransferReceipt | ITransferReceipt,
  ) => boolean,
): null | IKAppTransferReceipt | ITransferReceipt => {
  let buyReceipt = null;
  if (parameter?.buyType === 'MarketBuy') {
    buyReceipt = findNextSiblingReceipt(
      receipts,
      contractIndex,
      16,
      14, // in MarketBuy, the formal buy receipt is 16, but it is the 14(kapp transfer) receipt that has that data we want
      [sender],
      receiverIsSender,
    );
  } else if (parameter?.buyType === 'ITOBuy') {
    buyReceipt = findPreviousSiblingReceipt(receipts, contractIndex, 2, 0); // there is no formal buy receipt in ITOBuy, but the data we want is in the 0(transfer) receipt
  }
  return buyReceipt;
};

export const getBuyPrice = (
  parameter: IBuyContractPayload,
  buyReceipt: BuyReceiptData,
): undefined | number => {
  if (parameter?.buyType === 'MarketBuy') {
    return parameter.amount;
  } else if (parameter?.buyType === 'ITOBuy') {
    return buyReceipt?.value;
  }
};

export const getBuyAmount = (
  parameter: IBuyContractPayload,
  buyReceipt: BuyReceiptData,
): undefined | number => {
  if (parameter?.buyType === 'MarketBuy') {
    return buyReceipt?.value;
  } else if (parameter?.buyType === 'ITOBuy') {
    return parameter?.amount;
  }
};

export const parseJson = (data: string): string => {
  try {
    const json = JSON.parse(data);
    return JSON.stringify(json, null, 2);
  } catch (error) {
    return data;
  }
};

export const renderCorrectPath = (uriKey: string): string => {
  if (uriKey && uriKey.startsWith('https://')) {
    return uriKey;
  }
  return `https://${uriKey}`;
};
