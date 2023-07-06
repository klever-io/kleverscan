import { KLV } from '@/assets/coins';
import { statusWithIcon } from '@/assets/status';
import Copy from '@/components/Copy';
import { FrozenContainer, Row, RowContent } from '@/styles/common';
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
  IPackInfo,
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
  IClaimReceipt,
  ICreateAssetReceipt,
  ICreateMarketplaceReceipt,
  IDelegateReceipt,
  IFreezeReceipt,
  IProposalReceipt,
  IReceipt,
  ISellReceipt,
  IUnfreezeReceipt,
  IWithdrawReceipt,
} from '@/types/index';
import { IKAppTransferReceipt, ITransferReceipt } from '@/types/receipts';
import {
  findReceipt,
  findReceiptWithReceiver,
  findReceiptWithSender,
} from '@/utils/findKey';
import { formatDate, toLocaleFixed } from '@/utils/formatFunctions';
import {
  PacksPrecision,
  usePackInfoPrecisions,
  usePrecision,
} from '@/utils/hooks';
import { getProposalNetworkParams } from '@/utils/networkFunctions';
import {
  calculatePermissionOperations,
  renderCorrectPath,
} from '@/utils/validateSender';
import { BalanceContainer } from '@/views/accounts/detail';
import { ExpandWrapper } from '@/views/assets/detail';
import { BigSpan, NetworkParamsContainer } from '@/views/proposals/detail';
import {
  ButtonExpand,
  CenteredDiv,
  CenteredRow,
  ExpandRow,
  HeaderSpan,
  HeaderWrapper,
  HoverAnchor,
  Hr,
  NestedContainerWrapper,
  NonceGrid,
  NonceSpan,
  Panel,
  PropertiesWrapper,
  RoleDiv,
  RoleStrong,
  RoleWrapper,
  RoyaltiesChangeWrapper,
  StatusIconWrapper,
  StrongWidth,
  URIsWrapper,
} from '@/views/transactions/detail';
import Link from 'next/link';
import React, { useState } from 'react';
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
          <strong>Asset Id</strong>
        </span>
        <span>{parameter?.assetId || 'KLV'}</span>
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
            <Link href={`/asset/${parameter?.assetId?.split('/')[0]}`}>
              <div style={{ fontWeight: '500' }}>
                {parameter?.assetId?.split('/')[0]}
              </div>
            </Link>
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
      {parameter?.kdaRoyalties && (
        <>
          <Row>
            <span>
              <strong>KDA Royalties</strong>
            </span>
            <span>
              {toLocaleFixed(
                parameter.kdaRoyalties / 10 ** precision,
                precision,
              )}{' '}
              {parameter?.assetId}
            </span>
          </Row>
          <Row>
            <span>
              <strong>Total paid</strong>
            </span>
            <CenteredRow>
              <strong style={{ fontWeight: '600' }}>
                {toLocaleFixed(
                  (parameter.amount + parameter.kdaRoyalties) / 10 ** precision,
                  precision,
                )}{' '}
                {parameter?.assetId}
              </strong>
            </CenteredRow>
          </Row>
        </>
      )}
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
  filteredReceipts: rec,
  contractIndex,
}) => {
  const parameter = par as ICreateAssetContract;
  const filteredReceipts = rec as ICreateAssetReceipt[];
  const ownerAddress = parameter?.ownerAddress || sender;
  const createAssetReceipt = findReceipt(filteredReceipts, 1) as
    | ICreateAssetReceipt
    | undefined;

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
            <Panel>
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
            </Panel>
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
            <Panel>
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
            </Panel>
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
            <Panel>
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
            </Panel>
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
          <Panel>
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
          </Panel>
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
  filteredReceipts: rec,
}) => {
  const parameter = par as IFreezeContract;
  const filteredReceipts = rec as IFreezeReceipt[];
  const assetID = parameter?.assetId?.split('/')[0] || 'KLV';
  const precision = usePrecision(assetID);
  const freezeReceipt = findReceipt(filteredReceipts, 3) as
    | IFreezeReceipt
    | undefined;

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
  filteredReceipts: rec,
}) => {
  const parameter = par as IUnfreezeContract;
  const filteredReceipts = rec as IUnfreezeReceipt[];
  const claimReceipt = findReceipt(filteredReceipts, 17) as
    | IClaimReceipt
    | undefined;
  const claimPrecision = claimReceipt?.assetIdReceived || 'KLV';
  const assetIdPrecision = parameter?.assetId || 'KLV';
  const precision = usePrecision([claimPrecision, assetIdPrecision]);
  const unfreezeReceipt = findReceipt(filteredReceipts, 4) as
    | IUnfreezeReceipt
    | undefined;
  const undelegateReceipt = findReceipt(filteredReceipts, 7);

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
              Number(unfreezeReceipt?.value || 0) /
                10 ** precision[assetIdPrecision],
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
  filteredReceipts,
}) => {
  const parameter = par as IDelegateContract;
  const delegateReceipt = findReceipt(filteredReceipts, 7) as
    | IDelegateReceipt
    | undefined;
  const claimReceipt = findReceipt(filteredReceipts, 17) as
    | IClaimReceipt
    | undefined;
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
                {toLocaleFixed(
                  Number(delegateReceipt?.amountDelegated || 0) / 10 ** 6,
                  6,
                )}
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
  filteredReceipts,
  contractIndex,
}) => {
  const parameter = par as IUndelegateContract;
  const undelegateReceipt = findReceipt(filteredReceipts, 7) as
    | IDelegateReceipt
    | undefined;
  // undelegate receipt is the delegate receipt
  const claimReceipt = findReceipt(filteredReceipts, 17) as
    | IClaimReceipt
    | undefined;
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
            {toLocaleFixed(
              Number(undelegateReceipt?.amountDelegated || 0) / 10 ** 6,
              6,
            )}
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
  filteredReceipts,
}) => {
  const parameter = par as IWithdrawContract;

  const claimReceipt = findReceipt(filteredReceipts, 17) as
    | IClaimReceipt
    | undefined;
  const assetIdPrecision = parameter?.assetId || 'KLV';
  const claimPrecision = claimReceipt?.assetIdReceived || 'KLV';
  const precision = usePrecision([assetIdPrecision, claimPrecision]);
  const withdrawReceipt = findReceipt(filteredReceipts, 18) as IWithdrawReceipt;

  return (
    <>
      <Row>
        <span>
          <strong>Type</strong>
        </span>
        <strong>Withdraw</strong>
      </Row>
      {filteredReceipts?.length === 0 && (
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
              Number(withdrawReceipt?.amount || 0) /
                10 ** precision[assetIdPrecision],
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
  filteredReceipts,
}) => {
  const parameter = par as IClaimContract;
  const claimReceipt = findReceipt(filteredReceipts, 17) as
    | IClaimReceipt
    | undefined;
  const precision = usePrecision(claimReceipt?.assetIdReceived || 'KLV');

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
  filteredReceipts,
}) => {
  const parameter = par as IProposalContract;
  const parameters = getProposalNetworkParams(parameter?.parameters);

  const proposalReceipt = findReceipt(filteredReceipts, 5) as
    | IProposalReceipt
    | undefined;
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
  const assetId = parameter?.assetId?.split('/')[0] || 'KLV';
  const precision = usePrecision(assetId);
  const [packsPrecision] = usePackInfoPrecisions(
    parameter?.packInfo ? parameter.packInfo : [],
  );

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

      {parameter.packInfo &&
        renderPackInfoComponents(
          parameter,
          precision,
          packsPrecision,
          renderPackPrecision,
        )}
    </>
  );
};

