import Tooltip from '@/components/Tooltip';
import { useMobile } from '@/contexts/mobile';
import { IAPR, IFPR, IKDAFPR, IStaking } from '@/types/index';
import { toLocaleFixed } from '@/utils/formatFunctions';
import {
  EpochDepositsWrapper,
  EpochGeneralData,
  EpochWrapper,
  FPRFrozenContainer,
  FPRRow,
  FallbackFPRRow,
  HistoryWrapper,
  NoDepositsContainer,
  PaginationHistory,
  StakingHeader,
  StakingHeaderSpan,
  StakingHistoryTitle,
} from '@/views/assets/detail';
import { useTranslation } from 'next-i18next';
import { default as React, useState } from 'react';
import { AssetProps } from './OverviewTab';

interface IStakingHistoryProps extends AssetProps {
  staking: IStaking | undefined;
}

export const StakingHistoryTab: React.FC<IStakingHistoryProps> = ({
  asset,
  staking,
}) => {
  if (!staking) return null;
  if (asset?.staking.interestType === 'APRI') {
    return <APRHistory apr={staking.apr as IAPR[]} />;
  }
  return <FPRHistory fpr={staking.fpr as IFPR[]} asset={asset} />;
};

interface FPRHistoryProps extends AssetProps {
  fpr: IFPR[];
}

