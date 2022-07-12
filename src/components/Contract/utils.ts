import { TransactionType } from '@klever/sdk';

const getNonce = async (address: string): Promise<number> => {
  const request = await fetch(
    `${
      process.env.DEFAULT_NODE_HOST || 'https://node.mainnet.klever.finance'
    }/address/${address}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  const response = await request.json();

  return response.data.account.Nonce;
};

const getType = (rawType: string): TransactionType => {
  let type = rawType.substring(0, rawType.length - 8);

  switch (type) {
    case 'Vote':
      type = 'Votes';
      break;
    case 'ValidatorConfig':
      type = 'ConfigValidator';
      break;
    case 'Buy':
      type = 'BuyOrder';
      break;
    case 'Sell':
      type = 'SellOrder';
      break;
  }

  return TransactionType[type];
};

const getPrecision = async (asset: string): Promise<number> => {
  const request = await fetch(
    `${
      process.env.DEFAULT_API_HOST || 'https://api.mainnet.klever.finance'
    }/assets/${asset}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  const response = await request.json();

  return 10 ** response.data.asset.precision;
};

const precisionParse = async (
  payload: any,
  contractType: string,
): Promise<any> => {
  let precision: number;
  let assetId: string;
  const KLVPecision = 10 ** 6; // Also used for KFI
  const percentagePrecision = 10 ** 6;

  switch (contractType) {
    case 'TransferContract':
    case 'FreezeContract':
    case 'AssetTriggerContract':
      if (payload.amount) {
        const assetId = payload.assetId ? payload.assetId : payload.assetID;
        precision = await getPrecision(assetId);
        payload.amount = payload.amount * precision;
      }
      break;
    case 'VoteContract':
      payload.amount = payload.amount * KLVPecision;
      break;
    case 'CreateAssetContract':
      precision = 10 ** payload.precision;
      payload.initialSupply &&= payload.initialSupply * precision;
      payload.maxSupply &&= payload.maxSupply * precision;
      payload.royalties.transferFixed &&=
        payload.royalties.transferFixed * KLVPecision;
      payload.royalties.marketFixed &&=
        payload.royalties.marketFixed * KLVPecision;
      payload.royalties.marketPercentage &&=
        payload.royalties.marketPercentage * percentagePrecision;
      if (payload.royalties.transferPercentage) {
        payload.royalties.transferPercentage.forEach((item: any) => {
          item.percentagePrecision &&=
            item.percentagePrecision * percentagePrecision;
          item.amount &&= item.amount * KLVPecision;
        });
      }
      break;
    case 'CreateValidator':
    case 'ConfigValidator':
      payload.config.comission = payload.config.comission * percentagePrecision;
      payload.config.maxDelegationAmount =
        payload.config.maxDelegationAmount * KLVPecision;
      break;
    case 'ConfigITOContract':
    case 'SetITOPricesContract':
      if (payload.maxAmount) {
        const assetId = payload.assetId ? payload.assetId : payload.assetID;
        precision = await getPrecision(assetId);
        payload.maxAmount = payload.maxAmount * precision;
      }
      if (payload.packInfo) {
        Object.entries(payload.packInfo).forEach(
          async ([key, packs]: [string, any]) => {
            const packPrecision = await getPrecision(key);

            packs.forEach((pack: any) => {
              pack.amount = pack.amount * packPrecision;
            });
          },
        );
      }
      break;
    case 'BuyContract':
      assetId = payload.currencyId;
      precision = await getPrecision(assetId);
      payload.amount = payload.amount * precision;
      break;
    case 'SellContract':
      assetId = payload.currencyId;
      precision = await getPrecision(assetId);
      payload.price &&= payload.price * precision;
      break;
    case 'CreateMarketplaceContract':
    case 'ConfigMarketplaceContract':
      payload.referralPercentage &&=
        payload.referralPercentage * percentagePrecision;
  }

  return payload;
};

export { getNonce, getType, precisionParse };
