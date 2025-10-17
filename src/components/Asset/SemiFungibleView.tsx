import { NonceDetails } from '@/components/Asset/NFTDetails';
import { OverviewTab } from '@/components/Asset/OverviewTab';
import Table, { ITable } from '@/components/Table';
import { requestSftDetails } from '@/services/requests/asset/nonce';
import { CardHeader, CardHeaderItem, CardTabContainer } from '@/styles/common';
import { AssetCardContent } from '@/views/assets';
import { CardContainer } from '@/views/transactions/detail';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { PropsWithChildren, useState } from 'react';
import { useQuery } from 'react-query';
import { SftMetadata } from './SFTMetadata';

interface ISemiFungibleViewProps {
  tableProps: ITable;
}

export const SemiFungibleView: React.FC<
  PropsWithChildren<ISemiFungibleViewProps>
> = ({ tableProps }) => {
  const { t } = useTranslation(['common', 'assets']);
  const router = useRouter();
  const assetId = router.query.asset as string;
  const nonceValue = router.query.nonce as string;

  const { data: sftData, isLoading } = useQuery({
    queryKey: [`nftDetail-${assetId}-${nonceValue}`, assetId, nonceValue],
    queryFn: () => requestSftDetails(assetId, nonceValue),
    enabled: !!router?.isReady && !!assetId && !!nonceValue,
  });

  const cardHeaders = [t('common:Tabs.Overview')];

  const [selectedCard, setSelectedCard] = useState(cardHeaders[0]);

  const SelectedComponent: React.FC<PropsWithChildren> = () => {
    switch (selectedCard) {
      case t('common:Tabs.Overview'):
        return <OverviewTab asset={sftData} />;
      default:
        return <div />;
    }
  };

  return (
    <>
      <CardTabContainer>
        <CardHeader>
          {cardHeaders.map((header, index) => (
            <CardHeaderItem
              key={String(index)}
              selected={selectedCard === header}
              onClick={() => {
                setSelectedCard(header);
              }}
            >
              <span>{header}</span>
            </CardHeaderItem>
          ))}
        </CardHeader>

        <AssetCardContent>
          <SelectedComponent />
        </AssetCardContent>
      </CardTabContainer>

      <SftMetadata
        sft={sftData ? { ...sftData, nonce: nonceValue } : undefined}
        isLoading={isLoading}
      />

      <CardContainer>
        <h3>Asset Transactions</h3>
        <Table {...tableProps} />
      </CardContainer>
    </>
  );
};
