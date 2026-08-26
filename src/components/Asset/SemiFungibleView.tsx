import { SftMetadata } from '@/components/Asset/SFTMetadata';
import { SftOverviewTab } from '@/components/Asset/SftOverviewTab';
import Table, { ITable } from '@/components/Table';
import { requestSftDetails } from '@/services/requests/asset/nonce';
import {
  CardContent,
  CardHeader,
  CardHeaderItem,
  CardTabContainer,
} from '@/styles/common';
import { AssetCardContent } from '@/views/assets';
import { CardContainer } from '@/views/transactions/detail';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { PropsWithChildren, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

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
    queryKey: [`sftDetail-${assetId}-${nonceValue}`, assetId, nonceValue],
    queryFn: () => requestSftDetails(assetId, nonceValue),
    enabled: !!router?.isReady && !!assetId && !!nonceValue,
  });

  return (
    <>
      <CardTabContainer>
        <CardHeader>
          <CardHeaderItem selected>
            <span>{t('common:Tabs.Overview')}</span>
          </CardHeaderItem>
        </CardHeader>

        <AssetCardContent>
          <SftOverviewTab sft={sftData} />
        </AssetCardContent>
      </CardTabContainer>

      <SftMetadata
        sft={sftData ? { ...sftData, nonce: nonceValue } : undefined}
      />

      <CardContainer>
        <h3>Asset Transactions</h3>
        <Table {...tableProps} />
      </CardContainer>
    </>
  );
};
