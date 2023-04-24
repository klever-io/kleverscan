import { KLV } from '@/assets/coins';
import { statusWithIcon } from '@/assets/status';
import Copy from '@/components/Copy';
import {
  EnumTriggerTypeName,
  IAssetTriggerContract,
  IBuyContractPayload,
  ICancelMarketOrderContract,
  IClaimContract,
  IConfigITOContract,
  IConfigMarketplaceContract,
  IContractBuyProps,
  ICreateAssetContract,
  ICreateMarketplaceContract,
  ICreateValidatorContract,
  IDelegateContract,
  IDepositContract,
  IFreezeContract,
  IIndexedContract,
  IITOTriggerContract,
  IParameter,
  IProposalContract,
  ISellContract,
  ISetAccountNameContract,
  ISetITOPricesContract,
  ITOTriggerType,
  ITransferContract,
  IUndelegateContract,
  IUnfreezeContract,
  IUpdateAccountPermissionContract,
  IURIs,
  IValidatorConfigContract,
  IVoteContract,
  IWithdrawContract,
} from '@/types/contracts';
import {
  IBuyReceipt,
  ICreateAssetReceipt,
  IFreezeReceipt,
  IUnfreezeReceipt,
} from '@/types/index';
import { IKAppTransferReceipt } from '@/types/receipts';
import {
  findNextSiblingReceipt,
  findPreviousSiblingReceipt,
  findReceipt,
} from '@/utils/findKey';
import { formatDate, toLocaleFixed } from '@/utils/formatFunctions';
import { usePrecision } from '@/utils/hooks';
import { getProposalNetworkParams } from '@/utils/networkFunctions';
import { getPrecision } from '@/utils/precisionFunctions';
import {
  calculatePermissionOperations,
  receiverIsSender,
  renderCorrectPath,
} from '@/utils/validateSender';
import {
  BalanceContainer,
  FrozenContainer,
  RowContent,
} from '@/views/accounts/detail';
import { ExpandWrapper } from '@/views/assets/detail';
import { BigSpan, NetworkParamsContainer } from '@/views/proposals/detail';
import {
  ButtonExpand,
  CenteredRow,
  ExpandRow,
  HeaderWrapper,
  HoverAnchor,
  Hr,
  NestedContainerWrapper,
  PropertiesWrapper,
  RoleDiv,
  RoleStrong,
  RoleWrapper,
  Row,
  RoyaltiesChangeWrapper,
  StatusIconWrapper,
  StrongWidth,
  URIsWrapper,
} from '@/views/transactions/detail';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Tooltip from '../Tooltip';

