import { Certified } from '@/assets/icons';
import { Assets as Icon } from '@/assets/title-icons';
import Title from '@/components/Layout/Title';
import AssetLogo from '@/components/Logo/AssetLogo';
import Pagination from '@/components/Pagination';
import { PaginationContainer } from '@/components/Pagination/styles';
import Table, { ITable } from '@/components/Table';
import api from '@/services/api';
import { IAsset, IPagination, IResponse } from '@/types/index';
import { useDidUpdateEffect } from '@/utils/hooks';
import { formatAmount, parseHardCodedInfo } from '@/utils/index';
import { Container, Header, Input } from '@/views/assets';
import { LetterLogo, Logo } from '@/views/assets/index';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactNode, useState } from 'react';
import { IoIosInfinite } from 'react-icons/io';

interface IAssetPage {
  assets: IAsset[];
  pagination: IPagination;
}

interface IAssetResponse extends IResponse {
  data: {
    assets: IAsset[];
  };
  pagination: IPagination;
}

const Assets: React.FC<IAssetPage> = ({
  assets: defaultAssets,
  pagination,
}) => {
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [assets, setAssets] = useState(defaultAssets);
  const [loading, setLoading] = useState(false);

  useDidUpdateEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const response: IAssetResponse = await api.getCached({
        route: `assets/kassets?hidden=false&page=${page}`,
        refreshTime: 21600,
      });

      if (!response.error) {
        setAssets(response.data.assets);
      }

      setLoading(false);
    };

    fetchData();
  }, [page]);

  const rowSections = (asset: IAsset): JSX.Element[] => {
    const {
      ticker,
      name,
      logo,
      assetId,
      assetType,
      initialSupply,
      maxSupply,
      staking,
      circulatingSupply,
      precision,
      verified,
    } = asset;

    const renderMaxSupply = (): ReactNode => {
      return (
        <strong>
          {maxSupply !== 0 ? (
            formatAmount(maxSupply / 10 ** precision)
          ) : (
            <IoIosInfinite />
          )}
        </strong>
      );
    };

    const isVerified = () => {
      if (verified) {
        return <Certified className="isVerified" />;
      }
    };

    const sections = [
      <Link href={`/asset/${assetId}`} key={assetId}>
        <a>
          <AssetLogo
            LetterLogo={LetterLogo}
            isVerified={isVerified}
            Logo={Logo}
            logo={logo}
            ticker={ticker}
            name={name}
          />
        </a>
      </Link>,

      <Link href={`/asset/${assetId}`} key={ticker}>
        <a>
          <p>{ticker}</p>
        </a>
      </Link>,

      <Link href={`/asset/${assetId}`} key={assetId}>
        {assetId}
      </Link>,
      <Link href={`/asset/${assetId}`} key={assetId}>
        <a>
          <p
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {name}
          </p>
        </a>
      </Link>,

      <span key={assetType}>{assetType}</span>,
      <strong key={initialSupply}>
        {formatAmount(initialSupply / 10 ** precision)} {ticker}
      </strong>,
      <strong key={maxSupply}>
        {renderMaxSupply()} {ticker}
      </strong>,
      <strong key={circulatingSupply}>
        {formatAmount(circulatingSupply / 10 ** precision)} {ticker}
      </strong>,
      <strong key={String(staking?.totalStaked)}>
        {staking?.totalStaked
          ? formatAmount(staking.totalStaked / 10 ** precision)
          : 0}
      </strong>,
      <strong key={precision}>{precision}</strong>,
    ];

    return sections;
  };

  const header = [
    '',
    'Token',
    'ID',
    'Name',
    'Type',
    'Initial Supply',
    'Max Supply',
    'Circulating Supply',
    'Total Staked',
    'Precision',
  ];

  const tableProps: ITable = {
    rowSections,
    data: assets as any[],
    header,
    loading,
    type: 'assetsPage',
  };

  return (
    <Container>
      <Header>
        <Title title="Assets" Icon={Icon} />

        <Input />
      </Header>

      <Table {...tableProps} />

      <PaginationContainer>
        <Pagination
          scrollUp={true}
          count={pagination.totalPages}
          page={page}
          onPaginate={page => {
            setPage(page);
          }}
        />
      </PaginationContainer>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const props: IAssetPage = { assets: [], pagination: {} as IPagination };

  const assets: IAssetResponse = await api.getCached({
    route: 'assets/kassets?hidden=false',
    refreshTime: 21600,
  });
  if (!assets.error) {
    props.assets = assets.data.assets;
    props.pagination = assets.pagination;
  }

  props.pagination = assets?.pagination || {};

  props.assets = parseHardCodedInfo(props.assets);

  return { props };
};

export default Assets;
