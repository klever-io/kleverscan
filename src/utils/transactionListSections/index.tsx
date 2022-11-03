import Tooltip from '@/components/Tooltip';
import {
  IAssetTriggerContract,
  IBuyContractPayload,
  ICancelMarketOrderContract,
  IClaimContract,
  IConfigITOContract,
  IConfigMarketplaceContract,
  ICreateAssetContract,
  ICreateMarketplaceContract,
  ICreateValidatorContract,
  IFreezeContract,
  IParameter,
  IProposalContract,
  IRowSection,
  ISellContract,
  ISetAccountNameContract,
  ISetITOPricesContract,
  ITransferContract,
  IUndelegateContract,
  IUnfreezeContract,
  IUnjailContract,
  IValidatorConfigContract,
  IVoteContract,
  IWithdrawContract,
} from '@/types/index';
import { CenteredRow } from '@/views/transactions';
import Link from 'next/link';
import { formatAmount } from '..';

const precision = 6; // default KLV precision

const TransferSections = (par: IParameter): IRowSection[] => {
  const parameter = par as unknown as ITransferContract;

  return [
    {
      element: (
        <CenteredRow key={parameter.assetId}>
          <div>
            {parameter.assetId ? (
              <Tooltip
                msg={parameter.assetId}
                Component={() => (
                  <Link href={`/asset/${parameter.assetId}`}>
                    {parameter.assetId}
                  </Link>
                )}
              ></Tooltip>
            ) : (
              <>
                <Tooltip
                  msg="KLV"
                  Component={() => <Link href={`/asset/KLV`}>KLV</Link>}
                ></Tooltip>
              </>
            )}
          </div>
        </CenteredRow>
      ),
      span: 1,
    },
    {
      element: (
        <span key={parameter.amount}>
          <strong>{formatAmount(parameter.amount / 10 ** precision)}</strong>
        </span>
      ),
      span: 1,
    },
  ];
};

const CreateAssetSections = (par: IParameter): IRowSection[] => {
  const parameter = par as unknown as ICreateAssetContract;

  return [
    { element: <span key={parameter.name}>{parameter.name}</span>, span: 1 },
    {
      element: (
        <span key={parameter.ticker}>
          <small>{parameter.ticker}</small>
        </span>
      ),
      span: 1,
    },
  ];
};

const CreateValidatorSections = (par: IParameter): IRowSection[] => {
  const parameter = par as unknown as ICreateValidatorContract;

  return [
    {
      element: (
        <span key={parameter.config.rewardAddress}>
          <Link href={`/account/${parameter.config.rewardAddress}`}>
            {parameter.config.rewardAddress}
          </Link>
        </span>
      ),
      span: 1,
    },
    {
      element: (
        <span key={String(parameter.config.canDelegate)}>
          <strong>{parameter.config.canDelegate ? 'True' : 'False'}</strong>
        </span>
      ),
      span: 1,
    },
  ];
};

const ValidatorConfigSections = (par: IParameter): IRowSection[] => {
  const parameter = par as unknown as IValidatorConfigContract;

  return [
    {
      element: (
        <span key={parameter.config.blsPublicKey}>
          <small>{parameter.config.blsPublicKey}</small>
        </span>
      ),
      span: 1,
    },
  ];
};

