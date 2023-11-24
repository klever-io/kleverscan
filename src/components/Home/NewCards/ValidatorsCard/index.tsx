import { HomeData } from '@/contexts/mainPage';
import Image from 'next/image';
import React, { useContext } from 'react';
import {
  CardContainer,
  CardContent,
  CardSection,
  NextImageValidatorWrapper,
  StackedImageWrapper,
  Title,
} from '../style';

const ValidatorsCard: React.FC = () => {
  const { totalValidators, activeValidators } = useContext(HomeData);
  return (
    <CardContainer>
      <Title>Validators</Title>
      <CardContent>
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
        <CardSection>
          <span>Active Vals.</span>
          <span>{activeValidators}</span>
        </CardSection>
        <hr />
        <CardSection>
          <span>Total Vals.</span>
          <span>{totalValidators}</span>
        </CardSection>
      </CardContent>
    </CardContainer>
  );
};

export default ValidatorsCard;
