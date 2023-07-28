import { getSomeAssetsPool } from '@/services/requests/pool/pool';
import { ICollectionList } from '@/types';

export const filterPoolAssets = async (
  assetsList: ICollectionList[],
): Promise<ICollectionList[]> => {
  const assets = assetsList.map(asset => asset.assetId).join(',');
  const result = await getSomeAssetsPool(assets);
  const assetsPoolArray = result?.data?.pools;
  if (assetsPoolArray?.length) {
    return assetsList.filter(asset =>
      assetsPoolArray.some(
        assetPool => asset.assetId === assetPool.kda || asset.assetId === 'KLV',
      ),
    );
  }
  return [];
};
