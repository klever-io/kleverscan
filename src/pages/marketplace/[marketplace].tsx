import { WarningIcon } from '@/assets/calendar';
import Copy from '@/components/Copy';
import Title from '@/components/Layout/Title';
import BuyCard from '@/components/Marketplace/Buycard';
import { BuyCardSkeleton } from '@/components/Marketplace/BuyCardSkeleton';
import Pagination from '@/components/Pagination';
import { PaginationContainer } from '@/components/Pagination/styles';
import {
  getBuyCards,
  getMarketplace,
} from '@/services/requests/marketplace/marketplace';
import {
  CardContent,
  CardHeader,
  CardHeaderItem,
  CardTabContainer,
  Container,
  Header,
  Row,
} from '@/styles/common';
import { IAsset } from '@/types';
import {
  IMarketplace,
  IMarketplaceAsset,
  IMarketplaceAssets,
  IMarketplaceResponse,
} from '@/types/marketplaces';
import { setQueryAndRouter } from '@/utils';
import { PERCENTAGE_PRECISION } from '@/utils/globalVariables';
import { CenteredRowSpan, CommonSpan } from '@/views/blocks/detail';
import {
  DefaultReturn,
  GridSales,
  MktplaceCenteredRow,
} from '@/views/marketplaces/detail';
import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useQuery, UseQueryResult } from 'react-query';

export interface IBuyCard {
  marketplaceAsset: IMarketplaceAsset;
  precisionQueries: UseQueryResult<[string, number], unknown>[];
  saleAssetsLoading: boolean;
  saleAssets: IAsset[] | undefined;
}

