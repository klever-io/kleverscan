import { WarningIcon } from '@/assets/calendar';
import Copy from '@/components/Copy';
import Title from '@/components/Layout/Title';
import BuyCard from '@/components/Marketplace/Buycard';
import { BuyCardSkeleton } from '@/components/Marketplace/BuyCardSkeleton';
import Pagination from '@/components/Pagination';
import { PaginationContainer } from '@/components/Pagination/styles';
import { getBuyCards, getMarketplace } from '@/services/requests/marketplace';
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
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { useQuery, UseQueryResult } from 'react-query';
import nextI18nextConfig from '../../../next-i18next.config';

export interface IBuyCard {
  marketplaceAsset: IMarketplaceAsset;
  precisionQueries: UseQueryResult<[string, number], unknown>[];
  saleAssetsLoading: boolean;
  saleAssets: IAsset[] | undefined;
}

const MarketplaceDetails: React.FC<IMarketplaceResponse> = props => {
  const serversideMarketplaceResponse = props;
  const { t } = useTranslation(['common', 'marketPlaces']);
  const pagination = props.pagination;
  const router = useRouter();
  const [page, setPage] = useState(1);

  const tableRef = useRef<HTMLDivElement>(null);

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
            <strong>
              {t('marketPlaces:MarketplaceType', {
                type: `${t('marketPlaces:Name')}`,
              })}
            </strong>
          </CommonSpan>
          <MktplaceCenteredRow>
            <CenteredRowSpan>{serversideMarketplace.name}</CenteredRowSpan>
          </MktplaceCenteredRow>
        </Row>
        <Row>
          <CommonSpan>
            <strong>{t('marketplaces:MarketplaceType', { type: 'Id' })}</strong>
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
            <strong>{t('marketplaces:OwnerAddress')}</strong>
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
            <strong>{t('marketPlaces:ReferralAddress')}</strong>
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
            <strong>{t('marketPlaces:ReferralPercentage')}</strong>
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
          <span>{t('marketPlaces:NoOrders')}</span>
        </DefaultReturn>
      );
    }
    return (
      <GridSales>
        {!buyCardsLoading &&
          marketplaceAssets &&
          Object.keys(marketplaceAssets).map(assetId => {
            return (
              <React.Fragment key={assetId}>
                {!buyCardsLoading && marketplaceAssets && (
                  <BuyCard
                    // precisionQueries={precisionQueries}
                    marketplaceAsset={marketplaceAssets[assetId]}
                    buyCardsLoading={buyCardsLoading}
                    assets={assets}
                  />
                )}
              </React.Fragment>
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
        <Title
          title={t('marketPlaces:MarketplaceDetails')}
          route="/marketplaces"
        />
      </Header>
      <CardTabContainer ref={tableRef}>
        <CardHeader>
          <CardHeaderItem selected={true}>
            <span>{t('common:Tabs.Overview')}</span>
          </CardHeaderItem>
        </CardHeader>
        <CardContent>
          <Overview />
        </CardContent>
      </CardTabContainer>
      {renderSellCards()}
      <PaginationContainer>
        <Pagination
          tableRef={tableRef}
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

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: 'blocking', //indicates the type of fallback
  };
};

export const getStaticProps: GetStaticProps<IMarketplaceResponse> = async ({
  params,
  locale = 'en',
}) => {
  const redirectProps = { redirect: { destination: '/404', permanent: false } };
  const translations = await serverSideTranslations(
    locale,
    ['common', 'marketPlaces'],
    nextI18nextConfig,
    ['en'],
  );
  let props = {} as IMarketplaceResponse;

  const marketplaceId = params?.marketplace;

  if (typeof marketplaceId !== 'string' || marketplaceId.length !== 16) {
    return redirectProps;
  }

  const marketplaceResponse = await getMarketplace(marketplaceId, 1);

  if (!marketplaceResponse?.data?.assets) {
    return redirectProps;
  }

  props = { ...marketplaceResponse }; // Coloque apenas os dados da API

  return { props: { ...props, ...translations } }; // Retorna props combinado com translations
};

export default MarketplaceDetails;