export const Transfer: React.FC<IIndexedContract> = ({ parameter: par }) => {
  const parameter = par as ITransferContract;
  const assetID = parameter?.assetId?.split('/')[0] || 'KLV';
  const precision = usePrecision(assetID);

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
          <strong>
            {parameter.amount
              ? toLocaleFixed(parameter?.amount / 10 ** precision, precision)
              : '--'}
          </strong>
          {parameter?.assetId?.split('/')[0] &&
          parameter?.assetId?.split('/')[0] !== 'KLV' ? (
            <>
              <Link href={`/asset/${parameter?.assetId?.split('/')[0]}`}>
                {parameter?.assetId?.split('/')[0]}
              </Link>
            </>
          ) : (
            parameter?.amount && (
              <>
                <Link href={`/asset/KLV`}>
                  <KLV />
                </Link>
                <Link href={`/asset/KLV`}>KLV</Link>
              </>
            )
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

export const CreateAsset: React.FC<IIndexedContract> = ({
  sender,
  parameter: par,
  receipts: rec,
  contractIndex,
}) => {
  const parameter = par as ICreateAssetContract;
  const receipts = rec as ICreateAssetReceipt[];
  const ownerAddress = parameter?.ownerAddress || sender;
  const createAssetReceipt = findReceipt(receipts, contractIndex, 1);

  interface Active {
    parameter: string;
  }
  const [expand, setExpand] = useState({
    royalties: false,
    staking: false,
    properties: false,
    attributes: false,
  });

  return (
    <>
      <Row>
        <span>
          <strong>Type</strong>
        </span>
        <strong>Create Asset</strong>
      </Row>
      {createAssetReceipt && (
        <Row>
          <span>
            <strong>Asset ID</strong>
          </span>
          <Link href={`/asset/${createAssetReceipt?.assetId}`}>
            {createAssetReceipt?.assetId}
          </Link>
        </Row>
      )}
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
          <CenteredRow>
            <Link href={`/account/${ownerAddress}`}>{ownerAddress}</Link>
            <Copy data={ownerAddress} />
          </CenteredRow>
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
        <ExpandRow expandVar={expand.royalties}>
          <ExpandWrapper expandVar={expand.royalties}>
            <span style={{ minWidth: '10rem' }}>
              <strong>Royalties</strong>
            </span>
            <span>
              <ButtonExpand
                onClick={() =>
                  setExpand({
                    ...expand,
                    royalties: !expand.royalties,
                  })
                }
              >
                {expand?.royalties ? 'Hide' : 'Expand'}
              </ButtonExpand>
            </span>
          </ExpandWrapper>
          {expand?.royalties && (
            <span className="panel">
              <CenteredRow>
                <strong>Address:&nbsp;</strong>
                <Link href={`/account/${parameter.royalties?.address}`}>
                  {parameter.royalties?.address}
                </Link>
                <Copy data={parameter.royalties?.address}></Copy>
              </CenteredRow>
              {parameter.royalties?.transferFixed && (
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
        </ExpandRow>
      )}
      {parameter.staking && (
        <ExpandRow expandVar={expand.staking}>
          <ExpandWrapper expandVar={expand.staking}>
            <span style={{ minWidth: '10rem' }}>
              <strong>Staking</strong>
            </span>
            <span>
              <ButtonExpand
                onClick={() =>
                  setExpand({
                    ...expand,
                    staking: !expand.staking,
                  })
                }
              >
                {expand?.staking ? 'Hide' : 'Expand'}
              </ButtonExpand>
            </span>
          </ExpandWrapper>

          {expand?.staking && (
            <span className="panel">
              <span>
                <strong>Type:&nbsp;</strong>
                {parameter?.staking?.type}
              </span>
              <span>
                <strong>APR:&nbsp;</strong>
                {parameter?.staking?.apr / 100 || 0}%
              </span>
              <span>
                <strong>Claim Type&nbsp;</strong>
                {parameter?.staking?.minEpochsToClaim || 0} Epoch(s)
              </span>{' '}
              <span>
                <strong>Unstake Time:&nbsp;</strong>
                {parameter?.staking?.minEpochsToUnstake || 0} Epoch(s)
              </span>{' '}
              <span>
                <strong>Withdraw Time:&nbsp;</strong>
                {parameter?.staking?.minEpochsToWithdraw || 0} Epoch(s)
              </span>
            </span>
          )}
        </ExpandRow>
      )}

      {parameter.properties && (
        <ExpandRow expandVar={expand.properties}>
          <ExpandWrapper expandVar={expand.properties}>
            <span style={{ minWidth: '10rem' }}>
              <strong>Properties</strong>
            </span>
            <span>
              <ButtonExpand
                onClick={() =>
                  setExpand({
                    ...expand,
                    properties: !expand.properties,
                  })
                }
              >
                {expand?.properties ? 'Hide' : 'Expand'}
              </ButtonExpand>
            </span>
          </ExpandWrapper>
          {expand?.properties && (
            <span className="panel">
              <PropertiesWrapper>
                <div>
                  <StatusIconWrapper>
                    <strong>Can Freeze:&nbsp;</strong>
                    <span>
                      {statusWithIcon(
                        parameter?.properties?.canFreeze ? true : false,
                      )}
                    </span>
                  </StatusIconWrapper>
                  <StatusIconWrapper>
                    <strong>Can Mint:&nbsp;</strong>
                    <span>
                      {statusWithIcon(
                        parameter?.properties?.canMint ? true : false,
                      )}
                    </span>
                  </StatusIconWrapper>
                  <StatusIconWrapper>
                    <strong>Can Burn:&nbsp;</strong>
                    <span>
                      {statusWithIcon(
                        parameter?.properties?.canBurn ? true : false,
                      )}
                    </span>
                  </StatusIconWrapper>
                  <StatusIconWrapper>
                    <strong>Can Pause:&nbsp;</strong>
                    <span>
                      {statusWithIcon(
                        parameter?.properties?.canPause ? true : false,
                      )}
                    </span>
                  </StatusIconWrapper>
                </div>
                <div>
                  <StatusIconWrapper>
                    <strong>Can Wipe:&nbsp;</strong>
                    <span>
                      {statusWithIcon(
                        parameter?.properties?.canWipe ? true : false,
                      )}
                    </span>
                  </StatusIconWrapper>
                  <StatusIconWrapper>
                    <strong>Change Owner:&nbsp;</strong>
                    {statusWithIcon(
                      parameter?.properties?.canChangeOwner ? true : false,
                    )}
                  </StatusIconWrapper>
                  <StatusIconWrapper>
                    <strong>Add Roles:&nbsp;</strong>
                    {statusWithIcon(
                      parameter?.properties?.canAddRoles ? true : false,
                    )}
                  </StatusIconWrapper>
                </div>
              </PropertiesWrapper>
            </span>
          )}
        </ExpandRow>
      )}

      <ExpandRow expandVar={expand.attributes}>
        <ExpandWrapper expandVar={expand.attributes}>
          <span style={{ minWidth: '10rem' }}>
            <strong>Attributes</strong>
          </span>
          <span>
            <ButtonExpand
              onClick={() =>
                setExpand({
                  ...expand,
                  attributes: !expand.attributes,
                })
              }
            >
              {expand?.attributes ? 'Hide' : 'Expand'}
            </ButtonExpand>
          </span>
        </ExpandWrapper>

        {expand?.attributes && (
          <span className="panel">
            <StatusIconWrapper>
              <strong>Is Paused:&nbsp;</strong>
              <span>
                {statusWithIcon(parameter?.attributes?.isPaused ? true : false)}
              </span>
            </StatusIconWrapper>
            <StatusIconWrapper>
              <strong>Can Mint NFT:&nbsp;</strong>
              <span>
                {statusWithIcon(
                  parameter?.attributes?.isNFTMintStopped ? true : false,
                )}
              </span>
            </StatusIconWrapper>
            <StatusIconWrapper>
              <RoyaltiesChangeWrapper>
                <strong>Royalties</strong>
                <strong>Change Stopped:</strong>
              </RoyaltiesChangeWrapper>
              <span>
                {statusWithIcon(
                  parameter?.attributes?.isRoyaltiesChangeStopped
                    ? true
                    : false,
                )}
              </span>
            </StatusIconWrapper>
          </span>
        )}
      </ExpandRow>
    </>
  );
};

export const CreateValidator: React.FC<IIndexedContract> = ({
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
          <strong>Commission</strong>
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

export const ValidatorConfig: React.FC<IIndexedContract> = ({
  parameter: par,
}) => {
  const param = par as unknown as IValidatorConfigContract;
  const parameter = param.config;
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
          <strong>BLS Public Key</strong>
        </span>
        <CenteredRow>
          <span>{parameter?.blsPublicKey}</span>
          <Copy data={parameter?.blsPublicKey} info="public key"></Copy>
        </CenteredRow>
      </Row>
      <Row>
        <span>
          <strong>Name</strong>
        </span>
        <span>{parameter?.name}</span>
      </Row>
      {typeof parameter?.canDelegate === 'boolean' && (
        <Row>
          <span>
            <strong>Can Delegate</strong>
          </span>
          <span>{parameter?.canDelegate ? 'True' : 'False'}</span>{' '}
        </Row>
      )}
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
            <span>{parameter?.rewardAddress}</span>
            <Copy data={parameter?.rewardAddress} info="address"></Copy>
          </CenteredRow>
        </span>
      </Row>
      <Row>
        <span>
          <strong>Logo</strong>
        </span>
        <span>
          <a href={renderCorrectPath(parameter?.logo)}>{parameter?.logo}</a>
        </span>
      </Row>
      <Row>
        <span>
          <strong>URIs</strong>
        </span>
        <RowContent>
          <BalanceContainer>
            <FrozenContainer>
              {parameter.uris?.map(
                ({ key, value }: { key: string; value: string }) => (
                  <div key={key}>
                    <span>
                      <strong>{key}</strong>
                    </span>
                    <span>
                      <a
                        href={renderCorrectPath(value)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {value}
                      </a>
                    </span>
                  </div>
                ),
              )}
            </FrozenContainer>
          </BalanceContainer>
        </RowContent>
      </Row>
    </>
  );
};

export const Freeze: React.FC<IIndexedContract> = ({
  parameter: par,
  contractIndex,
  receipts: rec,
}) => {
  const parameter = par as IFreezeContract;
  const receipts = rec as IFreezeReceipt[];
  const assetID = parameter?.assetId?.split('/')[0] || 'KLV';
  const precision = usePrecision(assetID);
  const freezeReceipt = findReceipt(receipts, contractIndex, 3);

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
          <small>
            {toLocaleFixed(parameter.amount / 10 ** precision, precision)}
          </small>
        </span>
      </Row>
      {freezeReceipt && (
        <Row>
          <span>
            <strong>Bucket Id</strong>
          </span>
          <span>{freezeReceipt?.bucketId}</span>
        </Row>
      )}
    </>
  );
};

export const Unfreeze: React.FC<IIndexedContract> = ({
  parameter: par,
  contractIndex,
  receipts: rec,
}) => {
  const parameter = par as IUnfreezeContract;
  const receipts = rec as IUnfreezeReceipt[];
  const claimReceipt = findNextSiblingReceipt(receipts, contractIndex, 4, 17);
  const claimPrecision = claimReceipt?.assetIdReceived || 'KLV';
  const assetIdPrecision = parameter?.assetId || 'KLV';
  const precision = usePrecision([claimPrecision, assetIdPrecision]);
  const unfreezeReceipt = findReceipt(receipts, contractIndex, 4);

  const undelegateReceipt = findPreviousSiblingReceipt(
    receipts,
    contractIndex,
    4,
    7,
  );

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
          <strong>Asset Id</strong>
        </span>
        <span>{parameter?.assetId || 'KLV'}</span>
      </Row>
      <Row>
        <span>
          <strong>Bucket Id</strong>
        </span>
        <span>
          <CenteredRow>
            <span>{parameter?.bucketID}</span>
            <Copy data={parameter?.bucketID} info="Bucket Id"></Copy>
          </CenteredRow>
        </span>
      </Row>
      {unfreezeReceipt && (
        <Row>
          <span>
            <strong>Available Epoch</strong>
          </span>
          <span>{unfreezeReceipt?.availableEpoch}</span>
        </Row>
      )}
      {unfreezeReceipt && (
        <Row>
          <span>
            <strong>Amount</strong>
          </span>
          <span>
            {toLocaleFixed(
              unfreezeReceipt?.value / 10 ** precision[assetIdPrecision],
              precision[assetIdPrecision],
            )}
          </span>
        </Row>
      )}
      {claimReceipt && (
        <Row>
          <span>
            <strong>Claimed Rewards</strong>
          </span>
          <span>
            {claimReceipt.amount / 10 ** precision[claimPrecision]}{' '}
            {claimReceipt.assetIdReceived}
          </span>
        </Row>
      )}
      <Row>
        <span>
          <strong>Undelegated?</strong>
        </span>
        <span>{undelegateReceipt ? 'True' : 'False'}</span>
      </Row>
    </>
  );
};
export const Delegate: React.FC<IIndexedContract> = ({
  parameter: par,
  receipts,
  contractIndex,
}) => {
  const parameter = par as IDelegateContract;
  const delegateReceipt = findReceipt(receipts, contractIndex, 7);
  const claimReceipt = findPreviousSiblingReceipt(
    receipts,
    contractIndex,
    7,
    17,
  );
  const claimPrecision = usePrecision(
    (claimReceipt?.assetIdReceived || 'KLV') as string,
  );

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
            <span>{parameter?.bucketID}</span>
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
            <span>{parameter?.toAddress}</span>
            <Copy data={parameter?.toAddress} info="Address"></Copy>
          </CenteredRow>
        </span>
      </Row>
      {delegateReceipt && (
        <Row>
          <span>
            <strong>Amount Delegated</strong>
          </span>
          <span>
            <CenteredRow>
              <span>
                {toLocaleFixed(delegateReceipt?.amountDelegated / 10 ** 6, 6)}
              </span>
            </CenteredRow>
          </span>
        </Row>
      )}
      {claimReceipt && (
        <Row>
          <span>
            <strong>Rewards Claimed</strong>
          </span>
          <span>
            <CenteredRow>
              <span>
                {toLocaleFixed(
                  claimReceipt.amount / 10 ** claimPrecision,
                  claimPrecision,
                )}{' '}
                {claimReceipt.assetIdReceived}
              </span>
              <Tooltip msg="Delegation generates an unfreeze contract, which will trigger the freeze contract rewards, if there are any." />
            </CenteredRow>
          </span>
        </Row>
      )}
    </>
  );
};

export const Undelegate: React.FC<IIndexedContract> = ({
  parameter: par,
  receipts,
  contractIndex,
}) => {
  const parameter = par as IUndelegateContract;
  const undelegateReceipt = findReceipt(receipts, contractIndex, 7);
  const claimReceipt = findPreviousSiblingReceipt(
    receipts,
    contractIndex,
    7,
    17,
  );
  const claimPrecision = usePrecision(
    (claimReceipt?.assetIdReceived || 'KLV') as string,
  );

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
            <span>{parameter?.bucketID}</span>
            <Copy data={parameter?.bucketID} info="Bucket ID"></Copy>
          </CenteredRow>
        </span>
      </Row>
      {undelegateReceipt && (
        <Row>
          <span>
            <strong>Amount</strong>
          </span>
          <span>
            {toLocaleFixed(undelegateReceipt?.amountDelegated / 10 ** 6, 6)}
          </span>
        </Row>
      )}
      {claimReceipt && (
        <Row>
          <span>
            <strong>Rewards Claimed</strong>
          </span>
          <span>
            <CenteredRow>
              <span>
                {toLocaleFixed(
                  claimReceipt.amount / 10 ** claimPrecision,
                  claimPrecision,
                )}{' '}
                {claimReceipt.assetIdReceived}
              </span>
            </CenteredRow>
          </span>
        </Row>
      )}
    </>
  );
};

export const Withdraw: React.FC<IIndexedContract> = ({
  parameter: par,
  receipts,
  contractIndex,
}) => {
  const parameter = par as IWithdrawContract;

  const claimReceipt = findPreviousSiblingReceipt(
    receipts,
    contractIndex,
    18,
    17,
  );
  const assetIdPrecision = parameter?.assetId || 'KLV';
  const claimPrecision = claimReceipt?.assetIdReceived || 'KLV';
  const precision = usePrecision([assetIdPrecision, claimPrecision]);
  const withdrawReceipt = findReceipt(receipts, contractIndex, 18);

  return (
    <>
      <Row>
        <span>
          <strong>Type</strong>
        </span>
        <strong>Withdraw</strong>
      </Row>
      {receipts?.length === 0 && (
        <Row>
          <span>
            <strong>Asset Id</strong>
          </span>
          <span>{parameter?.assetId}</span>
        </Row>
      )}
      {withdrawReceipt && (
        <Row>
          <span>
            <strong>Amount</strong>
          </span>
          <span>
            {toLocaleFixed(
              withdrawReceipt?.amount / 10 ** precision[assetIdPrecision],
              precision[assetIdPrecision],
            )}{' '}
            {withdrawReceipt?.assetId}
          </span>
        </Row>
      )}
      {claimReceipt && (
        <Row>
          <span>
            <strong>Rewards Claimed</strong>
          </span>
          <span>
            <CenteredRow>
              <span>
                {toLocaleFixed(
                  claimReceipt.amount / 10 ** precision[claimPrecision],
                  precision[claimPrecision],
                )}{' '}
                {claimReceipt.assetIdReceived}
              </span>
            </CenteredRow>
          </span>
        </Row>
      )}
    </>
  );
};

export const Claim: React.FC<IIndexedContract> = ({
  parameter: par,
  receipts,
}) => {
  const parameter = par as IClaimContract;
  const claimReceipt = findReceipt(receipts, 0, 17);
  const precision = usePrecision(
    (claimReceipt?.assetIdReceived || 'KLV') as string,
  );

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
      {claimReceipt && (
        <Row>
          <span>
            <strong>Asset Id</strong>
          </span>
          <span>{claimReceipt?.assetId}</span>
        </Row>
      )}
      {claimReceipt && typeof claimReceipt?.amount === 'number' && (
        <Row>
          <span>
            <strong>Amount</strong>
          </span>
          <span>
            {toLocaleFixed(claimReceipt?.amount / 10 ** precision, precision)}{' '}
            {claimReceipt?.assetIdReceived}
          </span>
        </Row>
      )}
    </>
  );
};

export const Unjail: React.FC<IIndexedContract> = () => {
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

export const AssetTrigger: React.FC<IIndexedContract> = ({
  parameter: par,
}) => {
  const parameter = par as IAssetTriggerContract;
  const assetID = parameter?.assetId?.split('/')[0] || 'KLV';
  const precision = usePrecision(assetID);

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
      {renderAssetTriggerTypeData(parameter, precision)}
    </>
  );
};

export const SetAccountName: React.FC<IIndexedContract> = ({
  parameter: par,
}) => {
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

export const Proposal: React.FC<IIndexedContract> = ({
  parameter: par,
  receipts,
  contractIndex,
}) => {
  const parameter = par as IProposalContract;
  const parameters = getProposalNetworkParams(parameter?.parameters);

  const proposalReceipt = findReceipt(receipts, contractIndex, 5);
  return (
    <>
      <Row>
        <span>
          <strong>Type</strong>
        </span>
        <strong>Proposal</strong>
      </Row>
      {proposalReceipt && (
        <Row>
          <span>
            <strong>Proposal Id</strong>
          </span>
          <span>{proposalReceipt?.proposalId}</span>
        </Row>
      )}
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
        <BigSpan>{parameter?.description}</BigSpan>
      </Row>
      <Row>
        <span>
          <strong>Parameters</strong>
        </span>
        <RowContent>
          <BalanceContainer>
            <NetworkParamsContainer>
              {parameters.map(param => (
                <div key={param.paramIndex}>
                  <strong>{param.paramText}</strong>
                  <span>{param.paramValue}</span>
                </div>
              ))}
            </NetworkParamsContainer>
          </BalanceContainer>
        </RowContent>
      </Row>
    </>
  );
};

export const Vote: React.FC<IIndexedContract> = ({ parameter: par }) => {
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
      <Row>
        <span>
          <strong>Vote</strong>
        </span>
        <span>{parameter?.type}</span>
      </Row>
    </>
  );
};

export const ConfigITO: React.FC<IIndexedContract> = ({ parameter: par }) => {
  const parameter = par as IConfigITOContract;
  const assetID = parameter?.assetId?.split('/')[0] || 'KLV';
  const precision = usePrecision(assetID);

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
        <CenteredRow>
          <Link href={`/account/${parameter?.receiverAddress}`}>
            <a>{parameter?.receiverAddress}</a>
          </Link>
          <Copy data={parameter?.receiverAddress} info="Bucket ID"></Copy>
        </CenteredRow>
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
          <span>
            {toLocaleFixed(parameter?.maxAmount / 10 ** precision, precision)}
          </span>
        </Row>
      )}
    </>
  );
};

