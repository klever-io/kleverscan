import { Assets as Icon } from '@/assets/title-icons';
import { requestAssetsPoolsQuery } from '@/services/requests/assetsPools';
import { Header, Mono } from '@/styles/common';
import { IAssetPool, IRowSection } from '@/types';
import { capitalizeString } from '@/utils/convertString';
import { parseAddress } from '@/utils/parseValues';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import Copy from '../Copy';
import Title from '../Layout/Title';
import Table, { ITable } from '../Table';
import { Status } from '../Table/styles';
import { Row } from './styled';

const AssetsPools: React.FC<PropsWithChildren> = () => {
  const router = useRouter();
  const { t } = useTranslation(['common', 'assets', 'table']);

  const header = [
    'KDA/Status',
    'Owner/Admin Address',
    `KDA/KLV Balance`,
    `Ratio`,
  ];

  const rowSections = (asset: IAssetPool): IRowSection[] => {
    const {
      active,
      adminAddress,
      kda,
      kdaBalance,
      ownerAddress,
      klvBalance,
      ratio,
    } = asset;

    const handlerStatus = () => (
      <>
        <Row>
          <span>{kda}</span>
        </Row>
        <Row>
          <Status status={active ? 'success' : 'fail'}>
            {capitalizeString(active ? 'Active' : 'disabled')}
          </Status>
        </Row>
      </>
    );
    const handlerAddresses = (i: number) => (
      <>
        <Row>
          <Link href={`/account/${ownerAddress}`} key={ownerAddress}>
            <Mono key={ownerAddress + i}>{parseAddress(ownerAddress, 16)}</Mono>
          </Link>
          <Copy data={ownerAddress} info="Owner Address" />
        </Row>
        <Row>
          <Link href={`/account/${adminAddress}`} key={adminAddress}>
            <Mono key={adminAddress + i}>{parseAddress(adminAddress, 16)}</Mono>
          </Link>
          <Copy data={adminAddress} info="Admin Address" />
        </Row>
      </>
    );
    const handlerBalance = () => (
      <>
        <Row>
          <span>{kdaBalance} KDA</span>
        </Row>
        <Row>
          <span>{klvBalance} KLV</span>
        </Row>
      </>
    );
    const handlerRatio = () => (
      <Row>
        <span>{ratio}</span>
      </Row>
    );

    const sections: IRowSection[] = [
      {
        element: (props, i) => handlerStatus(),
        span: 1,
        width: 50,
      },
      {
        element: (props, i) => handlerAddresses(i),
        span: 1,
        width: 50,
      },
      {
        element: (props, i) => handlerBalance(),
        span: 1,
        width: 50,
      },
      {
        element: (props, i) => handlerRatio(),
        span: 1,
        width: 50,
      },
    ];

    return sections;
  };

  const tableProps: ITable = {
    rowSections,
    header,
    type: 'assetsPage',
    request: (page, limit) => requestAssetsPoolsQuery(page, limit, router),
    dataName: 'pools',
  };

  return (
    <>
      <Header>
        <Title title={t('common:Titles.Pools')} Icon={Icon} />
      </Header>

      <Table {...tableProps} />
    </>
  );
};

export default AssetsPools;
