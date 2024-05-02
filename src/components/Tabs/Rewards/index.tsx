import Table, { ITable } from '@/components/TableV2';
import { IInnerTableProps, IRewardsAssets, IRowSection } from '@/types/index';
import { KLV_PRECISION } from '@/utils/globalVariables';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import React, { useState } from 'react';
import {
  ArrowExpand,
  ButtonContent,
  FrozenContainerRewards,
  FrozenContent,
} from './styles';

interface IRewards {
  rewardsTableProps: IInnerTableProps;
}

const Rewards: React.FC<IRewards> = ({ rewardsTableProps }) => {
  const [expanded, setExpanded] = useState({});
  const { t } = useTranslation('common');
  const headers = ['Asset Id', 'Rewards'];

  const toggleExpand = (assetId: string) => {
    setExpanded(prevState => ({
      ...prevState,
      [assetId]: !prevState[assetId],
    }));
  };
  const rowSections = (props: IRewardsAssets): IRowSection[] => {
    const { assetId, allStakingRewards, allowance } = props;

    const displayRewards = expanded[assetId]
      ? allStakingRewards
      : allStakingRewards?.slice(0, 3);

    const sections: IRowSection[] = [
      {
        element: props => (
          <Link key={assetId} href={`/asset/${assetId}`}>
            {assetId}
          </Link>
        ),
        span: 1,
      },
      {
        element: props => (
          <>
            <FrozenContainerRewards>
              {displayRewards && displayRewards.length >= 1 ? (
                displayRewards.map((rewards, key) => (
                  <FrozenContent key={key}>
                    <span>{` ${rewards.assetId || ''}`}</span>
                    <span>
                      {(
                        rewards.rewards /
                        10 ** rewards.precision
                      ).toLocaleString()}
                    </span>
                  </FrozenContent>
                ))
              ) : (
                <FrozenContent>
                  <span>{` ${assetId || ''}`}</span>
                  <span>{allowance / 10 ** KLV_PRECISION || 0}</span>
                </FrozenContent>
              )}
              {allStakingRewards?.length && allStakingRewards?.length > 3 && (
                <ButtonContent onClick={() => toggleExpand(assetId)}>
                  <p>
                    {expanded[assetId]
                      ? t('Buttons.Hide')
                      : t('Buttons.Expand')}
                  </p>
                  <ArrowExpand expended={expanded[assetId]} />
                </ButtonContent>
              )}
            </FrozenContainerRewards>
          </>
        ),
        span: 2,
      },
    ];

    return sections;
  };
  const tableProps: ITable = {
    ...rewardsTableProps,
    rowSections,
    type: 'rewards',
    header: headers,
  };

  return <Table {...tableProps} />;
};

export default Rewards;
