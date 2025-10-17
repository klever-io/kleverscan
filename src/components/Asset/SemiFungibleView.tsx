import { AssetTabs } from '@/components/Asset/AssetTabs';
import { SftMetadata } from '@/components/Asset/SFTMetadata';
import Table, { ITable } from '@/components/Table';
import { assetPoolCall, ITOCall } from '@/services/requests/asset';
import { requestSftDetails } from '@/services/requests/asset/nonce';
import { CardContainer } from '@/views/transactions/detail';
import { useRouter } from 'next/router';
import { PropsWithChildren } from 'react';
import { useQuery } from 'react-query';

interface ISemiFungibleViewProps {
  tableProps: ITable;
}

export const SemiFungibleView: React.FC<
  PropsWithChildren<ISemiFungibleViewProps>
> = ({ tableProps }) => {
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
      <AssetTabs asset={sftData} />

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
