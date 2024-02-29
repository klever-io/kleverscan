import { setQueryAndRouter } from '@/utils';
import { formatDate, toLocaleFixed } from '@/utils/formatFunctions';
import { KLV_PRECISION } from '@/utils/globalVariables';
import {
  ContentRow,
  ContentScrollBar,
  FrozenContainer,
  Row,
  ShowDetailsButton,
} from '@/views/assets/detail';
import { BalanceContainer, RowContent } from '@/views/proposals/detail';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { default as React, useCallback } from 'react';
import { AssetProps } from './OverviewTab';

interface StakingRoyaltiesTabProps extends AssetProps {
  setSelectedCard: (card: string) => void;
}

export const StakingRoyaltiesTab: React.FC<StakingRoyaltiesTabProps> = ({
  asset,
  setSelectedCard,
}) => {
  const { t } = useTranslation(['common', 'assets']);
  const router = useRouter();

  const stakingAprOrFpr = useCallback(() => {
    if (asset?.staking?.apr || asset?.staking?.fpr) {
      return (
        <ContentRow>
          <strong>{asset?.staking?.apr.length > 0 ? 'APR' : 'FPR'}</strong>
          <ContentScrollBar>
            {asset?.staking.interestType === 'FPRI' ? (
              <ShowDetailsButton
                onClick={() => {
                  const updatedQuery = { ...router.query };
                  setSelectedCard('Staking History');
                  setQueryAndRouter(
                    { ...updatedQuery, card: 'Staking History' },
                    router,
                  );
                }}
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
        </ContentRow>
      );
    }
    return;
  }, [asset?.staking]);

  return (
    <>
      {asset?.royalties && (
        <div>
          <Row isStakingRoyalties={true}>
            <span>
              <strong>Royalties</strong>
            </span>
            <RowContent>
              <BalanceContainer>
                <FrozenContainer>
                  <div>
                    <strong>{t('table:Address')}</strong>
                    <p>{asset?.royalties.address || '--'}</p>
                  </div>
                  <div>
                    <strong>{t('assets:Staking.Market Fixed')}</strong>
                    <p>
                      {(asset?.royalties.marketFixed &&
                        `${
                          asset?.royalties.marketFixed / 10 ** KLV_PRECISION
                        } KLV`) ||
                        '--'}
                    </p>
                  </div>
                  <div>
                    <strong> {t('assets:Staking.Market Percentage')}</strong>
                    <p>
                      {(asset?.royalties.marketPercentage &&
                        `${asset?.royalties.marketPercentage / 10 ** 2}%`) ||
                        '--'}
                    </p>
                  </div>
                  <div>
                    <strong>{t('assets:Staking.Transfer Fixed')}</strong>
                    <p>
                      {asset?.royalties.transferFixed
                        ? `${asset?.royalties.transferFixed / 10 ** 6} KLV`
                        : '--'}
                    </p>
                  </div>
                  {asset?.royalties.transferPercentage ? (
                    asset?.royalties.transferPercentage.map(
                      (transfer, index) =>
                        Object.keys(transfer).length > 0 && (
                          <div key={index}>
                            <strong>
                              {' '}
                              {t('assets:Staking.Transfer Percentage')}
                            </strong>
                            <p>
                              {t('table:Amount')}:{' '}
                              {toLocaleFixed(
                                (transfer.amount || 0) / 10 ** asset?.precision,
                                asset?.precision,
                              )}
                            </p>
                            <p>
                              {t('assets:Staking.Percentage')}:{' '}
                              {transfer.percentage / 10 ** 2}%
                            </p>
                          </div>
                        ),
                    )
                  ) : (
                    <div>
                      <strong>
                        {' '}
                        {t('assets:Staking.Transfer Percentage')}
                      </strong>
                      <p>{t('table:Amount')}: --</p>
                      <p>{t('assets:Staking.Percentage')}: -- </p>
                    </div>
                  )}
                  {asset?.royalties?.itoPercentage && (
                    <div>
                      <strong>ITO {t('assets:Staking.Percentage')}</strong>
                      <p>
                        {`${asset.royalties.itoPercentage / 10 ** 2}%` || '--'}
                      </p>
                    </div>
                  )}
                  {asset?.royalties?.itoFixed && (
                    <div>
                      <strong>ITO {t('assets:Staking.Fixed')}</strong>
                      <p>
                        {`${
                          asset.royalties.itoFixed / 10 ** KLV_PRECISION
                        } KLV` || '--'}
                      </p>
                    </div>
                  )}
                </FrozenContainer>
              </BalanceContainer>
            </RowContent>
          </Row>
          <Row isStakingRoyalties={true}>
            <span>
              <strong>Staking</strong>
            </span>
            <RowContent>
              <BalanceContainer>
                <FrozenContainer>
                  <div>
                    <strong>{t('common:Cards.Total Staked')}</strong>
                    <p>
                      {toLocaleFixed(
                        (asset?.staking?.totalStaked || 0) /
                          10 ** asset?.precision,
                        asset?.precision,
                      )}
                    </p>
                  </div>
                  <div>
                    <strong>{t('assets:Staking.Current FPR Amount')}</strong>

                    <p>
                      {toLocaleFixed(
                        (asset?.staking?.currentFPRAmount || 0) /
                          10 ** asset?.precision,
                        asset?.precision,
                      )}
                    </p>
                  </div>
                  <div>
                    <strong> {t('assets:Staking.Min Epochs To Claim')}</strong>

                    <p>{asset?.staking?.minEpochsToClaim || '--'}</p>
                  </div>
                  <div>
                    <strong>
                      {' '}
                      {t('assets:Staking.Min Epochs To Unstake')}
                    </strong>

                    <p>{asset?.staking?.minEpochsToUnstake || '--'}</p>
                  </div>
                  <div>
                    <strong>
                      {' '}
                      {t('assets:Staking.Min Epochs To Withdraw')}
                    </strong>
                    <p>{asset?.staking?.minEpochsToWithdraw || '--'}</p>
                  </div>
                  {stakingAprOrFpr()}
                </FrozenContainer>
              </BalanceContainer>
            </RowContent>
          </Row>
        </div>
      )}
    </>
  );
};