export const SetITOPrices: React.FC<IIndexedContract> = ({
  parameter: par,
}) => {
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

export const Buy: React.FC<IContractBuyProps> = ({
  parameter: par,
  receipts: rec,
  contracts,
  sender,
  contractIndex,
}) => {
  const parameter = par as IBuyContractPayload;
  const receipts = rec as IBuyReceipt[];
  const buyType = parameter?.buyType;
  let currencyId = '';
  let assetId = '';
  let nextKappTransferReceipt: undefined | IKAppTransferReceipt;
  let previousKappTransferReceipt: undefined | IKAppTransferReceipt;

  const initializeVariables = () => {
    switch (buyType) {
      case 'MarketBuy':
        nextKappTransferReceipt = findNextSiblingReceipt(
          receipts,
          contractIndex,
          16, // buy receipt
          14, // kapp transfer receipt
          [sender],
          receiverIsSender,
        );
        // there won't be nextKappTransferREceipt if the buy bid is not instant buy, hence if must collect data from the previousKappTransferReceipt(which will be the receipt with correct data, but we will not find the asset the bid was offered)
        previousKappTransferReceipt = findPreviousSiblingReceipt(
          receipts,
          contractIndex,
          16,
          14,
        );
        currencyId = parameter?.currencyID || 'KLV';
        assetId =
          nextKappTransferReceipt?.assetId ||
          previousKappTransferReceipt?.assetId ||
          '';
        break;
      case 'ITOBuy':
        currencyId = parameter?.currencyID || 'KLV';
        assetId = parameter?.id || '';
        break;
      default:
        break;
    }
  };
  initializeVariables();
  const precisions = usePrecision([assetId, currencyId]);

  const renderMarketBuy = () => {
    const buyReceipt = findReceipt(receipts, contractIndex, 16);

    const getStatus = () => {
      const executed = buyReceipt?.executed;
      if (typeof executed === 'boolean') {
        if (executed) {
          return 'Completed';
        } else {
          return 'Pending';
        }
      } else if (!executed && nextKappTransferReceipt) {
        return 'Completed';
      }
      return null;
    };

    const getPrice = () => {
      const price = parameter?.amount;
      if (typeof price === 'number') {
        return toLocaleFixed(
          price / 10 ** precisions[currencyId],
          precisions[currencyId],
        );
      }
      return null;
    };

    const getAmount = () => {
      const amount = nextKappTransferReceipt?.value;
      if (typeof amount === 'number') {
        return toLocaleFixed(
          amount / 10 ** precisions[assetId],
          precisions[assetId],
        );
      }
      return null;
    };

    const status = getStatus();
    const price = getPrice();
    const amount = getAmount();

    const orderId = parameter?.id;
    const marketplaceId = buyReceipt?.marketplaceId;

    return (
      <>
        {status && (
          <Row>
            <span>
              <strong>Status</strong>
            </span>
            <span>{status}</span>
          </Row>
        )}
        {price && (
          <Row>
            <span>
              <strong>Price</strong>
            </span>
            <span>
              {price} {currencyId}
            </span>
          </Row>
        )}
        {amount && (
          <Row>
            <span>
              <strong>Amount</strong>
            </span>
            <span>
              {amount} {assetId}
            </span>
          </Row>
        )}
        <Row>
          <span>
            <strong>Currency Id</strong>
          </span>
          <span>{currencyId}</span>
        </Row>
        <>
          {assetId && nextKappTransferReceipt && (
            <Row>
              <span>
                <strong>Asset Id</strong>
              </span>
              <span>{assetId}</span>
            </Row>
          )}
          {orderId && (
            <Row>
              <span>
                <strong>Order Id</strong>
              </span>
              <span>{orderId}</span>
            </Row>
          )}
          {marketplaceId && (
            <Row>
              <span>
                <strong>Marketplace Id</strong>
              </span>
              <span>{marketplaceId}</span>
            </Row>
          )}
        </>
      </>
    );
  };

  const renderITOBuy = () => {
    const transferReceipt = findPreviousSiblingReceipt(
      receipts,
      contractIndex,
      2,
      0,
    ); // there is no formal buy receipt in ITOBuy, but the data we want is in the 0(transfer) receipt

    const getPrice = () => {
      const price = transferReceipt?.value;
      if (typeof price === 'number') {
        return toLocaleFixed(
          price / 10 ** precisions[currencyId],
          precisions[currencyId],
        );
      }
      return null;
    };

    const getAmount = () => {
      const amount = parameter?.amount;
      if (typeof amount === 'number') {
        return toLocaleFixed(
          amount / 10 ** precisions[assetId],
          precisions[assetId],
        );
      }
      return null;
    };
    const price = getPrice();
    const amount = getAmount();

    return (
      <>
        {price && (
          <Row>
            <span>
              <strong>Price</strong>
            </span>
            <span>
              {price} {currencyId}
            </span>
          </Row>
        )}
        {amount && (
          <Row>
            <span>
              <strong>Amount</strong>
            </span>
            <span>
              {amount} {assetId}
            </span>
          </Row>
        )}
        <Row>
          <span>
            <strong>Currency Id</strong>
          </span>
          <span>{currencyId}</span>
        </Row>
        {assetId && (
          <Row>
            <span>
              <strong>Asset Id</strong>
            </span>
            <span>{assetId}</span>
          </Row>
        )}
      </>
    );
  };

  const renderBuyTypeData = () => {
    switch (buyType) {
      case 'MarketBuy':
        return renderMarketBuy();
      case 'ITOBuy':
        return renderITOBuy();
      default:
        return null;
    }
  };

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
        <span>{buyType}</span>
      </Row>
      {renderBuyTypeData()}
    </>
  );
};

