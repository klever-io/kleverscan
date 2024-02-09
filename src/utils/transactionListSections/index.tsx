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
import { IClaimReceipt, IReceipt, IRowSection } from '@/types/index';
import Link from 'next/link';
import { findReceipt } from '../findKey';
import { formatAmount, toLocaleFixed } from '../formatFunctions';
import { KLV_PRECISION } from '../globalVariables';
import { passViewportStyles } from '../viewportStyles';

const TransferSections = (
  par: IParameter,
  precision: number,
): IRowSection[] => {
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
        </CenteredRow>
      ),
      span: 1,
    },
    {
      element: (
        <span key={parameter.amount}>
          <strong>
            {parameter.amount / 10 ** precision >= 1
              ? formatAmount(parameter.amount / 10 ** precision)
              : toLocaleFixed(parameter.amount / 10 ** precision, precision)}
          </strong>
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

const FreezeSections = (par: IParameter, precision: number): IRowSection[] => {
  const parameter = par as unknown as IFreezeContract;
  if (!parameter.assetId) precision = KLV_PRECISION;

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
  const claimReceipt = findReceipt(receipts, 17) as IClaimReceipt | undefined;
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
          <span>{claimReceipt?.assetId ?? '--'}</span>
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
      element: (
        <span key={parameter.description}>
          {parameter.description
            ? `${
                parameter.description.length > 48
                  ? parameter.description.substring(0, 48).trim()
                  : parameter.description
              }...`
            : '--'}
        </span>
      ),
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
          <small>{parameter.amount / 10 ** KLV_PRECISION}</small>
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

  let assetId = parameter.assetId;
  let currencyID = parameter.currencyID;

  if (parameter.assetId?.includes('/')) {
    assetId = parameter.assetId.split('/')[0];
  }
  if (parameter.currencyID?.includes('/')) {
    currencyID = parameter.currencyID.split('/')[0];
  }

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
        <Link href={`/asset/${currencyID}`}>
          <a>
            <span key={currencyID}>
              <small>{parameter.currencyID}</small>
            </span>
          </a>
        </Link>
      ),
      span: 1,
    },
    {
      element: (
        <Link href={`/asset/${assetId}`}>
          <a>
            <span key={assetId}>
              <small>{parameter.assetId}</small>
            </span>
          </a>
        </Link>
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
    {
      element: (
        <span>
          {parameter?.depositTypeString === 'FPRDeposit' ? 'FPR' : 'KDA Pool'}
        </span>
      ),
      span: 1,
    },
    { element: <span>{parameter?.id || '--'}</span>, span: 1 },
  ];
};

const IITOTriggerSections = (par: IParameter): IRowSection[] => {
  const parameter = par as unknown as IITOTriggerContract;
  return [
    { element: <span>{parameter?.triggerType || ''}</span>, span: 1 },
    { element: <span>{parameter?.assetId || ''}</span>, span: 1 },
  ];
};

const SmartContractSections = (par: IParameter): IRowSection[] => {
  const parameter = par as unknown as ISmartContract;

  return [
    {
      element: (
        <span key={parameter?.type}>{parameter?.typeName?.slice(2) || ''}</span>
      ),
      span: 1,
    },
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
  SmartContractSections,
};
