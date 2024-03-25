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
  IDelegateContract,
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
import {
  IClaimReceipt,
  ICreateAssetReceipt,
  IDelegateReceipt,
  IFreezeReceipt,
  IReceipt,
  IUnfreezeReceipt,
  IWithdrawReceipt,
} from '@/types/index';
import { parseAddress } from '@/utils/parseValues';
import Link from 'next/link';
import { findReceipt } from '../findKey';
import { formatAmount, toLocaleFixed } from '../formatFunctions';
import { KLV_PRECISION } from '../globalVariables';

interface IProps {
  par: IParameter;
  receipts: IReceipt[];
  precision: number;
}

const formatAmountField = (
  amount: number | undefined,
  precision: number,
): string => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '--';
  }

  if (amount / 10 ** precision >= 1) {
    return formatAmount(amount / 10 ** precision);
  }
  return toLocaleFixed(amount / 10 ** precision, precision);
};

const TransferSections = ({ par, precision }: IProps): JSX.Element[] => {
  const parameter = par as unknown as ITransferContract;

  if (typeof window === 'undefined') return [];

  let assetId = 'KLV';
  if (parameter?.assetId?.includes('/')) {
    assetId = parameter?.assetId.split('/')[0];
  }

  if (!parameter?.assetId) precision = KLV_PRECISION;

  return [
    <CenteredRow key={parameter?.assetId + String(parameter?.amount)}>
      {formatAmountField(parameter?.amount, precision)}{' '}
      {parameter?.assetId ? (
        <Link href={`/asset/${assetId}`}>{parameter?.assetId}</Link>
      ) : (
        <>
          <Link href={`/asset/${assetId}`}>{assetId}</Link>
        </>
      )}
    </CenteredRow>,
  ];
};

const CreateAssetSections = ({ par, receipts }: IProps): JSX.Element[] => {
  const parameter = par as unknown as ICreateAssetContract;
  const createAssetReceipt = findReceipt(receipts, 1) as ICreateAssetReceipt;

  return [
    <span key={parameter?.name}>{parameter?.name}</span>,
    <span key={createAssetReceipt?.assetId}>
      {createAssetReceipt?.assetId}
    </span>,
    <span key={parameter?.precision}>{parameter?.precision}</span>,
  ];
};

const CreateValidatorSections = ({ par }: IProps): JSX.Element[] => {
  const parameter = par as unknown as ICreateValidatorContract;

  return [
    <span key={parameter?.ownerAddress}>
      <Link href={`/account/${parameter?.ownerAddress}`}>
        {parseAddress(parameter?.ownerAddress, 16)}
      </Link>
    </span>,
    <span key={String(parameter?.config?.name)}>
      <strong>{parameter?.config?.name}</strong>
    </span>,
    <span key={String(parameter?.config?.canDelegate)}>
      <strong>{parameter?.config?.canDelegate ? 'True' : 'False'}</strong>
    </span>,
  ];
};

const ValidatorConfigSections = ({ par }: IProps): JSX.Element[] => {
  const parameter = par as unknown as IValidatorConfigContract;

  return [
    <span key={parameter?.config.blsPublicKey}>
      <small>{parseAddress(parameter?.config.blsPublicKey, 16)}</small>
    </span>,
    <span key={parameter?.config.name}>
      <small>{parameter?.config.name}</small>
    </span>,
    <span key={String(parameter?.config.canDelegate)}>
      <small>{parameter?.config.canDelegate}</small>
    </span>,
  ];
};