export const Sell: React.FC<IIndexedContract> = ({
  parameter: par,
  receipts,
  contractIndex,
}) => {
  const parameter = par as ISellContract;
  const precision = usePrecision(parameter?.currencyID || 'KLV');
  const kappTransferReceipt = findPreviousSiblingReceipt(
    receipts,
    contractIndex,
    15,
    14,
  );
  const sellReceipt = findReceipt(receipts, contractIndex, 15);
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
      {sellReceipt && (
        <Row>
          <span>
            <strong>Order Id</strong>
          </span>
          <span>{sellReceipt?.orderId}</span>
        </Row>
      )}
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
      </Row>
      {kappTransferReceipt && (
        <Row>
          <span>
            <strong>Amount</strong>
          </span>
          <span>{kappTransferReceipt?.value}</span>
        </Row>
      )}
      <Row>
        <span>
          <strong>Currency Id</strong>
        </span>
        <span>{parameter?.currencyID}</span>
      </Row>
      {parameter?.price && (
        <Row>
          <span>
            <strong>Price</strong>
          </span>
          <span>
            {toLocaleFixed(parameter.price / 10 ** (precision || 0), precision)}
          </span>
        </Row>
      )}
      {parameter?.reservePrice && (
        <Row>
          <span>
            <strong>Reserve Price</strong>
          </span>
          <span>
            {toLocaleFixed(
              parameter?.reservePrice / 10 ** precision,
              precision,
            )}
          </span>
        </Row>
      )}
      <Row>
        <span>
          <strong>End Time</strong>
        </span>
        <span>
          {parameter?.endTime ? formatDate(parameter?.endTime * 1000) : '--'}
        </span>
      </Row>
    </>
  );
};

