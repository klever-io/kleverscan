import { ICollectionList } from '@/types/index';
import { getPrecision } from '@/utils/index';
import { TransactionType } from '@klever/sdk';

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

const precisionParse = async (
  payload: { [key: string]: any },
  contractType: string,
): Promise<any> => {
  let precision: number | undefined;
  let assetId: string;
  const KLVPecision = 10 ** 6; // Also used for KFI
  const percentagePrecision = 10 ** 2;

  switch (contractType) {
    case 'TransferContract':
    case 'FreezeContract':
    case 'AssetTriggerContract':
      if (payload.amount) {
        const assetId = payload.assetId ? payload.assetId : payload.kda;
        precision = await getPrecision(assetId);
        if (precision) {
          payload.amount = payload.amount * precision;
        } else return;
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
        if (precision) {
          payload.maxAmount = payload.maxAmount * precision;
        } else return;
      }
      if (payload.packInfo) {
        Object.entries(payload.packInfo).forEach(
          async ([key, packs]: [string, any]) => {
            const packPrecision = await getPrecision(key);

            if (packPrecision) {
              packs.forEach((pack: any) => {
                pack.amount = pack.amount * packPrecision;
              });
            } else return;
          },
        );
      }
      break;
    case 'BuyContract':
      assetId = payload.currencyId;
      precision = await getPrecision(assetId);
      if (precision) {
        payload.amount = payload.amount * precision;
      } else return;
      break;
    case 'SellContract':
      assetId = payload.currencyId;
      precision = await getPrecision(assetId);
      if (precision) {
        payload.price &&= payload.price * precision;
      } else return;
      break;
    case 'CreateMarketplaceContract':
    case 'ConfigMarketplaceContract':
      payload.referralPercentage &&=
        payload.referralPercentage * percentagePrecision;
  }

  return payload;
};

const contractHaveKDA = (
  contract: string,
  assetTriggerType?: number | null,
): boolean => {
  const contracts = [
    'TransferContract',
    'FreezeContract',
    'UnfreezeContract',
    'WithdrawContract',
    'ConfigITOContract',
    'SetITOPricesContract',
  ];

  if (contract === 'AssetTriggerContract' && assetTriggerType !== null) {
    return true;
  }

  return contracts.includes(contract);
};

const contractHaveBucketId = (contract: string): boolean => {
  const contracts = [
    'UnfreezeContract',
    'DelegateContract',
    'UndelegateContract',
  ];

  return contracts.includes(contract);
};

const getAssetsList = (
  assets: any[],
  contractType: string,
  typeAssetTrigger: number | null,
): any[] => {
  if (contractType === 'AssetTriggerContract' && typeAssetTrigger !== null) {
    const bothCollectionNFT = [1, 2];
    const justCollection = [0, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13];
    const justNFT = [8];

    if (bothCollectionNFT.includes(typeAssetTrigger)) {
      return assets;
    } else if (justCollection.includes(typeAssetTrigger)) {
      return assets.filter((value: ICollectionList) => {
        return !value.isNFT;
      });
    } else if (justNFT.includes(typeAssetTrigger)) {
      return assets.filter((value: ICollectionList) => {
        return value.isNFT;
      });
    }
  } else if (contractType === 'FreezeContract') {
    return assets.filter((value: ICollectionList) => {
      return !value.isNFT;
    });
  } else if (contractType === 'UnfreezeContract') {
    return assets.filter((value: ICollectionList) => {
      return !value.isNFT && value.frozenBalance !== 0;
    });
  }

  return assets;
};

const parseValues = (
  values: Record<string, any>,
  contractType: string,
  typeAssetTrigger: number | null,
  claimType: number,
  assetID: number,
  collection: Record<string, any>,
  selectedBucket: string,
  proposalId: number | null,
  tokenChosen: boolean,
): any => {
  const parsedValues = JSON.parse(JSON.stringify(values));

  if (contractHaveKDA(contractType, typeAssetTrigger)) {
    if (contractType === 'AssetTriggerContract') {
      parsedValues.assetId =
        assetID !== 0 ? `${collection.value}/${assetID}` : collection.value;
    } else {
      parsedValues.kda =
        assetID !== 0 ? `${collection.value}/${assetID}` : collection.value;
    }
  } else if (contractType === 'CreateAssetContract') {
    parsedValues.type = tokenChosen ? 0 : 1;
  } else if (contractType === 'AssetTriggerContract') {
    parsedValues.triggerType = typeAssetTrigger;
  } else if (contractType === 'ClaimContract') {
    parsedValues.claimType = claimType;
    if (parsedValues.assetID) {
      parsedValues.id = parsedValues.assetID;
      delete parsedValues.assetID;
    } else if (parsedValues.orderID) {
      parsedValues.id = parsedValues.orderID;
      delete parsedValues.orderID;
    }
  } else if (contractType === 'ProposalContract') {
    if (values.parameters) {
      const parameters = {};

      values.parameters.forEach((parameter: any) => {
        if (
          !isNaN(Number(parameter.parameterKey)) &&
          !isNaN(Number(parameter.parameterValue))
        ) {
          parameters[parameter.parameterKey] = String(parameter.parameterValue);
        }
      });

      if (Object.keys(parameters).length > 0) {
        parsedValues.parameters = parameters;
      }
    }
  } else if (contractType === 'VoteContract') {
    parsedValues.proposalId = proposalId;
  }

  if (contractHaveBucketId(contractType)) {
    parsedValues.bucketId = selectedBucket;
  }

  if (values.uris) {
    const uris = {};

    values.uris.forEach((uri: any) => {
      if (uri.label && uri.address) {
        uris[uri.label] = uri.address;
      }
    });

    if (Object.keys(uris).length > 0) {
      parsedValues.uris = uris;
    }
  }

  Object.keys(parsedValues).forEach((item: any) => {
    if (parsedValues[item] && parsedValues[item].uris) {
      const uris = {};

      parsedValues[item].uris.forEach((uri: any) => {
        if (uri.label && uri.address) {
          uris[uri.label] = uri.address;
        }
      });

      if (Object.keys(uris).length > 0) {
        parsedValues[item].uris = uris;
      }
    }
  });

  return parsedValues;
};

export {
  getType,
  getAssetsList,
  getPrecision,
  precisionParse,
  parseValues,
  contractHaveKDA,
  contractHaveBucketId,
};
