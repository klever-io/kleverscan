import { Accounts as Icon } from '@/assets/title-icons';
import Copy from '@/components/Copy';
import Title from '@/components/Layout/Title';
import Table, { ITable } from '@/components/Table';
import { getMarketplaces } from '@/services/requests/marketplace/marketplace';
import { Container, FlexSpan, Header } from '@/styles/common';
import { IMarketplace } from '@/types/marketplaces';
import { PERCENTAGE_PRECISION } from '@/utils/globalVariables';
import { parseAddress } from '@/utils/parseValues';
import { TableTitle } from '@/views/marketplaces';
import Link from 'next/link';
import React from 'react';
const Marketplaces: React.FC = () => {
  const marketplacesHeader = [
    'Id',
    'Name',
    'Owner Address',
    'Referral Address',
    'Referral Percentage',
  ];

  const marketplacesRowSections = (marketplace: IMarketplace) => {
    const { id, name, ownerAddress, referralAddress, referralPercentage } =
      marketplace;
    const rowSections = [
      {
        element: (
          <FlexSpan>
            <Link href={`marketplace/${id}`}>{id}</Link>
            <Copy data={id} info="Marketplace Id" />
          </FlexSpan>
        ),
        span: 1,
      },
      {
        element: (
          <span key={name}>
            <Link href={`marketplace/${id}`}>{name}</Link>
          </span>
        ),
        span: 1,
      },
      {
        element: (
          <FlexSpan>
            <Link href={`account/${ownerAddress}`}>
              {parseAddress(ownerAddress, 20)}
            </Link>
            <Copy data={ownerAddress} info="Marketplace Owner Address" />
          </FlexSpan>
        ),
        span: 1,
      },
      {
        element: (
          <FlexSpan>
            {referralAddress ? (
              <>
                <Link href={`account/${referralAddress}`}>
                  {parseAddress(referralAddress, 20)}
                </Link>
                <Copy data={referralAddress} info="Referral Address" />
              </>
            ) : (
              '-'
            )}
          </FlexSpan>
        ),
        span: 1,
      },
      {
        element: (
          <span>
            {referralPercentage
              ? `${referralPercentage / 10 ** PERCENTAGE_PRECISION}%`
              : '-'}
          </span>
        ),
        span: 1,
      },
    ];
    return rowSections;
  };

  const tableProps: ITable = {
    type: 'marketplaces',
    header: marketplacesHeader,
    rowSections: marketplacesRowSections,
    request: () => getMarketplaces(),
    scrollUp: true,
    dataName: 'marketplaces',
  };

  return (
    <Container>
      <Header>
        <Title title="Marketplaces" Icon={Icon} />
      </Header>
      <TableTitle>List of Marketplaces</TableTitle>
      <Table {...tableProps} />
    </Container>
  );
};

export default Marketplaces;
