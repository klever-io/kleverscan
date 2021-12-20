import React from 'react';

import {
  CardContainer,
  CardContent,
  ChartContainer,
  Container,
  Content,
  Description,
  HeaderContainer,
  HeaderContent,
  IconContainer,
  Name,
  ValueContainer,
  ValueContent,
  ValueDetail,
} from './styles';

import { ICoinInfo } from '@/pages/index';
import Chart from '@/components/Chart';

interface ICoinCard {
  coins: ICoinInfo[];
  actualTPS: string;
}

const CoinCard: React.FC<ICoinCard> = ({ coins, actualTPS }) => {
  const getVariation = (variation: number) => {
    const precision = 2;

    if (variation < 0) {
      return `- ${Math.abs(variation).toFixed(precision)}%`;
    }

    return `+ ${variation.toFixed(precision)}%`;
  };

  // const handleSelectionCoin = useCallback(
  //   (index: number) => {
  //     if (selectedCoin !== index) {
  //       setSelectedCoin(index);
  //     }
  //   },
  //   [selectedCoin],
  // );

  return (
    <Container>
      <Content>
        {coins.map((coin, index) => {
          return (
            <CardContainer key={String(index)}>
              <CardContent>
                <HeaderContainer>
                  <IconContainer src={`/coins/${coin.shortname}.png`} />

                  <HeaderContent>
                    <Name>
                      <span>{coin.shortname}</span>
                      <span>U$ {coin.price.toLocaleString()}</span>
                    </Name>
                    <Description
                      positive={getVariation(coin.variation).includes('+')}
                    >
                      <span>{coin.name}</span>
                      <p>{getVariation(coin.variation)}</p>
                    </Description>
                  </HeaderContent>
                </HeaderContainer>

                <ChartContainer>
                  <Chart data={coin.prices} />
                </ChartContainer>

                <ValueContainer>
                  {[coin.marketCap, coin.volume].map((item, index) => (
                    <ValueContent key={String(index)}>
                      <p>{index === 0 ? 'Market Cap' : 'Volume'}</p>
                      <ValueDetail
                        positive={getVariation(item.variation).includes('+')}
                      >
                        <span>$ {item.price.toLocaleString()}</span>
                        <p>{getVariation(item.variation)}</p>
                      </ValueDetail>
                    </ValueContent>
                  ))}
                  <ValueContent>
                    <ValueDetail>
                      <p>Live/Peak TPS</p>
                      <span>{actualTPS}</span>
                    </ValueDetail>
                  </ValueContent>
                </ValueContainer>
              </CardContent>
            </CardContainer>
          );
        })}

        {/* TODO: Add Carousel selection */}
      </Content>
    </Container>
  );
};

export default CoinCard;
