import { ISection } from 'components/Form';

import createAsset from "./createAsset";
import transferContract from "./transfer";
import {freezeContract} from "./freeze";
import {delegateContract} from './delegate';
import proposalContract from './proposal';
import voteContract from './vote';
import buyContract from './buy';
import sellContract from './sell';
import createMarketplaceContract from './createMarketplace';
import configMarketplaceContract from './configMarketplace';
import claimContract from './claim';
import validatorConfigContract from './validatorConfig';
import createValidatorContract from './createValidator';
import configITOContract from './configITO';
import assetTriggerContract from './assetTrigger';

const cancelMarketOrderContract = (): ISection[] => {
  const section = [] as ISection[];

  section.push({
    fields: [
      { label: 'Order Id', props: { required: true, tooltip: 'ID generated on "Sell"' } },
    ],
  });

  return section;
};

const setAccountNameContract = (): ISection[] => {
  const section = [] as ISection[];

  section.push({
    fields: [
      { label: 'Name', props: { required: true, tooltip: 'Set sender name of account' } },
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

const formSection = (contract: string, type?: string, address = ''): ISection[] => {
  const contractsSections = {
    'CreateAssetContract': type ? createAsset(type, address) : createAsset('NFT', address),
    'TransferContract': transferContract(),
    'UnfreezeContract': unfreezeContract(),
    'FreezeContract': freezeContract(),
    'DelegateContract': delegateContract(),
    'UndelegateContract': undelegateContract(),
    'WithdrawContract': withdrawContract(),
    'ProposalContract': proposalContract(),
    'VoteContract': voteContract(),
    'BuyContract': buyContract(),
    'SellContract': sellContract(),
    'CancelMarketOrderContract': cancelMarketOrderContract(),
    'CreateMarketplaceContract': createMarketplaceContract(),
    'ConfigMarketplaceContract': configMarketplaceContract(),
    'ClaimContract': claimContract(),
    'UnjailContract': unjailContract(),
    'SetAccountNameContract': setAccountNameContract(),
    'ValidatorConfigContract': validatorConfigContract(),
    'CreateValidatorContract': createValidatorContract(address),
    'SetITOPricesContract': setITOContract(),
    'ConfigITOContract': configITOContract(),
    'AssetTriggerContract': assetTriggerContract(),
    'UpdateAccountPermissionContract': updatePermissionContract(),
  };

  return contractsSections[contract] ? contractsSections[contract] : [];
}

export default formSection;