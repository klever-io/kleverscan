import { setQueryAndRouter } from '@/utils';
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

export function toByteArray(str: string) {
  const byteArray = [];
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    byteArray.push(code & 0xff);
  }
  return byteArray;
}
