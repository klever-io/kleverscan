import Tooltip from '@/components/Tooltip';
import { coinStyles } from '@/components/Tooltip/configs';
import { useMobile } from '@/contexts/mobile';
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
  IDepositContract,
  IFreezeContract,
  IITOTriggerContract,
  IParameter,
  IProposalContract,
  ISellContract,
  ISetAccountNameContract,
  ISetITOPricesContract,
  ITransferContract,
  IUndelegateContract,
  IUnfreezeContract,
  IUnjailContract,
  IUpdateAccountPermissionContract,
  IValidatorConfigContract,
  IVoteContract,
  IWithdrawContract,
} from '@/types/contracts';
import { IReceipt, IRowSection } from '@/types/index';
import { CenteredRow } from '@/views/transactions';
import Link from 'next/link';
import { formatAmount, passViewportStyles } from '..';
import { findReceipt } from '../findKey';

const precision = 6; // default KLV precision

const TransferSections = (par: IParameter): IRowSection[] => {
  const parameter = par as unknown as ITransferContract;

  const { isMobile, isTablet } = useMobile();

  return [
    {
      element: (
        <CenteredRow key={parameter.assetId}>
          <div>
            {parameter.assetId ? (
              <Tooltip
                msg={parameter.assetId}
                customStyles={passViewportStyles(
                  isMobile,
                  isTablet,
                  ...coinStyles,
                )}
                minMsgLength={9}
                Component={() => (
                  <Link href={`/asset/${parameter.assetId}`}>
                    {parameter.assetId}
                  </Link>
                )}
              ></Tooltip>
            ) : (
              <>
                <Tooltip
                  minMsgLength={9}
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
        <span key={parameter.assetId}>
          <strong>{parameter.assetId.replace(/['"]+/g, '')}</strong>
        </span>
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
  const assetId = parameter?.assetId ?? 'KLV';

  return [
    {
      element: (
        <>
          <span>{assetId}</span>
        </>
      ),
      span: 1,
    },
  ];
};

const ClaimSections = (
  par: IParameter,
  receipts: IReceipt[],
): IRowSection[] => {
  const parameter = par as unknown as IClaimContract;
  const assetId = findReceipt(receipts, 0, 17, 'assetId');
  return [
    {
      element: (
        <span key={parameter.claimType}>
          <small>{parameter.claimType}</small>
        </span>
      ),
      span: 1,
    },
    {
      element: (
        <span>
          <span>{assetId ?? ''}</span>
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
          <small>{parameter.amount / 10 ** precision}</small>
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
        <span key={parameter.currencyID}>
          <small>{parameter.currencyID}</small>
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
        <span key={parameter.marketType}>
          <small>{parameter.marketType}</small>
        </span>
      ),
      span: 1,
    },
    {
      element: (
        <span key={parameter.currencyID}>
          <small>{parameter.currencyID}</small>
        </span>
      ),
      span: 1,
    },
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
      element: <span key={parameter.orderID}>{parameter.orderID}</span>,
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

  return [
    {
      element: (
        <span key={parameter?.marketplaceID}>
          {parameter?.marketplaceID || ''}
        </span>
      ),
      span: 1,
    },
  ];
};

const UpdateAccountPermissionContractSections = (
  par: IParameter,
): IRowSection[] => {
  const parameter = par as unknown as IUpdateAccountPermissionContract;
  return [
    {
      element: (
        <span key={parameter?.permissions[0]?.permissionName}>
          {parameter?.permissions[0]?.permissionName || ''}
        </span>
      ),
      span: 1,
    },
  ];
};

const DepositSections = (par: IParameter): IRowSection[] => {
  const parameter = par as unknown as IDepositContract;
  return [
    { element: <span>{parameter?.depositType || ''}</span>, span: 1 },
    { element: <span>{parameter?.id || ''}</span>, span: 1 },
  ];
};

const IITOTriggerSections = (par: IParameter): IRowSection[] => {
  const parameter = par as unknown as IITOTriggerContract;
  return [
    { element: <span>{parameter?.triggerType || ''}</span>, span: 1 },
    { element: <span>{parameter?.assetID || ''}</span>, span: 1 },
  ];
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
  UpdateAccountPermissionContractSections,
  DepositSections,
  IITOTriggerSections,
};
