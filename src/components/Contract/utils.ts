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

  if (type === 'Depoist') {
    // TODO:Remove upon SDK UPDATE
    return 23;
  }
  if (type === 'ITOTrigger') {
    return 24;
  }
  return TransactionType[type];
};

const parsePackInfoPrecision = (payload: any) => {
  if (payload.packInfo) {
    Object.entries(payload.packInfo).forEach(
      async ([key, { packs }]: [string, any]) => {
        const packPrecision = (await getPrecision(key)) as number;

        if (packPrecision !== undefined) {
          packs.forEach((pack: any) => {
            pack.price = pack.price * 10 ** packPrecision;
          });
        } else return;
      },
    );
  }
};

const precisionParse = async (
  payload: { [key: string]: any },
  contractType: string,
): Promise<any> => {
  let precision: number | undefined;
  let assetId = 'KLV';
  const KLVPecision = 10 ** 6; // Also used for KFI
  const percentagePrecision = 10 ** 2;

  const addPrecision = (payload: number, precision: number) => {
    if (typeof payload === 'number') {
      return payload * precision;
    }
    return payload;
  };

  switch (contractType) {
    case 'TransferContract':
    case 'FreezeContract':
    case 'AssetTriggerContract':
      if (payload.amount) {
        const assetId = payload.assetId ? payload.assetId : payload.kda;
        precision = (await getPrecision(assetId)) as number;
        if (precision !== undefined) {
          payload.amount = payload.amount * 10 ** precision;
        } else return;
      }
      break;
    case 'VoteContract':
      payload.amount = payload.amount * KLVPecision;
      break;
    case 'CreateAssetContract':
      precision = 10 ** payload.precision;

      payload.initialSupply = addPrecision(payload.initialSupply, precision);

      payload.maxSupply = addPrecision(payload.maxSupply, precision);

      payload.royalties.transferFixed = addPrecision(
        payload.royalties.transferFixed,
        KLVPecision,
      );

      payload.royalties.marketFixed = addPrecision(
        payload.royalties.marketFixed,
        KLVPecision,
      );

      payload.royalties.marketPercentage = addPrecision(
        payload.royalties.marketPercentage,
        percentagePrecision,
      );

      if (payload.royalties.transferPercentage) {
        payload.royalties.transferPercentage.forEach((item: any) => {
          item.percentagePrecision = addPrecision(
            item.percentagePrecision,
            percentagePrecision,
          );

          addPrecision(item.amount, KLVPecision);
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
      if (payload.maxAmount) {
        const assetId = payload.kda ? payload.kda : payload.assetId;
        precision = (await getPrecision(assetId)) as number;
        if (precision !== undefined) {
          payload.maxAmount = payload.maxAmount * 10 ** precision;
        } else return;
      }
    case 'ITOTriggerContract':
      parsePackInfoPrecision(payload);

      break;
    case 'BuyContract':
      assetId = payload.currencyId;
      precision = (await getPrecision(assetId)) as number;
      if (precision !== undefined) {
        payload.amount = payload.amount * 10 ** precision;
      } else return;
      break;
    case 'SellContract':
      assetId = payload.assetID;
      precision = (await getPrecision(assetId)) as number;
      if (precision !== undefined) {
        payload.price = addPrecision(payload.price, 10 ** precision);
      } else return;
      break;
    case 'CreateMarketplaceContract':
    case 'ConfigMarketplaceContract':
      payload.referralPercentage = addPrecision(
        payload.referralPercentage,
        percentagePrecision,
      );
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
    'SellContract',
    'ITOTriggerContract',
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

const filterByProperties = (
  assets: ICollectionList[],
  typeAssetTrigger: number,
) => {
  switch (typeAssetTrigger) {
    case 0:
      return assets.filter(item => {
        return item.properties?.canMint;
      });

    case 1:
      return assets.filter(item => {
        return item.properties?.canBurn;
      });

    case 2:
      return assets.filter(item => {
        return item.properties?.canWipe;
      });

    case 3:
      return assets.filter(item => {
        return item.properties?.canPause && !item.attributes?.isPaused;
      });

    case 4:
      return assets.filter(item => {
        return item.attributes?.isPaused;
      });

    case 5:
      return assets.filter(item => {
        return item.properties?.canChangeOwner;
      });

    case 6:
      return assets.filter(item => {
        return item.properties?.canAddRoles;
      });

    default:
      return assets;
  }
};

const showAssetIDInput = (
  contractType: string,
  typeAssetTrigger: number | null,
): boolean => {
  if (
    contractType === 'AssetTriggerContract' &&
    typeAssetTrigger !== null &&
    !isNaN(typeAssetTrigger)
  ) {
    const singleNFTContracts = [1, 8];
    return singleNFTContracts.includes(typeAssetTrigger);
  }

  return true;
};

const getAssetsList = (
  assets: ICollectionList[],
  contractType: string,
  typeAssetTrigger: number | null,
  ownerAddress: string,
): any[] => {
  if (contractType === 'AssetTriggerContract' && typeAssetTrigger !== null) {
    const bothCollectionNFT = [0, 1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13];
    const justNFT = [8];

    if (bothCollectionNFT.includes(typeAssetTrigger)) {
      return filterByProperties(assets, typeAssetTrigger);
    } else if (justNFT.includes(typeAssetTrigger)) {
      const newAssets = assets.filter((value: ICollectionList) => {
        return value.isNFT;
      });
      return filterByProperties(newAssets, typeAssetTrigger);
    }
  } else if (contractType === 'FreezeContract') {
    return assets.filter((value: ICollectionList) => {
      return !value.isNFT;
    });
  } else if (contractType === 'UnfreezeContract') {
    return assets.filter((value: ICollectionList) => {
      return !value.isNFT && value.frozenBalance !== 0;
    });
  } else if (contractType === 'WithdrawContract') {
    return assets.filter((value: ICollectionList) => {
      let thereIsUnfreezedBucket = false;
      let passedMinEpochs = false;

      value.buckets?.forEach((bucket: any) => {
        if (bucket.unstakedEpoch !== 4294967295) {
          thereIsUnfreezedBucket = true;
        }

        if (
          value.minEpochsToWithdraw !== undefined &&
          bucket.stakedEpoch !== value.minEpochsToWithdraw
        ) {
          passedMinEpochs = true;
        }
      });

      return thereIsUnfreezedBucket && passedMinEpochs ? value : null;
    });
  } else if (contractType === 'ConfigITOContract') {
    return assets.filter(asset => asset.ownerAddress === ownerAddress);
  }
  return assets;
};

const parsePackInfo = (values: any) => {
  const packs = values.pack;

  delete values.pack;

  const packInfo: {
    [key: string]: any;
  } = {};
  packs.forEach((item: any) => {
    const itemContent = {
      packs: item.packItem,
    };
    if (item.packCurrencyID) {
      packInfo[item.packCurrencyID] = itemContent;
    } else {
      packInfo['KLV'] = itemContent;
    }
  });

  values.packInfo = packInfo;
};

const parseValues = (
  values: Record<string, any>,
  contractType: string,
  typeAssetTrigger: number | null,
  claimType: number,
  assetID: number,
  collection: ICollectionList | undefined,
  selectedBucket: string,
  proposalId: number | null,
  tokenChosen: boolean,
  ITOBuy: boolean,
  binaryOperations: string[],
  depositType: string | null,
  withdrawType: number | null,
  itoTriggerType: number | null,
  isNFT: boolean | undefined,
): any => {
  const parsedValues = JSON.parse(JSON.stringify(values));

  if (contractType === 'TransferContract') {
    parsedValues.receiver = parsedValues.receiverAddress;
    if (isNFT) {
      parsedValues.amount = 1;
    }
    delete parsedValues.receiverAddress;
  } else if (contractType === 'CreateAssetContract') {
    const oldProperties = { ...parsedValues.properties };
    const newProperties: any = {};
    delete parsedValues.properties;

    newProperties.canFreeze = oldProperties.freeze;
    newProperties.canPause = oldProperties.pause;
    newProperties.canBurn = oldProperties.burn;
    newProperties.canAddRoles = oldProperties.addRoles;
    newProperties.canWipe = oldProperties.wipe;
    newProperties.canMint = oldProperties.mint;
    newProperties.canChangeOwner = oldProperties.changeOwner;

    parsedValues.properties = newProperties;
  }

  if (contractHaveKDA(contractType, typeAssetTrigger) && collection) {
    if (contractType === 'AssetTriggerContract') {
      parsedValues.triggerType = typeAssetTrigger;
      parsedValues.assetId =
        assetID !== 0 ? `${collection.value}/${assetID}` : collection.value;
    } else if (contractType === 'SellContract') {
      parsedValues.assetID =
        assetID !== 0 ? `${collection.value}/${assetID}` : collection.value;
    } else if (contractType === 'ITOTriggerContract') {
      parsedValues.triggerType = itoTriggerType;
      parsedValues.kda = collection.value;
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
  } else if (contractType === 'BuyContract') {
    parsedValues.buyType = ITOBuy ? 0 : 1;
    if (parsedValues.orderID) {
      parsedValues.id = parsedValues.orderID;
      delete parsedValues.orderID;
    } else if (parsedValues.iTOAssetID) {
      parsedValues.id = parsedValues.iTOAssetID;
      delete parsedValues.iTOAssetID;
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
  } else if (contractType === 'UpdateAccountPermissionContract') {
    if (parsedValues.permissions?.length > 0) {
      parsedValues.permissions.forEach((item: any, index: number) => {
        const hex = Number(`0b${binaryOperations[index]}`).toString(16);
        let newHex = hex;
        if (newHex.length % 2 !== 0) {
          newHex = '0' + newHex;
        }
        parsedValues.permissions[index].operations = newHex;
      });
    }
  } else if (contractType === 'DepositContract') {
    parsedValues.depositType = depositType;
  } else if (contractType === 'WithdrawContract') {
    parsedValues.withdrawType = withdrawType;
  }

  if (
    contractType === 'ConfigITOContract' ||
    (contractType === 'ITOTriggerContract' && itoTriggerType === 0)
  ) {
    parsePackInfo(parsedValues);
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

const contractsDescription = {
  TransferContract: 'Transfer assets to another wallet.',
  CreateAssetContract:
    'Create a new Coin(Fungible Token) or an NFT Collection.',
  CreateValidatorContract: 'Generate a new validator.',
  ValidatorConfigContract: 'Edit the current settings for a validator.',
  FreezeContract: 'Freeze a chosen amount of an asset or collection.',
  UnfreezeContract: 'Unfreeze a bucket of an asset or collection.',
  DelegateContract: 'Delegate a bucket to a validator.',
  UndelegateContract: 'Undelegate a bucket.',
  WithdrawContract: 'Total withdraw of the chosen asset.',
  ClaimContract: 'Claim rewards or expired market orders.',
  UnjailContract:
    'Unjails your validator, be sure to use only if the cause of the jail is already fixed.',
  AssetTriggerContract:
    'A contract setting operations over a collection of assets or an NFT.',
  SetAccountNameContract: 'Set a new name for the current account.',
  ProposalContract: 'Create a proposal to change the blockchain parameters.',
  VoteContract: 'Vote in a proposal.',
  ConfigITOContract: 'Set up an Initial Token Offering.',
  SetITOPricesContract: 'Set the prices for the Initial Token Offering.',
  BuyContract: 'Buy tokens.',
  SellContract: 'Sell tokens.',
  CreateMarketplaceContract: 'Create a new Marketplace.',
  ConfigMarketplaceContract: 'Set up a Marketplace.',
  DepositContract: 'Deposit to a KDA Pool or FPR Pool.',
  ITOTriggerContract: 'Change the parameters of an ITO.',
};

export {
  getType,
  getAssetsList,
  showAssetIDInput,
  precisionParse,
  parseValues,
  contractHaveKDA,
  contractHaveBucketId,
  contractsDescription,
};