const FreezeSections = ({
  par,
  precision,
  receipts,
}: IProps): JSX.Element[] => {
  const parameter = par as unknown as IFreezeContract;
  if (!parameter?.assetId) precision = KLV_PRECISION;

  const freezeReceipt = findReceipt(receipts, 3) as IFreezeReceipt;

  return [
    <span key={parameter?.assetId + parameter?.amount}>
      {formatAmountField(parameter?.amount, precision)}{' '}
      {parameter?.assetId?.replace(/['"]+/g, '')}
    </span>,
    <span key={freezeReceipt?.bucketId}>
      {parameter?.assetId === 'KLV' ||
      parameter?.assetId === 'KFI' ||
      !parameter.assetId
        ? parseAddress(freezeReceipt?.bucketId, 16)
        : parameter?.assetId}
    </span>,
  ];
};

const UnfreezeSections = ({
  par,
  receipts,
  precision,
}: IProps): JSX.Element[] => {
  const parameter = par as unknown as IUnfreezeContract;

  const unfreezeReceipt = findReceipt(receipts, 4) as
    | IUnfreezeReceipt
    | undefined;
  const assetId = parameter?.assetId || 'KLV';

  return [
    <span key={unfreezeReceipt?.value}>
      {unfreezeReceipt?.value
        ? formatAmountField(Number(unfreezeReceipt?.value), precision)
        : null}{' '}
      {unfreezeReceipt?.value ? assetId : null}
    </span>,
    <span key={parameter?.bucketID}>
      {parameter?.assetId === 'KLV' ||
      parameter?.assetId === 'KFI' ||
      !parameter.assetId
        ? parseAddress(parameter?.bucketID, 16)
        : parameter?.assetId}
    </span>,
  ];
};

const DelegateSections = ({ par, receipts }: IProps): JSX.Element[] => {
  const parameter = par as unknown as IDelegateContract;

  const delegateReceipt = findReceipt(receipts, 7) as
    | IDelegateReceipt
    | undefined;

  return [
    <span key={delegateReceipt?.amountDelegated}>
      {delegateReceipt?.amountDelegated
        ? formatAmountField(
            Number(delegateReceipt?.amountDelegated),
            KLV_PRECISION,
          )
        : null}{' '}
      {delegateReceipt?.amountDelegated ? 'KLV' : null}
    </span>,
    <span key={parameter?.bucketID}>
      {parseAddress(parameter?.bucketID, 16)}
    </span>,
    <span key={parameter?.toAddress}>
      {parseAddress(parameter?.toAddress, 16)}
    </span>,
  ];
};

const UndelegateSections = ({ par, receipts }: IProps): JSX.Element[] => {
  const parameter = par as unknown as IUndelegateContract;

  const delegateReceipt = findReceipt(receipts, 7) as
    | IDelegateReceipt
    | undefined;

  return [
    <span key={delegateReceipt?.amountDelegated}>
      {delegateReceipt?.amountDelegated
        ? formatAmountField(
            Number(delegateReceipt?.amountDelegated),
            KLV_PRECISION,
          )
        : null}{' '}
      {delegateReceipt?.amountDelegated ? 'KLV' : null}
    </span>,
    <span key={parameter?.bucketID}>
      {parseAddress(parameter?.bucketID, 16)}
    </span>,
  ];
};

const WithdrawSections = ({
  par,
  precision,
  receipts,
}: IProps): JSX.Element[] => {
  const parameter = par as unknown as IWithdrawContract;
  const assetId = parameter?.assetId ?? 'KLV';

  const withdrawReceipt = findReceipt(receipts, 18) as
    | IWithdrawReceipt
    | undefined;

  let amount = parameter?.amount;
  if (amount === undefined) {
    amount = Number(withdrawReceipt?.amount);
  }

  return [
    <span key={parameter?.withdrawType}>
      {parameter?.withdrawType === 1 ? 'KDA Pool' : 'Staking'}
    </span>,
    <span key={amount}>
      {amount ? formatAmountField(Number(amount), precision) : null}{' '}
      {amount ? assetId : null}
    </span>,
  ];
};

const ClaimSections = ({ par, receipts }: IProps): JSX.Element[] => {
  const parameter = par as unknown as IClaimContract;
  const claimReceipt = findReceipt(receipts, 17) as IClaimReceipt | undefined;
  return [
    <span key={parameter?.claimType}>
      <small>{parameter?.claimType}</small>
    </span>,
    <span key={claimReceipt?.assetId}>
      <span>{claimReceipt?.assetId ?? '--'}</span>
    </span>,
  ];
};

const UnjailSections = ({ par }: IProps): JSX.Element[] => {
  const parameter = par as IUnjailContract;

  return [<></>];
};

const AssetTriggerSections = ({ par }: IProps): JSX.Element[] => {
  const parameter = par as unknown as IAssetTriggerContract;

  return [
    <span key={parameter?.triggerType}>
      <small>{parameter?.triggerType}</small>
    </span>,
  ];
};

const SetAccountNameSections = ({ par }: IProps): JSX.Element[] => {
  const parameter = par as unknown as ISetAccountNameContract;

  return [
    <span key={parameter?.name}>
      <small>{parameter?.name}</small>
    </span>,
  ];
};

const ProposalSections = ({ par }: IProps): JSX.Element[] => {
  const parameter = par as unknown as IProposalContract;

  return [
    <span key={parameter?.description}>
      {parameter?.description
        ? `${
            parameter?.description.length > 48
              ? parameter?.description.substring(0, 48).trim()
              : parameter?.description
          }...`
        : '--'}
    </span>,
  ];
};

const VoteSections = ({ par }: IProps): JSX.Element[] => {
  const parameter = par as unknown as IVoteContract;

  return [
    <span key={parameter?.proposalId}>{parameter?.proposalId}</span>,

    <span key={parameter?.amount}>
      <small>{parameter?.amount / 10 ** KLV_PRECISION}</small>
    </span>,
  ];
};

const ConfigITOSections = ({ par }: IProps): JSX.Element[] => {
  const parameter = par as unknown as IConfigITOContract;

  return [<span key={parameter?.assetId}>{parameter?.assetId}</span>];
};

const SetITOPricesSections = ({ par }: IProps): JSX.Element[] => {
  const parameter = par as unknown as ISetITOPricesContract;

  return [<span key={parameter?.assetId}>{parameter?.assetId}</span>];
};

const BuySections = ({ par }: IProps): JSX.Element[] => {
  const parameter = par as unknown as IBuyContractPayload;

  return [
    <span key={parameter?.buyType}>{parameter?.buyType}</span>,

    <span key={parameter?.currencyID}>
      <small>{parameter?.currencyID}</small>
    </span>,
  ];
};

const SellSections = ({ par }: IProps): JSX.Element[] => {
  const parameter = par as unknown as ISellContract;

  let assetId = parameter?.assetId;
  let currencyID = parameter?.currencyID;

  if (parameter?.assetId?.includes('/')) {
    assetId = parameter?.assetId.split('/')[0];
  }
  if (parameter?.currencyID?.includes('/')) {
    currencyID = parameter?.currencyID.split('/')[0];
  }

  return [
    <span key={parameter?.marketType}>
      <small>{parameter?.marketType}</small>
    </span>,
    <Link href={`/asset/${currencyID}`} key={currencyID}>
      <a>
        <span key={currencyID}>
          <small>{parameter?.currencyID}</small>
        </span>
      </a>
    </Link>,
    <Link href={`/asset/${assetId}`} key={assetId}>
      <a>
        <span key={assetId}>
          <small>{parameter?.assetId}</small>
        </span>
      </a>
    </Link>,
  ];
};

const CancelMarketOrderSections = ({ par }: IProps): JSX.Element[] => {
  const parameter = par as unknown as ICancelMarketOrderContract;

  return [<span key={parameter?.orderID}>{parameter?.orderID}</span>];
};

const CreateMarketplaceSections = ({ par }: IProps): JSX.Element[] => {
  const parameter = par as unknown as ICreateMarketplaceContract;

  return [<span key={parameter?.name}>{parameter?.name}</span>];
};

const ConfigMarketplaceSections = ({ par }: IProps): JSX.Element[] => {
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

const DepositSections = ({ par }: IProps): JSX.Element[] => {
  const parameter = par as unknown as IDepositContract;
  return [
    <span key={parameter?.depositTypeString}>
      {parameter?.depositTypeString === 'FPRDeposit' ? 'FPR' : 'KDA Pool'}
    </span>,
    <span key={parameter?.id}>{parameter?.id || '--'}</span>,
  ];
};

const IITOTriggerSections = ({ par }: IProps): JSX.Element[] => {
  const parameter = par as unknown as IITOTriggerContract;
  return [
    <span key={parameter?.triggerType}>{parameter?.triggerType || ''}</span>,
    <span key={parameter?.assetId}>{parameter?.assetId || ''}</span>,
  ];
};

const SmartContractSections = ({ par }: IProps): JSX.Element[] => {
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
