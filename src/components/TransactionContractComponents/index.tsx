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
  extractValuesFromReceipts,
  findAllReceiptsWithSender,
  findNFTReceipt,
  findReceipt,
  findReceiptWithAssetId,
  findReceiptWithSender,
} from '@/utils/findKey';
import { formatDate, toLocaleFixed } from '@/utils/formatFunctions';
import { KLV_PRECISION } from '@/utils/globalVariables';
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
  RoyaltiesTransferPercentage,
  StatusIconWrapper,
  StrongWidth,
  URIsWrapper,
} from '@/views/transactions/detail';
import { TFunction, useTranslation } from 'next-i18next';
import Link from 'next/link';
import React, { useState } from 'react';
import Tooltip from '../Tooltip';

type RenderAssetTriggerTypeDataProps = {
  parameter: IAssetTriggerContract;
  precision: number;
  t: TFunction;
};

const getNFTNonces = (
  filteredReceipts: IBuyReceipt[],
  parameter: any,
  sender: string,
) => {
  return filteredReceipts.filter((receipt: IReceipt) => {
    const possibleTransferReceipt = receipt as ITransferReceipt;
    const assetAndNonce = possibleTransferReceipt?.assetId?.split('/');
    if (assetAndNonce && assetAndNonce.length >= 2) {
      if (
        assetAndNonce[0] === parameter.id ||
        (parameter.assetId && possibleTransferReceipt.to === sender)
      ) {
        return assetAndNonce[1];
      }
    } else {
      return null;
    }
  });
};

const renderNFTNonces = (noncesReceipts: IBuyReceipt[]) => {
  if (noncesReceipts.length) {
    return (
      <NonceGrid>
        {noncesReceipts.map((nonceReceipt: { assetId: string }) => {
          const nonce = nonceReceipt.assetId.split('/')[1];
          return <NonceSpan key={nonce}>{nonce}</NonceSpan>;
        })}
      </NonceGrid>
    );
  }
  return null;
};

export const Transfer: React.FC<IIndexedContract> = ({
  parameter: par,
  filteredReceipts: rec,
  renderMetadata,
}) => {
  const { t } = useTranslation('transactions');
  const parameter = par as ITransferContract;
  const assetID = parameter?.assetId?.split('/')[0] || 'KLV';
  const precision = usePrecision(assetID);
  const filteredReceipts = rec as ITransferReceipt[];

  const hasTransferPercentageRoyalties = parameter?.kdaRoyalties;
  const getTransferPercentageRoyalties = () => parameter?.kdaRoyalties || 0;

  const hasTransferFixedRoyalties = parameter?.assetId?.split('/')[1];
  const getTransferFixedRoyaltiesReceipt = () => {
    if (hasTransferFixedRoyalties) {
      return findReceiptWithAssetId(filteredReceipts, 0, 'KLV');
    }
  };

  const getCorrectKDARoyalty = () => {
    if (hasTransferPercentageRoyalties) {
      return (
        <Row>
          <span>
            <strong>{t('Transfer.Transfer')}</strong>
            <br />
            <strong>{t('Transfer.Percentage')}</strong>
            <br />
            <strong>{t('Royalties')}</strong>
          </span>
          <span>
            {toLocaleFixed(
              getTransferPercentageRoyalties() / 10 ** precision,
              precision,
            )}{' '}
            {parameter?.assetId}{' '}
            <Tooltip
              msg={`Charged a percentage amount from the sender\n when ${parameter?.assetId} is transferred to another account.`}
            />
          </span>
        </Row>
      );
    }
    if (hasTransferFixedRoyalties) {
      const transferFixedRoyalties = getTransferFixedRoyaltiesReceipt() as
        | ITransferReceipt
        | undefined;
      if (transferFixedRoyalties) {
        return (
          <Row>
            <span>
              <strong> {t('Transfer.Transfer Fixed')}</strong>
              <br />
              <strong>{t('Royalties')}</strong>
            </span>
            <span>
              {toLocaleFixed(
                transferFixedRoyalties.value / 10 ** KLV_PRECISION,
                KLV_PRECISION,
              )}{' '}
              {'KLV'}
              &nbsp;
              <Tooltip
                msg={`Charged from the sender a fixed amount of KLV\n  every time someone transfers ${
                  parameter?.assetId?.split('/')[0]
                } from one account to another.`}
              />
            </span>
          </Row>
        );
      }
    }
  };

  return (
    <>
      <Row>
        <span>
          <strong>{t('Type')}</strong>
        </span>
        <strong>{t('Transfer.Transfer')}</strong>
      </Row>
      <Row>
        <span>
          <strong>{t('AssetId')}</strong>
        </span>
        <span>{parameter?.assetId || 'KLV'}</span>
      </Row>
      <Row>
        <span>
          <strong>{t('Amount')}</strong>
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
      <Row>
        <span>
          <strong>{t('To')}</strong>
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
      {getCorrectKDARoyalty()}
      {hasTransferPercentageRoyalties && (
        <Row>
          <span>
            <strong>{t('Transfer.Total paid')}</strong>
          </span>
          <CenteredRow>
            <strong style={{ fontWeight: '600' }}>
              {toLocaleFixed(
                (parameter.amount + getTransferPercentageRoyalties()) /
                  10 ** precision,
                precision,
              )}{' '}
              {parameter?.assetId}
            </strong>
          </CenteredRow>
        </Row>
      )}
      {renderMetadata()}
    </>
  );
};

