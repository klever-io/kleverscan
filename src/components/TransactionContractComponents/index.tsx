import React from 'react';

import Link from 'next/link';

import { CenteredRow, Row } from '@/views/transactions/detail';

import { toLocaleFixed } from '@/utils/index';

import { findKey } from '@/utils/findKey';

import {
  ITransferContract,
  ICreateAssetContract,
  IContract,
  ICreateValidatorContract,
  IFreezeContract,
  IUnfreezeContract,
  IAsset,
  IFreezeReceipt,
  IUnfreezeReceipt,
  ICreateAssetReceipt,
  IClaimContract,
  IDelegateContract,
  IUndelegateContract,
  IWithdrawContract,
  IAssetTriggerContract,
  ISetAccountNameContract,
  IProposalContract,
  IVoteContract,
  IConfigICOContract,
  ISetICOPricesContract,
  IBuyContract,
  ISellContract,
  ICancelMarketOrderContract,
  ICreateMarketplaceContract,
  IConfigMarketplaceContract,
  IValidatorConfig,
} from '@/types/index';

import { KLV } from '@/assets/coins';

export const Transfer: React.FC<IContract> = ({
  parameter: par,
  precision,
  asset,
}) => {
  precision = precision ? precision : 6;
  const coin: IAsset = asset || KLV;
  const parameter = par as ITransferContract;

  return (
    <>
      <Row>
        <span>
          <strong>Amount</strong>
        </span>
        <CenteredRow>
          <strong>
            {toLocaleFixed(parameter.amount / 10 ** coin.precision, precision)}
          </strong>
          {coin.assetId ? (
            <Link href={`/asset/${coin.assetId}`}>{coin.assetId}</Link>
          ) : (
            <>
              <Link href={`/asset/KLV`}>
                <KLV />
              </Link>
              <Link href={`/asset/KLV`}>KLV</Link>
            </>
          )}
        </CenteredRow>
      </Row>
      <Row>
        <span>
          <strong>To</strong>
        </span>
        <span>
          <Link href={`/account/${parameter.toAddress}`}>
            {parameter.toAddress}
          </Link>
        </span>
      </Row>
    </>
  );
};

export const CreateAsset: React.FC<IContract> = ({
  sender,
  parameter: par,
  receipts: rec,
}) => {
  const parameter = par as ICreateAssetContract;
  const receipts = rec as ICreateAssetReceipt[];
  const ownerAddress = parameter?.ownerAddress || sender;
  const assetId = findKey(receipts, 'assetId');

  return (
    <>
      <Row>
        <span>
          <strong>Asset ID</strong>
        </span>
        <Link href={`/asset/${assetId}`}>{assetId}</Link>
      </Row>
      <Row>
        <span>
          <strong>Name</strong>
        </span>
        <span>{parameter.name}</span>
      </Row>
      <Row>
        <span>
          <strong>Owner</strong>
        </span>
        <span>
          <Link href={`/account/${ownerAddress}`}>{ownerAddress}</Link>
        </span>
      </Row>
      <Row>
        <span>
          <strong>Token</strong>
        </span>
        <span>{parameter.ticker}</span>
      </Row>
      <Row>
        <span>
          <strong>Precision</strong>
        </span>
        <span>
          <p>{parameter.precision}</p>
        </span>
      </Row>
      <Row>
        <span>
          <strong>Circulating Supply</strong>
        </span>
        <span>
          <small>
            {toLocaleFixed(
              parameter.circulatingSupply / 10 ** parameter.precision,
              parameter.precision,
            )}
          </small>
        </span>
      </Row>
      <Row>
        <span>
          <strong>Initial Supply</strong>
        </span>
        <span>
          <small>
            {toLocaleFixed(
              parameter.initialSupply / 10 ** parameter.precision,
              parameter.precision,
            )}
          </small>
        </span>
      </Row>
      <Row>
        <span>
          <strong>Max Supply</strong>
        </span>
        <span>
          <small>
            {toLocaleFixed(
              parameter.maxSupply / 10 ** parameter.precision,
              parameter.precision,
            )}
          </small>
        </span>
      </Row>
    </>
  );
};