export const CancelMarketOrder: React.FC<IIndexedContract> = ({
  parameter: par,
  receipts,
  contractIndex,
}) => {
  const parameter = par as ICancelMarketOrderContract;
  const cancelMarketOrderReceipt = findReceipt(receipts, contractIndex, 14);
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
      {cancelMarketOrderReceipt && (
        <>
          <Row>
            <span>
              <strong>Marketplace Id</strong>
            </span>
            <span>{cancelMarketOrderReceipt?.marketplaceId}</span>
          </Row>
          <Row>
            <span>
              <strong>Asset Id</strong>
            </span>
            <span>{cancelMarketOrderReceipt?.assetId}</span>
          </Row>
          <Row>
            <span>
              <strong>Amount</strong>
            </span>
            <span>{cancelMarketOrderReceipt?.value}</span>
          </Row>
        </>
      )}
    </>
  );
};

export const CreateMarketplace: React.FC<IIndexedContract> = ({
  parameter: par,
  receipts,
  contractIndex,
}) => {
  const parameter = par as ICreateMarketplaceContract;
  const createMarketplaceReceipt = findReceipt(receipts, contractIndex, 10);
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
      {createMarketplaceReceipt && (
        <Row>
          <span>
            <strong>Marketplace Id</strong>
          </span>
          <span>{createMarketplaceReceipt?.marketplaceId}</span>
        </Row>
      )}
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
        <span>
          {parameter?.referralPercentage
            ? `${parameter.referralPercentage / 100} %`
            : '--'}
        </span>
      </Row>
    </>
  );
};

