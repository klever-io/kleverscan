import { PropsWithChildren } from 'react';
import AssetTrigger from './AssetTrigger';
import Buy from './Buy';
import CancelMarketOrder from './CancelMarketOrder';
import Claim from './Claim';
import ConfigITO from './ConfigITO';
import ConfigMarketplace from './ConfigMarketplace';
import ConfigValidator from './ConfigValidator';
import { CreateAsset } from './CreateAsset';
import CreateMarketplace from './CreateMarketplace';
import CreateValidator from './CreateValidator';
import Delegate from './Delegate';
import Deposit from './Deposit';
import Freeze from './Freeze';
import ITOTrigger from './ITOTrigger';
import Proposal from './Proposal';
import Sell from './Sell';
import SetAccountName from './SetAccountName';
import SmartContract from './SmartContract';
import Transfer from './Transfer';
import Undelegate from './Undelegate';
import Unfreeze from './Unfreeze';
import Unjail from './Unjail';
import UpdateAccountPermission from './UpdateAccountPermission';
import Vote from './Vote';
import Withdraw from './Withdraw';

export interface IContractProps {
  formKey: number;
  handleFormSubmit: (data: any) => Promise<void>;
}

export type SelectOption = {
  label: string;
  value: number;
};

interface IRenderContractProps {
  contractName: string;
  contractProps: IContractProps;
}

export const RenderContract: React.FC<
  PropsWithChildren<IRenderContractProps>
> = ({ contractName, contractProps }) => {
  const getContractComponent = () => {
    switch (contractName) {
      case 'TransferContract':
        return <Transfer {...contractProps} />;
      case 'FreezeContract':
        return <Freeze {...contractProps} />;
      case 'UnfreezeContract':
        return <Unfreeze {...contractProps} />;
      case 'DelegateContract':
        return <Delegate {...contractProps} />;
      case 'UndelegateContract':
        return <Undelegate {...contractProps} />;
      case 'ClaimContract':
        return <Claim {...contractProps} />;
      case 'WithdrawContract':
        return <Withdraw {...contractProps} />;
      case 'CreateAssetContract':
        return <CreateAsset {...contractProps} />;
      case 'AssetTriggerContract':
        return <AssetTrigger {...contractProps} />;
      case 'DepositContract':
        return <Deposit {...contractProps} />;
      case 'ConfigITOContract':
        return <ConfigITO {...contractProps} />;
      case 'ITOTriggerContract':
        return <ITOTrigger {...contractProps} />;
      case 'CreateMarketplaceContract':
        return <CreateMarketplace {...contractProps} />;
      case 'ConfigMarketplaceContract':
        return <ConfigMarketplace {...contractProps} />;
      case 'SellContract':
        return <Sell {...contractProps} />;
      case 'BuyContract':
        return <Buy {...contractProps} />;
      case 'CancelMarketOrderContract':
        return <CancelMarketOrder {...contractProps} />;
      case 'ProposalContract':
        return <Proposal {...contractProps} />;
      case 'VoteContract':
        return <Vote {...contractProps} />;
      case 'CreateValidatorContract':
        return <CreateValidator {...contractProps} />;
      case 'ValidatorConfigContract':
        return <ConfigValidator {...contractProps} />;
      case 'UnjailContract':
        return <Unjail {...contractProps} />;
      case 'SetAccountNameContract':
        return <SetAccountName {...contractProps} />;
      case 'UpdateAccountPermissionContract':
        return <UpdateAccountPermission {...contractProps} />;
      case 'SmartContract':
        return <SmartContract {...contractProps} />;
      default:
        return <></>;
    }
  };

  return getContractComponent();
};
