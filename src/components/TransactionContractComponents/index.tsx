import { KLV } from '@/assets/coins';
import {
  IAssetTriggerContract,
  IBuyContract,
  ICancelMarketOrderContract,
  IClaimContract,
  IConfigITOContract,
  IConfigMarketplaceContract,
  IContract,
  ICreateAssetContract,
  ICreateAssetReceipt,
  ICreateMarketplaceContract,
  ICreateValidatorContract,
  IDelegateContract,
  IFreezeContract,
  IFreezeReceipt,
  IProposalContract,
  ISellContract,
  ISetAccountNameContract,
  ISetITOPricesContract,
  ITransferContract,
  IUndelegateContract,
  IUnfreezeContract,
  IUnfreezeReceipt,
  IValidatorConfig,
  IVoteContract,
  IWithdrawContract,
} from '@/types/index';
import { findKey, findReceipt } from '@/utils/findKey';
import { getPrecision, toLocaleFixed } from '@/utils/index';
import { CenteredRow, Row } from '@/views/transactions/detail';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Copy from '../Copy';

export const Transfer: React.FC<any> = ({ parameter: par }) => {
  const parameter = par as ITransferContract;
  const [precision, setPrecision] = useState(1);

  useEffect(() => {
    const assetID = parameter?.assetId?.split('/') || [];

    const getAssetPrecision = async () => {
      setPrecision((await getPrecision(assetID?.[0] || 'KLV')) || 1);
    };

    if (assetID.length > 1) {
      return;
    }

    if (assetID.length === 0 || assetID[0] === 'KLV' || assetID[0] === 'KFI') {
      setPrecision(1000000);
      return;
    }

    getAssetPrecision();
  }, []);

  return (
    <>
      <Row>
        <span>
          <strong>Type</strong>
        </span>
        <strong>Transfer</strong>
      </Row>
      <Row>
        <span>
          <strong>Amount</strong>
        </span>
        <CenteredRow>
          <strong>{(parameter?.amount / precision).toLocaleString()}</strong>
          {parameter?.assetId?.split('/')[0] ? (
            <>
              <Link href={`/asset/${parameter?.assetId?.split('/')[0]}`}>
                {parameter?.assetId?.split('/')[0]}
              </Link>
            </>
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
          <strong>Asset Id</strong>
        </span>
        <span>{parameter?.assetId || 'KLV'}</span>
      </Row>
      <Row>
        <span>
          <strong>To</strong>
        </span>
        <span>
          <CenteredRow>
            <Link href={`/account/${parameter?.toAddress}`}>
              {parameter?.toAddress}
            </Link>
            <Copy data={parameter?.toAddress} />
          </CenteredRow>
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

  interface Active {
    parameter: string;
  }
  const [isActive, setIsActive] = useState({} as any);

  return (
    <>
      <Row>
        <span>
          <strong>Type</strong>
        </span>
        <strong>Create Asset</strong>
      </Row>
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
          <strong>Ticker</strong>
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
      {parameter.royalties && (
        <>
          <Row>
            <div
              onClick={() =>
                setIsActive({
                  ...isActive,
                  royalties: !!!isActive?.royalties,
                })
              }
              className={`accordion-${
                isActive?.royalties ? 'active' : 'disabled'
              }`}
            >
              <div className="accordionHeader">
                <span>
                  <strong>Royalties</strong>
                </span>
                <span className="icon">+</span>
              </div>

              {isActive?.royalties && (
                <span className="panel">
                  <span>
                    <strong>Address:&nbsp;</strong>
                    {parameter?.royalties?.address}
                  </span>
                  {parameter?.royalties?.transferFixed && (
                    <span>
                      <strong>Transfer Fixed:&nbsp;</strong>
                      {parameter?.royalties?.transferFixed / 1000000} KLV
                    </span>
                  )}
                  {parameter?.royalties?.marketFixed && (
                    <span>
                      <strong>Market Fixed:&nbsp;</strong>
                      {parameter?.royalties?.marketFixed / 1000000} KLV
                    </span>
                  )}
                  {parameter?.royalties?.marketPercentage && (
                    <span>
                      <strong>Market Percent:&nbsp;</strong>
                      {parameter?.royalties?.marketPercentage / 100}%
                    </span>
                  )}
                </span>
              )}
            </div>
          </Row>
        </>
      )}
      {parameter.staking && (
        <>
          <Row>
            <div
              onClick={() =>
                setIsActive({
                  ...isActive,
                  staking: !!!isActive?.staking,
                })
              }
              className={`accordion-${
                isActive?.staking ? 'active' : 'disabled'
              }`}
            >
              <div className="accordionHeader">
                <span>
                  <strong>Staking</strong>
                </span>
                <span className="icon">+</span>
              </div>

              {isActive?.staking && (
                <span className="panel">
                  <span>
                    <strong>Type:&nbsp;</strong>
                    {parameter?.staking?.type}
                  </span>
                  <span>
                    <strong>APR:&nbsp;</strong>
                    {parameter?.staking?.apr / 100}%
                  </span>
                  <span>
                    <strong>Claim Type&nbsp;</strong>
                    {parameter?.staking?.minEpochsToClaim} Epoch(s)
                  </span>{' '}
                  <span>
                    <strong>Unstake Time:&nbsp;</strong>
                    {parameter?.staking?.minEpochsToUnstake} Epoch(s)
                  </span>{' '}
                  <span>
                    <strong>Withdraw Time:&nbsp;</strong>
                    {parameter?.staking?.minEpochsToWithdraw} Epoch(s)
                  </span>
                </span>
              )}
            </div>
          </Row>
        </>
      )}

      {parameter.properties && (
        <>
          <Row>
            <div
              onClick={() =>
                setIsActive({
                  ...isActive,
                  properties: !!!isActive?.properties,
                })
              }
              className={`accordion-${
                isActive?.properties ? 'active' : 'disabled'
              }`}
            >
              <div className="accordionHeader">
                <span>
                  <strong>Properties</strong>
                </span>
                <span className="icon">+</span>
              </div>

              {isActive?.properties && (
                <span className="panel">
                  <span>
                    <strong>Can Freeze:&nbsp;</strong>
                    <span>
                      {parameter?.properties?.canFreeze ? 'Yes' : 'No'}
                    </span>
                  </span>
                  <span>
                    <strong>Can Mint:&nbsp;</strong>
                    <span>{parameter?.properties?.canMint ? 'Yes' : 'No'}</span>
                  </span>
                  <span>
                    <strong>Can Burn:&nbsp;</strong>
                    <span>{parameter?.properties?.canBurn ? 'Yes' : 'No'}</span>
                  </span>{' '}
                  <span>
                    <strong>Can Pause:&nbsp;</strong>
                    <span>
                      {parameter?.properties?.canPause ? 'Yes' : 'No'}
                    </span>
                  </span>
                  <span>
                    <strong>Can Wipe:&nbsp;</strong>
                    {parameter?.properties?.canWipe ? 'Yes' : 'No'}
                  </span>
                  <span>
                    <strong>Change Owner:&nbsp;</strong>
                    {parameter?.properties?.canChangeOwner ? 'Yes' : 'No'}
                  </span>
                  <span>
                    <strong>Add Roles:&nbsp;</strong>
                    {parameter?.properties?.canAddRoles ? 'Yes' : 'No'}
                  </span>
                </span>
              )}
            </div>
          </Row>
        </>
      )}

      {parameter.attributes && (
        <>
          <Row>
            <div
              onClick={() =>
                setIsActive({
                  ...isActive,
                  attributes: !!!isActive?.attributes,
                })
              }
              className={`accordion-${
                isActive?.attributes ? 'active' : 'disabled'
              }`}
            >
              <div className="accordionHeader">
                <span>
                  <strong>Attributes</strong>
                </span>
                <span className="icon">+</span>
              </div>

              {isActive?.attributes && (
                <span className="panel">
                  <span>
                    <strong>Is Paused:&nbsp;</strong>
                    <span>
                      {parameter?.attributes?.isPaused ? 'Yes' : 'No'}
                    </span>
                  </span>
                  <span>
                    <strong>Can Mint NFT:&nbsp;</strong>
                    <span>
                      {parameter?.attributes?.isNFTMintStopped ? 'Yes' : 'No'}
                    </span>
                  </span>
                </span>
              )}
            </div>
          </Row>
        </>
      )}
    </>
  );
};

export const CreateValidator: React.FC<IContract> = ({
  sender,
  parameter: par,
}) => {
  const parameter = par as ICreateValidatorContract;
  const ownerAddress = parameter?.ownerAddress || sender;

  return (
    <>
      {' '}
      <Row>
        <span>
          <strong>Type</strong>
        </span>
        <strong>Create Validator</strong>
      </Row>
      <Row>
        <span>
          <strong>Name</strong>
        </span>
        <span>
          <p>{parameter?.config?.name}</p>
        </span>
      </Row>
      <Row>
        <span>
          <strong>Owner</strong>
        </span>
        <span>
          <Link href={`/account/${ownerAddress}`}>{ownerAddress}</Link>
        </span>
      </Row>
      {parameter?.config?.logo && (
        <Row>
          <span>
            <strong>Logo</strong>
          </span>
          <span>
            <CenteredRow>
              <Link href={parameter.config.logo}>{parameter.config.logo}</Link>
              <Copy data={parameter.config.logo}></Copy>
            </CenteredRow>
          </span>
        </Row>
      )}
      <Row>
        <span>
          <strong>Can Delegate</strong>
        </span>
        <span>
          <p>{parameter?.config?.canDelegate ? 'True' : 'False'}</p>
        </span>
      </Row>
      <Row>
        <span>
          <strong>Comission</strong>
        </span>
        <span>
          <small>{parameter?.config?.commission / 100}%</small>
        </span>
      </Row>
      <Row>
        <span>
          <strong>Max Delegation</strong>
        </span>
        <span>
          <small>
            {toLocaleFixed(parameter?.config?.maxDelegationAmount / 1000000, 6)}
          </small>
        </span>
      </Row>
      <Row>
        <span>
          <strong>Reward Address</strong>
        </span>
        <span>
          <CenteredRow>
            <Link href={`/account/${parameter?.config?.rewardAddress}`}>
              {parameter?.config?.rewardAddress}
            </Link>
            <Copy data={parameter?.config?.rewardAddress} />
          </CenteredRow>
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
          <strong>Type</strong>
        </span>
        <strong>Validator Config</strong>
      </Row>
      <Row>
        <span>
          <strong>Public Key</strong>
        </span>
        <span>{parameter?.blsPublicKey}</span>
      </Row>
      <Row>
        <span>
          <strong>Name</strong>
        </span>
        <span>{parameter?.name}</span>
      </Row>
      <Row>
        <span>
          <strong>Can Delegate</strong>
        </span>
        <span>{parameter?.canDelegate}</span>
      </Row>
      <Row>
        <span>
          <strong>Commission</strong>
        </span>
        <span>{parameter?.commission / 100}%</span>
      </Row>
      <Row>
        <span>
          <strong>Max Delegation</strong>
        </span>
        <span>
          {toLocaleFixed(parameter?.maxDelegationAmount / 1000000, 6)}
        </span>
      </Row>
      <Row>
        <span>
          <strong>Reward Address</strong>
        </span>
        <span>
          <CenteredRow>
            {parameter?.rewardAddress}
            <Copy data={parameter?.rewardAddress} info="address"></Copy>
          </CenteredRow>
        </span>
      </Row>
      <Row>
        <span>
          <strong>Logo</strong>
        </span>
        <span>{parameter?.logo}</span>
      </Row>
      <Row>
        <span>
          <strong>URIs</strong>
        </span>
        <span>{parameter?.uris?.toString()}</span>
      </Row>
    </>
  );
};

export const Freeze: React.FC<IContract> = ({
  parameter: par,
  contractIndex,
  receipts: rec,
}) => {
  const parameter = par as IFreezeContract;
  const receipts = rec as IFreezeReceipt[];

  const [precision, setPrecision] = useState(1);

  useEffect(() => {
    const assetID = parameter?.assetId?.split('/') || [];

    const getAssetPrecision = async () => {
      setPrecision((await getPrecision(assetID?.[0] || 'KLV')) || 1);
    };

    if (assetID.length > 1) {
      return;
    }

    if (assetID.length === 0 || assetID[0] === 'KLV' || assetID[0] === 'KFI') {
      setPrecision(1000000);
      return;
    }

    getAssetPrecision();
  }, []);

  return (
    <>
      <Row>
        <span>
          <strong>Type</strong>
        </span>
        <strong>Freeze</strong>
      </Row>
      <Row>
        <span>
          <strong>Asset Id</strong>
        </span>
        <span>
          <small>{parameter?.assetId || 'KLV'}</small>
        </span>
      </Row>
      <Row>
        <span>
          <strong>Amount</strong>
        </span>
        <span>
          <small>{(parameter.amount / precision).toLocaleString()}</small>
        </span>
      </Row>
      <Row>
        <span>
          <strong>Bucket ID</strong>
        </span>
        <span>
          {contractIndex && findReceipt(receipts, contractIndex, 3, 'bucketId')}
        </span>
      </Row>
    </>
  );
};

export const Unfreeze: React.FC<IContract> = ({
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
          <strong>Type</strong>
        </span>
        <strong>Unfreeze</strong>
      </Row>
      <Row>
        <span>
          <strong>Asset ID</strong>
        </span>
        <span>{parameter?.assetId || 'KLV'}</span>
      </Row>
      <Row>
        <span>
          <strong>Bucket ID</strong>
        </span>
        <span>
          <CenteredRow>
            {parameter?.bucketID}
            <Copy data={parameter?.bucketID} info="Bucket Id"></Copy>
          </CenteredRow>
        </span>
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
          <strong>Type</strong>
        </span>
        <strong>Delegate</strong>
      </Row>
      <Row>
        <span>
          <strong>Bucket ID</strong>
        </span>
        <span>
          <CenteredRow>
            {parameter?.bucketID}
            <Copy data={parameter?.bucketID} info="Bucket Id"></Copy>
          </CenteredRow>
        </span>
      </Row>
      <Row>
        <span>
          <strong>To</strong>
        </span>
        <span>
          <CenteredRow>
            {parameter?.toAddress}
            <Copy data={parameter?.toAddress} info="Address"></Copy>
          </CenteredRow>
        </span>
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
          <strong>Type</strong>
        </span>
        <strong>Undelegate</strong>
      </Row>
      <Row>
        <span>
          <strong>Bucket ID</strong>
        </span>
        <span>
          <CenteredRow>
            {parameter?.bucketID}
            <Copy data={parameter?.bucketID} info="Bucket ID"></Copy>
          </CenteredRow>
        </span>
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
          <strong>Type</strong>
        </span>
        <strong>Withdraw</strong>
      </Row>
      <Row>
        <span>
          <strong>Asset ID</strong>
        </span>
        <span>{parameter?.assetId || 'KLV'}</span>
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
          <strong>Type</strong>
        </span>
        <strong>Claim</strong>
      </Row>
      <Row>
        <span>
          <strong>Claim Type</strong>
        </span>
        <span>{parameter?.claimType}</span>
      </Row>
      {parameter.id && (
        <Row>
          <span>
            <strong>ID</strong>
          </span>
          <span>{parameter?.id}</span>
        </Row>
      )}
    </>
  );
};

export const Unjail: React.FC<IContract> = () => {
  return (
    <>
      <Row>
        <span>
          <strong>Type</strong>
        </span>
        <strong>Unjail</strong>
      </Row>
    </>
  );
};

export const AssetTrigger: React.FC<IContract> = ({ parameter: par }) => {
  const parameter = par as IAssetTriggerContract;
  const [precision, setPrecision] = useState(1);

  useEffect(() => {
    const assetID = parameter?.assetId?.split('/') || [];

    const getAssetPrecision = async () => {
      setPrecision((await getPrecision(assetID?.[0] || 'KLV')) || 1);
    };

    if (assetID.length > 1) {
      return;
    }

    if (assetID.length === 0 || assetID[0] === 'KLV' || assetID[0] === 'KFI') {
      setPrecision(1000000);
      return;
    }

    getAssetPrecision();
  }, []);

  return (
    <>
      <Row>
        <span>
          <strong>Type</strong>
        </span>
        <strong>Asset Trigger</strong>
      </Row>
      <Row>
        <span>
          <strong>Trigger Type</strong>
        </span>
        <span>{parameter?.triggerType}</span>
      </Row>
      <Row>
        <span>
          <strong>Asset ID</strong>
        </span>
        <span>{parameter?.assetId}</span>
      </Row>
      {parameter.amount && (
        <Row>
          <span>
            <strong>Amount</strong>
          </span>
          <span>{(parameter?.amount / precision).toLocaleString()}</span>
        </Row>
      )}
      {parameter.toAddress && (
        <Row>
          <span>
            <strong>To</strong>
          </span>
          <CenteredRow>
            {parameter?.toAddress}
            <Copy data={parameter?.toAddress} info="address"></Copy>
          </CenteredRow>
        </Row>
      )}
      {parameter?.logo && (
        <Row>
          <span>
            <strong>Logo</strong>
          </span>
          <span>{parameter?.logo}</span>
        </Row>
      )}
      {parameter?.mime && (
        <Row>
          <span>
            <strong>MIME</strong>
          </span>
          <span>{parameter?.mime}</span>
        </Row>
      )}
      {parameter?.staking && (
        <Row>
          <span>
            <strong>Staking</strong>
          </span>
          <span>{`Type: ${parameter?.staking?.type}  APR: ${parameter.staking?.apr}`}</span>
        </Row>
      )}
    </>
  );
};

export const SetAccountName: React.FC<IContract> = ({ parameter: par }) => {
  const parameter = par as ISetAccountNameContract;

  return (
    <>
      <Row>
        <span>
          <strong>Type</strong>
        </span>
        <strong>Set Account Name</strong>
      </Row>
      <Row>
        <span>
          <strong>Name</strong>
        </span>
        <span>{parameter?.name}</span>
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
          <strong>Type</strong>
        </span>
        <strong>Proposal</strong>
      </Row>
      <Row>
        <span>
          <strong>Epoch Duration</strong>
        </span>
        <span>{parameter?.epochsDuration}</span>
      </Row>
      <Row>
        <span>
          <strong>Description</strong>
        </span>
        <span>{parameter?.description}</span>
      </Row>
      <Row>
        <span>
          <strong>Parameters</strong>
        </span>
        <span>{parameter?.parameters?.toString()}</span>
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
          <strong>Type</strong>
        </span>
        <strong>Vote</strong>
      </Row>
      <Row>
        <span>
          <strong>Proposal Id</strong>
        </span>
        <span>{parameter?.proposalId}</span>
      </Row>
      <Row>
        <span>
          <strong>Amount</strong>
        </span>
        <span>{(parameter.amount / 1000000).toLocaleString()}</span>
      </Row>
    </>
  );
};

export const ConfigITO: React.FC<IContract> = ({ parameter: par }) => {
  const parameter = par as IConfigITOContract;
  const [precision, setPrecision] = useState(1);

  useEffect(() => {
    const assetID = parameter?.assetId?.split('/') || [];

    const getAssetPrecision = async () => {
      setPrecision((await getPrecision(assetID?.[0] || 'KLV')) || 1);
    };

    if (assetID.length > 1) {
      return;
    }

    if (assetID.length === 0 || assetID[0] === 'KLV' || assetID[0] === 'KFI') {
      setPrecision(1000000);
      return;
    }

    getAssetPrecision();
  }, []);

  return (
    <>
      <Row>
        <span>
          <strong>Type</strong>
        </span>
        <strong>Config ITO</strong>
      </Row>
      <Row>
        <span>
          <strong>Receiver</strong>
        </span>
        <span>{parameter?.receiverAddress}</span>
      </Row>
      <Row>
        <span>
          <strong>Asset Id</strong>
        </span>
        <span>{parameter?.assetId}</span>
      </Row>
      <Row>
        <span>
          <strong>Status</strong>
        </span>
        <span>{parameter?.status}</span>
      </Row>
      {parameter?.maxAmount && (
        <Row>
          <span>
            <strong>Max Amount</strong>
          </span>
          <span>{(parameter?.maxAmount / precision).toLocaleString()}</span>
        </Row>
      )}
    </>
  );
};

export const SetITOPrices: React.FC<IContract> = ({ parameter: par }) => {
  const parameter = par as ISetITOPricesContract;
  return (
    <>
      <Row>
        <span>
          <strong>Type</strong>
        </span>
        <strong>Set ITO Prices</strong>
      </Row>
      <Row>
        <span>
          <strong>Asset Id</strong>
        </span>
        <span>{parameter?.assetId}</span>
      </Row>
    </>
  );
};

export const Buy: React.FC<IContract> = ({ parameter: par }) => {
  const parameter = par as IBuyContract;
  const [precision, setPrecision] = useState(1);

  useEffect(() => {
    const getAssetPrecision = async () => {
      setPrecision((await getPrecision(parameter?.currencyID || 'KLV')) || 1);
    };

    if (parameter?.currencyID === 'KLV' || parameter?.currencyID === 'KFI') {
      setPrecision(1000000);
      return;
    }

    getAssetPrecision();
  }, []);

  return (
    <>
      <Row>
        <span>
          <strong>Type</strong>
        </span>
        <strong>Buy</strong>
      </Row>
      <Row>
        <span>
          <strong>Buy Type</strong>
        </span>
        <span>{parameter?.buyType}</span>
      </Row>
      <Row>
        <span>
          <strong>Id</strong>
        </span>
        <span>{parameter?.id}</span>
      </Row>
      <Row>
        <span>
          <strong>Currency Id</strong>
        </span>
        <span>{parameter?.currencyID}</span>
      </Row>
      <Row>
        <span>
          <strong>Amount</strong>
        </span>
        <span>{(parameter.amount / precision).toLocaleString()}</span>
      </Row>
    </>
  );
};

export const Sell: React.FC<IContract> = ({ parameter: par }) => {
  const parameter = par as ISellContract;

  const [precision, setPrecision] = useState(1);

  useEffect(() => {
    const getAssetPrecision = async () => {
      setPrecision((await getPrecision(parameter?.currencyID || 'KLV')) || 1);
    };

    if (parameter?.currencyID === 'KLV' || parameter?.currencyID === 'KFI') {
      setPrecision(1000000);
      return;
    }

    getAssetPrecision();
  }, []);

  return (
    <>
      <Row>
        <span>
          <strong>Type</strong>
        </span>
        <strong>Sell</strong>
      </Row>
      <Row>
        <span>
          <strong>Market Type</strong>
        </span>
        <span>{parameter?.marketType}</span>
      </Row>
      <Row>
        <span>
          <strong>Marketplace Id</strong>
        </span>
        <span>{parameter?.marketplaceID}</span>
      </Row>
      <Row>
        <span>
          <strong>Asset Id</strong>
        </span>
        <span>{parameter?.assetId}</span>
      </Row>{' '}
      <Row>
        <span>
          <strong>Currency Id</strong>
        </span>
        <span>{parameter?.currencyID}</span>
      </Row>
      <Row>
        <span>
          <strong>Price</strong>
        </span>
        <span>{(parameter?.price / precision).toLocaleString()}</span>
      </Row>{' '}
      <Row>
        <span>
          <strong>Reserve Price</strong>
        </span>
        <span>{(parameter?.reservePrice / precision).toLocaleString()}</span>
      </Row>
      <Row>
        <span>
          <strong>End Time</strong>
        </span>
        <span>{parameter?.endTime}</span>
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
          <strong>Type</strong>
        </span>
        <strong>Cancel Market Order</strong>
      </Row>
      <Row>
        <span>
          <strong>Order Id</strong>
        </span>
        <span>{parameter?.orderID}</span>
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
          <strong>Type</strong>
        </span>
        <strong>Create Marketplace</strong>
      </Row>
      <Row>
        <span>
          <strong>Name</strong>
        </span>
        <span>{parameter?.name}</span>
      </Row>
      <Row>
        <span>
          <strong>Referral Address</strong>
        </span>
        <span>{parameter?.referralAddress}</span>
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
          <strong>Type</strong>
        </span>
        <strong>Config Marketplace</strong>
      </Row>
      <Row>
        <span>
          <strong>Name</strong>
        </span>
        <span>{parameter?.name}</span>
      </Row>
      <Row>
        <span>
          <strong>Marketplace Id</strong>
        </span>
        <span>{parameter?.marketplaceID}</span>
      </Row>
      <Row>
        <span>
          <strong>Referral Address</strong>
        </span>
        <span>{parameter?.referralAddress}</span>
      </Row>
      <Row>
        <span>
          <strong>Referral Percent</strong>
        </span>
        <span>{parameter?.referralPercentage / 100}%</span>
      </Row>
    </>
  );
};
