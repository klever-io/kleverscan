import { IEpochInfo, IMetrics } from '@/types';
import { NextParsedUrlQuery } from 'next/dist/server/request-meta';
import { NextRouter } from 'next/router';
import { secondsToHourMinSec } from './timeFunctions';

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
 * Receive a tab name(string) and the headers(array of strings) from next router query and find the number of selected tab(). If it doesn't find any number, returns 0.
 * @param tab is required to use next router query
 * @param headers is required to search tab number
 * @returns return number corresponding to the tab selected or 0.
 */
export const getSelectedTab = (
  tab: string | string[] | undefined,
  headers: string[],
): number => {
  if (typeof tab === 'string') {
    const result = headers.indexOf(tab);
    if (result === -1) {
      return 0;
    }
    return result;
  }
  return 0;
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
 * Parse the APRI/FPRI
 *
 * Parse string to remove the last letter and let only the APR/FPR
 * @param stakingType
 * @returns string
 */
export const parseApr = (stakingType: string | undefined): string => {
  if (!stakingType) return '--';
  return stakingType.slice(0, -1);
};

export const setQueryAndRouter = (
  newQuery: NextParsedUrlQuery,
  router: NextRouter,
): void => {
  router.query = {
    ...router.query,
    ...newQuery,
  };

  router.push(
    {
      pathname: router.pathname,
      query: router.query,
    },
    undefined,
    {
      shallow: true,
    },
  );
};

export const sleep = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));