const FPRHistory: React.FC<FPRHistoryProps> = ({ fpr, asset }) => {
  const { t } = useTranslation(['common', 'assets']);
  const isMobile = useMobile();
  const [FPRIndex, setFPRIndex] = useState<number>(3);

  const showDefaultItems = () => {
    setFPRIndex(3);
    window.scrollTo(0, 0);
  };

  const renderHistoryContent = (historyArray: IFPR[], currentIndex: number) => (
    <EpochWrapper>
      <EpochGeneralData>
        <div>
          <strong>Epoch</strong>
          <br />
          <strong>{historyArray[currentIndex].epoch}</strong>
        </div>
        <StakingHeader>
          <StakingHeaderSpan>
            {t('common:Cards.Total Staked')} {t('assets:Staking.Of')} <br />
            {asset?.name}
            <br />
            <strong>
              {toLocaleFixed(
                historyArray[currentIndex]?.totalStaked || 0,
                historyArray[currentIndex].precision || 0,
              )}
            </strong>
          </StakingHeaderSpan>
        </StakingHeader>
      </EpochGeneralData>
    </EpochWrapper>
  );

  const renderStakingHistory = (historyArray: IFPR[], offset: number) => {
    const elements: JSX.Element[] = [];
    const fprLength = asset?.staking?.fpr?.length;
    if (typeof fprLength !== 'number') {
      return elements;
    }

    let currentIndex = fprLength - 1;
    let indexEnd = fprLength - offset;

    if (indexEnd < 0) {
      indexEnd = 0;
    }

    for (currentIndex; currentIndex >= indexEnd; currentIndex--) {
      const hasDataToRender =
        !!historyArray[currentIndex]?.totalAmount ||
        !!historyArray[currentIndex]?.TotalClaimed ||
        historyArray[currentIndex]?.kda.length > 0;
      elements.push(
        hasDataToRender ? (
          <FPRRow
            key={historyArray[currentIndex].epoch}
            isStakingRoyalties={false}
          >
            <HistoryWrapper>
              {renderHistoryContent(historyArray, currentIndex)}
              <EpochDepositsWrapper>
                {(!!historyArray[currentIndex]?.totalAmount ||
                  !!historyArray[currentIndex]?.TotalClaimed) && (
                  <FPRFrozenContainer>
                    <div>
                      <strong>KDA</strong>
                      <p>KLV</p>
                    </div>
                    <div>
                      <strong>{t('assets:Staking.Total Deposited')}</strong>
                      {/* here is always KLV */}
                      <p>
                        {toLocaleFixed(
                          historyArray[currentIndex]?.totalAmount,
                          6,
                        )}
                      </p>
                    </div>
                    <div>
                      <strong>{t('assets:Staking.Total claimed')}</strong>
                      {/* here is always KLV */}
                      <p>
                        {toLocaleFixed(
                          historyArray[currentIndex]?.TotalClaimed,
                          6,
                        )}
                      </p>
                    </div>
                  </FPRFrozenContainer>
                )}

                {historyArray[currentIndex].kda.map((kda: IKDAFPR) => {
                  return (
                    <FPRFrozenContainer key={kda.kda}>
                      <div>
                        <strong>KDA</strong>
                        <p>{kda.kda}</p>
                      </div>
                      <div>
                        <strong>{t('assets:Staking.Total Deposited')}</strong>
                        <p>
                          {toLocaleFixed(kda?.totalAmount, kda.precision || 0)}
                        </p>
                      </div>
                      <div>
                        <strong>{t('assets:Staking.Total claimed')}</strong>
                        <p>
                          {toLocaleFixed(kda?.totalClaimed, kda.precision || 0)}
                        </p>
                      </div>
                    </FPRFrozenContainer>
                  );
                })}
              </EpochDepositsWrapper>
            </HistoryWrapper>
          </FPRRow>
        ) : (
          <FPRRow isStakingRoyalties={false} span={2}>
            <FallbackFPRRow>
              <HistoryWrapper>
                <EpochDepositsWrapper>
                  {renderHistoryContent(historyArray, currentIndex)}
                </EpochDepositsWrapper>
              </HistoryWrapper>

              <NoDepositsContainer>
                {asset?.assetId === 'KLV' || asset?.assetId === 'KFI' ? (
                  <p>
                    {t('assets:Staking.No Deposits')}
                    <br />
                    <br />
                    {t('assets:Staking.Info Deposits KLVorKFI')}
                  </p>
                ) : (
                  <p>{t('assets:Staking.No Deposits')}</p>
                )}
              </NoDepositsContainer>
            </FallbackFPRRow>
          </FPRRow>
        ),
      );
    }
    return elements;
  };

  const renderFPRHeaderMsg = () => {
    if (asset?.assetId !== 'KLV' && asset?.assetId !== 'KFI') {
      return (
        <>
          {isMobile ? (
            <Tooltip
              msg={t('assets:Staking.InfoOtherAssets', {
                asset: asset?.name,
              })}
            />
          ) : (
            <p>{t('assets:Staking.InfoOtherAssets', { asset: asset?.name })}</p>
          )}
        </>
      );
    }
    return (
      <>
        {isMobile ? (
          <Tooltip
            msg={t('assets:Staking.InfoKLVorKFI', { asset: asset?.name })}
          />
        ) : (
          <>
            <p>{t('assets:Staking.InfoKLVorKFI', { asset: asset?.name })}</p>
          </>
        )}
      </>
    );
  };
  return (
    <div>
      <StakingHistoryTitle>
        <strong>{t('assets:Staking.Title History', { type: 'FPR' })}</strong>
        {renderFPRHeaderMsg()}
      </StakingHistoryTitle>

      {renderStakingHistory(fpr, FPRIndex)}

      {!((asset?.staking?.fpr?.length || 0) - FPRIndex <= 0) && (
        <PaginationHistory
          onClick={() => setFPRIndex(asset?.staking?.fpr?.length || 0)}
        >
          <strong>
            {t('common:Buttons.Show', {
              type: `${t('common:Tabs.More').toLowerCase()}`,
            })}
          </strong>
        </PaginationHistory>
      )}

      {!!((asset?.staking?.fpr?.length || 0) - FPRIndex <= 0) &&
        !!((asset?.staking?.fpr?.length || 0) > 3) && (
          <PaginationHistory onClick={() => showDefaultItems()}>
            <strong>Show less</strong>
          </PaginationHistory>
        )}
    </div>
  );
};

interface APRHistoryProps {
  apr: IAPR[];
}

const APRHistory: React.FC<APRHistoryProps> = ({ apr }) => {
  return <></>;
};
