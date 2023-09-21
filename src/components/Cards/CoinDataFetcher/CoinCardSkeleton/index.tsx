import Skeleton from '@/components/Skeleton';
import Link from 'next/link';
import React from 'react';
import {
  CardContainerSkeleton,
  CardContent,
  ChartContainerSkeleton,
  Container,
  Content,
  HeaderContainer,
  HeaderContentSkeleton,
  Name,
} from '../CoinCard/styles';

const CoinCardSkeleton: React.FC = () => {
  return (
    <Container>
      <Content style={{ marginBottom: '1rem' }}>
        {Array(2)
          .fill(2)
          .map((_, index) => (
            <CardContainerSkeleton key={index}>
              <CardContent>
                <Link href={`#`}>
                  <a>
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
                  </a>
                </Link>

                <ChartContainerSkeleton>
                  <Skeleton height={180} width={'100%'} />
                </ChartContainerSkeleton>
              </CardContent>
            </CardContainerSkeleton>
          ))}
      </Content>
    </Container>
  );
};

export default CoinCardSkeleton;
