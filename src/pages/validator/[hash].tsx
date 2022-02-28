import React from 'react';

import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';

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

import { IPagination, IPeer, IResponse } from '@/types/index';

import { ArrowLeft } from '@/assets/icons';
import { KLV } from '@/assets/validators';
import api from '@/services/api';
import { CenteredRow } from '@/views/transactions/detail';
import Copy from '@/components/Copy';
import { Status } from '@/components/Table/styles';
import { getStatusIcon } from '@/assets/status';
import { ProgressContent } from '@/views/validators';

interface IValidatorPage {
  validator: IPeer;
}

interface IValidatorResponse extends IResponse {
  data: {
    validator: IPeer;
  };
  pagination: IPagination;
}

const Validator: React.FC<IValidatorPage> = ({ validator }) => {
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
  } = validator;
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

  const stakedPercent = maxDelegation <= 0 ? 100 : totalStake / maxDelegation;

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
              <StakedIndicator percent={stakedPercent} />
              <PercentIndicator percent={stakedPercent}>
                {stakedPercent}%
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
          {}
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
            <strong>Staked Balance</strong>
          </span>
          <span>
            <p>{(totalStake / 10 ** 6).toLocaleString()} KLV</p>
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
      </CardContent>
    );
  };

  return (
    <Container>
      <Header>
        <Title>
          <div onClick={router.back}>
            <ArrowLeft />
          </div>

          <TitleContent>
            <KLV />
            <TitleInformation>
              <ValidatorTitle>
                <h1>Klever Staking</h1>
                {/* <div>Rank {'X'}</div> */}
              </ValidatorTitle>
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
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps<IValidatorPage> = async ({
  query: { hash },
}) => {
  const props: IValidatorPage = {
    validator: {} as IPeer,
  };
  const address = String(hash);

  const validator: IValidatorResponse = await api.get({
    route: `validator/${address}`,
  });
  props.validator = validator.data.validator;
  return { props };
};

export default Validator;
