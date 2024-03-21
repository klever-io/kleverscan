import Tooltip from '@/components/Tooltip';
import { coinStyles } from '@/components/Tooltip/configs';
import { CenteredRow } from '@/styles/common';
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
  ISmartContract,
  ITransferContract,
  IUndelegateContract,
  IUnfreezeContract,
  IUnjailContract,
  IUpdateAccountPermissionContract,
  IValidatorConfigContract,
  IVoteContract,
  IWithdrawContract,
} from '@/types/contracts';
import { IClaimReceipt, IReceipt } from '@/types/index';
import Link from 'next/link';
import { findReceipt } from '../findKey';
import { formatAmount, toLocaleFixed } from '../formatFunctions';
import { KLV_PRECISION } from '../globalVariables';
import { passViewportStyles } from '../viewportStyles';

const TransferSections = (
  par: IParameter,
  precision: number,
): JSX.Element[] => {
  const parameter = par as unknown as ITransferContract;

  if (typeof window === 'undefined') return [];

  const isMobile = window.innerWidth <= 768;
  const isTablet = window.innerWidth < 1025 && window.innerWidth > 768;

  let assetId = 'KLV';
  if (parameter.assetId?.includes('/')) {
    assetId = parameter.assetId.split('/')[0];
  }

  if (!parameter.assetId) precision = KLV_PRECISION;

  return [
    <CenteredRow key={parameter.assetId}>
      <div>
        {parameter.assetId ? (
          <Tooltip
            msg={parameter.assetId}
            customStyles={passViewportStyles(isMobile, isTablet, ...coinStyles)}
            minMsgLength={9}
            Component={() => (
              <Link href={`/asset/${assetId}`}>{parameter.assetId}</Link>
            )}
          ></Tooltip>
        ) : (
          <>
            <Tooltip
              minMsgLength={9}
              msg={assetId}
              Component={() => (
                <Link href={`/asset/${assetId}`}>{assetId}</Link>
              )}
            ></Tooltip>
          </>
        )}
      </div>
    </CenteredRow>,
    <span key={parameter.amount}>
      <strong>
        {parameter.amount / 10 ** precision >= 1
          ? formatAmount(parameter.amount / 10 ** precision)
          : toLocaleFixed(parameter.amount / 10 ** precision, precision)}
      </strong>
    </span>,
  ];
};

const CreateAssetSections = (par: IParameter): JSX.Element[] => {
  const parameter = par as unknown as ICreateAssetContract;

  return [
    <span key={parameter.name}>{parameter.name}</span>,
    <span key={parameter.ticker}>
      <small>{parameter.ticker}</small>
    </span>,
  ];
};

const CreateValidatorSections = (par: IParameter): JSX.Element[] => {
  const parameter = par as unknown as ICreateValidatorContract;

  return [
    <span key={parameter.config.rewardAddress}>
      <Link href={`/account/${parameter.config.rewardAddress}`}>
        {parameter.config.rewardAddress}
      </Link>
    </span>,
    <span key={String(parameter.config.canDelegate)}>
      <strong>{parameter.config.canDelegate ? 'True' : 'False'}</strong>
    </span>,
  ];
};

const ValidatorConfigSections = (par: IParameter): JSX.Element[] => {
  const parameter = par as unknown as IValidatorConfigContract;

  return [
    <span key={parameter.config.blsPublicKey}>
      <small>{parameter.config.blsPublicKey}</small>
    </span>,
  ];
};

