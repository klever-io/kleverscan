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
  ];
  asset?.uris && cardHeaders.push('URIS');
  assetPool && cardHeaders.push('KDA Pool');
  ITO && cardHeaders.push('ITO');
  asset?.royalties && cardHeaders.push('Staking & Royalties');
  if (asset?.staking?.interestType === 'FPRI') {
    asset?.staking && cardHeaders.push('Staking History');
  }

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
      case 'URIS':
        return <UrisTab asset={asset} />;
      case 'Staking & Royalties':
        return (
          <StakingRoyaltiesTab
            asset={asset}
            setSelectedCard={setSelectedCard}
          />
        );
      case 'ITO':
        return <ITOTab ITO={ITO} />;
      case 'KDA Pool':
        return <KDAPoolTab asset={asset} assetPool={assetPool} />;
      case 'Staking History':
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
