import { Receive } from '@/assets/icons/index';
import { getStatusIcon } from '@/assets/status';
import Copy from '@/components/Copy';
import Dropdown from '@/components/Dropdown';
import Title from '@/components/Layout/Title';
import QrCodeModal from '@/components/QrCodeModal';
import Table, { ITable } from '@/components/Table';
import ValidatorCards from '@/components/ValidatorCards';
import api from '@/services/api';
import {
  IBucket,
  IDelegate,
  IPagination,
  IPeer,
  IResponse,
  IRowSection,
} from '@/types/index';
import { formatAmount, parseAddress, regexImgUrl } from '@/utils/index';
import {
  BoldElement,
  CenteredSubTitle,
  Container,
  CopyBackground,
  ElementsWrapper,
  HalfRow,
  LetterLogo,
  Logo,
  Rating,
  RatingContainer,
  ReceiveBackground,
  Row,
  Status,
  TitleContent,
  TitleInformation,
  ValidatorTitle,
} from '@/views/validator';
import {
  CardContainer,
  CardContent,
  CenteredRow,
  TableContainer,
} from '@/views/validators/detail';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import React, { useState } from 'react';
import { IoIosInfinite } from 'react-icons/io';

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

  const [imgError, setImgError] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [rerender, setRerender] = useState(false);

  const handleLogoError = () => {
    setImgError(true);
    setRerender(!rerender);
  };

  const renderLogo = () => {
    if (regexImgUrl(logo) && !imgError) {
      return (
        <Logo
          alt={`${name}-logo`}
          src={logo}
          onError={() => handleLogoError()}
        />
      );
    }
    return <LetterLogo>{name?.split?.('')[0] || 'K'}</LetterLogo>;
  };

  const totalProduced =
    validator?.totalLeaderSuccessRate?.numSuccess +
    validator?.totalValidatorSuccessRate?.numSuccess;
  const totalMissed =
    validator?.totalLeaderSuccessRate?.numFailure +
    validator?.totalValidatorSuccessRate?.numFailure;
  const DelegateIcon = getStatusIcon(canDelegate ? 'success' : 'fail');

  const commissionPercent = commission / 10 ** 2;

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

  const renderTitle = () => {
    return <h1>{name || parseAddress(ownerAddress, 24)}</h1>;
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

  const requestValidator = async (page: number, limit: number) => {
    const response: IDelegateResponse = await api.get({
      route: `validator/delegated/${ownerAddress}?page=${page}&limit=${limit}`,
    });

    const delegators: IBucket[] = [];
    response?.data?.delegators?.forEach(delegation => {
      delegation?.buckets?.forEach(bucket => {
        if (bucket?.delegation === ownerAddress) {
          delegators.push({
            address: delegation?.address,
            ...bucket,
          });
        }
      });
    });
    return { ...response, data: { validator: delegators } };
  };

  const Overview: React.FC = () => {
    return (
      <CardContent>
        <Row>
          <span>
            <strong>Owner Address</strong>
          </span>
          <span>
            <CenteredRow>
              <Link href={`/account/${ownerAddress}`}>{ownerAddress}</Link>
              <Copy data={ownerAddress} info="ownerAddress"></Copy>
            </CenteredRow>
          </span>
        </Row>
        <Row>
          <RatingContainer>
            <span>
              <strong>Rating</strong>
            </span>
            <span>
              <Rating rate={getRateColor()}>
                {((rating * 100) / 10000000).toFixed(2)}%
              </Rating>
            </span>
          </RatingContainer>
        </Row>
        <Row>
          <HalfRow>
            <ElementsWrapper>
              <span>
                <strong>List</strong>
              </span>
              <Status status={getListStatus(list)}>
                <ListIcon />
                <span>{list}</span>
              </Status>
            </ElementsWrapper>
          </HalfRow>
          <HalfRow>
            <ElementsWrapper>
              <span>
                <strong>Can Delegate</strong>
              </span>
              <Status status={canDelegate ? 'success' : 'fail'}>
                <DelegateIcon />
                <span>{canDelegate ? 'Yes' : 'No'}</span>
              </Status>
            </ElementsWrapper>
          </HalfRow>
        </Row>
        <Row>
          <span>
            <strong>Max Delegation</strong>
          </span>
          <BoldElement>{renderMaxDelegation()}</BoldElement>
        </Row>
        <Row>
          <HalfRow>
            <ElementsWrapper>
              <span>
                <strong>Staked Balance</strong>
              </span>
              <BoldElement>
                <span>{(totalStake / 10 ** precision).toLocaleString()}</span>
                <span> KLV</span>
              </BoldElement>
            </ElementsWrapper>
          </HalfRow>
          <HalfRow>
            <ElementsWrapper>
              <span>
                <strong>Self Stake</strong>
              </span>
              <BoldElement>
                <span>{(selfStake / 10 ** 6).toLocaleString()}</span>
                <span> KLV</span>
              </BoldElement>
            </ElementsWrapper>
          </HalfRow>
        </Row>
        <Row>
          <HalfRow>
            <ElementsWrapper>
              <span>
                <strong>Total Produced</strong>
              </span>
              <BoldElement>
                <p>{totalProduced?.toLocaleString()}</p>
              </BoldElement>
            </ElementsWrapper>
          </HalfRow>
          <HalfRow>
            <ElementsWrapper>
              <span>
                <strong>Total Missed</strong>
              </span>
              <BoldElement>
                <p>{totalMissed?.toLocaleString()}</p>
              </BoldElement>
            </ElementsWrapper>
          </HalfRow>
        </Row>
        <Row>
          <ElementsWrapper>
            <span>
              <strong>Commission</strong>
            </span>
            <BoldElement>
              <p>{commissionPercent}%</p>
            </BoldElement>
          </ElementsWrapper>
        </Row>
        <Row>
          <span>
            <strong>URIS</strong>
          </span>
          <BoldElement>
            <Dropdown uris={uris} />
          </BoldElement>
        </Row>
      </CardContent>
    );
  };

  const precision = 6; // default KLV precision
  const header = ['Address', 'Bucket ID', 'Staked Epoch', 'Amount '];

  const rowSections = (bucket: IBucket): IRowSection[] => {
    const { address, id, stakedEpoch, balance } = bucket;
    const sections = [
      {
        element: (
          <CenteredRow key={id}>
            <Link href={`/account/${address}`} key={address}>
              {parseAddress(address || '', 24)}
            </Link>
            <Copy data={address} info="address"></Copy>
          </CenteredRow>
        ),
        span: 2,
      },
      {
        element: (
          <CenteredRow key={id}>
            {parseAddress(id || '', 24)}
            <Copy data={id} info="id"></Copy>
          </CenteredRow>
        ),
        span: 2,
      },
      { element: <span key={stakedEpoch}>{stakedEpoch}</span>, span: 1 },
      {
        element: (
          <strong key={balance}>
            {formatAmount(balance / 10 ** precision)}
          </strong>
        ),
        span: 1,
      },
    ];

    return sections;
  };

  const tableProps: ITable = {
    type: 'validator',
    header,
    data: defaultDelegators as IBucket[],
    rowSections,
    request: (page, limit) => requestValidator(page, limit),
    scrollUp: false,
    totalPages: pagination?.totalPages || 1,
    dataName: 'validator',
  };

  return (
    <Container>
      <Title
        Component={() => (
          <TitleContent>
            {renderLogo()}
            <TitleInformation>
              <ValidatorTitle>
                {renderTitle()}
                {/* <Ranking>Rank 1</Ranking> */}
              </ValidatorTitle>
              <CenteredSubTitle>
                <span>{blsPublicKey}</span>
                <CopyBackground>
                  <Copy data={blsPublicKey} info="Key" />
                </CopyBackground>
                <ReceiveBackground>
                  <Receive onClick={() => setShowModal(!showModal)} />
                  <QrCodeModal
                    show={showModal}
                    setShowModal={() => setShowModal(false)}
                    value={blsPublicKey}
                    onClose={() => setShowModal(false)}
                  />
                </ReceiveBackground>
              </CenteredSubTitle>
            </TitleInformation>
          </TitleContent>
        )}
        route={'/validators'}
      />

      <ValidatorCards
        totalStake={totalStake}
        commission={commission}
        maxDelegation={maxDelegation}
      />
      <CardContainer>
        <Overview />
      </CardContainer>
      <TableContainer>
        <h3>List of delegations</h3>
        <Table {...tableProps} />
      </TableContainer>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps<IValidatorPage> = async ({
  query: { hash },
}) => {
  const redirectProps = { redirect: { destination: '/404', permanent: false } };

  const props: IValidatorPage = {
    validator: {} as IPeer,
    delegators: [],
    pagination: {} as IPagination,
  };

  const address = String(hash);

  const validatorCall = new Promise<IValidatorResponse>(
    async (resolve, reject) => {
      const res = await api.get({
        route: `validator/${address}`,
      });

      if (!res.error || res.error === '') {
        resolve(res);
      }

      reject(res.error);
    },
  );

  const delegationCall = new Promise<IDelegateResponse>(
    async (resolve, reject) => {
      const res = await api.get({
        route: `validator/delegated/${address}`,
      });

      if (!res.error || res.error === '') {
        resolve(res);
      }

      reject(res.error);
    },
  );

  await Promise.allSettled([validatorCall, delegationCall]).then(promises => {
    promises?.forEach((res, index) => {
      if (res.status === 'fulfilled') {
        if (index === 0) {
          const { value }: any = res;
          props.validator = value?.data?.validator;
        } else if (index === 1) {
          const delegations: any = res.value;
          const delegators: IBucket[] = [];

          delegations?.data?.delegators?.forEach((delegation: any) => {
            delegation?.buckets?.forEach((bucket: any) => {
              if (bucket?.delegation === address) {
                delegators.push({
                  address: delegation?.address,
                  ...bucket,
                });
              }
            });
          });

          if (!delegations.error) {
            props.pagination = delegations?.pagination;
            props.delegators = delegators;
          }
        }
      }
    });
  });

  if (Object.keys(props.validator).length === 0) {
    return redirectProps;
  }

  return { props };
};

export default Validator;