export const CreateAsset: React.FC<IIndexedContract> = ({
  sender,
  parameter: par,
  filteredReceipts: rec,
  contractIndex,
  renderMetadata,
}) => {
  const { t } = useTranslation('transactions');
  const { t: commonT } = useTranslation('common');
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
          <strong>{t('Type')}</strong>
        </span>
        <strong>{t('CreateAsset.Create Asset')}</strong>
      </Row>
      {createAssetReceipt && (
        <Row>
          <span>
            <strong>{t('AssetId')}</strong>
          </span>
          <Link href={`/asset/${createAssetReceipt?.assetId}`}>
            {createAssetReceipt?.assetId}
          </Link>
        </Row>
      )}
      <Row>
        <span>
          <strong>{t('CreateAsset.Name')}</strong>
        </span>
        <span>{parameter.name}</span>
      </Row>
      <Row>
        <span>
          <strong>{t('CreateAsset.Owner')}</strong>
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
          <strong>{t('CreateAsset.Ticker')}</strong>
        </span>
        <span>{parameter.ticker}</span>
      </Row>
      <Row>
        <span>
          <strong>{t('Precision')}</strong>
        </span>
        <span>
          <p>{parameter.precision}</p>
        </span>
      </Row>
      <Row>
        <span>
          <strong>{t('CreateAsset.Initial Supply')}</strong>
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
          <strong>{t('CreateAsset.Max Supply')}</strong>
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
              <strong>{t('Royalties')}</strong>
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
                {expand?.royalties
                  ? `${commonT('Buttons.Hide')}`
                  : `${commonT('Buttons.Expand')}`}
              </ButtonExpand>
            </span>
          </ExpandWrapper>
          {expand?.royalties && (
            <Panel>
              <CenteredRow>
                <strong>{t('Address')}:&nbsp;</strong>
                <Link href={`/account/${parameter.royalties?.address}`}>
                  {parameter.royalties?.address}
                </Link>
                <Copy data={parameter.royalties?.address}></Copy>
              </CenteredRow>
              {parameter.royalties?.transferFixed && (
                <span>
                  <strong>{t('Transfer.Transfer Fixed')}:&nbsp;</strong>
                  {parameter?.royalties?.transferFixed / 1000000} KLV
                </span>
              )}
              {parameter?.royalties?.marketFixed && (
                <span>
                  <strong>{t('CreateAsset.Market Fixed')}:&nbsp;</strong>
                  {parameter?.royalties?.marketFixed / 1000000} KLV
                </span>
              )}
              {parameter?.royalties?.marketPercentage && (
                <span>
                  <strong>{t('CreateAsset.Market Percent')}:&nbsp;</strong>
                  {parameter?.royalties?.marketPercentage / 100}%
                </span>
              )}
              <CenteredRow>
                {parameter?.royalties?.itoFixed && (
                  <>
                    <strong>
                      {t('CreateAsset.ITO', {
                        type: `${t('CreateAsset.Fixed')}`,
                      })}
                      :&nbsp;
                    </strong>
                    <span>{parameter?.royalties?.itoFixed / 1000000} KLV</span>
                  </>
                )}
              </CenteredRow>
              <CenteredRow>
                {parameter?.royalties?.itoPercentage && (
                  <>
                    <strong>
                      {t('CreateAsset.ITO', {
                        type: `${t('Transfer.Percentage')}`,
                      })}
                      :&nbsp;
                    </strong>
                    <span>{parameter?.royalties?.itoPercentage / 100}%</span>
                  </>
                )}
              </CenteredRow>
              {parameter?.royalties?.transferPercentage && (
                <RoyaltiesTransferPercentage>
                  <strong>{t('CreateAsset.Transfer Percentage')}:&nbsp;</strong>
                  <div>
                    {parameter?.royalties?.transferPercentage.map(
                      (data, index) => (
                        <span key={index}>
                          <p>
                            {' '}
                            {t('Amount')}: {data.amount}
                          </p>
                          <p>
                            {' '}
                            {t('Transfer.Percentage')}: {data.percentage / 100}%
                          </p>
                        </span>
                      ),
                    )}
                  </div>
                </RoyaltiesTransferPercentage>
              )}
            </Panel>
          )}
        </ExpandRow>
      )}
      {parameter.staking && (
        <ExpandRow expandVar={expand.staking}>
          <ExpandWrapper expandVar={expand.staking}>
            <span style={{ minWidth: '10rem' }}>
              <strong>{t('CreateAsset.Staking')}</strong>
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
                {expand?.staking
                  ? `${commonT('Buttons.Hide')}`
                  : `${commonT('Buttons.Expand')}`}
              </ButtonExpand>
            </span>
          </ExpandWrapper>

          {expand?.staking && (
            <Panel>
              <span>
                <strong>{t('Type')}:&nbsp;</strong>
                {parameter?.staking?.type}
              </span>
              <span>
                <strong>APR:&nbsp;</strong>
                {parameter?.staking?.apr / 100 || 0}%
              </span>
              <span>
                <strong>{t('CreateAsset.Claim Type')}&nbsp;</strong>
                {parameter?.staking?.minEpochsToClaim || 0} Epoch(s)
              </span>{' '}
              <span>
                <strong>{t('CreateAsset.Unstake Time')}:&nbsp;</strong>
                {parameter?.staking?.minEpochsToUnstake || 0} Epoch(s)
              </span>{' '}
              <span>
                <strong>{t('CreateAsset.Withdraw Time')}:&nbsp;</strong>
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
              <strong>{t('CreateAsset.Properties')}</strong>
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
                {expand?.properties
                  ? `${commonT('Buttons.Hide')}`
                  : `${commonT('Buttons.Expand')}`}
              </ButtonExpand>
            </span>
          </ExpandWrapper>
          {expand?.properties && (
            <Panel>
              <PropertiesWrapper>
                <div>
                  <StatusIconWrapper>
                    <strong>
                      {commonT('Properties.Can', {
                        type: `${commonT('Properties.Freeze')}`,
                      })}
                      :&nbsp;
                    </strong>
                    <span>
                      {statusWithIcon(
                        parameter?.properties?.canFreeze ? true : false,
                        commonT,
                      )}
                    </span>
                  </StatusIconWrapper>
                  <StatusIconWrapper>
                    <strong>
                      {' '}
                      {commonT('Properties.Can', {
                        type: `${commonT('Properties.Mint')}`,
                      })}
                      :&nbsp;
                    </strong>
                    <span>
                      {statusWithIcon(
                        parameter?.properties?.canMint ? true : false,
                        commonT,
                      )}
                    </span>
                  </StatusIconWrapper>
                  <StatusIconWrapper>
                    <strong>
                      {' '}
                      {commonT('Properties.Can', {
                        type: `${commonT('Properties.Burn')}`,
                      })}
                      :&nbsp;
                    </strong>
                    <span>
                      {statusWithIcon(
                        parameter?.properties?.canBurn ? true : false,
                        commonT,
                      )}
                    </span>
                  </StatusIconWrapper>
                  <StatusIconWrapper>
                    <strong>
                      {' '}
                      {commonT('Properties.Can', {
                        type: `${commonT('Properties.Pause')}`,
                      })}
                      :&nbsp;
                    </strong>
                    <span>
                      {statusWithIcon(
                        parameter?.properties?.canPause ? true : false,
                        commonT,
                      )}
                    </span>
                  </StatusIconWrapper>
                </div>
                <div>
                  <StatusIconWrapper>
                    <strong>
                      {' '}
                      {commonT('Properties.Can', {
                        type: `${commonT('Properties.Wipe')}`,
                      })}
                      :&nbsp;
                    </strong>
                    <span>
                      {statusWithIcon(
                        parameter?.properties?.canWipe ? true : false,
                        commonT,
                      )}
                    </span>
                  </StatusIconWrapper>
                  <StatusIconWrapper>
                    <strong>{commonT('Properties.Change Owner')}:&nbsp;</strong>
                    {statusWithIcon(
                      parameter?.properties?.canChangeOwner ? true : false,
                      commonT,
                    )}
                  </StatusIconWrapper>
                  <StatusIconWrapper>
                    <strong>{commonT('Properties.Add Roles')}:&nbsp;</strong>
                    {statusWithIcon(
                      parameter?.properties?.canAddRoles ? true : false,
                      commonT,
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
            <strong>{t('CreateAsset.Attributes')}</strong>
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
              {expand?.attributes
                ? `${commonT('Buttons.Hide')}`
                : `${commonT('Buttons.Expand')}`}
            </ButtonExpand>
          </span>
        </ExpandWrapper>

        {expand?.attributes && (
          <Panel>
            <StatusIconWrapper>
              <strong>{t('CreateAsset.Is Paused')}:&nbsp;</strong>
              <span>
                {statusWithIcon(
                  parameter?.attributes?.isPaused ? true : false,
                  t,
                )}
              </span>
            </StatusIconWrapper>
            <StatusIconWrapper>
              <strong> {t('CreateAsset.Can Mint NFT')}:&nbsp;</strong>
              <span>
                {statusWithIcon(
                  parameter?.attributes?.isNFTMintStopped ? true : false,
                  t,
                )}
              </span>
            </StatusIconWrapper>
            <StatusIconWrapper>
              <RoyaltiesChangeWrapper>
                <strong>{t('Royalties')}</strong>
                <strong>{t('CreateAsset.Change Stopped')}:</strong>
              </RoyaltiesChangeWrapper>
              <span>
                {statusWithIcon(
                  parameter?.attributes?.isRoyaltiesChangeStopped
                    ? true
                    : false,
                  t,
                )}
              </span>
            </StatusIconWrapper>
          </Panel>
        )}
      </ExpandRow>
      {renderMetadata()}
    </>
  );
};

export const CreateValidator: React.FC<IIndexedContract> = ({
  sender,
  parameter: par,
  renderMetadata,
}) => {
  const { t } = useTranslation('transactions');
  const parameter = par as ICreateValidatorContract;
  const ownerAddress = parameter?.ownerAddress || sender;

  return (
    <>
      {' '}
      <Row>
        <span>
          <strong>{t('Type')}</strong>
        </span>
        <strong>{t('CreateValidator.Create Validator')}</strong>
      </Row>
      <Row>
        <span>
          <strong>{t('CreateAsset.Name')}</strong>
        </span>
        <span>
          <p>{parameter?.config?.name}</p>
        </span>
      </Row>
      <Row>
        <span>
          <strong>{t('CreateAsset.Owner')}</strong>
        </span>
        <span>
          <Link href={`/account/${ownerAddress}`}>{ownerAddress}</Link>
        </span>
      </Row>
      {parameter?.config?.logo && (
        <Row>
          <span>
            <strong>{t('CreateValidator.Logo')}</strong>
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
          <strong>{t('CreateValidator.Can Delegate')}</strong>
        </span>
        <span>
          <p>{parameter?.config?.canDelegate ? 'True' : 'False'}</p>
        </span>
      </Row>
      <Row>
        <span>
          <strong>{t('CreateValidator.Commission')}</strong>
        </span>
        <span>
          <small>{parameter?.config?.commission / 100}%</small>
        </span>
      </Row>
      <Row>
        <span>
          <strong>{t('CreateValidator.Max Delegation')}</strong>
        </span>
        <span>
          <small>
            {toLocaleFixed(parameter?.config?.maxDelegationAmount / 1000000, 6)}
          </small>
        </span>
      </Row>
      <Row>
        <span>
          <strong>{t('CreateValidator.Reward Address')}</strong>
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
      {renderMetadata()}
    </>
  );
};

export const ValidatorConfig: React.FC<IIndexedContract> = ({
  parameter: par,
  renderMetadata,
}) => {
  const { t } = useTranslation('transactions');
  const { t: commonT } = useTranslation('common');
  const param = par as unknown as IValidatorConfigContract;
  const parameter = param.config;

  return (
    <>
      <Row>
        <span>
          <strong>{t('Type')}</strong>
        </span>
        <strong>{t('ValidatorConfig.Validator Config')}</strong>
      </Row>
      <Row>
        <span>
          <strong>{t('ValidatorConfig.BLS Public Key')}</strong>
        </span>
        <CenteredRow>
          <span>{parameter?.blsPublicKey}</span>
          <Copy data={parameter?.blsPublicKey} info="public key"></Copy>
        </CenteredRow>
      </Row>
      <Row>
        <span>
          <strong>{t('CreateAsset.Name')}</strong>
        </span>
        <span>{parameter?.name || '--'}</span>
      </Row>
      {typeof parameter?.canDelegate === 'boolean' && (
        <Row>
          <span>
            <strong>{t('CreateValidator.Can Delegate')}</strong>
          </span>
          <span>{statusWithIcon(parameter?.canDelegate, commonT)}</span>{' '}
        </Row>
      )}
      <Row>
        <span>
          <strong>{t('CreateValidator.Commission')}</strong>
        </span>
        <span>{parameter?.commission / 100}%</span>
      </Row>
      <Row>
        <span>
          <strong>{t('CreateValidator.Max Delegation')}</strong>
        </span>
        <span>
          {toLocaleFixed(parameter?.maxDelegationAmount / 1000000, 6)}
        </span>
      </Row>
      <Row>
        <span>
          <strong>{t('CreateValidator.Reward Address')}</strong>
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
          <strong>{t('CreateValidator.Logo')}</strong>
        </span>
        <span>
          {parameter.logo ? (
            <a href={renderCorrectPath(parameter?.logo)}>{parameter?.logo}</a>
          ) : (
            <span>--</span>
          )}
        </span>
      </Row>
      <Row>
        <span>
          <strong>URIs</strong>
        </span>
        {parameter.uris.length !== 0 ? (
          parameter.uris?.map(
            ({ key, value }: { key: string; value: string }) => (
              <RowContent key={key}>
                <BalanceContainer>
                  <FrozenContainer>
                    <div>
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
                  </FrozenContainer>
                </BalanceContainer>
              </RowContent>
            ),
          )
        ) : (
          <span>--</span>
        )}
      </Row>

      {renderMetadata()}
    </>
  );
};

export const Freeze: React.FC<IIndexedContract> = ({
  parameter: par,
  contractIndex,
  filteredReceipts: rec,
  renderMetadata,
}) => {
  const { t } = useTranslation('transactions');
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
          <strong>{t('Type')}</strong>
        </span>
        <strong>{t('FreezeUnfreeze.Freeze')}</strong>
      </Row>
      <Row>
        <span>
          <strong>{t('AssetId')}</strong>
        </span>
        <span>
          <small>{parameter?.assetId || 'KLV'}</small>
        </span>
      </Row>
      <Row>
        <span>
          <strong>{t('Amount')}</strong>
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
            <strong>{t('FreezeUnfreeze.Bucket Id')}</strong>
          </span>
          <span>{freezeReceipt?.bucketId}</span>
        </Row>
      )}
      {renderMetadata()}
    </>
  );
};

export const Unfreeze: React.FC<IIndexedContract> = ({
  parameter: par,
  contractIndex,
  filteredReceipts: rec,
  renderMetadata,
}) => {
  const { t } = useTranslation('transactions');
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
          <strong>{t('Type')}</strong>
        </span>
        <strong>{t('FreezeUnfreeze.Unfreeze')}</strong>
      </Row>
      <Row>
        <span>
          <strong>{t('AssetId')}</strong>
        </span>
        <span>{parameter?.assetId || 'KLV'}</span>
      </Row>
      <Row>
        <span>
          <strong>{t('FreezeUnfreeze.Bucket Id')}</strong>
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
            <strong>{t('FreezeUnfreeze.Available Epoch')}</strong>
          </span>
          <span>{unfreezeReceipt?.availableEpoch}</span>
        </Row>
      )}
      {unfreezeReceipt && (
        <Row>
          <span>
            <strong>{t('Amount')}</strong>
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
            <strong>{t('FreezeUnfreeze.Claimed Rewards')}</strong>
          </span>
          <span>
            {claimReceipt.amount / 10 ** precision[claimPrecision]}{' '}
            {claimReceipt.assetIdReceived}
          </span>
        </Row>
      )}
      <Row>
        <span>
          <strong>{t('FreezeUnfreeze.Undelegated')}?</strong>
        </span>
        <span>{undelegateReceipt ? 'True' : 'False'}</span>
      </Row>
      {renderMetadata()}
    </>
  );
};
export const Delegate: React.FC<IIndexedContract> = ({
  parameter: par,
  filteredReceipts,
  contractIndex,
  renderMetadata,
}) => {
  const { t } = useTranslation('transactions');
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
          <strong>{t('Type')}</strong>
        </span>
        <strong>{t('DelegateUndelegate.Delegate')}</strong>
      </Row>
      <Row>
        <span>
          <strong>{t('FreezeUnfreeze.Bucket ID')}</strong>
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
          <strong>{t('To')}</strong>
        </span>
        <span>
          <CenteredRow>
            <Link href={`/account/${parameter?.toAddress}`}>
              <a>{parameter?.toAddress}</a>
            </Link>
            <Copy data={parameter?.toAddress} info="Address"></Copy>
          </CenteredRow>
        </span>
      </Row>
      {delegateReceipt && (
        <Row>
          <span>
            <strong>{t('DelegateUndelegate.Amount Delegated')}</strong>
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
            <strong>{t('DelegateUndelegate.Rewards Claimed')}</strong>
          </span>
          <span>
            <CenteredRow>
              <span>
                {toLocaleFixed(
                  claimReceipt.amount / 10 ** claimPrecision,
                  claimPrecision,
                )}{' '}
              </span>
              {claimReceipt.assetIdReceived === 'KLV' && <KLV />}
              {claimReceipt.assetIdReceived}
              <Tooltip
                msg={`Delegation generates an unfreeze contract,\n which will trigger the freeze contract rewards, if there are any.`}
              />
            </CenteredRow>
          </span>
        </Row>
      )}
      {claimReceipt && claimReceipt.marketplaceId && (
        <>
          <Row>
            <span>
              <strong>{t('DelegateUndelegate.Marketplace ID')}</strong>
            </span>
            <span>{claimReceipt.marketplaceId || '--'}</span>
          </Row>
          <Row>
            <span>
              <strong>{t('DelegateUndelegate.OrderId')}</strong>
            </span>
            <span>{claimReceipt.orderId || '--'}</span>
          </Row>
        </>
      )}
      {renderMetadata()}
    </>
  );
};

export const Undelegate: React.FC<IIndexedContract> = ({
  parameter: par,
  filteredReceipts,
  contractIndex,
  renderMetadata,
}) => {
  const { t } = useTranslation('transactions');
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
          <strong>{t('Type')}</strong>
        </span>
        <strong>{t('DelegateUndelegate.Undelegate')}</strong>
      </Row>
      <Row>
        <span>
          <strong>{t('FreezeUnfreeze.Bucket ID')}</strong>
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
            <strong>{t('Amount')}</strong>
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
            <strong>{t('DelegateUndelegate.Rewards Claimed')}</strong>
          </span>
          <span>
            <CenteredRow>
              <span>
                {toLocaleFixed(
                  claimReceipt.amount / 10 ** claimPrecision,
                  claimPrecision,
                )}{' '}
              </span>
              {claimReceipt.assetIdReceived === 'KLV' && <KLV />}
              {claimReceipt.assetIdReceived}
            </CenteredRow>
          </span>
        </Row>
      )}
      <>
        <Row>
          <span>
            <strong>{t('DelegateUndelegate.AssetID Received')}</strong>
          </span>
          <span>{claimReceipt?.assetIdReceived || '--'}</span>
        </Row>
        <Row>
          <span>
            <strong>{t('AssetId')}</strong>
          </span>
          <span>{claimReceipt?.assetId || '--'}</span>
        </Row>
        {claimReceipt?.marketplaceId && (
          <Row>
            <span>
              <strong>{t('DelegateUndelegate.Marketplace ID')}</strong>
            </span>
            <span>{claimReceipt.marketplaceId || '--'}</span>
          </Row>
        )}
        {claimReceipt?.orderId && (
          <Row>
            <span>
              <strong>{t('DelegateUndelegate.OrderId')}</strong>
            </span>
            <span>{claimReceipt.orderId || '--'}</span>
          </Row>
        )}
      </>
      {renderMetadata()}
    </>
  );
};

