import React, { useRef, useState } from 'react';

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

import { getVariation } from '@/utils/index';

import { ICoinInfo, ICoinsStaking, ICoinStaking } from '@/types/index';

import Chart from '@/components/Chart';
import Link from 'next/link';

interface ICoinCard {
  coins: ICoinInfo[];
  actualTPS: string;
  coinsStaking: ICoinsStaking;
}

const CoinCard: React.FC<ICoinCard> = ({ coins, actualTPS, coinsStaking }) => {
  const [selectedCoin, setSelectedCoin] = useState(0);
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

  const renderTotalStaking = (coin: ICoinInfo) => {
    const currentCoin =
      coin.shortname === 'KLV'
        ? coinsStaking?.klvStaking
        : coinsStaking?.kfiStaking;

    if (
      typeof currentCoin?.totalStaking !== 'number' ||
      typeof currentCoin?.dayBeforeTotalStaking !== 'number'
    ) {
      return null;
    }
    const todayPercent =
      (currentCoin.totalStaking * 100) / currentCoin.dayBeforeTotalStaking;
    const yesterdayPercent = 100;
    const variation = todayPercent - yesterdayPercent;

    return (
      <ValueContent>
        <p>Total Staked</p>
        <ValueDetail positive={getVariation(variation).includes('+')}>
          {coin.shortname === 'KLV' ? (
            <span>
              $ {(coin.price * currentCoin.totalStaking).toLocaleString(undefined,{maximumFractionDigits: 0})}
            </span>
          ) : (
            <span>KFI {currentCoin.totalStaking.toLocaleString()} </span>
          )}

          <p>{getVariation(variation)}</p>
        </ValueDetail>
      </ValueContent>
    );
  };

  return (
    <Container>
      <Content ref={carouselRef} onScroll={handleSelectCoin}>
        {coins.map((coin, index) => {
          return (
            <CardContainer key={String(index)} ref={cardRef}>
              <CardContent>
                <Link href={`/asset/${coin.shortname}`}>
                  <a>
                    <HeaderContainer>
                      <IconContainer
                        src={`/coins/${coin.shortname.toLowerCase()}.png`}
                      />

                      <HeaderContent>
                        <Name>
                          <span>{coin.shortname}</span>
                          <span>
                            U${' '}
                            {coin.shortname === 'KLV'
                              ? coin.price.toLocaleString()
                              : '--'}
                          </span>
                        </Name>
                        <Description
                          positive={
                            coin.shortname === 'KLV'
                              ? getVariation(coin.variation).includes('+')
                              : getVariation(0).includes('+')
                          }
                        >
                          <span>{coin.name}</span>
                          <p>
                            {coin.shortname === 'KLV'
                              ? getVariation(coin.variation)
                              : getVariation(0)}
                          </p>
                        </Description>
                      </HeaderContent>
                    </HeaderContainer>
                  </a>
                </Link>
                {coin.shortname === 'KLV' ? (
                  <ChartContainer>
                    <Chart data={coin.prices} />
                  </ChartContainer>
                ) : null}

                <ValueContainer>
                  <ValueContent>
                    <p>Market Cap</p>
                    <ValueDetail
                      positive={getVariation(coin.marketCap.variation).includes(
                        '+',
                      )}
                    >
                      {coin.shortname === 'KLV' ? (
                        <>
                          {' '}
                          <span>$ {coin.marketCap.price.toLocaleString()}</span>
                          <p>{getVariation(coin.marketCap.variation)}</p>
                        </>
                      ) : (
                        <>
                          <span>$ --</span>
                          <p>{getVariation(0)}</p>
                        </>
                      )}
                    </ValueDetail>
                  </ValueContent>
                  <ValueContent>
                    <p>Volume</p>
                    <ValueDetail
                      positive={getVariation(coin.volume.variation).includes(
                        '+',
                      )}
                    >
                      {coin.shortname === 'KLV' ? (
                        <>
                          {' '}
                          <span>$ {coin.volume.price.toLocaleString()}</span>
                          <p>{getVariation(coin.volume.variation)}</p>
                        </>
                      ) : (
                        <>
                          {' '}
                          <span>$ --</span>
                          <p>{getVariation(0)}</p>
                        </>
                      )}
                    </ValueDetail>
                  </ValueContent>
                  {renderTotalStaking(coin)}
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