export const ConfigMarketplace: React.FC<IIndexedContract> = ({
  parameter: par,
}) => {
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
        <span>
          {parameter?.referralPercentage
            ? `${parameter.referralPercentage / 100} %`
            : '--'}
        </span>
      </Row>
    </>
  );
};

export const UpdateAccountPermission: React.FC<IIndexedContract> = ({
  parameter: par,
}) => {
  const parameter = par as IUpdateAccountPermissionContract;
  const permission = parameter?.permissions[0];
  const operations = calculatePermissionOperations(permission?.operations);
  const signers = permission?.signers || [];
  return (
    <>
      <Row>
        <span>
          <strong>Type</strong>
        </span>
        <strong>Update Account Permission</strong>
      </Row>
      <Row>
        <span>
          <strong>Permission Name</strong>
        </span>
        <span>{permission?.permissionName ?? ''}</span>
      </Row>
      <Row>
        <span>
          <strong>Permission Type</strong>
        </span>
        <span>{permission?.type ?? ''}</span>
      </Row>
      <Row>
        <span>
          <strong>Threshold</strong>
        </span>
        <span>{permission?.threshold ?? ''}</span>
      </Row>
      <Row>
        <span>
          <strong>Operations</strong>
        </span>
        <RowContent>
          <BalanceContainer>
            <FrozenContainer>
              {operations.map(operation => (
                <div key={operation}>{operation}</div>
              ))}
            </FrozenContainer>
          </BalanceContainer>
        </RowContent>
      </Row>
      <Row>
        <span>
          <strong>Signers</strong>
        </span>
        <RowContent>
          <BalanceContainer>
            <FrozenContainer>
              {signers.map((signer, index) => (
                <div
                  style={{ flexDirection: 'column', alignItems: 'start' }}
                  key={index}
                >
                  <span style={{ maxWidth: '100%' }}>
                    <a href={`/account/${signer?.address}`}>
                      <strong>{signer.address ?? ''}</strong>
                    </a>
                  </span>
                  <span>
                    {' '}
                    Weight:
                    <strong style={{ color: 'white' }}>
                      {' '}
                      {signer.weight ?? ''}
                    </strong>
                  </span>
                </div>
              ))}
            </FrozenContainer>
          </BalanceContainer>
        </RowContent>
      </Row>
    </>
  );
};

export const Deposit: React.FC<IIndexedContract> = ({ parameter: par }) => {
  const parameter = par as IDepositContract;
  const precision = usePrecision(parameter?.currencyID || 'KLV');

  return (
    <>
      <Row>
        <span>
          <strong>Type</strong>
        </span>
        <strong>Deposit</strong>
      </Row>
      <Row>
        <span>
          <strong>Deposit Type</strong>
        </span>
        <span>{parameter?.depositTypeString}</span>
      </Row>
      <Row>
        <span>
          <strong>Id</strong>
        </span>
        <span>{parameter?.id}</span>
      </Row>
      <Row>
        <span>
          <strong>Amount</strong>
        </span>
        <span>{parameter?.amount / 10 ** precision}</span>
      </Row>
      <Row>
        <span>
          <strong>Currency Id</strong>
        </span>
        <span>{parameter?.currencyID}</span>
      </Row>
    </>
  );
};