export const Withdraw: React.FC<IIndexedContract> = ({
  parameter: par,
  filteredReceipts,
  contractIndex,
  renderMetadata,
}) => {
  const { t } = useTranslation('transactions');
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
          <strong>{t('Type')}</strong>
        </span>
        <strong>{t('Withdraw.Withdraw')}</strong>
      </Row>
      {filteredReceipts?.length === 0 && (
        <Row>
          <span>
            <strong>{t('AssetId')}</strong>
          </span>
          <span>{parameter?.assetId}</span>
        </Row>
      )}

      <Row>
        <span>
          <strong>{t('Amount')}</strong>
        </span>
        <span>
          {toLocaleFixed(
            Number(withdrawReceipt?.amount || parameter.amount || 0) /
              10 ** precision[assetIdPrecision],
            precision[assetIdPrecision],
          )}{' '}
          {withdrawReceipt?.assetId || parameter.currencyID}
        </span>
      </Row>
      <Row>
        <span>
          <strong>Withdraw Type</strong>
        </span>
        <span>{parameter.withdrawType || '--'}</span>
      </Row>
      {claimReceipt && (
        <Row>
          <span>
            <strong>{t('DelegateUndelegate.Rewards Claimed')}</strong>
          </span>
          <span>
            <CenteredRow>
              <span>
                {toLocaleFixed(
                  claimReceipt.amount / 10 ** precision[claimPrecision],
                  precision[claimPrecision],
                )}{' '}
              </span>
              {claimReceipt.assetIdReceived === 'KLV' && <KLV />}
              {claimReceipt.assetIdReceived}
            </CenteredRow>
          </span>
        </Row>
      )}
      <>
        <Row>
          <span>
            <strong>{t('DelegateUndelegate.AssetID Received')}</strong>
          </span>
          <span>{claimReceipt?.assetIdReceived || '--'}</span>
        </Row>
        <Row>
          <span>
            <strong>{t('AssetId')}</strong>
          </span>
          <span>{claimReceipt?.assetId || '--'}</span>
        </Row>
        {claimReceipt?.marketplaceId && (
          <Row>
            <span>
              <strong>{t('DelegateUndelegate.MarketPlace ID')}</strong>
            </span>
            <span>{claimReceipt.marketplaceId || '--'}</span>
          </Row>
        )}
        {claimReceipt?.orderId && (
          <Row>
            <span>
              <strong>{t('DelegateUndelegate.OrderId')}</strong>
            </span>
            <span>{claimReceipt.orderId || '--'}</span>
          </Row>
        )}
      </>
      {renderMetadata()}
    </>
  );
};

