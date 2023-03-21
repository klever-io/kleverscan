import { ISection } from '@/components/Form';
import { ICollectionList, IParamList } from '@/types/index';
import assetTriggerContract from './assetTrigger';
import buyContract from './buy';
import claimContract from './claim';
import configITOContract from './configITO';
import configMarketplaceContract from './configMarketplace';
import createAsset from './createAsset';
import createMarketplaceContract from './createMarketplace';
import createValidatorContract from './createValidator';
import { delegateContract } from './delegate';
import depositContract from './deposit';
import { freezeContract } from './freeze';
import ITOTriggerContract from './ITOTrigger';
import proposalContract from './proposal';
import sellContract from './sell';
import transferContract from './transfer';
import validatorConfigContract from './validatorConfig';
import voteContract from './vote';
import withdrawContract from './withdraw';

const cancelMarketOrderContract = (): ISection[] => {
  const section = [] as ISection[];

  section.push({
    fields: [
      {
        label: 'Order Id',
        props: { required: true, tooltip: 'ID generated on "Sell"' },
      },
    ],
  });

  return section;
};

const setAccountNameContract = (): ISection[] => {
  const section = [] as ISection[];

  section.push({
    fields: [
      {
        label: 'Name',
        props: { required: true },
      },
    ],
  });

  return section;
};

const updatePermissionContract = (): ISection[] => [];

const unjailContract = (): ISection[] => [];

const unfreezeContract = (): ISection[] => [];

const undelegateContract = (): ISection[] => [];

const setITOContract = (): ISection[] => [];

interface IFormSectionArgs {
  contract: string;
  type?: string;
  address: string;
  paramsList?: IParamList[];
  assetTriggerType?: number | null;
  claimLabel?: string;
  buyType?: boolean;
  withdrawType?: number | null;
  collection?: ICollectionList;
  itoTriggerType?: number | null;
  inputValue?: string;
}

const formSection = ({
  contract,
  type,
  address,
  paramsList,
  assetTriggerType,
  claimLabel,
  buyType,
  withdrawType,
  collection,
  itoTriggerType,
  inputValue,
}: IFormSectionArgs): ISection[] => {
  const contractsSections = {
    CreateAssetContract: type
      ? () => createAsset(type, address)
      : () => createAsset('NFT', address),
    TransferContract: () => transferContract(collection?.isNFT),
    UnfreezeContract: () => unfreezeContract(),
    FreezeContract: () => freezeContract(),
    DelegateContract: () => delegateContract(),
    UndelegateContract: () => undelegateContract(),
    WithdrawContract: () => withdrawContract(withdrawType),
    ProposalContract: () => proposalContract(paramsList),
    VoteContract: () => voteContract(),
    BuyContract: () => buyContract(buyType),
    SellContract: () => sellContract(),
    CancelMarketOrderContract: () => cancelMarketOrderContract(),
    ClaimContract: () => claimContract(claimLabel || '', inputValue),
    CreateMarketplaceContract: () => createMarketplaceContract(address),
    ConfigMarketplaceContract: () => configMarketplaceContract(address),
    UnjailContract: () => unjailContract(),
    SetAccountNameContract: () => setAccountNameContract(),
    ValidatorConfigContract: () => validatorConfigContract(),
    CreateValidatorContract: () => createValidatorContract(address),
    SetITOPricesContract: () => setITOContract(),
    ConfigITOContract: () => configITOContract(address),
    AssetTriggerContract: () =>
      assetTriggerContract(assetTriggerType, collection, address),
    UpdateAccountPermissionContract: () => updatePermissionContract(),
    DepositContract: () => depositContract(),
    ITOTriggerContract: () => ITOTriggerContract(itoTriggerType, address),
  };

  return contractsSections[contract] ? contractsSections[contract]() : [];
};

export default formSection;
