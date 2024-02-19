import { setQueryAndRouter } from '@/utils';
import { bech32 } from 'bech32';
import { NextParsedUrlQuery } from 'next/dist/server/request-meta';
import { cleanEmptyValues } from '../../FormInput';
import { PackInfo, WhitelistInfo } from './types';

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const parseSplitRoyalties = (data: any): void => {
  if (data?.splitRoyalties) {
    delete data.splitRoyalties;
  }
  if (data?.transferPercentage) {
    delete data.transferPercentage;
  }
  if (
    data.royalties?.splitRoyalties === undefined ||
    !data.royalties?.splitRoyalties?.length
  ) {
    return;
  }

  const splitRoyaltiesReference = data.royalties.splitRoyalties;

  delete data.royalties.splitRoyalties;

  const splitRoyalties: {
    [key: string]: any;
  } = {};

  splitRoyaltiesReference.forEach((item: any) => {
    const address = item.address;
    delete item.address;
    splitRoyalties[address] = item;
  });
  data.royalties.splitRoyalties = splitRoyalties;
};

export const parseURIs = (data: any): void => {
  if (data.uris === undefined) {
    return;
  }

  const urisReference = data.uris;

  delete data.uris;

  if (urisReference.length === 0) return;

  const uris: {
    [key: string]: string;
  } = {};

  urisReference.forEach((item: any) => {
    const label = item.label;
    uris[label] = item.value;
  });

  data.uris = uris;
};

export const parseStaking = (data: any): void => {
  if (data.staking === undefined) {
    return;
  }

  if (data.staking.interestType !== undefined) {
    data.staking.interestType = data.staking.interestType ? 1 : 0;
  }
};

export const parseProperties = (data: any): void => {
  if (data.properties === undefined) {
    return;
  }

  const propertiesReference = data.properties;

  delete data.properties;

  if (Object.keys(propertiesReference).length === 0) return;

  const properties: {
    [key: string]: boolean;
  } = {};

  Object.keys(propertiesReference).forEach(key => {
    const label = key;
    properties[label] = Boolean(propertiesReference[key]);
  });

  data.properties = properties;
};

export const parseKDAFeePool = (data: any): void => {
  if (data.kdaPool === undefined) {
    return;
  }

  const quotient = data.kdaPool.quotient;

  delete data.kdaPool.quotient;

  data.kdaPool.fRatioKDA = quotient;
  data.kdaPool.fRatioKLV = 1;
};

export const parsePackInfo = (data: any): void => {
  if (data.packInfo === undefined) {
    return;
  }

  const packInfoReference = data.packInfo;

  delete data.packInfo;

  if (packInfoReference.length === 0) return;

  const packInfo: PackInfo = {};

  packInfoReference.forEach((item: any) => {
    const label = item.currencyId.toUpperCase();
    packInfo[label] = {
      packs: item.packs,
    };
  });

  data.packInfo = packInfo;
};

export const parseWhitelistInfo = (data: any): void => {
  if (data.whitelistInfo === undefined) {
    return;
  }

  const whitelistInfoReference = data.whitelistInfo;

  delete data.whitelistInfo;

  if (whitelistInfoReference.length === 0) return;

  const whitelistInfo: WhitelistInfo = {};

  whitelistInfoReference.forEach((item: any) => {
    const address = item.address;
    whitelistInfo[address] = {
      limit: item.limit,
    };
  });

  data.whitelistInfo = whitelistInfo;
};

export const parseDates = (data: any): void => {
  if (
    data.startTime === undefined &&
    data.endTime === undefined &&
    data.whitelistStartTime === undefined &&
    data.whitelistEndTime === undefined
  ) {
    return;
  }

  if (data.startTime !== undefined) {
    data.startTime = new Date(data.startTime).getTime() / 1000;
  }

  if (data.endTime !== undefined) {
    data.endTime = new Date(data.endTime).getTime() / 1000;
  }

  if (data.whitelistStartTime !== undefined) {
    data.whitelistStartTime =
      new Date(data.whitelistStartTime).getTime() / 1000;
  }

  if (data.whitelistEndTime !== undefined) {
    data.whitelistEndTime = new Date(data.whitelistEndTime).getTime() / 1000;
  }

  if (data.startTime !== undefined && data.endTime !== undefined) {
    if (data.startTime > data.endTime) {
      throw new Error('Start date must be before end date');
    }

    if (data.startTime < new Date().getTime() / 1000) {
      throw new Error(
        'Start date must be in the future, if you want to start now, leave the field blank',
      );
    }
  }

  if (
    data.whitelistStartTime !== undefined &&
    data.whitelistEndTime !== undefined
  ) {
    if (data.whitelistStartTime > data.whitelistEndTime) {
      throw new Error('Whitelist start time must be before whitelist end time');
    }

    if (data.whitelistStartTime < new Date().getTime() / 1000) {
      throw new Error(
        'Whitelist start time must be in the future, if you want to start now, leave the field blank',
      );
    }
  }
};