export const Claim: React.FC<IIndexedContract> = ({
  parameter: par,
  filteredReceipts,
  renderMetadata,
}) => {
  const { t } = useTranslation('transactions');
  const parameter = par as IClaimContract;
  const claimReceipt = findReceipt(filteredReceipts, 17) as
    | IClaimReceipt
    | undefined;
  const precision = usePrecision(claimReceipt?.assetIdReceived || 'KLV');

  return (
    <>
      <Row>
        <span>
          <strong>{t('Type')}</strong>
        </span>
        <strong>{t('Claim.Claim')}</strong>
      </Row>
      <Row>
        <span>
          <strong>{t('CreateAsset.Claim Type')}</strong>
        </span>
        <span>{parameter?.claimType}</span>
      </Row>
      {claimReceipt && (
        <Row>
          <span>
            <strong>{t('AssetId')}</strong>
          </span>
          <span>{claimReceipt?.assetId}</span>
        </Row>
      )}
      {claimReceipt && typeof claimReceipt?.amount === 'number' && (
        <Row>
          <span>
            <strong>{t('Amount')}</strong>
          </span>
          <span>
            {toLocaleFixed(claimReceipt?.amount / 10 ** precision, precision)}{' '}
            {claimReceipt.assetIdReceived}
          </span>
        </Row>
      )}
      <>
        <Row>
          <span>
            <strong>{t('Claim.Asset Id Received')}</strong>
          </span>
          <span>{claimReceipt?.assetIdReceived || '--'}</span>
        </Row>
        {claimReceipt?.marketplaceId && (
          <Row>
            <span>
              <strong>{t('DelegateUndelegate.MarketPlace ID')}</strong>
            </span>
            <span>{claimReceipt.marketplaceId || '--'}</span>
          </Row>
        )}
        {claimReceipt?.orderId && (
          <Row>
            <span>
              <strong>{t('DelegateUndelegate.OrderId')}</strong>
            </span>
            <span>{claimReceipt.orderId || '--'}</span>
          </Row>
        )}
      </>
    </>
  );
};

