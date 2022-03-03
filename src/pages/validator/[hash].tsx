import React from 'react';

import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { Logo, LetterLogo } from './styles'

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
    logo,
    name
  } = validator;
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
    if(regex.test(logo)) {
      return (<Logo alt={`${name}-logo`} src={logo} />);
    }
    return <LetterLogo>{logo.split('')[0]}</LetterLogo>;
  }

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
          <span>
            <p>{(maxDelegation).toLocaleString()}</p>
          </span>
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
            <p>{(totalProduced).toLocaleString()}</p>
          </span>
        </Row>
        <Row>
          <span>
            <strong>Total Missed</strong>
          </span>
          <span>
            <p>{(totalMissed).toLocaleString()}</p>
          </span>
        </Row>
        <Row>
          <span>
            <strong>Commission</strong>
          </span>
          <span>
            <p>{commission / 10 ** 2}</p>
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
            {renderLogo()}
            <TitleInformation>
              <ValidatorTitle>
                <h1>{name}</h1>
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