export const ITOTrigger: React.FC<IIndexedContract> = ({ parameter: par }) => {
  const parameter = par as IITOTriggerContract;

  const packInfo = parameter?.packInfo || [];
  const whitelistInfo = parameter?.whitelistInfo || [];

  const getInitialPacksPrecisions = () => {
    const initialPacksPrecisions = [];
    for (let index = 0; index < packInfo.length; index++) {
      initialPacksPrecisions.push({ value: 0 });
    }
    return initialPacksPrecisions;
  };

  const precision = usePrecision(parameter?.assetID || 'KLV');
  type PacksPrecision =
    | PromiseSettledResult<number | undefined>[]
    | { value: number }[];

  const [packsPrecision, setPacksPrecision] = useState<PacksPrecision>(
    getInitialPacksPrecisions(),
  );

  useEffect(() => {
    const getPacksPrecision = async () => {
      const promises = packInfo.map(pack => {
        return getPrecision([pack.key]);
      });
      const result: any = await Promise.allSettled(promises);
      setPacksPrecision(result);
    };
    getPacksPrecision();
  }, []);

  const renderPackPrecision = (price: number, index: number) => {
    try {
      const promiseResult = packsPrecision[
        index
      ] as PromiseSettledResult<number>;
      if (promiseResult.status === 'fulfilled') {
        return price / 10 ** (promiseResult?.value || 0);
      }
    } catch (error) {
      return '';
    }
  };

  const renderMaxAmount = () => {
    if (typeof parameter?.maxAmount === 'number') {
      return parameter.maxAmount / 10 ** precision;
    }
    return '';
  };

  const renderWhiteListInfo = () => {
    return (
      <Row>
        <span>
          <strong>White List Info</strong>
        </span>
        <RowContent>
          <BalanceContainer>
            <FrozenContainer>
              {whitelistInfo.map((info, index) => (
                <section key={info.address}>
                  <div key={info.address}>
                    <strong>Address</strong>
                    <span>{info.address}</span>
                  </div>
                  <div>
                    <strong>Limit</strong>
                    <span>{info.limit}</span>
                  </div>
                  {index < whitelistInfo.length - 1 && <Hr />}
                </section>
              ))}
            </FrozenContainer>
          </BalanceContainer>
        </RowContent>
      </Row>
    );
  };

  const renderTriggerTypeData = () => {
    const triggerType = parameter?.triggerType;

    switch (triggerType) {
      case ITOTriggerType.SetITOPrices:
        return (
          <Row>
            <NestedContainerWrapper>
              {packInfo.map((pack, index) => (
                <HeaderWrapper key={index}>
                  <span>
                    <strong>Pack Info</strong>
                  </span>
                  <RowContent>
                    <BalanceContainer>
                      <FrozenContainer>
                        <section key={index}>
                          <div>
                            <strong>KDA</strong>
                            <span>{pack.key}</span>
                          </div>
                          <Hr />
                          {pack.packs.map((pack2, index2) => (
                            <section key={index2}>
                              <div>
                                <strong>Amount</strong>
                                <span>{pack2.amount / 10 ** precision}</span>
                              </div>
                              <div>
                                <strong>Price</strong>
                                <span>
                                  {renderPackPrecision(pack2.price, index)}
                                </span>
                              </div>
                              {index2 < pack.packs.length - 1 && <Hr />}
                            </section>
                          ))}
                        </section>
                      </FrozenContainer>
                    </BalanceContainer>
                  </RowContent>
                </HeaderWrapper>
              ))}
            </NestedContainerWrapper>
          </Row>
        );
      case ITOTriggerType.UpdateStatus:
        return (
          <Row>
            <span>
              <strong>Status</strong>
            </span>
            <span>{parameter?.status}</span>
          </Row>
        );
      case ITOTriggerType.UpdateReceiverAddress:
        return (
          <Row>
            <span>
              <strong>Receiver Address</strong>
            </span>
            <CenteredRow>
              <Link href={`/account/${parameter?.receiverAddress}`}>
                {parameter?.receiverAddress}
              </Link>
              <Copy data={parameter?.receiverAddress} info="Bucket ID"></Copy>
            </CenteredRow>
          </Row>
        );
      case ITOTriggerType.UpdateMaxAmount:
        return (
          <Row>
            <span>
              <strong>Max Amount</strong>
            </span>
            <span>{renderMaxAmount()}</span>
          </Row>
        );
      case ITOTriggerType.UpdateDefaultLimitPerAddress:
        return (
          <Row>
            <span>
              <strong>
                Default Limit
                <br />
                per Address
              </strong>
            </span>
            <span>{parameter?.defaultLimitPerAddress}</span>
          </Row>
        );
      case ITOTriggerType.UpdateTimes:
        return (
          <>
            <Row>
              <span>
                <strong>Start Time</strong>
              </span>
              <span>{parameter?.startTime}</span>
            </Row>
            <Row>
              <span>
                <strong>End time</strong>
              </span>
              <span>{parameter?.endTime}</span>
            </Row>
          </>
        );
      case ITOTriggerType.UpdateWhitelistStatus:
        return (
          <Row>
            <span>
              <strong>White List Status</strong>
            </span>
            <span>{parameter?.whitelistStatus}</span>
          </Row>
        );
      case ITOTriggerType.AddToWhitelist:
        return renderWhiteListInfo();
      case ITOTriggerType.RemoveFromWhitelist:
        return renderWhiteListInfo();
      case ITOTriggerType.UpdateWhitelistTimes:
        return (
          <>
            <Row>
              <span>
                <strong>
                  White List
                  <br />
                  Start Time
                </strong>
              </span>
              <span>{parameter?.whitelistStartTime}</span>
            </Row>
            <Row>
              <span>
                <strong>
                  White List
                  <br />
                  End Time
                </strong>
              </span>
              <span>{parameter?.whitelistEndTime}</span>
            </Row>
          </>
        );
      default:
        break;
    }
  };

  return (
    <>
      <Row>
        <span>
          <strong>Type</strong>
        </span>
        <strong>ITO Trigger</strong>
      </Row>
      <Row>
        <span>
          <strong>Trigger Type</strong>
        </span>
        <strong>{parameter?.triggerType}</strong>
      </Row>
      <Row>
        <span>
          <strong>Asset Id</strong>
        </span>
        <span>{parameter?.assetID}</span>
      </Row>
      {renderTriggerTypeData()}
    </>
  );
};

