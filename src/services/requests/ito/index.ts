import api from '@/services/api';
import { IAsset, IITO, IParsedITO } from '@/types';
import { getPrecision } from '@/utils/precisionFunctions';
import { NextRouter } from 'next/router';

export const requestITOs = async (
  tempPage?: number,
  router?: NextRouter,
  page?: number,
): Promise<any | void> => {
  const asset = router?.query?.asset ?? '';
  const itoPage = tempPage ?? page;
  const isActive = router?.query?.active ?? true;
  return api.get({
    route: `ito/list`,
    query: { page: itoPage, active: isActive, asset },
  });
};

export const requestAssetsList = async (data: IITO[]): Promise<any | void> => {
  if (data) {
    try {
      const assetsInput: string = data
        .map((ITO: IITO) => ITO.assetId)
        .join(',');
      const res = await api.get({
        route: `assets/list?asset=${assetsInput}`,
      });
      if (!res.error || res.error === '') {
        return res;
      }
    } catch (error) {
      console.error(error);
    }
  }
};

export const processITOPrecisions = async (
  ITO: IITO,
  assetPrecision: number,
): Promise<IITO> => {
  ITO.packData.forEach(async packInfo => {
    const keyPrecision = await getPrecision(packInfo.key);
    packInfo.packs.forEach(pack => {
      pack.price = pack.price / 10 ** keyPrecision;
      pack.amount = pack.amount / 10 ** assetPrecision;
    });
  });
  return ITO;
};

export const parseITOs = async (
  ITOs: IITO[],
): Promise<IParsedITO | never[]> => {
  const assetsInput: string = ITOs.map(ITO => ITO.assetId).join(',');
  const packsPrecisionCalls: Promise<IITO>[] = [];
  const res = await api.get({
    route: `assets/list?asset=${assetsInput}`,
  });
  if (!res.error || res.error === '') {
    const assets = res.data.assets;
    ITOs.forEach((ITO, index) => {
      const asset = assets.find(
        (asset: IAsset) => asset.assetId === ITOs[index].assetId,
      );
      ITO.maxAmount = ITO.maxAmount / 10 ** asset.precision;
      ITO['ticker'] = asset.ticker;
      ITO['assetType'] = asset.assetType;
      ITO['precision'] = asset.precision;
      ITO['assetLogo'] = asset.logo;
      packsPrecisionCalls.push(processITOPrecisions(ITO, asset.precision));
    });
    await Promise.allSettled(packsPrecisionCalls);
  }
  return [];
};
