import { KLV } from '@/assets/coins';
import {
  IAssetTriggerContract,
  IBuyContract,
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
import { CenteredRow, Tooltip, TooltipText } from '@/views/transactions';
import Link from 'next/link';
import { useRef } from 'react';
import { formatAmount } from '..';

const precision = 6; // default KLV precision

const TransferSections = (par: IParameter): JSX.Element[] => {
  const parameter = par as unknown as ITransferContract;
  const tooltipRef = useRef<any>(null);

  const handleMouseOver = (e: any) => {
    const positionY = e.currentTarget.getBoundingClientRect().top;
    const positionX = e.currentTarget.getBoundingClientRect().left;

    tooltipRef.current.style.top = positionY - 30 + 'px';
    tooltipRef.current.style.left = positionX + 'px';
  };
  return [
    <CenteredRow key={parameter.assetId}>
      <div>
        {parameter.assetId ? (
          <Tooltip onMouseOver={(e: any) => handleMouseOver(e)}>
            <Link href={`/asset/${parameter.assetId}`}>
              {parameter.assetId}
            </Link>
            <TooltipText ref={tooltipRef}>{parameter.assetId}</TooltipText>
          </Tooltip>
        ) : (
          <>
            <Tooltip onMouseOver={(e: any) => handleMouseOver(e)}>
              <Link href={`/asset/KLV`}>
                <KLV />
              </Link>
              <TooltipText ref={tooltipRef}>KLV</TooltipText>
            </Tooltip>
          </>
        )}
      </div>
    </CenteredRow>,
    <span key={parameter.amount}>
      <strong>{formatAmount(parameter.amount / 10 ** precision)}</strong>
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

const FreezeSections = (par: IParameter): JSX.Element[] => {
  const parameter = par as unknown as IFreezeContract;

  return [
    <span key={parameter.amount}>
      <strong>
        {formatAmount(parameter.amount / 10 ** precision)}{' '}
        {parameter.assetId.replace(/['"]+/g, '')}
      </strong>
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
  return [
    <>
      <span>{parameter.assetId}</span>
    </>,
  ];
};

const ClaimSections = (par: IParameter): JSX.Element[] => {
  const parameter = par as unknown as IClaimContract;

  return [
    <span key={parameter.claimType}>
      <small>{parameter.claimType}</small>
    </span>,
  ];
};

const UnjailSections = (par: IParameter): JSX.Element[] => {
  const parameter = par as IUnjailContract;

  return [];
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

  return [<span key={parameter.description}>{parameter.description}</span>];
};

const VoteSections = (par: IParameter): JSX.Element[] => {
  const parameter = par as unknown as IVoteContract;

  return [
    <span key={parameter.proposalId}>{parameter.proposalId}</span>,
    <span key={parameter.amount}>
      <small>{parameter.amount}</small>
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
  const parameter = par as unknown as IBuyContract;

  return [
    <span key={parameter.buyType}>{parameter.buyType}</span>,
    <span key={parameter.amount}>
      <small>{parameter.amount}</small>
    </span>,
  ];
};

const SellSections = (par: IParameter): JSX.Element[] => {
  const parameter = par as unknown as ISellContract;

  return [
    <span key={parameter.assetId}>
      <small>{parameter.assetId}</small>
    </span>,
  ];
};

const CancelMarketOrderSections = (par: IParameter): JSX.Element[] => {
  const parameter = par as unknown as ICancelMarketOrderContract;

  return [<span key={parameter.orderId}>{parameter.orderId}</span>];
};

const CreateMarketplaceSections = (par: IParameter): JSX.Element[] => {
  const parameter = par as unknown as ICreateMarketplaceContract;

  return [<span key={parameter.name}>{parameter.name}</span>];
};

const ConfigMarketplaceSections = (par: IParameter): JSX.Element[] => {
  const parameter = par as unknown as IConfigMarketplaceContract;

  return [<></>];
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
