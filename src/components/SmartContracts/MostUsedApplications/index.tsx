import React from 'react';
import {
  CardContainer,
  CardContractInfo,
  CardContractName,
  CardHeader,
  CardsContainerWrapper,
  CardsTitleWrapper,
} from './styles';
import AssetLogo from '@/components/Logo/AssetLogo';
import { parseAddress } from '@/utils/parseValues';

const ContractApps = [
  {
    constract: '000000',
    name: 'Contract Name',
    address: 'klv1fr724pjdjp3l8unuvgda0k6vt06d875hj7t5ggrxymzcg3jcveysejzljc',
  },
  {
    constract: '000000',
    name: 'Contract Name',
    address: 'klv1fr724pjdjp3l8unuvgda0k6vt06d875hj7t5ggrxymzcg3jcveysejzljc',
  },
  {
    constract: '000000',
    name: 'Contract Name',
    address: 'klv1fr724pjdjp3l8unuvgda0k6vt06d875hj7t5ggrxymzcg3jcveysejzljc',
  },
  {
    constract: '000000',
    name: 'Contract Name',
    address: 'klv1fr724pjdjp3l8unuvgda0k6vt06d875hj7t5ggrxymzcg3jcveysejzljc',
  },
  {
    constract: '000000',
    name: 'Contract Name',
    address: 'klv1fr724pjdjp3l8unuvgda0k6vt06d875hj7t5ggrxymzcg3jcveysejzljc',
  },
  {
    constract: '000000',
    name: 'Contract Name',
    address: 'klv1fr724pjdjp3l8unuvgda0k6vt06d875hj7t5ggrxymzcg3jcveysejzljc',
  },
  {
    constract: '000000',
    name: 'Contract Name',
    address: 'klv1fr724pjdjp3l8unuvgda0k6vt06d875hj7t5ggrxymzcg3jcveysejzljc',
  },
  {
    constract: '000000',
    name: 'Contract Name',
    address: 'klv1fr724pjdjp3l8unuvgda0k6vt06d875hj7t5ggrxymzcg3jcveysejzljc',
  },
  {
    constract: '000000',
    name: 'Contract Name',
    address: 'klv1fr724pjdjp3l8unuvgda0k6vt06d875hj7t5ggrxymzcg3jcveysejzljc',
  },
  {
    constract: '000000',
    name: 'Contract Name',
    address: 'klv1fr724pjdjp3l8unuvgda0k6vt06d875hj7t5ggrxymzcg3jcveysejzljc',
  },
];

const MostUsedApplications = () => {
  return (
    <>
      <CardsTitleWrapper>
        <h3>Most Used Applications</h3>
        <span>Daily</span>
      </CardsTitleWrapper>

      <CardsContainerWrapper>
        {ContractApps.map((app, index) => (
          <CardContainer key={index}>
            <CardHeader>
              <h4>#{index + 1}</h4>
              <CardContractInfo>
                <span>Transactions</span>
                <span>{app?.constract}</span>
              </CardContractInfo>
            </CardHeader>
            <CardContractName>
              <AssetLogo
                logo={'/assets/klv-logo.png?w=1920'}
                ticker={'KLV'}
                name={'KLV'}
              />
              <span>{app.name}</span>
              <small>{parseAddress(app.address, 25)}</small>
            </CardContractName>
          </CardContainer>
        ))}
      </CardsContainerWrapper>
    </>
  );
};

export default MostUsedApplications;
