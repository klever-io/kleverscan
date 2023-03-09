import { ICollectionList } from '@/types/index';
import { KLV_PRECISION } from '@/utils/globalVariables';
import { getPrecision } from '@/utils/precisionFunctions';
import {
  IAssetTrigger,
  IBuyOrder,
  ICancelMarketOrder,
  IClaim,
  IConfigITO,
  IConfigMarketplace,
  IConfigValidator,
  IContractRequest,
  ICreateAsset,
  ICreateMarketplace,
  ICreateValidator,
  IDelegate,
  IDeposit,
  IFreeze,
  IITOTrigger,
  IProposal,
  ISellOrder,
  ISetAccountName,
  ISetITOPrices,
  ITransaction,
  ITransfer,
  ITxOptionsRequest,
  IUndelegate,
  IUnfreeze,
  IUnjail,
  IUpdateAccountPermission,
  IVotes,
  IWithdraw,
  TransactionType,
} from '@klever/sdk';

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

const parseWhitelistInfoPrecision = async (payload: any) => {
  if (payload.whitelistInfo) {
    const assetPrecision = (await getPrecision(payload.kda)) as number;

    Object.values(payload.whitelistInfo).forEach(
      async (whitelistInfoRequest: any) => {
        if (assetPrecision !== undefined) {
          whitelistInfoRequest.limit =
            whitelistInfoRequest.limit * 10 ** assetPrecision;
        } else return;
      },
    );
  }
};

const parseSplitRoyaltiesPrecision = async (payload: any) => {
  if (payload.royalties?.splitRoyalties === undefined) {
    return;
  }

  Object.values(payload.royalties.splitRoyalties).forEach(
    async (splitRoyaltiesInfo: any) => {
      Object.keys(splitRoyaltiesInfo).forEach(key => {
        splitRoyaltiesInfo[key] = splitRoyaltiesInfo[key] * 100; //precision 2
      });
    },
  );
};

