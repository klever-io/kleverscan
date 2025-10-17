import { ITOTab } from '@/components/Asset/ITOTab';
import { KDAPoolTab } from '@/components/Asset/KDAPoolTab';
import { MoreTab } from '@/components/Asset/MoreTab';
import { OverviewTab } from '@/components/Asset/OverviewTab';
import { StakingHistoryTab } from '@/components/Asset/StakingHistoryTab';
import { StakingRoyaltiesTab } from '@/components/Asset/StakingRoyaltiesTab';
import { UrisTab } from '@/components/Asset/URIsTab';
import { CardHeader, CardHeaderItem, CardTabContainer } from '@/styles/common';
import { IAsset, IParsedITO, IAssetPool } from '@/types';
import { AssetCardContent } from '@/views/assets';
import { useTranslation } from 'next-i18next';
import { PropsWithChildren, useCallback, useState } from 'react';

interface IAssetTabsProps {
  asset: IAsset | undefined;
  ITO?: IParsedITO | undefined;
  assetPool?: IAssetPool | undefined;
  onCardChange?: (card: string) => void;
  defaultCard?: string;
}

export const AssetTabs: React.FC<PropsWithChildren<IAssetTabsProps>> = ({
  asset,
  ITO,
  assetPool,
  onCardChange,
  defaultCard,
}) => {
  const { t } = useTranslation(['common', 'assets']);

  const cardHeaders = [
    `${t('common:Tabs.Overview')}`,
    `${t('common:Tabs.More')}`,
    ...(asset?.uris ? [t('common:Tabs.URIS')] : []),
    ...(assetPool ? [t('common:Tabs.KDA Pool')] : []),
    ...(ITO ? [t('common:Tabs.ITO')] : []),
    ...(asset?.royalties ? [t('common:Tabs.Staking & Royalties')] : []),
    ...(asset?.staking?.interestType === 'FPRI'
      ? [t('common:Tabs.Staking History')]
      : []),
  ];

  const [selectedCard, setSelectedCard] = useState(
    defaultCard || cardHeaders[0],
  );

  const handleCardChange = (header: string) => {
    setSelectedCard(header);
    onCardChange?.(header);
  };

  const SelectedComponent: React.FC<PropsWithChildren> = useCallback(() => {
    switch (selectedCard) {
      case `${t('common:Tabs.Overview')}`:
        return <OverviewTab asset={asset} />;
      case `${t('common:Tabs.More')}`:
        return <MoreTab asset={asset} />;
      case `${t('common:Tabs.URIS')}`:
        return <UrisTab asset={asset} />;
      case `${t('common:Tabs.Staking & Royalties')}`:
        return (
          <StakingRoyaltiesTab
            asset={asset}
            setSelectedCard={setSelectedCard}
          />
        );
      case `${t('common:Tabs.ITO')}`:
        return <ITOTab ITO={ITO} />;
      case `${t('common:Tabs.KDA Pool')}`:
        return <KDAPoolTab asset={asset} assetPool={assetPool} />;
      case `${t('common:Tabs.Staking History')}`:
        return <StakingHistoryTab staking={asset?.staking} asset={asset} />;
      default:
        return <div />;
    }
  }, [selectedCard, asset, ITO, assetPool, t]);

  return (
    <CardTabContainer>
      <CardHeader>
        {cardHeaders.map((header, index) => (
          <CardHeaderItem
            key={String(index)}
            selected={selectedCard === header}
            onClick={() => handleCardChange(header)}
          >
            <span>{header}</span>
          </CardHeaderItem>
        ))}
      </CardHeader>

      <AssetCardContent>
        <SelectedComponent />
      </AssetCardContent>
    </CardTabContainer>
  );
};
