import Skeleton from '@/components/Skeleton';
import Link from 'next/link';
import React from 'react';
import {
  CardContainerSkeleton,
  CardContent,
  ChartContainer,
  Container,
  Content,
  Description,
  HeaderContainer,
  HeaderContentSkeleton,
  Name,
  TitleDetails,
  ValueContainer,
  ValueContent,
  ValueDetail,
} from '../CoinCard/styles';

const CoinCardSkeleton: React.FC = () => {
  return (
    <Container>
      <Content>
        <CardContainerSkeleton>
          <CardContent>
            <Link href={`#`}>
              <a>
                <HeaderContainer>
                  <Skeleton width={60} height={50} />

                  <HeaderContentSkeleton>
                    <Name>
                      <span>
                        <Skeleton width={60} height={21} />
                      </span>
                      <span>
                        <Skeleton height={21} />
                      </span>
                    </Name>
                    <Description positive={true}>
                      <span>
                        <Skeleton width={60} height={16} />
                      </span>
                      <p>
                        <Skeleton height={19} />
                      </p>
                    </Description>
                  </HeaderContentSkeleton>
                </HeaderContainer>
              </a>
            </Link>

            <ChartContainer>
              <Skeleton height={100} width={'100%'} />
            </ChartContainer>

            <ValueContainer isKLV={true}>
              <ValueContent>
                <TitleDetails positive={true}>
                  <p>
                    <Skeleton height={16} width={72} />
                  </p>
                  <span>
                    <Skeleton height={16} width={40} />
                  </span>
                </TitleDetails>
                <ValueDetail>
                  <span>
                    <Skeleton height={19} />
                  </span>
                </ValueDetail>
              </ValueContent>
              <ValueContent isDropdown={true}>
                <TitleDetails positive={true}>
                  <p>
                    <Skeleton height={16} width={72} />
                  </p>
                  <span>
                    <Skeleton height={16} width={40} />
                  </span>
                </TitleDetails>
                <ValueDetail>
                  <Skeleton height={19} />
                </ValueDetail>
              </ValueContent>
            </ValueContainer>
          </CardContent>
        </CardContainerSkeleton>
      </Content>
    </Container>
  );
};

export default CoinCardSkeleton;