export const Unjail: React.FC<IIndexedContract> = ({ renderMetadata }) => {
  const { t } = useTranslation('transactions');
  return (
    <>
      <Row>
        <span>
          <strong>{t('Type')}</strong>
        </span>
        <strong>{t('Unjail')}</strong>
      </Row>
      {renderMetadata()}
    </>
  );
};

export const AssetTrigger: React.FC<IIndexedContract> = ({
  parameter: par,
  renderMetadata,
  filteredReceipts: rec,
  sender,
}) => {
  const { t } = useTranslation('transactions');
  const parameter = par as IAssetTriggerContract;
  const assetID = parameter?.assetId?.split('/')[0] || 'KLV';
  const precision = usePrecision(assetID);
  const filteredReceipts = rec as IBuyReceipt[];
  const noncesReceipts = getNFTNonces(filteredReceipts, parameter, sender);

  return (
    <>
      <Row>
        <span>
          <strong>{t('Type')}</strong>
        </span>
        <strong>{t('AssetTrigger.Asset Trigger')}</strong>
      </Row>
      <Row>
        <span>
          <strong>{t('AssetTrigger.Trigger Type')}</strong>
        </span>
        <span>{parameter?.triggerType}</span>
      </Row>
      <Row>
        <span>
          <strong>{t('AssetId')}</strong>
        </span>
        <span>{parameter?.assetId}</span>
      </Row>
      {!!noncesReceipts.length && (
        <Row>
          <span>
            <strong>{t('AssetTrigger.NFTs Nonces')}</strong>
          </span>
          {renderNFTNonces(noncesReceipts)}
        </Row>
      )}
      {renderAssetTriggerTypeData({ parameter, precision, t })}
      {renderMetadata()}
    </>
  );
};

export const SetAccountName: React.FC<IIndexedContract> = ({
  parameter: par,
  renderMetadata,
}) => {
  const { t } = useTranslation('transactions');
  const parameter = par as ISetAccountNameContract;

  return (
    <>
      <Row>
        <span>
          <strong>{t('Type')}</strong>
        </span>
        <strong>{t('SetAccountName')}</strong>
      </Row>
      <Row>
        <span>
          <strong>{t('Name')}</strong>
        </span>
        <span>{parameter?.name}</span>
      </Row>
      {renderMetadata()}
    </>
  );
};

export const Proposal: React.FC<IIndexedContract> = ({
  parameter: par,
  filteredReceipts,
  contractIndex,
  renderMetadata,
}) => {
  const { t } = useTranslation('transactions');
  const parameter = par as IProposalContract;
  const parameters = getProposalNetworkParams(parameter?.parameters);

  const proposalReceipt = findReceipt(filteredReceipts, 5) as
    | IProposalReceipt
    | undefined;
  return (
    <>
      <Row>
        <span>
          <strong>{t('Type')}</strong>
        </span>
        <strong>{t('Proposal.Proposal')}</strong>
      </Row>
      {proposalReceipt && (
        <Row>
          <span>
            <strong>{t('Proposal.Proposal Id')}</strong>
          </span>
          <span>{proposalReceipt?.proposalId}</span>
        </Row>
      )}
      <Row>
        <span>
          <strong>{t('Proposal.Epoch Duration')}</strong>
        </span>
        <span>{parameter?.epochsDuration}</span>
      </Row>
      <Row>
        <span>
          <strong>{t('Proposal.Description')}</strong>
        </span>
        <BigSpan>{parameter?.description}</BigSpan>
      </Row>
      <Row>
        <span>
          <strong>{t('Proposal.Parameters')}</strong>
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
      {renderMetadata()}
    </>
  );
};

export const Vote: React.FC<IIndexedContract> = ({
  parameter: par,
  renderMetadata,
}) => {
  const { t } = useTranslation('transactions');
  const parameter = par as IVoteContract;

  return (
    <>
      <Row>
        <span>
          <strong>{t('Type')}</strong>
        </span>
        <strong>{t('Vote')}</strong>
      </Row>
      <Row>
        <span>
          <strong>{t('Proposal.Proposal Id')}</strong>
        </span>
        <span>{parameter?.proposalId}</span>
      </Row>
      <Row>
        <span>
          <strong>{t('Amount')}</strong>
        </span>
        <span>{(parameter.amount / 1000000).toLocaleString()}</span>
      </Row>
      <Row>
        <span>
          <strong>{t('Vote')}</strong>
        </span>
        <span>{parameter?.type}</span>
      </Row>
      {renderMetadata()}
    </>
  );
};

export const ConfigITO: React.FC<IIndexedContract> = ({
  parameter: par,
  renderMetadata,
}) => {
  const { t } = useTranslation('transactions');
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
          <strong>{t('Type')}</strong>
        </span>
        <strong>{t('ConfigITO.Config ITO')}</strong>
      </Row>
      <Row>
        <span>
          <strong>{t('ConfigITO.Receiver')}</strong>
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
          <strong>{t('AssetId')}</strong>
        </span>
        <span>{parameter?.assetId}</span>
      </Row>
      <Row>
        <span>
          <strong>{t('ConfigITO.Status')}</strong>
        </span>
        <span>{parameter?.status}</span>
      </Row>
      {parameter?.maxAmount && (
        <Row>
          <span>
            <strong>{t('ConfigITO.Max Amount')}</strong>
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
          t,
          renderPackPrecision,
        )}
      {renderMetadata()}
    </>
  );
};

export const SetITOPrices: React.FC<IIndexedContract> = ({
  parameter: par,
  renderMetadata,
}) => {
  const { t } = useTranslation('transactions');
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
          <strong>{t('Type')}</strong>
        </span>
        <strong>{t('SetITOPrices.Set ITO Prices')}</strong>
      </Row>
      <Row>
        <span>
          <strong>{t('AssetId')}</strong>
        </span>
        <span>{assetId}</span>
      </Row>
      {parameter.packInfo &&
        renderPackInfoComponents(
          parameter,
          precision,
          packsPrecision,
          t,
          renderPackPrecision,
        )}
      {renderMetadata()}
    </>
  );
};

