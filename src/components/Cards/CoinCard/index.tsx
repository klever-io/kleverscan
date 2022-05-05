import React, { useRef, useState } from 'react';

import { useRouter } from 'next/router';

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
  CoinsSelector,
  CoinSelector,
} from './styles';

import { ICoinInfo } from '@/types/index';

import Chart from '@/components/Chart';

interface ICoinCard {
  coins: ICoinInfo[];
  actualTPS: string;
}

const CoinCard: React.FC<ICoinCard> = ({ coins, actualTPS }) => {
  const [selectedCoin, setSelectedCoin] = useState(0);
  const router = useRouter();

  const getVariation = (variation: number) => {
    const precision = 2;

    if (variation < 0) {
      return `- ${Math.abs(variation).toFixed(precision)}%`;
    }

    return `+ ${variation ? variation.toFixed(precision) : '--'}%`;
  };

  const carouselRef = useRef<any>(null);
  const cardRef = useRef<any>(null);

  const handleSelectCoin = () => {
    setSelectedCoin(
      Math.floor(carouselRef.current.scrollLeft / cardRef.current.offsetWidth),
    );
  };
  const handleSelection = (index: number) => {
    carouselRef.current.scrollLeft = index * cardRef.current.offsetWidth;
  };
  const coinNavigate = (coin: ICoinInfo) => {
    router.push(`/asset/${coin.shortname}`);
  };

  return (
    <Container>
      <Content ref={carouselRef} onScroll={handleSelectCoin}>
        {coins.map((coin, index) => {
          return (
            <CardContainer key={String(index)} ref={cardRef}>
              <CardContent>
                <HeaderContainer>
                  <IconContainer
                    onClick={() => coinNavigate(coin)}
                    src={`/coins/${coin.shortname.toLowerCase()}.png`}
                  />

                  <HeaderContent>
                    <Name>
                      <span onClick={() => coinNavigate(coin)}>
                        {coin.shortname}
                      </span>
                      <span>U$ {coin.price.toLocaleString()}</span>
                    </Name>
                    <Description
                      positive={getVariation(coin.variation).includes('+')}
                    >
                      <span onClick={() => coinNavigate(coin)}>
                        {coin.name}
                      </span>
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
                  <ValueContent />
                </ValueContainer>
              </CardContent>
            </CardContainer>
          );
        })}
      </Content>

      <CoinsSelector>
        {coins.map((_, index) => (
          <CoinSelector
            key={String(index)}
            isSelected={selectedCoin === index}
            onClick={() => {
              handleSelection(index);
            }}
          />
        ))}
      </CoinsSelector>
    </Container>
  );
};

export default CoinCard;
