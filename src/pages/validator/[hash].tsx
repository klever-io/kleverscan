import { ArrowGreen, ArrowPink, Receive } from '@/assets/icons/index';
import { getStatusIcon } from '@/assets/status';
import Chart, { ChartType } from '@/components/Chart';
import Copy from '@/components/Copy';
import Dropdown from '@/components/Dropdown';
import Title from '@/components/Layout/Title';
import QrCodeModal from '@/components/QrCodeModal';
import Table, { ITable } from '@/components/Table';
import api from '@/services/api';
import {
  IBucket,
  IDelegate,
  IPagination,
  IPeer,
  IResponse,
} from '@/types/index';
import { formatAmount, getAge, parseAddress, regexImgUrl } from '@/utils/index';
import {
  AllSmallCardsContainer,
  BoldElement,
  Card,
  CardHeader,
  CardSubHeader,
  CardWrapper,
  CenteredSubTitle,
  CommissionPercent,
  Container,
  ContainerCircle,
  ContainerPerCentArrow,
  ContainerRewards,
  ContainerVotes,
  CopyBackground,
  ElementsWrapper,
  EmptyProgressBar,
  HalfCirclePie,
  HalfRow,
  LetterLogo,
  Logo,
  PercentIndicator,
  PieData,
  ProgressContent,
  Rating,
  RatingContainer,
  ReceiveBackground,
  RewardCardContentWrapper,
  RewardsCard,
  RewardsCardHeader,
  RewardsChart,
  RewardsChartContent,
  Row,
  StakedIndicator,
  Status,
  SubContainerVotes,
  TitleContent,
  TitleInformation,
  ValidatorTitle,
  VotersPercent,
  VotesFooter,
  VotesHeader,
} from '@/views/validator';
import {
  CardContainer,
  CardContent,
  CenteredRow,
  TableContainer,
} from '@/views/validators/detail';
import { fromUnixTime } from 'date-fns';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
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

  const [uptime] = useState(new Date().getTime());
  const [age, setAge] = useState(
    getAge(fromUnixTime(new Date().getTime() / 1000)),
  );
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

  useEffect(() => {
    const interval = setInterval(() => {
      const newAge = getAge(fromUnixTime(uptime / 1000));

      setAge(newAge);
    }, 1 * 1000); // 1 sec

    return () => {
      clearInterval(interval);
    };
  }, []);

  const totalProduced =
    validator?.totalLeaderSuccessRate?.numSuccess +
    validator?.totalValidatorSuccessRate?.numSuccess;
  const totalMissed =
    validator?.totalLeaderSuccessRate?.numFailure +
    validator?.totalValidatorSuccessRate?.numFailure;
  const DelegateIcon = getStatusIcon(canDelegate ? 'success' : 'fail');

  const commissionPercent = commission / 10 ** 2;
  const votersPercent = 100 - commission / 10 ** 2;
  const rotationPercent = (votersPercent * 180) / 10 ** 2;

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

  const requestValidator = async (page: number) => {
    const response: IDelegateResponse = await api.get({
      route: `validator/delegated/${ownerAddress}?page=${page}`,
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

  const stakedPercent =
    (maxDelegation <= 0 ? 100 : totalStake / maxDelegation) * 100;

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

  const rowSections = (bucket: IBucket): JSX.Element[] => {
    const { address, id, stakedEpoch, balance } = bucket;
    const sections = [
      <CenteredRow key={id}>
        <Link href={`/account/${address}`} key={address}>
          {parseAddress(address || '', 24)}
        </Link>
        <Copy data={address} info="address"></Copy>
      </CenteredRow>,
      <CenteredRow key={id}>
        {parseAddress(id || '', 24)}
        <Copy data={id} info="id"></Copy>
      </CenteredRow>,
      <span key={stakedEpoch}>{stakedEpoch}</span>,
      <strong key={balance}>{formatAmount(balance / 10 ** precision)}</strong>,
    ];

    return sections;
  };

  const tableProps: ITable = {
    type: 'validator',
    header,
    data: defaultDelegators as IBucket[],
    rowSections,
    columnSpans: [2, 2, 1, 1],
    request: page => requestValidator(page),
    scrollUp: false,
    totalPages: pagination.totalPages,
    dataName: 'validator',
  };

  // mocked data:
  const data = [
    { value: 500, date: '12' },
    { value: 300, date: '13' },
    { value: 330, date: '13' },
    { value: 400, date: '13' },
    { value: 350, date: '13' },
    { value: 150, date: '13' },
    { value: 250, date: '13' },
    { value: 350, date: '13' },
    { value: 450, date: '13' },
    { value: 500, date: '13' },
  ];
  const percentVotes = '+3.75%';

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

      <AllSmallCardsContainer>
        <Card marginLeft>
          <CardWrapper>
            <VotesHeader>
              <span>
                <strong>Current Delegations</strong>
              </span>
              <span>
                <p>{`(Updated: ${age} ago)`}</p>
              </span>
            </VotesHeader>
          </CardWrapper>
          <RewardsChart>
            <RewardsChartContent>
              <Chart type={ChartType.Area} data={data} />
            </RewardsChartContent>
            <VotesFooter>
              <span>{(totalStake / 10 ** precision).toLocaleString()}</span>
              <span>
                <strong>{percentVotes}</strong>
              </span>
            </VotesFooter>
          </RewardsChart>
        </Card>
        <RewardsCard marginLeft marginRight>
          <RewardsCardHeader>
            <span>
              <strong>Reward Distribution Ratio</strong>
            </span>
          </RewardsCardHeader>
          <CardSubHeader>
            <span>
              <strong>Voters</strong>
            </span>
            <span>
              <strong>Commission</strong>
            </span>
          </CardSubHeader>
          <RewardCardContentWrapper>
            <ContainerVotes>
              <SubContainerVotes>
                <ContainerPerCentArrow>
                  <ArrowGreen />
                  <VotersPercent>{votersPercent}%</VotersPercent>
                </ContainerPerCentArrow>
              </SubContainerVotes>
            </ContainerVotes>
            <ContainerCircle>
              <HalfCirclePie rotation={`${rotationPercent}deg`}>
                <PieData></PieData>
                <PieData></PieData>
              </HalfCirclePie>
            </ContainerCircle>
            <ContainerRewards>
              <ContainerPerCentArrow>
                <ArrowPink />
                <CommissionPercent>{commissionPercent}%</CommissionPercent>
              </ContainerPerCentArrow>
            </ContainerRewards>
          </RewardCardContentWrapper>
        </RewardsCard>
        <Card marginRight>
          <CardHeader>
            <span>
              <strong>Delegated</strong>
            </span>
            <p>{`(Updated: ${age} ago)`}</p>
          </CardHeader>
          <EmptyProgressBar>
            <ProgressContent percent={maxDelegation === 0 ? 0 : stakedPercent}>
              <StakedIndicator
                percent={maxDelegation === 0 ? 0 : stakedPercent}
              >
                {(totalStake / 10 ** precision).toLocaleString()}
              </StakedIndicator>
            </ProgressContent>
            <PercentIndicator percent={maxDelegation === 0 ? 0 : stakedPercent}>
              <p>{maxDelegation === 0 ? 0 : stakedPercent?.toFixed(0)}%</p>
            </PercentIndicator>
          </EmptyProgressBar>
        </Card>
      </AllSmallCardsContainer>
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