export const Buy: React.FC<IContractBuyProps> = ({
  parameter: par,
  filteredReceipts: rec,
  sender,
  contractIndex,
  renderMetadata,
}) => {
  const { t } = useTranslation('transactions');
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

  const NFTKAppTransferReceipt = findNFTReceipt(filteredReceipts, 14) as
    | IKAppTransferReceipt
    | undefined;

  const initializeVariables = () => {
    switch (buyType) {
      case 'MarketBuy':
        currencyId = parameter?.currencyID || 'KLV';
        assetId = NFTKAppTransferReceipt?.assetId || '';
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
  getPrecisionsToSearch.push(currencyId, assetId);
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
      const amount = NFTKAppTransferReceipt?.value;
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
              <strong>{t('ConfigITO.Status')}</strong>
            </span>
            <span>{status}</span>
          </Row>
        )}
        {price && (
          <Row>
            <span>
              <strong>{t('Buy.Price')}</strong>
            </span>
            <span>
              {price} {currencyId}
            </span>
          </Row>
        )}
        {amount && (
          <Row>
            <span>
              <strong>{t('Amount')}</strong>
            </span>
            <span>
              {amount} {assetId}
            </span>
          </Row>
        )}
        <Row>
          <span>
            <strong>{t('Buy.Currency Id')}</strong>
          </span>
          <span>{currencyId}</span>
        </Row>
        <>
          {assetId && (
            <Row>
              <span>
                <strong>{t('AssetId')}</strong>
              </span>
              <span>{assetId}</span>
            </Row>
          )}
          {orderId && (
            <Row>
              <span>
                <strong>{t('Buy.Order Id')}</strong>
              </span>
              <span>{orderId}</span>
            </Row>
          )}
          {marketplaceId && (
            <Row>
              <span>
                <strong>
                  Marketplace Id{t('DelegateUndelegate.Marketplace ID')}
                </strong>
              </span>
              <span>{marketplaceId}</span>
            </Row>
          )}
        </>
      </>
    );
  };

  const renderITOBuy = () => {
    const getITOBuyPrices = () => {
      const transferReceipts = findAllReceiptsWithSender(
        filteredReceipts,
        0,
        sender,
      );
      if (!transferReceipts) return;
      const allPricesSum = extractValuesFromReceipts(
        transferReceipts as ITransferReceipt[],
        'assetId',
      );
      const precisionAllPricesSum = {};
      Object.keys(allPricesSum).forEach(
        key =>
          (precisionAllPricesSum[key] = toLocaleFixed(
            allPricesSum[key] / 10 ** precisions[currencyId],
            precisions[currencyId],
          )),
      );
      return precisionAllPricesSum;
    };

    const renderITOBuyPrices = () => {
      const prices = getITOBuyPrices();
      if (!prices) return;
      return Object.keys(prices).map(key => {
        return (
          <Row key={key}>
            <span>
              <strong>{t('Transfer.Total paid')}</strong>
              <br />
              <strong>
                {t('Buy.in')}
                {key}
              </strong>
            </span>
            <CenteredDiv>
              <span>
                {prices[key]} {currencyId}
              </span>
              <Tooltip
                msg={
                  'There might be royalties fees in the total paid price.\n To know exactly how much you are being charged check your assets royalties info in assets page.'
                }
              />
            </CenteredDiv>
          </Row>
        );
      });
    };

    const getAmount = () => {
      const amount = parameter?.amount;
      if (typeof amount === 'number') {
        return toLocaleFixed(
          amount / 10 ** (precisions[assetId] || 0),
          precisions[assetId] || 0,
        );
      }
      return null;
    };

    const amount = getAmount();
    const noncesReceipts = getNFTNonces(filteredReceipts, parameter, sender);

    return (
      <>
        {renderITOBuyPrices()}
        {amount && (
          <Row>
            <span>
              <strong>{t('Amount')}</strong>
            </span>
            <span>
              {amount} <a href={`/asset/${assetId}`}>{assetId}</a>
            </span>
          </Row>
        )}
        {!!noncesReceipts.length && (
          <Row>
            <span>
              <strong>{t('AssetTrigger.NFTs Nonces')}</strong>
            </span>
            {renderNFTNonces(noncesReceipts)}
          </Row>
        )}
        <Row>
          <span>
            <strong>{t('Buy.Currency Id')}</strong>
          </span>
          <span>{currencyId}</span>
        </Row>
        {assetId && (
          <Row>
            <span>
              <strong>{t('AssetId')}</strong>
            </span>
            <a href={`/asset/${assetId}`}>
              <span>{assetId}</span>
            </a>
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
          <strong>{t('Type')}</strong>
        </span>
        <strong>{t('Buy.Buy')}</strong>
      </Row>
      <Row>
        <span>
          <strong>{t('Buy.Buy Type')}</strong>
        </span>
        <span>{buyType}</span>
      </Row>
      {renderBuyTypeData()}
      {renderMetadata()}
    </>
  );
};

export const Sell: React.FC<IIndexedContract> = ({
  parameter: par,
  filteredReceipts,
  contractIndex,
  renderMetadata,
}) => {
  const { t } = useTranslation('transactions');
  const parameter = par as ISellContract;
  const assetId = parameter?.assetId || 'KLV';
  const precision = usePrecision(parameter?.currencyID || 'KLV');
  const kAppTransferReceipt = findReceiptWithAssetId(
    filteredReceipts,
    14,
    assetId,
  ) as IKAppTransferReceipt | undefined;
  const sellReceipt = findReceipt(filteredReceipts, 15) as
    | ISellReceipt
    | undefined;

  const hasMarketFixedRoyalties = findReceiptWithAssetId(
    filteredReceipts,
    14,
    'KLV',
  ) as IKAppTransferReceipt | undefined;
  const getMarketFixedRoyalties = () => {
    if (hasMarketFixedRoyalties) {
      return (
        <Row>
          <span>
            <strong>{t('CreateAsset.Market Fixed')}</strong>
            <br />
            <strong>{t('Royalties')}</strong>
          </span>
          <span>
            {toLocaleFixed(
              hasMarketFixedRoyalties.value / 10 ** KLV_PRECISION,
              KLV_PRECISION,
            )}{' '}
            {'KLV'}
          </span>
          &nbsp;
          <Tooltip msg="Paid by the seller the moment this order was placed." />
        </Row>
      );
    }
  };

  return (
    <>
      <Row>
        <span>
          <strong>{t('Type')}</strong>
        </span>
        <strong>{t('Buy.Sell')}</strong>
      </Row>
      <Row>
        <span>
          <strong>{t('Buy.Market Type')}</strong>
        </span>
        <span>{parameter?.marketType}</span>
      </Row>
      {sellReceipt && (
        <Row>
          <span>
            <strong>{t('Buy.Order Id')}</strong>
          </span>
          <span>{sellReceipt?.orderId}</span>
        </Row>
      )}
      <Row>
        <span>
          <strong>{t('DelegateUndelegate.paidMarketplace ID')}</strong>
        </span>
        <span>{parameter?.marketplaceID}</span>
      </Row>
      <Row>
        <span>
          <strong>{t('AssetId')}</strong>
        </span>
        <span>{parameter?.assetId}</span>
      </Row>
      {kAppTransferReceipt && (
        <Row>
          <span>
            <strong>{t('Amount')}</strong>
          </span>
          <span>{kAppTransferReceipt?.value}</span>
        </Row>
      )}
      <Row>
        <span>
          <strong>{t('Buy.Currency Id')}</strong>
        </span>
        <span>{parameter?.currencyID}</span>
      </Row>
      {parameter?.price && (
        <Row>
          <span>
            <strong>{t('Buy.Price')}</strong>
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
            <strong>{t('Buy.Reserve Price')}</strong>
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
          <strong>{t('Buy.End Time')}</strong>
        </span>
        <span>
          {parameter?.endTime ? formatDate(parameter?.endTime * 1000) : '--'}
        </span>
      </Row>
      {getMarketFixedRoyalties()}
      {renderMetadata()}
    </>
  );
};

export const CancelMarketOrder: React.FC<IIndexedContract> = ({
  parameter: par,
  filteredReceipts,
  contractIndex,
  renderMetadata,
}) => {
  const { t } = useTranslation('transactions');
  const parameter = par as ICancelMarketOrderContract;
  const kAppTransferReceipt = findReceipt(
    filteredReceipts,
    14,
  ) as IKAppTransferReceipt;
  return (
    <>
      <Row>
        <span>
          <strong>{t('Type')}</strong>
        </span>
        <strong>{t('CancelMarketOrder')}</strong>
      </Row>
      <Row>
        <span>
          <strong>{t('Buy.Order Id')}</strong>
        </span>
        <span>{parameter?.orderID}</span>
      </Row>
      {kAppTransferReceipt && (
        <>
          <Row>
            <span>
              <strong>{t('DelegateUndelegate.Marketplace ID')}</strong>
            </span>
            <span>{kAppTransferReceipt?.marketplaceId}</span>
          </Row>
          <Row>
            <span>
              <strong>{t('AssetId')}</strong>
            </span>
            <span>{kAppTransferReceipt?.assetId}</span>
          </Row>
          <Row>
            <span>
              <strong>{t('Amount')}</strong>
            </span>
            <span>{kAppTransferReceipt?.value}</span>
          </Row>
        </>
      )}
      {renderMetadata()}
    </>
  );
};

export const CreateMarketplace: React.FC<IIndexedContract> = ({
  parameter: par,
  filteredReceipts,
  contractIndex,
  renderMetadata,
}) => {
  const { t } = useTranslation('transactions');
  const parameter = par as ICreateMarketplaceContract;
  const createMarketplaceReceipt = findReceipt(
    filteredReceipts,
    10,
  ) as ICreateMarketplaceReceipt;
  return (
    <>
      <Row>
        <span>
          <strong>{t('Type')}</strong>
        </span>
        <strong>{t('CreateMarketplace')}</strong>
      </Row>
      <Row>
        <span>
          <strong>{t('CreateAsset.Name')}</strong>
        </span>
        <span>{parameter?.name}</span>
      </Row>
      {createMarketplaceReceipt && (
        <Row>
          <span>
            <strong>{t('DelegateUndelegate.Marketplace ID')}</strong>
          </span>
          <span>{createMarketplaceReceipt?.marketplaceId}</span>
        </Row>
      )}
      <Row>
        <span>
          <strong>{t('ReferralAddress')}</strong>
        </span>
        <span>{parameter?.referralAddress}</span>
      </Row>
      <Row>
        <span>
          <strong>{t('ReferralPercent')}</strong>
        </span>
        <span>
          {parameter?.referralPercentage
            ? `${parameter.referralPercentage / 100} %`
            : '--'}
        </span>
      </Row>
      {renderMetadata()}
    </>
  );
};

export const ConfigMarketplace: React.FC<IIndexedContract> = ({
  parameter: par,
  renderMetadata,
}) => {
  const { t } = useTranslation('transactions');
  const parameter = par as IConfigMarketplaceContract;

  return (
    <>
      <Row>
        <span>
          <strong>{t('Type')}</strong>
        </span>
        <strong>{t('ConfigMarketplace')}</strong>
      </Row>
      <Row>
        <span>
          <strong>{t('CreateAsset.Name')}</strong>
        </span>
        <span>{parameter?.name}</span>
      </Row>
      <Row>
        <span>
          <strong>{t('DelegateUndelegate.Marketplace ID')}</strong>
        </span>
        <span>{parameter?.marketplaceID}</span>
      </Row>
      <Row>
        <span>
          <strong>{t('ReferralAddress')}</strong>
        </span>
        <span>{parameter?.referralAddress}</span>
      </Row>
      <Row>
        <span>
          <strong>{t('ReferralPercent')}</strong>
        </span>
        <span>
          {parameter?.referralPercentage
            ? `${parameter.referralPercentage / 100} %`
            : '--'}
        </span>
      </Row>
      {renderMetadata()}
    </>
  );
};

export const UpdateAccountPermission: React.FC<IIndexedContract> = ({
  parameter: par,
  renderMetadata,
}) => {
  const { t } = useTranslation('transactions');
  const parameter = par as IUpdateAccountPermissionContract;
  const permission = parameter?.permissions[0];
  const operations = calculatePermissionOperations(permission?.operations);
  const signers = permission?.signers || [];
  return (
    <>
      <Row>
        <span>
          <strong>{t('Type')}</strong>
        </span>
        <strong>
          {t('UpdateAccountPermission.Update Account Permission')}
        </strong>
      </Row>
      <Row>
        <span>
          <strong>{t('UpdateAccountPermission.Permission Name')}</strong>
        </span>
        <span>{permission?.permissionName ?? ''}</span>
      </Row>
      <Row>
        <span>
          <strong>{t('UpdateAccountPermission.Permission Type')}</strong>
        </span>
        <span>{permission?.type ?? ''}</span>
      </Row>
      <Row>
        <span>
          <strong>{t('Threshold')}</strong>
        </span>
        <span>{permission?.Threshold ?? ''}</span>
      </Row>
      <Row>
        <span>
          <strong>{t('UpdateAccountPermission.Operations')}</strong>
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
          <strong>{t('UpdateAccountPermission.Signers')}</strong>
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
      {renderMetadata()}
    </>
  );
};

export const Deposit: React.FC<IIndexedContract> = ({
  parameter: par,
  renderMetadata,
}) => {
  const { t } = useTranslation('transactions');
  const parameter = par as IDepositContract;
  const precision = usePrecision(parameter?.currencyID || 'KLV');

  return (
    <>
      <Row>
        <span>
          <strong>{t('Type')}</strong>
        </span>
        <strong>{t('Deposit.Deposit')}</strong>
      </Row>
      <Row>
        <span>
          <strong>{t('Deposit.Deposit Type')}</strong>
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
          <strong>{t('Amount')}</strong>
        </span>
        <span>{parameter?.amount / 10 ** precision}</span>
      </Row>
      <Row>
        <span>
          <strong>{t('Buy.Currency Id')}</strong>
        </span>
        <span>{parameter?.currencyID}</span>
      </Row>
      {renderMetadata()}
    </>
  );
};

export const ITOTrigger: React.FC<IIndexedContract> = ({
  parameter: par,
  renderMetadata,
}) => {
  const { t } = useTranslation('transactions');
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
          <strong>{t('ITOTrigger.White List Info')}</strong>
        </span>
        <RowContent>
          <BalanceContainer>
            <FrozenContainer>
              {whitelistInfo.map((info, index) => (
                <section key={info.address}>
                  <div key={info.address}>
                    <strong>{t('Address')}</strong>
                    <span>{info.address}</span>
                  </div>
                  <div>
                    <strong>{t('Limit')}</strong>
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
            t,
            renderPackPrecision,
          );
        }
        return null;
      case ITOTriggerType.UpdateStatus:
        return (
          <Row>
            <span>
              <strong>{t('ConfigITO.Status')}</strong>
            </span>
            <span>{parameter?.status}</span>
          </Row>
        );
      case ITOTriggerType.UpdateReceiverAddress:
        return (
          <Row>
            <span>
              <strong>{t('ITOTrigger.Receiver Address')}</strong>
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
              <strong>{t('ConfigITO.Max Amount')}</strong>
            </span>
            <span>{renderMaxAmount()}</span>
          </Row>
        );
      case ITOTriggerType.UpdateDefaultLimitPerAddress:
        return (
          <Row>
            <span>
              <strong>
                {t('ITOTrigger.Default Limit')}
                <br />
                {t('ITOTrigger.per Address')}
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
                <strong>{t('Buy.Start Time')}</strong>
              </span>
              <span>{parameter?.startTime}</span>
            </Row>
            <Row>
              <span>
                <strong>{t('Buy.End time')}</strong>
              </span>
              <span>{parameter?.endTime}</span>
            </Row>
          </>
        );
      case ITOTriggerType.UpdateWhitelistStatus:
        return (
          <Row>
            <span>
              <strong>{t('ITOTrigger.White List Status')}</strong>
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
                  {t('ITOTrigger.White List')}
                  <br />
                  {t('Buy.Start Time')}
                </strong>
              </span>
              <span>{parameter?.whitelistStartTime}</span>
            </Row>
            <Row>
              <span>
                <strong>
                  {t('ITOTrigger.White List')}
                  <br />
                  {t('Buy.End Time')}
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
          <strong>{t('Type')}</strong>
        </span>
        <strong>{t('AssetTrigger.ITO Trigger')}</strong>
      </Row>
      <Row>
        <span>
          <strong>{t('AssetTrigger.Trigger Type')}</strong>
        </span>
        <strong>{parameter?.triggerType}</strong>
      </Row>
      <Row>
        <span>
          <strong>{t('AssetId')}</strong>
        </span>
        <span>{parameter?.assetId}</span>
      </Row>
      {renderTriggerTypeData()}
      {renderMetadata()}
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
  t: TFunction,
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
            {t('ITOTrigger.Pack Info')}
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
                      <strong>{t('Amount')}</strong>
                      <span>
                        {toLocaleFixed(
                          pack2.amount / 10 ** precision,
                          precision,
                        )}
                      </span>
                    </div>
                    <div>
                      <strong>{t('Buy.Price')}</strong>
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
  t: TFunction,
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
          t,
          renderPackPrecision,
        )}
      </NestedContainerWrapper>
    </Row>
  );
};

const renderAssetTriggerTypeData: React.FC<RenderAssetTriggerTypeDataProps> = ({
  parameter,
  precision,
  t,
}): any => {
  const par = parameter;
  const triggerType = par?.triggerType;

  const toAddressReturn = () => (
    <Row>
      <span>
        <strong>{t('To')}</strong>
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
        <strong>{t('Amount')}</strong>
      </span>
      <span>{toLocaleFixed(par?.amount / 10 ** precision, precision)}</span>
    </Row>
  );

  const kdaPoolReturn = () => (
    <Row>
      <strong>{t('AssetTrigger.KDAPool')}</strong>
      <RowContent>
        <BalanceContainer>
          <FrozenContainer>
            <RoleWrapper>
              <RoleDiv>
                <StrongWidth>{t('AssetTrigger.Active')}</StrongWidth>
                <span>{par.kdaPool.active ? 'true' : 'false'}</span>
              </RoleDiv>
              <RoleDiv>
                <StrongWidth>{t('AssetTrigger.Admin Address')}</StrongWidth>
                <span>{par.kdaPool.adminAddress}</span>
                <Copy data={par.kdaPool.adminAddress} />
              </RoleDiv>
              <RoleDiv>
                <StrongWidth>{t('AssetTrigger.fRationKDA')}</StrongWidth>
                <span>{par.kdaPool.fRatioKDA}</span>
              </RoleDiv>
              <RoleDiv>
                <StrongWidth>{t('AssetTrigger.fRationKLV')}</StrongWidth>
                <span>{par.kdaPool.fRatioKLV}</span>
              </RoleDiv>
              <RoleDiv>
                <StrongWidth>KDA</StrongWidth>
                <span>{par.kdaPool.kda}</span>
              </RoleDiv>
            </RoleWrapper>
          </FrozenContainer>
        </BalanceContainer>
      </RowContent>
    </Row>
  );

  const royaltiesReturn = () => (
    <Row>
      <strong>{t('Royalties')}</strong>
      <RowContent>
        <BalanceContainer>
          <FrozenContainer>
            <RoleWrapper>
              <RoleDiv>
                <StrongWidth>{t('Address')}</StrongWidth>
                <span>{par.royalties.address || '--'}</span>
                <Copy data={par.royalties.address} />
              </RoleDiv>
              <RoleDiv>
                <StrongWidth>
                  {t('CreateAsset.ITO', { type: `${t('CreateAsset.Fixed')}` })}
                </StrongWidth>
                <span>{par.royalties.itoFixed || '--'}</span>
              </RoleDiv>
              <RoleDiv>
                <StrongWidth>
                  ITO Percentage
                  {t('CreateAsset.ITO', {
                    type: `${t('Transfer.Percentage')}`,
                  })}
                </StrongWidth>
                <span>{par.royalties.itoPercentage / 100 || 0}%</span>
              </RoleDiv>
              <RoleDiv>
                <StrongWidth>{t('CreateAsset.Market Fixed')}</StrongWidth>
                <span>{par.royalties.marketFixed || '--'}</span>
              </RoleDiv>
              <RoleDiv>
                <StrongWidth>{t('CreateAsset.Market Percentage')}</StrongWidth>
                <span>{par.royalties.marketPercentage / 100 || 0}%</span>
              </RoleDiv>
              <RoleDiv>
                <StrongWidth>{t('Transfer.Transfer Fixed')}</StrongWidth>
                <span>{par.royalties.transferFixed || '--'}</span>
              </RoleDiv>
            </RoleWrapper>
          </FrozenContainer>
        </BalanceContainer>
      </RowContent>
    </Row>
  );

  const roleReturn = () => (
    <Row>
      <strong>{t('AssetTrigger.Role')}</strong>
      <RowContent>
        <BalanceContainer>
          <FrozenContainer>
            <RoleWrapper>
              <RoleDiv>
                <RoleStrong>{t('Address')}</RoleStrong>
                <span style={{ marginRight: '0.5rem' }}>
                  {par.role.address}
                </span>
                <Copy data={par.role.address} />
              </RoleDiv>

              <RoleDiv>
                <RoleStrong>t{t('AssetTrigger.HasRoleMin')}</RoleStrong>
                <span>{statusWithIcon(par.role.hasRoleMint, t)}</span>
              </RoleDiv>
              <RoleDiv>
                <RoleStrong>{t('AssetTrigger.HasRoleSetITOPrices')}</RoleStrong>
                <span>{statusWithIcon(par.role.hasRoleSetITOPrices, t)}</span>
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
        <strong>{t('AssetTrigger.MIME')}</strong>
      </span>
      <span>{par?.mime}</span>
    </Row>
  );

  const logoReturn = () => (
    <Row>
      <span>
        <strong>{t('CreateValidator.Logo')}</strong>
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
        <strong>{t('CreateAsset.Staking')}</strong>
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
                <StrongWidth>
                  {t('AssetTrigger.Min Epochs To', {
                    type: `${t('Claim.Claim')}`,
                  })}
                </StrongWidth>
                <span>{par.staking?.minEpochsToClaim}</span>
              </section>
              <section>
                <StrongWidth>
                  {t('AssetTrigger.Min Epochs To', {
                    type: `${t('AssetTrigger.Unstake')}`,
                  })}
                </StrongWidth>
                <span>{par.staking?.minEpochsToUnstake}</span>
              </section>
              <section>
                <StrongWidth>
                  {t('AssetTrigger.Min Epochs To', {
                    type: `${t('Withdraw.Withdraw')}`,
                  })}
                </StrongWidth>
                <span>{par.staking?.minEpochsToWithdraw}</span>
              </section>
              <section>
                <StrongWidth>{t('Type')}</StrongWidth>
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
      return royaltiesReturn();
    case EnumTriggerTypeName.UpdateKDAFeePool:
      return kdaPoolReturn();
    case EnumTriggerTypeName.StopRoyaltiesChange:
      return null;
    default:
      return null;
  }
};