const precisionParse = async (
  payload: { [key: string]: any },
  contractType: string,
): Promise<any> => {
  let precision: number;
  let assetId = 'KLV';
  const percentagePrecision = 2;

  const addPrecision = (value: number, precision: number) => {
    return value * 10 ** precision;
  };
  const addFieldPrecision = async (
    fieldName: string,
    precisionField: string,
  ) => {
    const field = payload[fieldName];
    if (!field) return;

    if (typeof field !== 'number') {
      return;
    }
    const precision = await getPrecision(precisionField);

    payload[fieldName] = addPrecision(field, precision);
  };

  const addRoyalitiesPrecision = () => {
    if (payload?.royalties?.transferFixed === undefined) {
      return;
    }

    payload.royalties.transferFixed = addPrecision(
      payload.royalties.transferFixed,
      KLV_PRECISION,
    );

    payload.royalties.marketFixed = addPrecision(
      payload.royalties.marketFixed,
      KLV_PRECISION,
    );

    payload.royalties.itoPercentage = addPrecision(
      payload.royalties.itoPercentage,
      percentagePrecision,
    );

    payload.royalties.marketPercentage = addPrecision(
      payload.royalties.marketPercentage,
      percentagePrecision,
    );

    payload.royalties.itoFixed = addPrecision(
      payload.royalties.itoFixed,
      KLV_PRECISION,
    );

    if (payload.royalties.transferPercentage) {
      payload.royalties.transferPercentage.forEach((item: any) => {
        item.percentage = addPrecision(item.percentage, percentagePrecision);

        addPrecision(item.amount, KLV_PRECISION);
      });
    }
  };

  switch (contractType) {
    case 'TransferContract':
    case 'FreezeContract':
    case 'AssetTriggerContract':
      assetId = payload.assetId ? payload.assetId : payload.kda;
      await addFieldPrecision('amount', assetId);
      if (payload?.staking?.apr)
        payload.staking.apr = addPrecision(
          payload.staking.apr,
          percentagePrecision,
        );
      parseSplitRoyaltiesPrecision(payload);
      addRoyalitiesPrecision();
      if (payload?.kdaPool?.fRatioKDA) {
        payload.kdaPool.fRatioKDA = addPrecision(
          payload.kdaPool.fRatioKDA,
          await getPrecision(assetId),
        );
      }
      if (payload?.kdaPool?.fRatioKLV) {
        payload.kdaPool.fRatioKLV = addPrecision(
          payload.kdaPool.fRatioKLV,
          KLV_PRECISION,
        );
      }
      break;
    case 'VoteContract':
      payload.amount = payload.amount * KLV_PRECISION;
      break;
    case 'CreateAssetContract':
      precision = payload.precision || 0;

      payload.initialSupply = addPrecision(payload.initialSupply, precision);

      payload.maxSupply = addPrecision(payload.maxSupply, precision);

      if (payload?.staking?.apr)
        payload.staking.apr = addPrecision(
          payload.staking.apr,
          percentagePrecision,
        );

      addRoyalitiesPrecision();

      parseSplitRoyaltiesPrecision(payload);
      break;
    case 'CreateValidator':
    case 'ConfigValidator':
      payload.config.comission = payload.config.comission * percentagePrecision;
      payload.config.maxDelegationAmount =
        payload.config.maxDelegationAmount * KLV_PRECISION;
      break;
    case 'ConfigITOContract':
      if (payload.maxAmount) {
        const assetId = payload.kda ? payload.kda : payload.assetId;
        precision = (await getPrecision(assetId)) as number;
        if (precision !== undefined) {
          payload.maxAmount = payload.maxAmount * precision;
        } else return;
      }
    case 'ITOTriggerContract':
      parsePackInfoPrecision(payload);
      await parseWhitelistInfoPrecision(payload);

      await addFieldPrecision('maxAmount', payload.kda);
      await addFieldPrecision('defaultLimitPerAddress', payload.kda);
      break;
    case 'BuyContract':
      assetId = payload.currencyId;
      precision = (await getPrecision(assetId)) as number;
      if (precision !== undefined) {
        payload.amount = payload.amount * precision;
      } else return;
      break;
    case 'SellContract':
      assetId = payload.currencyID;
      await addFieldPrecision('price', assetId);
      await addFieldPrecision('reservePrice', assetId);
      break;
    case 'CreateMarketplaceContract':
    case 'ConfigMarketplaceContract':
      payload.referralPercentage = addPrecision(
        payload.referralPercentage,
        percentagePrecision,
      );
      break;
    case 'WithdrawContract':
      assetId = payload?.currencyId;
      await addFieldPrecision('amount', assetId);
      break;
    case 'DepositContract':
      assetId = payload?.currencyID;
      await addFieldPrecision('amount', assetId);
  }

  return payload;
};

