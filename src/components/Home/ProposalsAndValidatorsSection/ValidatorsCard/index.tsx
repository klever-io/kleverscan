import { HomeData } from '@/contexts/mainPage';
import { MapContainer } from '@/views/nodes';
import dynamic from 'next/dynamic';
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
import Link from 'next/link';
import { PurpleArrowRight } from '@/assets/icons';

const Map = dynamic(() => import('@/components/Map/index'), { ssr: false });

const ValidatorsCard: React.FC = () => {
  const { totalValidators, activeValidators, nodes } = useContext(HomeData);
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
        <Link
          href={{
            pathname: '/validators',
          }}
        >
          <a>
            {' '}
            View All
            <PurpleArrowRight />
          </a>
        </Link>
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

      <MapContainer>
        <Map nodes={nodes} />
      </MapContainer>
    </CardContainer>
  );
};

export default ValidatorsCard;
