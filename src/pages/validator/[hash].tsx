import React, { useEffect, useState } from 'react';

import { IoIosInfinite } from 'react-icons/io';

import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { Logo, LetterLogo } from '@/views/validator';

import {
  CardContainer,
  CardContent,
  Container,
  Header,
  Input,
  PercentIndicator,
  Rating,
  Row,
  StakedIndicator,
  Title,
  TitleContent,
  TitleInformation,
  ValidatorDescription,
  ValidatorTitle,
} from '@/views/validators/detail';
import { Row as RowList } from '@/components/Table/styles';

import {
  IDelegate,
  IPagination,
  IPeer,
  IResponse,
  IBucket,
} from '@/types/index';

import { ArrowLeft } from '@/assets/icons';
import api from '@/services/api';
import { CenteredRow } from '@/views/transactions/detail';
import Copy from '@/components/Copy';
import Dropdown from '@/components/Dropdown';
import { Status } from '@/components/Table/styles';
import { getStatusIcon } from '@/assets/status';
import { ProgressContent } from '@/views/validators';
import Table, { ITable } from '@/components/Table';
import { TableContainer } from '@/views/validators/detail';
import { formatAmount, parseAddress } from '@/utils/index';
import { PaginationContainer } from '@/components/Pagination/styles';
import Pagination from '@/components/Pagination';

interface IValidatorPage {
  validator: IPeer;
  delegators: IBucket[];
  pagination: IPagination;
}

interface IValidatorResponse extends IResponse {
  data: {
    validator: IPeer;
  };
  pagination: IPagination;
}

const precision = 6;

interface IDelegateResponse extends IResponse {
  data: {
    delegators: IDelegate[];
  };
  pagination: IPagination;
}

