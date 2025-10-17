import api from '@/services/api';
import { IAsset, IAssetResponse, ISftAsset } from '@/types';

export const requestNonceDetails = async (
  assetId: string,
  nonce: string,
): Promise<IAsset | undefined> => {
  try {
    const res: IAssetResponse = await api.get({
      route: `assets/${assetId}/${nonce}`,
    });
    if (!res.error || res.error === '') {
      return res.data?.asset;
    }
  } catch (error) {
    console.error(error);
  }
};

export const requestSftDetails = async (
  assetId: string,
  nonce: string,
): Promise<ISftAsset | undefined> => {
  try {
    const res: IAssetResponse = await api.get({
      route: `assets/sft/${assetId}/${nonce}`,
    });
    if (!res.error || res.error === '') {
      return res.data?.asset;
    }
  } catch (error) {
    console.error(error);
  }
};

export const requestNonceHolder = async (
  assetId: string,
  nonce: string,
): Promise<string | undefined> => {
  try {
    const res = await api.get({
      route: `assets/nft/holder/${assetId}/${nonce}`,
    });
    if (!res.error || res.error === '') {
      return res.data?.account?.address;
    }
  } catch (error) {
    console.error(error);
  }
};
