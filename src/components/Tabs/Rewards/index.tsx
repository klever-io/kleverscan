import { ROW_LAYOUT_MIN_WIDTH } from '@/components/DataList/layout';
import { TokenMark } from '@/components/DataList/styles';
import AssetLogo from '@/components/Logo/AssetLogo';
import { PropsWithChildren } from 'react';
import Table, { ITable } from '@/components/Table';
import { IInnerTableProps, IRewardsAssets, IRowSection } from '@/types/index';
import { KLV_PRECISION } from '@/utils/globalVariables';
import ExplorerLink from '@/components/ExplorerLink';
import { useTranslation } from 'next-i18next';
import React, { useState } from 'react';
import {
  ArrowExpand,
  ExpandButton,
  RewardLine,
  RewardLines,
  RewardsTableWrapper,
} from './styles';

interface IRewards {
  rewardsTableProps: IInnerTableProps;
}

const Rewards: React.FC<PropsWithChildren<IRewards>> = ({
  rewardsTableProps,
}) => {
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const { t } = useTranslation('common');
  const headers = ['Asset Id', 'Rewards'];

  const toggleExpand = (assetId: string) => {
    setExpanded(prevState => ({
      ...prevState,
      [assetId]: !prevState[assetId],
    }));
  };
  const rowSections = (props: IRewardsAssets): IRowSection[] => {
    const { assetId, allStakingRewards, allowance, assetName, logo, verified } =
      props;
    const ticker = props.ticker || assetId?.split('-')[0] || '';

    const displayRewards = expanded[assetId]
      ? allStakingRewards
      : allStakingRewards?.slice(0, 3);

    const sections: IRowSection[] = [
      {
        element: props => (
          <TokenMark>
            <AssetLogo
              logo={logo || ''}
              ticker={ticker}
              name={assetName || ticker}
              verified={verified}
              size={32}
            />
            <ExplorerLink type="asset" value={assetId} compact />
          </TokenMark>
        ),
        span: 1,
      },
      {
        element: props => (
          <RewardLines>
            {displayRewards && displayRewards.length >= 1 ? (
              displayRewards.map((rewards, key) => (
                <RewardLine key={key}>
                  <span>{rewards.assetId || ''}</span>
                  <span>
                    {(
                      rewards.rewards /
                      10 ** rewards.precision
                    ).toLocaleString()}
                  </span>
                </RewardLine>
              ))
            ) : (
              <RewardLine>
                <span>{assetId || ''}</span>
                <span>{allowance / 10 ** KLV_PRECISION || 0}</span>
              </RewardLine>
            )}
            {!!allStakingRewards?.length && allStakingRewards.length > 3 && (
              <ExpandButton type="button" onClick={() => toggleExpand(assetId)}>
                {expanded[assetId] ? t('Buttons.Hide') : t('Buttons.Expand')}
                <ArrowExpand $open={!!expanded[assetId]} />
              </ExpandButton>
            )}
          </RewardLines>
        ),
        span: 1,
      },
    ];

    return sections;
  };
  const tableProps: ITable = {
    ...rewardsTableProps,
    rowSections,
    type: 'rewards',
    header: headers,
    singleLineSkeleton: true,
  };

  return (
    <RewardsTableWrapper>
      <Table {...tableProps} cardBreakpoint={ROW_LAYOUT_MIN_WIDTH} />
    </RewardsTableWrapper>
  );
};

export default Rewards;
