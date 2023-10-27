import api from '@/services/api';
import { IAsset, IITO, IITOsResponse } from '@/types';
import { getPrecision } from '@/utils/precisionFunctions';
import { NextRouter } from 'next/router';

export const requestITOs = async (
  router: NextRouter,
  pageParam = 1,
): Promise<any | void> => {
  const asset = router?.query?.asset ?? '';
  const isActive = router?.query?.active ?? true;
  try {
    const itosResponse = await api.get({
      route: `ito/list`,
      query: { page: pageParam, active: isActive, asset },
    });
    if (!itosResponse.error || itosResponse.error === '') {
      return itosResponse;
    }
  } catch (error) {
    console.error(error);
  }
  return;
};

export const requestAssetsList = async (
  data: IITOsResponse,
): Promise<any | void> => {
  if (data.data.itos.length !== 0) {
    try {
      const assetsInput: string = data.data.itos
        .map((ITO: IITO) => ITO.assetId)
        .join(',');

      const res = await api.get({
        route: `assets/list?asset=${assetsInput}`,
      });
      if (!res.error || res.error === '') {
        return res.data.assets;
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

export const parseITOsRequest = async (
  itemsITOs: IITOsResponse,
  assetsList: any[],
): Promise<void> => {
  if (itemsITOs && assetsList) {
    const packsPrecisionCalls: Promise<IITO>[] = [];
    itemsITOs.data.itos.forEach((ITO: IITO, index: number) => {
      const asset = assetsList.find(
        (asset: IAsset) => asset.assetId === itemsITOs.data.itos[index].assetId,
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
};