const contractHaveKDA = (
  contract: string,
  assetTriggerType?: number | null,
  itoTriggerType?: number | null,
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
    'DepositContract',
  ];

  if (contract === 'AssetTriggerContract' && assetTriggerType !== null) {
    return true;
  }
  if (contract === 'ITOTriggerContract' && itoTriggerType !== null) {
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
  withdrawType: number | null,
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
  } else if (contractType === 'WithdrawContract' && withdrawType === 0) {
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
  if (!values.pack) {
    return;
  }

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

const parseWhitelistInfo = (values: any, defaultValue = 0) => {
  if (!values.whitelistInfo) {
    return;
  }

  const whitelist = values.whitelistInfo;

  delete values.whitelistInfo;

  const whitelistInfo: {
    [key: string]: any;
  } = {};
  whitelist.forEach((item: any) => {
    whitelistInfo[item.address] = { limit: item.limit || defaultValue };
  });

  values.whitelistInfo = whitelistInfo;
};

const parseSplitRoyalties = (values: any) => {
  if (values.royalties?.splitRoyalties === undefined) {
    return;
  }

  const splitRoyaltiesReference = values.royalties.splitRoyalties;

  delete values.royalties.splitRoyalties;

  const splitRoyalties: {
    [key: string]: any;
  } = {};

  splitRoyaltiesReference.forEach((item: any) => {
    const address = item.address;
    delete item.address;
    splitRoyalties[address] = item.royalties.splitRoyalties.splitRoyaltyValues;
  });

  values.royalties.splitRoyalties = splitRoyalties;
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
): any => {
  const parsedValues = JSON.parse(JSON.stringify(values));

  if (contractType === 'TransferContract') {
    parsedValues.receiver = parsedValues.receiverAddress;
    if (collection?.isNFT) {
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

  if (
    contractHaveKDA(contractType, typeAssetTrigger, itoTriggerType) &&
    collection
  ) {
    if (contractType === 'AssetTriggerContract') {
      parsedValues.triggerType = typeAssetTrigger;
      parsedValues.assetId =
        assetID !== 0 ? `${collection.value}/${assetID}` : collection.value;
      if (typeAssetTrigger === 14) {
        parseSplitRoyalties(parsedValues);
      }
      if (typeAssetTrigger === 15) {
        if (parsedValues.kdaPool?.quotient) {
          const quotient = parsedValues.kdaPool.quotient;

          delete parsedValues.kdaPool.quotient;

          parsedValues.kdaPool.fRatioKDA = quotient;
          parsedValues.kdaPool.fRatioKLV = 1;
        }
      }
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
    parseSplitRoyalties(parsedValues);
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
  }

  if (contractType === 'DepositContract') {
    parsedValues.depositType = depositType;
  }

  if (contractType === 'WithdrawContract') {
    parsedValues.withdrawType = withdrawType;
  }

  if (contractType === 'DelegateContract') {
    parsedValues.receiver = parsedValues.validatorAddress;
    delete parsedValues.validatorAddress;
  }

  if (
    contractType === 'ConfigITOContract' ||
    (contractType === 'ITOTriggerContract' && itoTriggerType === 0)
  ) {
    parsePackInfo(parsedValues);
  }

  if (
    (contractType === 'ITOTriggerContract' && itoTriggerType === 7) ||
    contractType === 'ConfigITOContract'
  ) {
    parseWhitelistInfo(parsedValues);
  }
  if (contractType === 'ITOTriggerContract' && itoTriggerType === 8) {
    parseWhitelistInfo(parsedValues, 1);
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

// SDK mock while extension doesn't update

interface IAccountNonce {
  data: {
    firstPendingNonce: number;
    nonce: number;
    txPending: number;
  };
  error: string;
  code: string;
}
type IPayload =
  | ITransfer
  | ICreateAsset
  | ICreateValidator
  | IConfigValidator
  | IFreeze
  | IUnfreeze
  | IDelegate
  | IUndelegate
  | IWithdraw
  | IClaim
  | IUnjail
  | IAssetTrigger
  | ISetAccountName
  | IProposal
  | IVotes
  | IConfigITO
  | ISetITOPrices
  | IBuyOrder
  | ISellOrder
  | ICancelMarketOrder
  | ICreateMarketplace
  | IConfigMarketplace
  | IUpdateAccountPermission
  | IDeposit
  | IITOTrigger;
interface ITxRequest {
  type: TransactionType;
  sender: string;
  nonce: number;
  contracts: IPayload[];
  data?: string[];
  permID?: number;
  kdaFee?: string;
}

const getNonce = async (): Promise<IAccountNonce> => {
  const req = await fetch(
    `${window.kleverWeb.provider.node}/address/${window.kleverWeb.address}/nonce`,
  );

  return (await req.json()) as IAccountNonce;
};

const buildTransaction = async (
  contracts: IContractRequest[],
  txData?: string[],
  options?: ITxOptionsRequest,
): Promise<ITransaction> => {
  if (contracts?.length === 0) {
    throw 'empty contracts';
  }

  const fistContractType = contracts[0]?.type;
  const payloads = contracts.map(contract => {
    if (contract.type != fistContractType) {
      throw 'Multiple contracts of different types are not supported yet';
    }

    return contract.payload;
  });

  const nonce = options?.nonce
    ? options.nonce
    : (await getNonce())?.data?.nonce || 0;

  const permID = options?.permID || 0;

  const kdaFee = options?.kdaFee || '';

  const txBody: ITxRequest = {
    type: fistContractType,
    nonce,
    sender: window.kleverWeb.address,
    data: txData || [],
    permID,
    contracts: payloads,
    kdaFee,
  };

  const req = await fetch(
    `${window.kleverWeb.provider.node}/transaction/send`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(txBody),
    },
  );

  const res = await req.json();
  if (res?.error) throw res?.error;

  if (!res?.data && !res?.data?.result) {
    throw 'failed to generate transaction';
  }

  return res.data.result as ITransaction;
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
  buildTransaction,
};