const Validator: React.FC<IValidatorPage> = ({
  validator,
  delegators: defaultDelegators,
  pagination,
}) => {
  const {
    blsPublicKey,
    ownerAddress,
    canDelegate,
    commission,
    maxDelegation,
    rating,
    list,
    totalStake,
    selfStake,
    logo,
    name,
    uris,
  } = validator;
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [delegators, setDelegators] = useState(defaultDelegators);

  const totalProduced =
    validator.totalLeaderSuccessRate.numSuccess +
    validator.totalValidatorSuccessRate.numSuccess;
  const totalMissed =
    validator.totalLeaderSuccessRate.numFailure +
    validator.totalValidatorSuccessRate.numFailure;
  const DelegateIcon = getStatusIcon(canDelegate ? 'success' : 'error');

  const getListStatus = (list: string): string => {
    let status = '';
    switch (list) {
      case 'elected':
      case 'eligible':
        return (status = 'success');
      case 'waiting':
        return (status = 'pending');
      case 'leaving':
      case 'inactive':
      case 'observer':
        return (status = 'inactive');
      case 'jailed':
        return (status = 'fail');
    }
    return status;
  };

  const ListIcon = getStatusIcon(getListStatus(list));

  const getRateColor = (): string => {
    const percent = rating / 10 ** 7;

    if (percent > 0.8) {
      return 'green';
    } else if (percent > 0.5) {
      return 'yellow';
    } else {
      return 'red';
    }
  };

  const renderLogo = () => {
    const regex = /[\/.](gif|jpg|jpeg|tiff|png)$/i;
    if (regex.test(logo)) {
      return <Logo alt={`${name}-logo`} src={logo} />;
    }
    return <LetterLogo>{name.split('')[0] || 'K'}</LetterLogo>;
  };

  const renderTitle = () => {
    return <h1>{name || parseAddress(ownerAddress, 12)}</h1>;
  };

  const renderMaxDelegation = () => {
    const maxDelegationWithPresicion = (
      maxDelegation /
      10 ** precision
    ).toLocaleString();
    return (
      <p>
        {maxDelegation !== 0 ? (
          `${maxDelegationWithPresicion} KLV`
        ) : (
          <IoIosInfinite />
        )}
      </p>
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const response: IDelegateResponse = await api.get({
        route: `validator/delegated/${ownerAddress}?page=${page}`,
      });

      if (!response.error) {
        const delegators: IBucket[] = [];
        response?.data?.delegators.forEach(delegation => {
          delegation.buckets.forEach(bucket => {
            if (bucket.delegation === ownerAddress) {
              delegators.push({
                address: delegation.address,
                ...bucket,
              });
            }
          });
        });

        setDelegators(delegators);
      }

      setLoading(false);
    };

    fetchData();
  }, [page]);

  const stakedPercent =
    (maxDelegation <= 0 ? 100 : totalStake / maxDelegation) * 100;

  const router = useRouter();

  const Overview: React.FC = () => {
    return (
      <CardContent>
        <Row>
          <span>
            <strong>Owner Address</strong>
          </span>
          <span>
            <Link href={`/account/${ownerAddress}`}>{ownerAddress}</Link>
          </span>
        </Row>
        <Row>
          <span>
            <strong>Public Key</strong>
          </span>
          <CenteredRow>
            <span>{blsPublicKey}</span>
            <Copy data={blsPublicKey} info="Key" />
          </CenteredRow>
        </Row>
        <Row>
          <span>
            <strong>Delegated Percent</strong>
          </span>
          <span>
            <ProgressContent>
              <StakedIndicator
                percent={maxDelegation === 0 ? 0 : stakedPercent}
              />
              <PercentIndicator
                percent={maxDelegation === 0 ? 0 : stakedPercent}
              >
                {maxDelegation === 0 ? 0 : stakedPercent.toFixed(2)}%
              </PercentIndicator>
            </ProgressContent>
          </span>
        </Row>
        <Row>
          <span>
            <strong>Rating</strong>
          </span>
          <span>
            <Rating rate={getRateColor()}>
              {((rating * 100) / 10000000).toFixed(2)}%
            </Rating>
          </span>
        </Row>
        <Row>
          <span>
            <strong>List</strong>
          </span>
          <Status status={getListStatus(list)}>
            <ListIcon />
            <span>{list}</span>
          </Status>
        </Row>
        <Row>
          <span>
            <strong>Can Delegate</strong>
          </span>
          <Status status={canDelegate ? 'success' : 'fail'}>
            <DelegateIcon />
            <span>{canDelegate ? 'Yes' : 'No'}</span>
          </Status>
        </Row>
        <Row>
          <span>
            <strong>Max Delegation</strong>
          </span>
          <span>{renderMaxDelegation()}</span>
        </Row>
        <Row>
          <span>
            <strong>Staked Balance</strong>
          </span>
          <span>
            <p>{(totalStake / 10 ** 6).toLocaleString()} KLV</p>
          </span>
        </Row>
        <Row>
          <span>
            <strong>Self Stake</strong>
          </span>
          <span>
            <p>{(selfStake / 10 ** 6).toLocaleString()} KLV</p>
          </span>
        </Row>
        <Row>
          <span>
            <strong>Total Produced</strong>
          </span>
          <span>
            <p>{totalProduced.toLocaleString()}</p>
          </span>
        </Row>
        <Row>
          <span>
            <strong>Total Missed</strong>
          </span>
          <span>
            <p>{totalMissed.toLocaleString()}</p>
          </span>
        </Row>
        <Row>
          <span>
            <strong>Commission</strong>
          </span>
          <span>
            <p>{commission / 10 ** 2}%</p>
          </span>
        </Row>
        <Row>
          <span>
            <strong>URIS</strong>
          </span>
          <span>
            <Dropdown uris={uris} />
          </span>
        </Row>
      </CardContent>
    );
  };

  const precision = 6; // default KLV precision
  const header = ['Address', 'Bucket ID', 'Staked Epoch', 'Amount '];

  const TableBody: React.FC<IBucket> = ({
    address,
    id,
    stakedEpoch,
    balance,
  }) => {
    return (
      <RowList type="delegations">
        <Link href={`/account/${address}`}>
          {parseAddress(address || '', 12)}
        </Link>
        <span>{id}</span>
        <span>{stakedEpoch}</span>

        <span>
          <strong>{formatAmount(balance / 10 ** precision)} KLV</strong>
        </span>
      </RowList>
    );
  };

  const tableProps: ITable = {
    type: 'delegations',
    header,
    data: delegators as IBucket[],
    body: TableBody,
    loading,
  };

  return (
    <Container>
      <Header>
        <Title>
          <div onClick={router.back}>
            <ArrowLeft />
          </div>

          <TitleContent>
            {renderLogo()}
            <TitleInformation>
              <ValidatorTitle>{renderTitle()}</ValidatorTitle>
              <ValidatorDescription>
                Public Blockchain Infrastructure for the internet.
              </ValidatorDescription>
            </TitleInformation>
          </TitleContent>
        </Title>

        <Input />
      </Header>

      <CardContainer>
        <Overview />
      </CardContainer>

      <TableContainer>
        <h3>List of delegations</h3>
        <Table {...tableProps} />
      </TableContainer>

      <PaginationContainer>
        <Pagination
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

export const getServerSideProps: GetServerSideProps<IValidatorPage> = async ({
  query: { hash },
}) => {
  const props: IValidatorPage = {
    validator: {} as IPeer,
    delegators: [],
    pagination: {} as IPagination,
  };

  const address = String(hash);

  const validator: IValidatorResponse = await api.get({
    route: `validator/${address}`,
  });
  if (!validator.error) {
    props.validator = validator.data.validator;
  }

  const delegations: IDelegateResponse = await api.get({
    route: `validator/delegated/${address}`,
  });

  const delegators: IBucket[] = [];
  delegations?.data?.delegators.forEach(delegation => {
    delegation.buckets.forEach(bucket => {
      if (bucket.delegation === address) {
        delegators.push({
          address: delegation.address,
          ...bucket,
        });
      }
    });
  });

  if (!delegations.error) {
    props.pagination = delegations.pagination;
    props.delegators = delegators;
  }

  return { props };
};

export default Validator;