export const CreateValidator: React.FC<IContract> = ({
  sender,
  parameter: par,
  precision,
}) => {
  precision = precision ? precision : 6;
  const parameter = par as ICreateValidatorContract;
  const ownerAddress = parameter?.ownerAddress || sender;

  return (
    <>
      <Row>
        <span>
          <strong>Owner</strong>
        </span>
        <span>
          <Link href={`/account/${ownerAddress}`}>{ownerAddress}</Link>
        </span>
      </Row>
      <Row>
        <span>
          <strong>Can Delegate</strong>
        </span>
        <span>
          <p>{parameter.config.canDelegate ? 'True' : 'False'}</p>
        </span>
      </Row>
      <Row>
        <span>
          <strong>Comission</strong>
        </span>
        <span>
          <small>{parameter.config.commission.toLocaleString()}</small>
        </span>
      </Row>
      <Row>
        <span>
          <strong>Max Delegation Amount</strong>
        </span>
        <span>
          <small>
            {toLocaleFixed(
              parameter.config.maxDelegationAmount / 10 ** precision,
              precision,
            )}
          </small>
        </span>
      </Row>
      <Row>
        <span>
          <strong>Reward</strong>
        </span>
        <span>
          <Link href={`/account/${parameter.config.rewardAddress}`}>
            {parameter.config.rewardAddress}
          </Link>
        </span>
      </Row>
    </>
  );
};

export const ValidatorConfig: React.FC<IContract> = ({ parameter: par }) => {
  const parameter = par as IValidatorConfig;
  return (
    <>
      <Row>
        <span>
          <strong>Public Key</strong>
        </span>
        <span>{parameter.blsPublicKey}</span>
      </Row>
      <Row>
        <span>
          <strong>Name</strong>
        </span>
        <span>{parameter.name}</span>
      </Row>
    </>
  );
};

export const Freeze: React.FC<IContract> = ({
  sender,
  parameter: par,
  receipts: rec,
}) => {
  const parameter = par as IFreezeContract;
  const receipts = rec as IFreezeReceipt[];

  return (
    <>
      <Row>
        <span>
          <strong>Owner</strong>
        </span>
        <span>
          <Link href={`/account/${sender}`}>{sender}</Link>
        </span>
      </Row>
      <Row>
        <span>
          <strong>Amount</strong>
        </span>
        <span>
          <small>{parameter.amount.toLocaleString()}</small>
        </span>
      </Row>
      <Row>
        <span>
          <strong>Bucket ID</strong>
        </span>
        <span>{findKey(receipts, 'bucketId')}</span>
      </Row>
    </>
  );
};

export const Unfreeze: React.FC<IContract> = ({
  sender,
  parameter: par,
  receipts: rec,
}) => {
  const parameter = par as IUnfreezeContract;
  const receipts = rec as IUnfreezeReceipt[];

  const getAvailabeEpoch = () => {
    return (
      Object.values(receipts).find(item => item?.availableEpoch > 0)
        ?.availableEpoch || '--'
    );
  };

  return (
    <>
      <Row>
        <span>
          <strong>Owner</strong>
        </span>
        <span>
          <Link href={`/account/${sender}`}>{sender}</Link>
        </span>
      </Row>
      <Row>
        <span>
          <strong>Asset ID</strong>
        </span>
        <span>{parameter.assetId}</span>
      </Row>
      <Row>
        <span>
          <strong>Bucket ID</strong>
        </span>
        <span>{parameter.bucketID}</span>
      </Row>
      <Row>
        <span>
          <strong>Available Epoch</strong>
        </span>
        <span>{getAvailabeEpoch()}</span>
      </Row>
    </>
  );
};
export const Delegate: React.FC<IContract> = ({ parameter: par }) => {
  const parameter = par as IDelegateContract;

  return (
    <>
      <Row>
        <span>
          <strong>Bucket ID</strong>
        </span>
        <span>{parameter.bucketID}</span>
      </Row>
      <Row>
        <span>
          <strong>to</strong>
        </span>
        <span>{parameter.toAddress}</span>
      </Row>
    </>
  );
};

export const Undelegate: React.FC<IContract> = ({ parameter: par }) => {
  const parameter = par as IUndelegateContract;

  return (
    <>
      <Row>
        <span>
          <strong>Bucket ID</strong>
        </span>
        <span>{parameter.bucketID}</span>
      </Row>
    </>
  );
};

export const Withdraw: React.FC<IContract> = ({ parameter: par }) => {
  const parameter = par as IWithdrawContract;
  return (
    <>
      <Row>
        <span>
          <strong>Asset ID</strong>
        </span>
        <span>{parameter.assetId}</span>
      </Row>
    </>
  );
};

export const Claim: React.FC<IContract> = ({ parameter: par }) => {
  const parameter = par as IClaimContract;

  return (
    <>
      <Row>
        <span>
          <strong>Claim Type</strong>
        </span>
        <span>{parameter.claimType}</span>
      </Row>
      <Row>
        <span>
          <strong>Id</strong>
        </span>
        <span>{parameter.id}</span>
      </Row>
    </>
  );
};

