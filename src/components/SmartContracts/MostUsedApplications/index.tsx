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
import { useSmartContractData } from '@/contexts/smartContractPage';
import { parseAddress } from '@/utils/parseValues';

const MostUsedApplications = () => {
  const { smartContractsStatistic } = useSmartContractData();
  return (
    <>
      <CardsTitleWrapper>
        <h3>Most Used Applications</h3>
        <span>Daily</span>
      </CardsTitleWrapper>

      <CardsContainerWrapper>
        {smartContractsStatistic?.map((app, index) => (
          <CardContainer key={index}>
            <CardHeader>
              <h4>#{index + 1}</h4>
              <CardContractInfo>
                <span>Transactions</span>
                <span>{app?.count}</span>
              </CardContractInfo>
            </CardHeader>
            <CardContractName>
              <AssetLogo
                logo={'/assets/klv-logo.png?w=1920'}
                ticker={'KLV'}
                name={'KLV'}
              />
              <span>{app.name || 'Contract Name'}</span>
              <small>{parseAddress(app.ownerAddress, 25)}</small>
            </CardContractName>
          </CardContainer>
        ))}
      </CardsContainerWrapper>
    </>
  );
};

export default MostUsedApplications;