const FreezeSections = (par: IParameter, precision: number): JSX.Element[] => {
  const parameter = par as unknown as IFreezeContract;
  if (!parameter.assetId) precision = KLV_PRECISION;

  return [
    <span key={parameter.assetId}>
      <strong>{parameter.assetId.replace(/['"]+/g, '')}</strong>
    </span>,
    <span key={parameter.amount}>
      <strong>{formatAmount(parameter.amount / 10 ** precision)}</strong>
    </span>,
  ];
};

const UnfreezeSections = (par: IParameter): JSX.Element[] => {
  const parameter = par as unknown as IUnfreezeContract;

  return [
    <span key={parameter.bucketID}>
      <small>{parameter.bucketID}</small>
    </span>,
  ];
};

const DelegateSections = (par: IParameter): JSX.Element[] => {
  const parameter = par as unknown as IUnfreezeContract;

  return [
    <span key={parameter.bucketID}>
      <small>{parameter.bucketID}</small>
    </span>,
  ];
};

const UndelegateSections = (par: IParameter): JSX.Element[] => {
  const parameter = par as unknown as IUndelegateContract;

  return [
    <span key={parameter.bucketID}>
      <small>{parameter.bucketID}</small>
    </span>,
  ];
};

const WithdrawSections = (par: IParameter): JSX.Element[] => {
  const parameter = par as unknown as IWithdrawContract;
  const assetId = parameter?.assetId ?? 'KLV';

  return [
    <>
      <span>{assetId}</span>
    </>,
  ];
};

const ClaimSections = (
  par: IParameter,
  receipts: IReceipt[],
): JSX.Element[] => {
  const parameter = par as unknown as IClaimContract;
  const claimReceipt = findReceipt(receipts, 17) as IClaimReceipt | undefined;
  return [
    <span key={parameter.claimType}>
      <small>{parameter.claimType}</small>
    </span>,
    <span key={claimReceipt?.assetId}>
      <span>{claimReceipt?.assetId ?? '--'}</span>
    </span>,
  ];
};

const UnjailSections = (par: IParameter): JSX.Element[] => {
  const parameter = par as IUnjailContract;

  return [<></>];
};

const AssetTriggerSections = (par: IParameter): JSX.Element[] => {
  const parameter = par as unknown as IAssetTriggerContract;

  return [
    <span key={parameter.triggerType}>
      <small>{parameter.triggerType}</small>
    </span>,
  ];
};

const SetAccountNameSections = (par: IParameter): JSX.Element[] => {
  const parameter = par as unknown as ISetAccountNameContract;

  return [
    <span key={parameter.name}>
      <small>{parameter.name}</small>
    </span>,
  ];
};

const ProposalSections = (par: IParameter): JSX.Element[] => {
  const parameter = par as unknown as IProposalContract;

  return [
    <span key={parameter.description}>
      {parameter.description
        ? `${
            parameter.description.length > 48
              ? parameter.description.substring(0, 48).trim()
              : parameter.description
          }...`
        : '--'}
    </span>,
  ];
};

const VoteSections = (par: IParameter): JSX.Element[] => {
  const parameter = par as unknown as IVoteContract;

  return [
    <span key={parameter.proposalId}>{parameter.proposalId}</span>,

    <span key={parameter.amount}>
      <small>{parameter.amount / 10 ** KLV_PRECISION}</small>
    </span>,
  ];
};

const ConfigITOSections = (par: IParameter): JSX.Element[] => {
  const parameter = par as unknown as IConfigITOContract;

  return [<span key={parameter.assetId}>{parameter.assetId}</span>];
};

const SetITOPricesSections = (par: IParameter): JSX.Element[] => {
  const parameter = par as unknown as ISetITOPricesContract;

  return [<span key={parameter.assetId}>{parameter.assetId}</span>];
};

const BuySections = (par: IParameter): JSX.Element[] => {
  const parameter = par as unknown as IBuyContractPayload;

  return [
    <span key={parameter.buyType}>{parameter.buyType}</span>,

    <span key={parameter.currencyID}>
      <small>{parameter.currencyID}</small>
    </span>,
  ];
};

const SellSections = (par: IParameter): JSX.Element[] => {
  const parameter = par as unknown as ISellContract;

  let assetId = parameter.assetId;
  let currencyID = parameter.currencyID;

  if (parameter.assetId?.includes('/')) {
    assetId = parameter.assetId.split('/')[0];
  }
  if (parameter.currencyID?.includes('/')) {
    currencyID = parameter.currencyID.split('/')[0];
  }

  return [
    <span key={parameter.marketType}>
      <small>{parameter.marketType}</small>
    </span>,
    <Link href={`/asset/${currencyID}`} key={currencyID}>
      <a>
        <span key={currencyID}>
          <small>{parameter.currencyID}</small>
        </span>
      </a>
    </Link>,
    <Link href={`/asset/${assetId}`} key={assetId}>
      <a>
        <span key={assetId}>
          <small>{parameter.assetId}</small>
        </span>
      </a>
    </Link>,
  ];
};

const CancelMarketOrderSections = (par: IParameter): JSX.Element[] => {
  const parameter = par as unknown as ICancelMarketOrderContract;

  return [<span key={parameter.orderID}>{parameter.orderID}</span>];
};

const CreateMarketplaceSections = (par: IParameter): JSX.Element[] => {
  const parameter = par as unknown as ICreateMarketplaceContract;

  return [<span key={parameter.name}>{parameter.name}</span>];
};

const ConfigMarketplaceSections = (par: IParameter): JSX.Element[] => {
  const parameter = par as unknown as IConfigMarketplaceContract;

  return [
    <span key={parameter?.marketplaceID}>
      {parameter?.marketplaceID || ''}
    </span>,
  ];
};

const UpdateAccountPermissionContractSections = (
  par: IParameter,
): JSX.Element[] => {
  const parameter = par as unknown as IUpdateAccountPermissionContract;
  return [
    <span key={parameter?.permissions[0]?.permissionName}>
      {parameter?.permissions[0]?.permissionName || ''}
    </span>,
  ];
};

const DepositSections = (par: IParameter): JSX.Element[] => {
  const parameter = par as unknown as IDepositContract;
  return [
    <span key={parameter?.depositTypeString}>
      {parameter?.depositTypeString === 'FPRDeposit' ? 'FPR' : 'KDA Pool'}
    </span>,
    <span key={parameter?.id}>{parameter?.id || '--'}</span>,
  ];
};

const IITOTriggerSections = (par: IParameter): JSX.Element[] => {
  const parameter = par as unknown as IITOTriggerContract;
  return [
    <span key={parameter?.triggerType}>{parameter?.triggerType || ''}</span>,
    <span key={parameter?.assetId}>{parameter?.assetId || ''}</span>,
  ];
};

const SmartContractSections = (par: IParameter): JSX.Element[] => {
  const parameter = par as unknown as ISmartContract;

  return [<span key={parameter?.type}>{parameter?.type?.slice(2) || ''}</span>];
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
  SmartContractSections,
};
