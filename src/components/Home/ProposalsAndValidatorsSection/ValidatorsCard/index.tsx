import { HomeData } from '@/contexts/mainPage';
import Image from 'next/image';
import React, { useContext } from 'react';
import {
  CardContainer,
  CardSection,
  Content,
  NextImageValidatorWrapper,
  StackedImageWrapper,
  Title,
} from '../style';

const ValidatorsCard: React.FC = () => {
  const { totalValidators, activeValidators } = useContext(HomeData);
  return (
    <CardContainer>
      <Title>
        <StackedImageWrapper>
          <NextImageValidatorWrapper>
            <Image
              src="/homeCards/validatorsIcon.svg"
              alt="Validators icon"
              width={32}
              height={32}
              loader={({ src, width }) => `${src}?w=${width}`}
            />
          </NextImageValidatorWrapper>
          <NextImageValidatorWrapper>
            <Image
              src="/homeCards/validatorsBackground.svg"
              alt="Validators icon background"
              width={48}
              height={48}
              loader={({ src, width }) => `${src}?w=${width}`}
            />
          </NextImageValidatorWrapper>
        </StackedImageWrapper>
        <span>Validators</span>
      </Title>

      <Content>
        <CardSection>
          <span>Active Validators</span>
          <span>{activeValidators}</span>
        </CardSection>
        <CardSection>
          <span>Total Validators</span>
          <span>{totalValidators}</span>
        </CardSection>
      </Content>
    </CardContainer>
  );
};

export default ValidatorsCard;