const MarketplaceDetails: React.FC<IMarketplaceResponse> = props => {
  const serversideMarketplaceResponse = props;
  const pagination = props.pagination;
  const router = useRouter();
  const [page, setPage] = useState(1);

  // const assetsKeys = Object.keys(
  //   serversideMarketplaceResponse.data.assets.assets || [],
  // );

  // const { data: saleAssets, isLoading: saleAssetsLoading } = useQuery(
  //   'saleAssets',
  //   () => requestAssets(sanitizedAssetKeys),
  // );
  const serversideMarketplace: IMarketplace =
    serversideMarketplaceResponse.data.assets;

  const { data: buyCardsData, isFetching: buyCardsLoading } = useQuery({
    queryKey: ['buycard', page],
    queryFn: () => getBuyCards(serversideMarketplace.id, page),
    enabled: router?.isReady,
  });
  const marketplaceAssets: IMarketplaceAssets | null | undefined =
    buyCardsData?.marketplaceResponse?.data?.assets?.assets;

  const assets = buyCardsData?.assets || [];

  // const precisionQueries = useQueries(
  //   assetsKeys.map(key => {
  //     return {
  //       queryKey: ['key', key],
  //       queryFn: () =>
  //         getCurrencyIdData(
  //           marketplace?.assets?.[key]?.sell?.currencyId?.toLocaleUpperCase() ||
  //             '',
  //         ),
  //     };
  //   }),
  // );

  // const getCurrencyIdData = async (
  //   currencyId: string,
  // ): Promise<[string, number]> => {
  //   if (!currencyId) {
  //     return [currencyId, 0];
  //   }
  //   const precision = await getPrecision(currencyId);
  //   return [currencyId, precision];
  // };

  const Overview: React.FC = () => {
    return (
      <>
        <Row>
          <CommonSpan>
            <strong>Marketplace Name</strong>
          </CommonSpan>
          <MktplaceCenteredRow>
            <CenteredRowSpan>{serversideMarketplace.name}</CenteredRowSpan>
          </MktplaceCenteredRow>
        </Row>
        <Row>
          <CommonSpan>
            <strong> Marketplace Id</strong>
          </CommonSpan>
          <CommonSpan>
            <MktplaceCenteredRow>
              <span>{serversideMarketplace.id}</span>
              <Copy info="Marketplace Id" data={serversideMarketplace.id} />
            </MktplaceCenteredRow>
          </CommonSpan>
        </Row>
        <Row>
          <CommonSpan>
            <strong>Owner Address</strong>
          </CommonSpan>
          <MktplaceCenteredRow style={{ overflow: 'hidden' }}>
            <Link
              href={`/account/${serversideMarketplace.ownerAddress}`}
              key={serversideMarketplace.ownerAddress}
            >
              {serversideMarketplace.ownerAddress}
            </Link>
            <Copy
              data={serversideMarketplace.ownerAddress}
              info="Marketplace Owner Address"
            />
          </MktplaceCenteredRow>
        </Row>
        <Row>
          <CommonSpan>
            <strong>Referral Address</strong>
          </CommonSpan>
          <MktplaceCenteredRow style={{ overflow: 'hidden' }}>
            {serversideMarketplace.referralAddress ? (
              <>
                <Link
                  href={`/account/${serversideMarketplace?.referralAddress}`}
                >
                  {serversideMarketplace?.referralAddress}
                </Link>
                <Copy
                  data={serversideMarketplace?.referralAddress || '-'}
                  info="Referral Address"
                />{' '}
              </>
            ) : (
              '-'
            )}
          </MktplaceCenteredRow>
        </Row>
        <Row>
          <CommonSpan>
            <strong>Referral Percentage</strong>
          </CommonSpan>
          <CommonSpan>
            <small>
              {typeof serversideMarketplace?.referralPercentage === 'number'
                ? `${
                    serversideMarketplace?.referralPercentage /
                    10 ** PERCENTAGE_PRECISION
                  } %`
                : '-'}
            </small>
          </CommonSpan>
        </Row>
      </>
    );
  };

  useEffect(() => {
    setPage(Number(router?.query?.page || 1));
  }, [router?.isReady, router?.query]);

  const renderSellCards = () => {
    if (marketplaceAssets && !Object.keys(marketplaceAssets).length) {
      return (
        <DefaultReturn>
          <WarningIcon />
          <span>No sell orders yet</span>
        </DefaultReturn>
      );
    }
    return (
      <GridSales>
        {!buyCardsLoading &&
          marketplaceAssets &&
          Object.keys(marketplaceAssets).map(assetId => {
            return (
              <>
                {!buyCardsLoading && marketplaceAssets && (
                  <BuyCard
                    key={assetId}
                    // precisionQueries={precisionQueries}
                    marketplaceAsset={marketplaceAssets[assetId]}
                    buyCardsLoading={buyCardsLoading}
                    assets={assets}
                  />
                )}
              </>
            );
          })}
        {buyCardsLoading &&
          Array(10)
            .fill(10)
            .map((_, i) => <BuyCardSkeleton key={i} />)}
      </GridSales>
    );
  };

  return (
    <Container>
      <Header>
        <Title title="Marketplace Details" route="/marketplaces" />
      </Header>
      <CardTabContainer>
        <CardHeader>
          <CardHeaderItem selected={true}>
            <span>Overview</span>
          </CardHeaderItem>
        </CardHeader>
        <CardContent>
          <Overview />
        </CardContent>
      </CardTabContainer>
      {renderSellCards()}
      <PaginationContainer>
        <Pagination
          scrollUp={true}
          count={pagination?.totalPages}
          page={page}
          onPaginate={page => {
            setPage(Number(router.query?.page) || page);
            setQueryAndRouter(
              { ...router.query, page: page.toString() },
              router,
            );
          }}
        />
      </PaginationContainer>
    </Container>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths: string[] = [];

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<IMarketplaceResponse> = async ({
  params,
}) => {
  const redirectProps = { redirect: { destination: '/404', permanent: false } };

  let props = {} as IMarketplaceResponse;

  const marketplaceId = params?.marketplace;

  if (typeof marketplaceId !== 'string' || marketplaceId.length !== 16) {
    return redirectProps;
  }

  const marketplaceResponse = await getMarketplace(marketplaceId, 1);

  if (!marketplaceResponse?.data?.assets) {
    return redirectProps;
  }
  props = marketplaceResponse;
  return { props };
};

export default MarketplaceDetails;
