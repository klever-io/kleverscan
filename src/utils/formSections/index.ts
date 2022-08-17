import { IParamList } from '@/types/index';
import { ISection } from 'components/Form';
import assetTriggerContract from './assetTrigger';
import buyContract from './buy';
import claimContract from './claim';
import configITOContract from './configITO';
import configMarketplaceContract from './configMarketplace';
import createAsset from './createAsset';
import createMarketplaceContract from './createMarketplace';
import createValidatorContract from './createValidator';
import { delegateContract } from './delegate';
import { freezeContract } from './freeze';
import proposalContract from './proposal';
import sellContract from './sell';
import transferContract from './transfer';
import validatorConfigContract from './validatorConfig';
import voteContract from './vote';

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
        props: { required: true, tooltip: 'Set sender name of account' },
      },
    ],
  });

  return section;
};

const updatePermissionContract = (): ISection[] => [];

const unjailContract = (): ISection[] => [];

const withdrawContract = (): ISection[] => [];

const unfreezeContract = (): ISection[] => [];

const undelegateContract = (): ISection[] => [];

const setITOContract = (): ISection[] => [];

const formSection = (
  contract: string,
  type?: string,
  address = '',
  paramsList?: IParamList[],
  assetTriggerType?: number | null,
  claimLabel?: string,
): ISection[] => {
  const contractsSections = {
    CreateAssetContract: type
      ? createAsset(type, address)
      : createAsset('NFT', address),
    TransferContract: transferContract(),
    UnfreezeContract: unfreezeContract(),
    FreezeContract: freezeContract(),
    DelegateContract: delegateContract(),
    UndelegateContract: undelegateContract(),
    WithdrawContract: withdrawContract(),
    ProposalContract: proposalContract(paramsList),
    VoteContract: voteContract(),
    BuyContract: buyContract(),
    SellContract: sellContract(),
    CancelMarketOrderContract: cancelMarketOrderContract(),
    CreateMarketplaceContract: createMarketplaceContract(),
    ConfigMarketplaceContract: configMarketplaceContract(),
    ClaimContract: claimContract(claimLabel || ''),
    UnjailContract: unjailContract(),
    SetAccountNameContract: setAccountNameContract(),
    ValidatorConfigContract: validatorConfigContract(),
    CreateValidatorContract: createValidatorContract(address),
    SetITOPricesContract: setITOContract(),
    ConfigITOContract: configITOContract(),
    AssetTriggerContract: assetTriggerContract(assetTriggerType),
    UpdateAccountPermissionContract: updatePermissionContract(),
  };

  return contractsSections[contract] ? contractsSections[contract] : [];
};

export default formSection;