export const SetITOPrices: React.FC<IIndexedContract> = ({
  parameter: par,
}) => {
  const parameter = par as ISetITOPricesContract;
  const assetId = parameter?.assetId?.split('/')[0] || 'KLV';
  const precision = usePrecision(assetId);
  const [packsPrecision] = usePackInfoPrecisions(
    parameter?.packInfo ? parameter.packInfo : [],
  );

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
        <span>{assetId}</span>
      </Row>
      {parameter.packInfo &&
        renderPackInfoComponents(
          parameter,
          precision,
          packsPrecision,
          renderPackPrecision,
        )}
    </>
  );
};

export const Buy: React.FC<IContractBuyProps> = ({
  parameter: par,
  filteredReceipts: rec,
  sender,
}) => {
  const parameter = par as IBuyContractPayload;
  const filteredReceipts = rec as IBuyReceipt[];
  const buyType = parameter?.buyType;
  let currencyId = '';
  let assetId = '';
  const senderKAppTransferReceipt = findReceiptWithSender(
    filteredReceipts,
    14,
    sender,
  ) as IKAppTransferReceipt | undefined;

  const receiver = sender; // sender of tx can be the receiver of an asset
  const receiverKAppTransferReceipt = findReceiptWithReceiver(
    filteredReceipts,
    14,
    receiver,
  ) as IKAppTransferReceipt | undefined;

  const initializeVariables = () => {
    switch (buyType) {
      case 'MarketBuy':
        currencyId = parameter?.currencyID || 'KLV';
        assetId = receiverKAppTransferReceipt?.assetId || '';
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
  const getPrecisionsToSearch = filteredReceipts
    .map(receipt => receipt.assetId)
    .filter(precision => precision !== undefined);
  const precisions = usePrecision(getPrecisionsToSearch);

  const renderMarketBuy = () => {
    const buyReceipt = findReceipt(filteredReceipts, 16) as
      | IBuyReceipt
      | undefined;

    const getStatus = () => {
      const executed = buyReceipt?.executed;
      if (typeof executed === 'boolean') {
        if (executed) {
          return 'Completed';
        } else {
          return 'Pending';
        }
      } else if (!executed && senderKAppTransferReceipt) {
        return 'Completed';
      }
      return null;
    };

    const getPrice = () => {
      const price = parameter?.amount;
      if (typeof price === 'number') {
        return toLocaleFixed(
          price / 10 ** (precisions[currencyId] || 0),
          precisions[currencyId] || 0,
        );
      }
      return null;
    };

    const getAmount = () => {
      const amount = receiverKAppTransferReceipt?.value;
      if (typeof amount === 'number') {
        return toLocaleFixed(
          amount / 10 ** (precisions[assetId] || 0),
          precisions[assetId] || 0,
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
          {assetId && (
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
    const transferReceipt = findReceipt(filteredReceipts, 0) as
      | ITransferReceipt
      | undefined; // there is no formal buy receipt in ITOBuy, but the data we want(price) is in the first transfer receipt, so the function will still work

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

    const getNFTNonces = () => {
      return filteredReceipts.filter((receipt: IReceipt) => {
        const possibleTransferReceipt = receipt as ITransferReceipt;
        const assetAndNonce = possibleTransferReceipt?.assetId?.split('/');
        if (
          assetAndNonce &&
          assetAndNonce[0] === parameter.id &&
          assetAndNonce[1] &&
          possibleTransferReceipt.to === sender
        ) {
          return assetAndNonce[1];
        }
      });
    };

    const renderNFTNonces = () => {
      if (noncesReceipts.length) {
        return (
          <NonceGrid>
            {noncesReceipts.map(nonceReceipt => {
              const nonce = nonceReceipt.assetId.split('/')[1];
              return <NonceSpan key={nonce}>{nonce}</NonceSpan>;
            })}
          </NonceGrid>
        );
      }
      return null;
    };

    const price = getPrice();
    const amount = getAmount();
    const noncesReceipts = getNFTNonces();

    return (
      <>
        {price && (
          <Row>
            <span>
              <strong>Price</strong>
            </span>
            <CenteredDiv>
              <span>
                {price} {currencyId}
              </span>
              <Tooltip
                msg={
                  'There might be royalties fees in the total paid price.\n To know exactly how much you are being charged check your assets royalties info in assets page.'
                }
              />
            </CenteredDiv>
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
        {!!noncesReceipts.length && (
          <Row>
            <span>
              <strong>NFTs Nonces</strong>
            </span>
            {renderNFTNonces()}
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
  filteredReceipts,
}) => {
  const parameter = par as ISellContract;
  const precision = usePrecision(parameter?.currencyID || 'KLV');
  const kAppTransferReceipt = findReceipt(filteredReceipts, 14) as
    | IKAppTransferReceipt
    | undefined;
  const sellReceipt = findReceipt(filteredReceipts, 15) as
    | ISellReceipt
    | undefined;
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
      {kAppTransferReceipt && (
        <Row>
          <span>
            <strong>Amount</strong>
          </span>
          <span>{kAppTransferReceipt?.value}</span>
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
            {toLocaleFixed(parameter.price / 10 ** (precision || 0), precision)}{' '}
            {parameter?.currencyID}
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
  filteredReceipts,
}) => {
  const parameter = par as ICancelMarketOrderContract;
  const kAppTransferReceipt = findReceipt(
    filteredReceipts,
    14,
  ) as IKAppTransferReceipt;
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
      {kAppTransferReceipt && (
        <>
          <Row>
            <span>
              <strong>Marketplace Id</strong>
            </span>
            <span>{kAppTransferReceipt?.marketplaceId}</span>
          </Row>
          <Row>
            <span>
              <strong>Asset Id</strong>
            </span>
            <span>{kAppTransferReceipt?.assetId}</span>
          </Row>
          <Row>
            <span>
              <strong>Amount</strong>
            </span>
            <span>{kAppTransferReceipt?.value}</span>
          </Row>
        </>
      )}
    </>
  );
};

export const CreateMarketplace: React.FC<IIndexedContract> = ({
  parameter: par,
  filteredReceipts,
}) => {
  const parameter = par as ICreateMarketplaceContract;
  const createMarketplaceReceipt = findReceipt(
    filteredReceipts,
    10,
  ) as ICreateMarketplaceReceipt;
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
  const precision = usePrecision(parameter?.assetId || 'KLV');
  const whitelistInfo = parameter?.whitelistInfo || [];
  const [packsPrecision] = usePackInfoPrecisions(
    parameter?.packInfo ? parameter.packInfo : [],
  );

  const renderPackPrecision = (
    price: number,
    assetId: string,
    packsPrecision: PacksPrecision,
  ): string => {
    const assetPrecision = packsPrecision[assetId] || 0;
    return toLocaleFixed(price / 10 ** assetPrecision, assetPrecision) || '--';
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
        if (parameter?.packInfo) {
          return renderPackInfoComponents(
            parameter,
            precision,
            packsPrecision,
            renderPackPrecision,
          );
        }
        return null;
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
        <span>{parameter?.assetId}</span>
      </Row>
      {renderTriggerTypeData()}
    </>
  );
};

const renderPackPrecision = (
  price: number,
  assetId: string,
  packsPrecision: PacksPrecision,
): string => {
  const assetPrecision = packsPrecision[assetId] || 0;
  return toLocaleFixed(price / 10 ** assetPrecision, assetPrecision) || '--';
};

const renderPackInfo = (
  packInfo: IPackInfo[],
  precision: number,
  packsPrecision: PacksPrecision,
  renderPackPrecision: (
    price: number,
    assetId: string,
    packsPrecision: PacksPrecision,
  ) => string,
): JSX.Element[] => {
  return packInfo.map((pack: IPackInfo, index: number) => {
    return (
      <HeaderWrapper key={pack.key}>
        <HeaderSpan>
          <strong>
            Pack Info
            <br />
          </strong>
          <strong>{`(${pack.key})`}</strong>
        </HeaderSpan>
        <RowContent>
          <BalanceContainer>
            <FrozenContainer>
              <section key={pack.key}>
                <div>
                  <strong>KDA</strong>
                  <span>{pack.key}</span>
                </div>
                <Hr />
                {pack.packs.map((pack2, index2: number) => (
                  <section key={index2}>
                    <div>
                      <strong>Amount</strong>
                      <span>
                        {toLocaleFixed(
                          pack2.amount / 10 ** precision,
                          precision,
                        )}
                      </span>
                    </div>
                    <div>
                      <strong>Price</strong>
                      <span>
                        {renderPackPrecision(
                          pack2.price,
                          pack.key,
                          packsPrecision,
                        )}{' '}
                        {pack.key}
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
    );
  });
};

type ContractWithPackInfo =
  | ISetITOPricesContract
  | IITOTriggerContract
  | IConfigITOContract;

const renderPackInfoComponents = (
  parameter: ContractWithPackInfo,
  precision: number,
  packsPrecision: PacksPrecision,
  renderPackPrecision: (
    price: number,
    assetId: string,
    packsPrecision: PacksPrecision,
  ) => string,
): JSX.Element => {
  return (
    <Row>
      <NestedContainerWrapper>
        {renderPackInfo(
          parameter.packInfo,
          precision,
          packsPrecision,
          renderPackPrecision,
        )}
      </NestedContainerWrapper>
    </Row>
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
