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
  IUpdateAccountPermissionContract,
  IValidatorConfigContract,
  IVoteContract,
  IWithdrawContract,
} from '@/types/contracts';
import {
  IClaimReceipt,
  ICreateAssetReceipt,
  ICreateMarketplaceReceipt,
  IDelegateReceipt,
  IFreezeReceipt,
  IProposalReceipt,
  IReceipt,
  IUnfreezeReceipt,
  IWithdrawReceipt,
} from '@/types/index';
import { parseAddress } from '@/utils/parseValues';
import Link from 'next/link';
import { hexToString } from '../convertString';
import { findReceipt } from '../findKey';
import { formatAmount, toLocaleFixed } from '../formatFunctions';
import { KLV_PRECISION } from '../globalVariables';

interface IProps {
  par: IParameter;
  receipts: IReceipt[];
  precision: number;
  data?: string[];
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

  let assetId = parameter?.assetId || 'KLV';
  if (parameter?.assetId?.includes('/')) {
    assetId = parameter.assetId.split('/')[0];
  }

  if (!parameter?.assetId) precision = KLV_PRECISION;

  return [
    <CenteredRow key={parameter?.assetId + String(parameter?.amount)}>
      {formatAmountField(parameter?.amount, precision)}{' '}
      {parameter?.assetId ? (
        <Link href={`/asset/${assetId}`} legacyBehavior>
          {parameter?.assetId}
        </Link>
      ) : (
        <>
          <Link href={`/asset/${assetId}`} legacyBehavior>
            {assetId}
          </Link>
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
      <Link href={`/account/${parameter?.ownerAddress}`} legacyBehavior>
        {parseAddress(parameter?.ownerAddress, 16)}
      </Link>
    </span>,
    <span key={String(parameter?.config?.name)}>
      {parameter?.config?.name}
    </span>,
    <span key={String(parameter?.config?.canDelegate)}>
      {parameter?.config?.canDelegate ? 'True' : 'False'}
    </span>,
  ];
};

const ValidatorConfigSections = ({ par }: IProps): JSX.Element[] => {
  const parameter = par as unknown as IValidatorConfigContract;

  return [
    <span key={parameter?.config.blsPublicKey}>
      {parseAddress(parameter?.config.blsPublicKey, 16)}
    </span>,
    <span key={parameter?.config.name}>{parameter?.config.name}</span>,
    <span key={String(parameter?.config.canDelegate)}>
      {parameter?.config.canDelegate}
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

const ClaimSections = ({ par, receipts, precision }: IProps): JSX.Element[] => {
  const parameter = par as unknown as IClaimContract;
  const claimReceipt = findReceipt(receipts, 17) as IClaimReceipt | undefined;

  return [
    <span key={claimReceipt?.amount}>
      {claimReceipt?.amount
        ? formatAmountField(Number(claimReceipt?.amount), precision)
        : null}{' '}
      {claimReceipt?.amount ? claimReceipt?.assetId : null}
    </span>,
    <span key={parameter?.claimType}>{parameter?.claimType}</span>,
    <span key={parameter?.id}>{parameter?.id}</span>,
  ];
};

const UnjailSections = (_props: IProps): JSX.Element[] => {
  return [<></>];
};

const AssetTriggerSections = ({ par }: IProps): JSX.Element[] => {
  const parameter = par as unknown as IAssetTriggerContract;

  return [
    <span key={parameter?.assetId}>{parameter?.assetId}</span>,
    <span key={parameter?.triggerType}>{parameter?.triggerType}</span>,
  ];
};

const SetAccountNameSections = ({ par }: IProps): JSX.Element[] => {
  const parameter = par as unknown as ISetAccountNameContract;

  return [<span key={parameter?.name}>{parameter?.name}</span>];
};

const ProposalSections = ({ par, receipts }: IProps): JSX.Element[] => {
  const parameter = par as unknown as IProposalContract;
  const proposalReceipt = findReceipt(receipts, 5) as IProposalReceipt;

  return [
    <span key={proposalReceipt?.proposalId}>
      {proposalReceipt?.proposalId}
    </span>,
    <span key={parameter?.epochsDuration}>
      {parameter?.epochsDuration} epoch
      {parameter?.epochsDuration > 1 ? 's' : ''}(
      {(parameter?.epochsDuration * 6) / 24} day
      {parameter?.epochsDuration > 1 ? 's' : ''})
    </span>,
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
      {parameter?.amount / 10 ** KLV_PRECISION}
    </span>,
    <span key={parameter?.type}>
      {parameter?.type ? parameter?.type : 'Yes'}
    </span>,
  ];
};

const ConfigITOSections = ({ par }: IProps): JSX.Element[] => {
  const parameter = par as unknown as IConfigITOContract;

  return [
    <span key={parameter?.assetId}>{parameter?.assetId}</span>,
    <span key={parameter?.status}>{parameter?.status}</span>,
    <span key={parameter?.startTime || 0}>
      {parameter?.startTime &&
        new Date(parameter?.startTime * 1000).toLocaleString()}{' '}
    </span>,
  ];
};

const SetITOPricesSections = ({ par }: IProps): JSX.Element[] => {
  const parameter = par as unknown as ISetITOPricesContract;

  return [<span key={parameter?.assetId}>{parameter?.assetId}</span>];
};

const BuySections = ({ par, precision }: IProps): JSX.Element[] => {
  const parameter = par as unknown as IBuyContractPayload;
  const currency =
    parameter?.buyType === 'ITOBuy' ? parameter?.id : parameter?.currencyID;

  return [
    <span key={parameter?.buyType}>{parameter?.buyType}</span>,

    <span key={parameter?.id}>{parameter?.id}</span>,
    <span key={parameter?.amount}>
      {formatAmountField(parameter?.amount, precision)}{' '}
      {parameter?.amount ? currency : null}
    </span>,
  ];
};

const SellSections = ({ par, precision }: IProps): JSX.Element[] => {
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
    <span key={parameter?.marketType}>{parameter?.marketType}</span>,
    <Link href={`/asset/${assetId}`} key={assetId}>
      <span key={assetId}>{parameter?.assetId}</span>
    </Link>,
    <span key={parameter?.price}>
      {parameter?.price && formatAmountField(parameter?.price, precision)}{' '}
      {parameter?.price && currencyID}
    </span>,
  ];
};

const CancelMarketOrderSections = ({ par }: IProps): JSX.Element[] => {
  const parameter = par as unknown as ICancelMarketOrderContract;

  return [<span key={parameter?.orderID}>{parameter?.orderID}</span>];
};

const CreateMarketplaceSections = ({
  par,
  receipts,
}: IProps): JSX.Element[] => {
  const parameter = par as unknown as ICreateMarketplaceContract;

  const createMarketplaceReceipt = findReceipt(
    receipts,
    10,
  ) as ICreateMarketplaceReceipt;

  return [
    <span key={createMarketplaceReceipt?.marketplaceId}>
      {createMarketplaceReceipt?.marketplaceId}
    </span>,
    <span key={parameter?.name}>{parameter?.name}</span>,
    <span key={parameter?.referralPercentage}>
      {' '}
      {parameter?.referralPercentage / 10 ** 2 || 0} %
    </span>,
  ];
};

const ConfigMarketplaceSections = ({ par }: IProps): JSX.Element[] => {
  const parameter = par as unknown as IConfigMarketplaceContract;

  return [
    <span key={parameter?.marketplaceID}>
      {parameter?.marketplaceID || ''}
    </span>,
    <span key={parameter?.name}>{parameter?.name}</span>,
    <span key={parameter?.referralPercentage}>
      {parameter?.referralPercentage / 10 ** 2 || 0} %
    </span>,
  ];
};

const UpdateAccountPermissionContractSections = ({
  par,
}: IProps): JSX.Element[] => {
  const parameter = par as unknown as IUpdateAccountPermissionContract;

  const permissionNames = parameter?.permissions?.map(permission =>
    !!permission.permissionName ? permission.permissionName : '""',
  );

  let permissionsString = '';

  if (permissionNames?.length > 0) {
    permissionsString = permissionNames?.slice(0, 2).join(', ');

    if (permissionNames?.length > 2)
      permissionsString += `+ ${permissionNames?.length - 2}`;
  }

  return [<span key={permissionsString}>{permissionsString}</span>];
};

const DepositSections = ({ par, precision }: IProps): JSX.Element[] => {
  const parameter = par as unknown as IDepositContract;

  return [
    <span key={parameter?.depositTypeString}>
      {parameter?.depositTypeString === 'FPRDeposit' ? 'FPR' : 'KDA Pool'}
    </span>,
    <span key={parameter?.id}>{parameter?.id || '--'}</span>,
    <span key={parameter?.amount}>
      {parameter?.amount && formatAmountField(parameter?.amount, precision)}{' '}
      {parameter?.currencyID || 'KLV'}
    </span>,
  ];
};

const IITOTriggerSections = ({ par }: IProps): JSX.Element[] => {
  const parameter = par as unknown as IITOTriggerContract;
  return [
    <span key={parameter?.assetId}>{parameter?.assetId || ''}</span>,
    <span key={parameter?.triggerType}>{parameter?.triggerType || ''}</span>,
  ];
};

const SmartContractSections = ({
  par,
  receipts,
  data,
}: IProps): JSX.Element[] => {
  const parameter = par as unknown as ISmartContract;

  const calledFunction =
    (parameter?.type?.slice(2) || '') === 'Invoke' &&
    hexToString(data?.[0] || '').split('@')?.[0];

  return [
    <span key={parameter?.type}>{parameter?.type?.slice(2) || ''}</span>,
    <span key={parameter?.address}>
      {((parameter?.type?.slice(2) || '') === 'Invoke' &&
        parseAddress(parameter?.address, 16)) ||
        ''}
    </span>,
    <span key={String(calledFunction)}>{calledFunction}</span>,
  ];
};

export {
  AssetTriggerSections,
  BuySections,
  CancelMarketOrderSections,
  ClaimSections,
  ConfigITOSections,
  ConfigMarketplaceSections,
  CreateAssetSections,
  CreateMarketplaceSections,
  CreateValidatorSections,
  DelegateSections,
  DepositSections,
  FreezeSections,
  IITOTriggerSections,
  ProposalSections,
  SellSections,
  SetAccountNameSections,
  SetITOPricesSections,
  SmartContractSections,
  TransferSections,
  UndelegateSections,
  UnfreezeSections,
  UnjailSections,
  UpdateAccountPermissionContractSections,
  ValidatorConfigSections,
  VoteSections,
  WithdrawSections,
};
