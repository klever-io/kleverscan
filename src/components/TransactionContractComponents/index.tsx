import React from 'react';

import Link from 'next/link';

import { CenteredRow, Row } from '@/views/transactions/detail';

import { toLocaleFixed } from '@/utils/index';
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

  return (
    <>
      <Row>
        <span>
          <strong>Asset ID</strong>
        </span>
        <span>{receipts?.[0]?.assetId}</span>
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
        <span>{receipts?.[0]?.bucketId}</span>
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
          <strong>Bucket ID</strong>
        </span>
        <span>{parameter.bucketId}</span>
      </Row>
      <Row>
        <span>
          <strong>Available Epoch To Withdraw</strong>
        </span>
        <span>{receipts?.[0]?.availableWithdrawEpoch}</span>
      </Row>
    </>
  );
};
export const Delegate: React.FC<IContract> = ({ parameter: par }) => {
  const parameter = par as IUnfreezeContract;

  return (
    <>
      <Row>
        <span>
          <strong>Bucket ID</strong>
        </span>
        <span>{parameter.bucketId}</span>
      </Row>
    </>
  );
};

export const Withdraw: React.FC<IContract> = () => {
  return <></>;
};
