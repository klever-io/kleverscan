import { PropsWithChildren } from 'react';
import Skeleton from '@/components/Skeleton';
import Link from 'next/link';
import React from 'react';
import {
  CardContainerSkeleton,
  CardContent,
  Carousel,
  ChartContainerSkeleton,
  Container,
  HeaderContainer,
  HeaderContentSkeleton,
  Name,
} from '../CoinCard/styles';

const CoinCardSkeleton: React.FC<PropsWithChildren> = () => {
  return (
    <Container>
      <Carousel style={{ marginBottom: '1rem' }}>
        {Array(2)
          .fill(2)
          .map((_, index) => (
            <CardContainerSkeleton key={index}>
              <CardContent>
                <Link href={`#`}>
                  <HeaderContainer>
                    <Skeleton width={70} height={60} />

                    <HeaderContentSkeleton>
                      <Name>
                        <span style={{ marginBottom: '0.5rem' }}>
                          <Skeleton width={60} height={21} />
                        </span>
                        <span>
                          <Skeleton height={21} />
                        </span>
                      </Name>
                    </HeaderContentSkeleton>
                  </HeaderContainer>
                </Link>

                <ChartContainerSkeleton>
                  <Skeleton height={180} width={'100%'} />
                </ChartContainerSkeleton>
              </CardContent>
            </CardContainerSkeleton>
          ))}
      </Carousel>
    </Container>
  );
};

export default CoinCardSkeleton;