export const parseKda = (contractValues: any, contractType: string) => {
  const parsedValues = { ...contractValues };
  if (parsedValues.collection) {
    parsedValues['kda'] = parsedValues.collection;
    delete parsedValues.collection;
  }
  if (parsedValues.collectionAssetID) {
    parsedValues['kda'] += `/${parsedValues.collectionAssetID}`;
  }
  if ('collectionAssetID' in parsedValues) {
    delete parsedValues.collectionAssetID;
  }

  if (
    contractType === 'AssetTriggerContract' ||
    contractType === 'SellContract'
  ) {
    parsedValues['assetId'] = parsedValues['kda'];

    delete parsedValues.kda;
  }
  return parsedValues;
};

export const parseUndefinedValues = (contractValues: any) => {
  if (!contractValues.startTime) {
    delete contractValues.startTime;
  }
  if (!contractValues.endTime) {
    delete contractValues.endTime;
  }
};

export const percentageProps = {
  min: 0,
  max: 100,
  precision: 2,
};

export const parseStringToNumberSupply = (data: any): void => {
  if (data.maxSupply !== '') {
    const maxSupply = parseInt(data.maxSupply.replace(/,/g, ''), 10);
    data.maxSupply = maxSupply;
  }
  if (data.initialSupply === '') {
    const initialSupply = parseInt(data.initialSupply.replace(/,/g, ''), 10);
    data.initialSupply = initialSupply;
  }
  if (data.maxAmount === '') {
    const maxAmount = parseInt(data.maxAmount.replace(/,/g, ''), 10);
    data.maxAmount = maxAmount;
  }
};

interface RemoveWrapperParams {
  index: number;
  remove: (index: number) => void;
  getValues: () => any;
  router: any;
}

export const removeWrapper = ({
  index,
  remove,
  getValues,
  router,
}: RemoveWrapperParams) => {
  remove(index);

  const nonEmptyValues = cleanEmptyValues(getValues());

  let newQuery: NextParsedUrlQuery = router.query?.contract
    ? { contract: router.query?.contract }
    : {};

  newQuery = {
    ...newQuery,
    ...router.query,
    contractDetails: JSON.stringify(nonEmptyValues),
  };

  setQueryAndRouter(newQuery, router);
};

export const twosComplement = (value: number, bitsSize: number): string => {
  if (value < 0) {
    value *= -1;
  }

  const bits = value.toString(2).padStart(bitsSize, '0');

  let complement = '';

  for (let i = 0; i < bitsSize; i++) {
    complement += bits[i] === '0' ? '1' : '0';
  }

  for (let i = bitsSize - 1; i >= 0; i--) {
    if (complement[i] === '0') {
      complement = complement.slice(0, i) + '1' + complement.slice(i + 1);
      break;
    } else {
      complement = complement.slice(0, i) + '0' + complement.slice(i + 1);
    }
  }

  let hexComplement = parseInt(complement.slice(0, bitsSize / 2), 2).toString(
    16,
  );
  hexComplement += parseInt(
    complement.slice(bitsSize / 2, bitsSize),
    2,
  ).toString(16);

  return hexComplement;
};

export function encodeBigNumber(value: number) {
  let hex = value.toString(16);
  if (value < 0) {
    hex = twosComplement(value, hex.length * 4);
  }
  if (hex.length % 2 !== 0) {
    hex = '0' + hex;
  }

  if (value > 0) {
    let bits = value.toString(2);
    if (bits.length % 8 !== 0) {
      bits = '0'.repeat(8 - (bits.length % 8)) + bits;
    }
    if (bits[0] === '1') {
      hex = '00' + hex;
    }
  }

  const length = (hex.length / 2).toString(16).padStart(8, '0');

  return length + hex;
}

export function encodeLengthPlusData(value: string | any[]) {
  let data;
  if (typeof value === 'string') {
    data = toByteArray(value);
  } else {
    data = value;
  }

  if (data.length === 0) {
    return '';
  }

  const length = data.length.toString(16).padStart(8, '0');

  const dataHex = Array.from(data)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
  return length + dataHex;
}

export function toByteArray(str: string) {
  const byteArray = [];
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    byteArray.push(code & 0xff);
  }
  return byteArray;
}

export function encodeAddress(value: string, shouldValidate = true) {
  let decoded;

  try {
    decoded = bech32.decode(value);
  } catch (err: any) {
    if (shouldValidate) {
      throw new Error(err);
    }
    return value;
  }

  const prefix = decoded.prefix;
  if (prefix != 'klv') {
    if (shouldValidate) {
      throw new Error('Invalid prefix');
    }
    return value;
  }

  const pubkey = Buffer.from(bech32.fromWords(decoded.words));
  if (pubkey.length != 32) {
    if (shouldValidate) {
      throw new Error('Invalid pubkey length');
    }
    return value;
  }

  return pubkey.toString('hex');
}
