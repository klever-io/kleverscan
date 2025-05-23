import { setQueryAndRouter } from '@/utils';
import { formatDate, toLocaleFixed } from '@/utils/formatFunctions';
import { KLV_PRECISION } from '@/utils/globalVariables';
import {
  ContentScrollBar,
  Row,
  SectionTitle,
  ShowDetailsButton,
} from '@/views/assets/detail';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import {
  PropsWithChildren,
  default as React,
  useCallback,
  Fragment,
} from 'react';
import { AssetProps } from './OverviewTab';

interface StakingRoyaltiesTabProps extends AssetProps {
  setSelectedCard: (card: string) => void;
}

export const StakingRoyaltiesTab: React.FC<
  PropsWithChildren<StakingRoyaltiesTabProps>
> = ({ asset, setSelectedCard }) => {
  const { t } = useTranslation(['common', 'assets']);
  const router = useRouter();

  const handleChangeActiveCard = (card: string) => {
    setSelectedCard(card);
    setQueryAndRouter({ ...router.query, card }, router);
  };

  const renderAssetStakingAprOrFpr = useCallback(
    () =>
      (asset?.staking?.apr || asset?.staking?.fpr) && (
        <Row>
          <strong>{asset?.staking?.apr.length > 0 ? 'APR' : 'FPR'}</strong>
          <ContentScrollBar>
            {asset?.staking.interestType === 'FPRI' ? (
              <ShowDetailsButton
                onClick={() => handleChangeActiveCard('Staking History')}
              >
                {t('common:Buttons.Show', {
                  type: `${t('assets:Staking.Details')}`,
                })}
              </ShowDetailsButton>
            ) : (
              asset?.staking.apr.reverse().map((apr, index) => (
                <span key={index}>
                  <p>Timestamp: {formatDate(apr.timestamp)}</p>
                  <p>Value: {toLocaleFixed((apr.value || 0) / 10 ** 2, 2)}%</p>
                </span>
              ))
            )}
          </ContentScrollBar>
        </Row>
      ),
    [asset?.staking],
  );

  if (!asset?.royalties) return null;

  return (
    <>
      <Row span={2}>
        <SectionTitle>Staking</SectionTitle>
      </Row>
      <Row>
        <strong>{t('common:Cards.Total Staked')}</strong>
        <span>
          {toLocaleFixed(
            (asset?.staking?.totalStaked || 0) / 10 ** asset?.precision,
            asset?.precision,
          )}
        </span>
      </Row>

      {asset?.staking?.interestType === 'FPRI' && (
        <Row>
          <strong>{t('assets:Staking.Current FPR Amount')}</strong>

          <span>
            {toLocaleFixed(
              (asset?.staking?.currentFPRAmount || 0) / 10 ** asset?.precision,
              asset?.precision,
            )}
          </span>
        </Row>
      )}

      <Row>
        <strong> {t('assets:Staking.Min Epochs To Claim')}</strong>

        <span>{asset?.staking?.minEpochsToClaim || '--'}</span>
      </Row>
      <Row>
        <strong> {t('assets:Staking.Min Epochs To Unstake')}</strong>

        <span>{asset?.staking?.minEpochsToUnstake || '--'}</span>
      </Row>
      <Row>
        <strong> {t('assets:Staking.Min Epochs To Withdraw')}</strong>
        <span>{asset?.staking?.minEpochsToWithdraw || '--'}</span>
      </Row>
      <Row>
        <strong> {t('assets:Staking.Qty_Holders')}</strong>
        <span>{asset?.stakingHolders?.toLocaleString() || '--'}</span>
      </Row>
      {renderAssetStakingAprOrFpr()}
      <Row span={2}>
        <SectionTitle>Royalties</SectionTitle>
      </Row>
      <Row>
        <strong>{t('table:Address')}</strong>
        <p>{asset?.royalties?.address ?? '--'}</p>
      </Row>
      <Row>
        <strong>{t('assets:Staking.Market Fixed')}</strong>
        <p>
          {(asset?.royalties.marketFixed &&
            `${asset?.royalties.marketFixed / 10 ** KLV_PRECISION} KLV`) ||
            '--'}
        </p>
      </Row>
      <Row>
        <strong> {t('assets:Staking.Market Percentage')}</strong>
        <p>
          {(asset?.royalties.marketPercentage &&
            `${asset?.royalties.marketPercentage / 10 ** 2}%`) ||
            '--'}
        </p>
      </Row>
      <Row>
        <strong>{t('assets:Staking.Transfer Fixed')}</strong>
        <p>
          {asset?.royalties.transferFixed
            ? `${asset?.royalties.transferFixed / 10 ** 6} KLV`
            : '--'}
        </p>
      </Row>

      {!!asset?.royalties?.transferPercentage?.length &&
        asset?.royalties.transferPercentage.map(
          (transfer, index) =>
            !!Object.keys(transfer)?.length && (
              <Row key={index}>
                <strong>
                  {' '}
                  {t('assets:Staking.Transfer Percentage').toUpperCase()}
                </strong>
                <p>
                  {t('table:Amount').toUpperCase()}:{' '}
                  {toLocaleFixed(
                    (transfer.amount || 0) / 10 ** asset?.precision,
                    asset?.precision,
                  )}
                </p>
                <p>
                  {t('assets:Staking.Percentage').toUpperCase()}:{' '}
                  {transfer.percentage / 10 ** 2}%
                </p>
              </Row>
            ),
        )}

      {asset?.royalties?.itoPercentage && (
        <Row>
          <strong>ITO {t('assets:Staking.Percentage').toUpperCase()}</strong>
          <p>{`${asset.royalties.itoPercentage / 10 ** 2}%`}</p>
        </Row>
      )}

      {asset?.royalties?.itoFixed && (
        <Row>
          <strong>ITO {t('assets:Staking.Fixed').toUpperCase()}</strong>
          <p>{`${asset.royalties.itoFixed / 10 ** KLV_PRECISION} KLV`}</p>
        </Row>
      )}

      {(asset?.royalties?.splitRoyalties ?? []).length > 0 && (
        <>
          <Row span={2}>
            <SectionTitle>Split Royalties</SectionTitle>
          </Row>
          {asset?.royalties?.splitRoyalties?.map((split, index) => (
            <Fragment key={index}>
              <Row span={2}>Split Royalty {index + 1}</Row>
              <Row>
                <strong>{t('table:Address')}</strong>
                <p>{split.address}</p>
              </Row>
              {split?.percentTransferPercentage && (
                <Row>
                  <strong>Percentage Over Transfer Percentage</strong>
                  <p>{split?.percentTransferPercentage}</p>
                </Row>
              )}
              {split?.percentITOFixed && (
                <Row>
                  <strong>Percentage Over ITO Fixed</strong>
                  <p>{split?.percentITOFixed}</p>
                </Row>
              )}
              {split?.percentITOPercentage && (
                <Row>
                  <strong>Percentage Over ITO Percentage</strong>
                  <p>{split?.percentITOPercentage}</p>
                </Row>
              )}
              {split?.percentMarketFixed && (
                <Row>
                  <strong>Percentage Over Market Fixed</strong>
                  <p>{split.percentMarketFixed}</p>
                </Row>
              )}
              {split?.percentMarketPercentage && (
                <Row>
                  <strong>Percentage Over Market Percentage</strong>
                  <p>{split.percentMarketPercentage}</p>
                </Row>
              )}
              {split?.percentTransferFixed && (
                <Row>
                  <strong>Percentage Over Transfer Fixed</strong>
                  <p>{split.percentTransferFixed}</p>
                </Row>
              )}
            </Fragment>
          ))}
        </>
      )}
    </>
  );
};
