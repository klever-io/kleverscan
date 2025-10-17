import { PropsWithChildren } from 'react';
import { NonceDetails } from '@/components/Asset/NFTDetails';
import Table, { ITable } from '@/components/Table';
import {
  CardContent,
  CardHeader,
  CardHeaderItem,
  CardTabContainer,
} from '@/styles/common';
import { IAsset } from '@/types';
import { SingleNFTTableContainer } from '@/views/accounts';
import { CardContainer } from '@/views/transactions/detail';
import { useQuery } from 'react-query';
import { requestNonceHolder } from '@/services/requests/asset/nonce';
import { AssetCardContent } from '@/views/assets';

interface INonFungibleViewProps {
  assetId: string;
  nonceValue: string;
  nonceData: (IAsset & { nonce?: string }) | undefined;
  isLoadingNonce: boolean;
  tableProps: ITable;
}

export const NonFungibleView: React.FC<
  PropsWithChildren<INonFungibleViewProps>
> = ({ assetId, nonceValue, nonceData, isLoadingNonce, tableProps }) => {
  const { data: holderAddress, isLoading: isLoadingHolder } = useQuery({
    queryKey: [`nftHolder-${assetId}-${nonceValue}`, assetId, nonceValue],
    queryFn: () => requestNonceHolder(assetId, nonceValue),
    enabled: !!assetId && !!nonceValue,
  });

  return (
    <>
      <CardTabContainer>
        <CardHeader>
          <CardHeaderItem selected>
            <span>Overview</span>
          </CardHeaderItem>
        </CardHeader>
        <AssetCardContent>
          <NonceDetails
            nonce={nonceData ? { ...nonceData, nonce: nonceValue } : undefined}
            holderAddress={holderAddress}
            isLoading={isLoadingNonce || isLoadingHolder}
            showAddress={true}
          />
        </AssetCardContent>
      </CardTabContainer>

      <CardContainer>
        <SingleNFTTableContainer>
          <h3>Asset Transactions</h3>
          <Table {...tableProps} />
        </SingleNFTTableContainer>
      </CardContainer>
    </>
  );
};