const FreezeSections = (par: IParameter): IRowSection[] => {
  const parameter = par as unknown as IFreezeContract;

  return [
    {
      element: (
        <span key={parameter.amount}>
          <strong>
            {formatAmount(parameter.amount / 10 ** precision)}{' '}
            {parameter.assetId.replace(/['"]+/g, '')}
          </strong>
        </span>
      ),
      span: 1,
    },
  ];
};

const UnfreezeSections = (par: IParameter): IRowSection[] => {
  const parameter = par as unknown as IUnfreezeContract;

  return [
    {
      element: (
        <span key={parameter.bucketID}>
          <small>{parameter.bucketID}</small>
        </span>
      ),
      span: 1,
    },
  ];
};

const DelegateSections = (par: IParameter): IRowSection[] => {
  const parameter = par as unknown as IUnfreezeContract;

  return [
    {
      element: (
        <span key={parameter.bucketID}>
          <small>{parameter.bucketID}</small>
        </span>
      ),
      span: 1,
    },
  ];
};

const UndelegateSections = (par: IParameter): IRowSection[] => {
  const parameter = par as unknown as IUndelegateContract;

  return [
    {
      element: (
        <span key={parameter.bucketID}>
          <small>{parameter.bucketID}</small>
        </span>
      ),
      span: 1,
    },
  ];
};

const WithdrawSections = (par: IParameter): IRowSection[] => {
  const parameter = par as unknown as IWithdrawContract;
  return [
    {
      element: (
        <>
          <span>{parameter.assetId}</span>
        </>
      ),
      span: 1,
    },
  ];
};

const ClaimSections = (par: IParameter): IRowSection[] => {
  const parameter = par as unknown as IClaimContract;

  return [
    {
      element: (
        <span key={parameter.claimType}>
          <small>{parameter.claimType}</small>
        </span>
      ),
      span: 1,
    },
  ];
};

const UnjailSections = (par: IParameter): IRowSection[] => {
  const parameter = par as IUnjailContract;

  return [{ element: <></>, span: 1 }];
};

const AssetTriggerSections = (par: IParameter): IRowSection[] => {
  const parameter = par as unknown as IAssetTriggerContract;

  return [
    {
      element: (
        <span key={parameter.triggerType}>
          <small>{parameter.triggerType}</small>
        </span>
      ),
      span: 1,
    },
  ];
};

const SetAccountNameSections = (par: IParameter): IRowSection[] => {
  const parameter = par as unknown as ISetAccountNameContract;

  return [
    {
      element: (
        <span key={parameter.name}>
          <small>{parameter.name}</small>
        </span>
      ),
      span: 1,
    },
  ];
};

const ProposalSections = (par: IParameter): IRowSection[] => {
  const parameter = par as unknown as IProposalContract;

  return [
    {
      element: <span key={parameter.description}>{parameter.description}</span>,
      span: 1,
    },
  ];
};

const VoteSections = (par: IParameter): IRowSection[] => {
  const parameter = par as unknown as IVoteContract;

  return [
    {
      element: <span key={parameter.proposalId}>{parameter.proposalId}</span>,
      span: 1,
    },
    {
      element: (
        <span key={parameter.amount}>
          <small>{parameter.amount}</small>
        </span>
      ),
      span: 1,
    },
  ];
};

const ConfigITOSections = (par: IParameter): IRowSection[] => {
  const parameter = par as unknown as IConfigITOContract;

  return [
    {
      element: <span key={parameter.assetId}>{parameter.assetId}</span>,
      span: 1,
    },
  ];
};

const SetITOPricesSections = (par: IParameter): IRowSection[] => {
  const parameter = par as unknown as ISetITOPricesContract;

  return [
    {
      element: <span key={parameter.assetId}>{parameter.assetId}</span>,
      span: 1,
    },
  ];
};

const BuySections = (par: IParameter): IRowSection[] => {
  const parameter = par as unknown as IBuyContractPayload;

  return [
    {
      element: <span key={parameter.buyType}>{parameter.buyType}</span>,
      span: 1,
    },
    {
      element: (
        <span key={parameter.amount}>
          <small>{parameter.amount}</small>
        </span>
      ),
      span: 1,
    },
  ];
};

const SellSections = (par: IParameter): IRowSection[] => {
  const parameter = par as unknown as ISellContract;

  return [
    {
      element: (
        <span key={parameter.assetId}>
          <small>{parameter.assetId}</small>
        </span>
      ),
      span: 1,
    },
  ];
};

const CancelMarketOrderSections = (par: IParameter): IRowSection[] => {
  const parameter = par as unknown as ICancelMarketOrderContract;

  return [
    {
      element: <span key={parameter.orderId}>{parameter.orderId}</span>,
      span: 1,
    },
  ];
};

const CreateMarketplaceSections = (par: IParameter): IRowSection[] => {
  const parameter = par as unknown as ICreateMarketplaceContract;

  return [
    { element: <span key={parameter.name}>{parameter.name}</span>, span: 1 },
  ];
};

const ConfigMarketplaceSections = (par: IParameter): IRowSection[] => {
  const parameter = par as unknown as IConfigMarketplaceContract;

  return [{ element: <></>, span: 1 }];
};

export {
  TransferSections,
  CreateValidatorSections,
  ValidatorConfigSections,
  FreezeSections,
  UnfreezeSections,
  DelegateSections,
  UndelegateSections,
  WithdrawSections,
  ClaimSections,
  UnjailSections,
  AssetTriggerSections,
  SetAccountNameSections,
  ProposalSections,
  VoteSections,
  ConfigITOSections,
  SetITOPricesSections,
  BuySections,
  SellSections,
  CancelMarketOrderSections,
  CreateMarketplaceSections,
  ConfigMarketplaceSections,
  CreateAssetSections,
};