const renderAssetTriggerTypeData: React.FC<IAssetTriggerContract> = (
  parameter: IParameter,
  precision: number,
): any => {
  const par = parameter as IAssetTriggerContract;
  const triggerType = par?.triggerType;

  const toAddressReturn = () => (
    <Row>
      <span>
        <strong>To</strong>
      </span>
      <CenteredRow>
        <span>{par?.toAddress}</span>
        <Copy data={par?.toAddress} info="address"></Copy>
      </CenteredRow>
    </Row>
  );

  const amountReturn = () => (
    <Row>
      <span>
        <strong>Amount</strong>
      </span>
      <span>{toLocaleFixed(par?.amount / 10 ** precision, precision)}</span>
    </Row>
  );

  const roleReturn = () => (
    <Row>
      <span>
        <strong>Role</strong>
      </span>
      <RowContent>
        <BalanceContainer>
          <FrozenContainer>
            <RoleWrapper>
              <RoleDiv>
                <RoleStrong>Address</RoleStrong>
                <span style={{ marginRight: '0.5rem' }}>
                  {par.role.address}
                </span>
                <Copy data={par.role.address} />
              </RoleDiv>

              <RoleDiv>
                <RoleStrong>HasRoleMint</RoleStrong>
                <span>{String(par.role.hasRoleMint)}</span>
              </RoleDiv>
              <RoleDiv>
                <RoleStrong>HasRoleSetITOPrices</RoleStrong>
                <span>{String(par.role.hasRoleSetITOPrices)}</span>
              </RoleDiv>
            </RoleWrapper>
          </FrozenContainer>
        </BalanceContainer>
      </RowContent>
    </Row>
  );

  const mimeReturn = () => (
    <Row>
      <span>
        <strong>MIME</strong>
      </span>
      <span>{par?.mime}</span>
    </Row>
  );

  const logoReturn = () => (
    <Row>
      <span>
        <strong>Logo</strong>
      </span>
      <HoverAnchor href={renderCorrectPath(par.logo)}>{par.logo}</HoverAnchor>
    </Row>
  );

  const URIsReturn = () => (
    <Row>
      <span>
        <strong>URIs</strong>
      </span>
      <RowContent>
        <BalanceContainer>
          <FrozenContainer>
            {par?.uris?.map((uri: IURIs, index: number) => (
              <URIsWrapper key={index}>
                <section>
                  <span>{uri.key}</span>
                </section>
                <section>
                  <HoverAnchor href={renderCorrectPath(uri.value)}>
                    {uri.value}
                  </HoverAnchor>
                </section>
              </URIsWrapper>
            ))}
          </FrozenContainer>
        </BalanceContainer>
      </RowContent>
    </Row>
  );

  const updateStakingReturn = () => (
    <Row>
      <span>
        <strong>Staking</strong>
      </span>
      <RowContent>
        <BalanceContainer>
          <FrozenContainer>
            <URIsWrapper>
              <section>
                <StrongWidth>APR</StrongWidth>
                <span>{par.staking?.apr}</span>
              </section>
              <section>
                <StrongWidth>min Epochs To Claim</StrongWidth>
                <span>{par.staking?.minEpochsToClaim}</span>
              </section>
              <section>
                <StrongWidth>min Epochs To Unstake</StrongWidth>
                <span>{par.staking?.minEpochsToUnstake}</span>
              </section>
              <section>
                <StrongWidth>min Epochs To Withdraw</StrongWidth>
                <span>{par.staking?.minEpochsToWithdraw}</span>
              </section>
              <section>
                <StrongWidth>Type</StrongWidth>
                <span>{par.staking?.type}</span>
              </section>
            </URIsWrapper>
          </FrozenContainer>
        </BalanceContainer>
      </RowContent>
    </Row>
  );

  switch (triggerType) {
    case EnumTriggerTypeName.Mint:
      return (
        <>
          {toAddressReturn()}
          {amountReturn()}
        </>
      );
    case EnumTriggerTypeName.Burn:
      return amountReturn();
    case EnumTriggerTypeName.Wipe:
      return (
        <>
          {toAddressReturn()}
          {amountReturn()}
        </>
      );
    case EnumTriggerTypeName.Pause:
      return null;
    case EnumTriggerTypeName.Resume:
      return null;
    case EnumTriggerTypeName.ChangeOwner:
      return toAddressReturn();
    case EnumTriggerTypeName.AddRole:
      return roleReturn();
    case EnumTriggerTypeName.RemoveRole:
      return toAddressReturn();
    case EnumTriggerTypeName.UpdateMetadata:
      return mimeReturn();
    case EnumTriggerTypeName.StopNFTMint:
      return null;
    case EnumTriggerTypeName.UpdateLogo:
      return logoReturn();
    case EnumTriggerTypeName.UpdateURIs:
      return URIsReturn();
    case EnumTriggerTypeName.ChangeRoyaltiesReceiver:
      return toAddressReturn();
    case EnumTriggerTypeName.UpdateStaking:
      return updateStakingReturn();
    case EnumTriggerTypeName.UpdateRoyalties:
      return null;
    case EnumTriggerTypeName.UpdateKDAFeePool:
      return null;
    case EnumTriggerTypeName.StopRoyaltiesChange:
      return null;
    default:
      return null;
  }
};