export const Unjail: React.FC<IContract> = () => {
  return <></>;
};

export const AssetTrigger: React.FC<IContract> = ({ parameter: par }) => {
  const parameter = par as IAssetTriggerContract;

  return (
    <>
      <Row>
        <span>
          <strong>Trigger Type</strong>
        </span>
        <span>{parameter.triggerType}</span>
      </Row>
    </>
  );
};

export const SetAccountName: React.FC<IContract> = ({ parameter: par }) => {
  const parameter = par as ISetAccountNameContract;

  return (
    <>
      <Row>
        <span>
          <strong>Name</strong>
        </span>
        <span>{parameter.name}</span>
      </Row>
    </>
  );
};

export const Proposal: React.FC<IContract> = ({ parameter: par }) => {
  const parameter = par as IProposalContract;

  return (
    <>
      <Row>
        <span>
          <strong>Value</strong>
        </span>
        <span>{parameter.value}</span>
      </Row>
      <Row>
        <span>
          <strong>Epoch Duration</strong>
        </span>
        <span>{parameter.epochsDuration}</span>
      </Row>
    </>
  );
};

export const Vote: React.FC<IContract> = ({ parameter: par }) => {
  const parameter = par as IVoteContract;

  return (
    <>
      <Row>
        <span>
          <strong>Proposal Id</strong>
        </span>
        <span>{parameter.proposalId}</span>
      </Row>
      <Row>
        <span>
          <strong>Amount</strong>
        </span>
        <span>{parameter.amount}</span>
      </Row>
    </>
  );
};

export const ConfigICO: React.FC<IContract> = ({ parameter: par }) => {
  const parameter = par as IConfigICOContract;

  return (
    <>
      <Row>
        <span>
          <strong>Asset Id</strong>
        </span>
        <span>{parameter.assetId}</span>
      </Row>
      <Row>
        <span>
          <strong>Status</strong>
        </span>
        <span>{parameter.status}</span>
      </Row>
    </>
  );
};

export const SetICOPrices: React.FC<IContract> = ({ parameter: par }) => {
  const parameter = par as ISetICOPricesContract;

  return (
    <>
      <Row>
        <span>
          <strong>Asset Id</strong>
        </span>
        <span>{parameter.assetId}</span>
      </Row>
      <Row>
        <span>
          <strong>Price</strong>
        </span>
        <span>{parameter.packInfo.price}</span>
      </Row>
    </>
  );
};

export const Buy: React.FC<IContract> = ({ parameter: par }) => {
  const parameter = par as IBuyContract;

  return (
    <>
      <Row>
        <span>
          <strong>Buy Type</strong>
        </span>
        <span>{parameter.buyType}</span>
      </Row>
      <Row>
        <span>
          <strong>Id</strong>
        </span>
        <span>{parameter.id}</span>
      </Row>
    </>
  );
};

export const Sell: React.FC<IContract> = ({ parameter: par }) => {
  const parameter = par as ISellContract;

  return (
    <>
      <Row>
        <span>
          <strong>Market Type</strong>
        </span>
        <span>{parameter.marketType}</span>
      </Row>
      <Row>
        <span>
          <strong>Asset Id</strong>
        </span>
        <span>{parameter.assetId}</span>
      </Row>
    </>
  );
};

export const CancelMarketOrder: React.FC<IContract> = ({ parameter: par }) => {
  const parameter = par as ICancelMarketOrderContract;

  return (
    <>
      <Row>
        <span>
          <strong>Order Id</strong>
        </span>
        <span>{parameter.orderId}</span>
      </Row>
    </>
  );
};

export const CreateMarketplace: React.FC<IContract> = ({ parameter: par }) => {
  const parameter = par as ICreateMarketplaceContract;

  return (
    <>
      <Row>
        <span>
          <strong>Name</strong>
        </span>
        <span>{parameter.name}</span>
      </Row>
      <Row>
        <span>
          <strong>Address</strong>
        </span>
        <span>{parameter.referralAddress}</span>
      </Row>
    </>
  );
};

export const ConfigMarketplace: React.FC<IContract> = ({ parameter: par }) => {
  const parameter = par as IConfigMarketplaceContract;

  return (
    <>
      <Row>
        <span>
          <strong>Name</strong>
        </span>
        <span>{parameter.name}</span>
      </Row>
      <Row>
        <span>
          <strong>Market Id</strong>
        </span>
        <span>{parameter.marketplaceId}</span>
      </Row>
      <Row>
        <span>
          <strong>Address</strong>
        </span>
        <span>{parameter.referralAddress}</span>
      </Row>
    </>
  );
};
