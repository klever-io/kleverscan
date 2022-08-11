import { Certified } from '@/assets/icons';
import { Assets as Icon } from '@/assets/title-icons';
import Title from '@/components/Layout/Title';
import AssetLogo from '@/components/Logo/AssetLogo';
import Pagination from '@/components/Pagination';
import { PaginationContainer } from '@/components/Pagination/styles';
import Table, { ITable } from '@/components/Table';
import { Row } from '@/components/Table/styles';
import api from '@/services/api';
import { IAsset, IPagination, IResponse } from '@/types/index';
import { useDidUpdateEffect } from '@/utils/hooks';
import { formatAmount, parseHardCodedInfo } from '@/utils/index';
import { Container, Header, Input } from '@/views/assets';
import { LetterLogo, Logo } from '@/views/assets/index';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactNode, useCallback, useState } from 'react';
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

      const response: IAssetResponse = await api.get({
        route: `assets/kassets?hidden=false&page=${page}`,
      });

      if (!response.error) {
        setAssets(response.data.assets);
      }

      setLoading(false);
    };

    fetchData();
  }, [page]);

  const TableBody: React.FC<IAsset> = ({
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
  }) => {
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

    const isVerified = useCallback(() => {
      if (verified) {
        return <Certified className="isVerified" />;
      }
    }, []);

    return (
      <Row type="assetsPage">
        <Link href={`/asset/${assetId}`}>
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
        </Link>

        <Link href={`/asset/${assetId}`}>
          <a>
            <p>{ticker}</p>
          </a>
        </Link>

        <span>
          <Link href={`/asset/${assetId}`}>{assetId}</Link>
        </span>

        <Link href={`/asset/${assetId}`}>
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
        </Link>

        <span>{assetType}</span>
        <span>
          <strong>
            {formatAmount(initialSupply / 10 ** precision)} {ticker}
          </strong>
        </span>
        <span>
          <strong>
            {renderMaxSupply()} {ticker}
          </strong>
        </span>
        <span>
          <strong>
            {formatAmount(circulatingSupply / 10 ** precision)} {ticker}
          </strong>
        </span>
        <span>
          <strong>
            {staking?.totalStaked
              ? formatAmount(staking.totalStaked / 10 ** precision)
              : 0}
          </strong>
        </span>
        <span>
          <strong>{precision}</strong>
        </span>
      </Row>
    );
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
    body: TableBody,
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

  const assets: IAssetResponse = await api.get({
    route: 'assets/kassets?hidden=false',
  });
  if (!assets.error) {
    props.assets = assets.data.assets;
    props.pagination = assets.pagination;
  }

  props.pagination = assets.pagination;

  props.assets = parseHardCodedInfo(props.assets);

  console.log(props.assets[0]);

  return { props };
};

export default Assets;
