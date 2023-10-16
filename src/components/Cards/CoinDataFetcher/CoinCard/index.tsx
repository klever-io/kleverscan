import { InfoSquare } from '@/assets/icons';
import Chart, { ChartType } from '@/components/Chart';
import { PriceTooltip } from '@/components/Chart/Tooltips';
import { Loader } from '@/components/Loader/styles';
import { useHomeData } from '@/contexts/mainPage';
import { useMobile } from '@/contexts/mobile';
import { ICoinInfo } from '@/types';
import { getVariation } from '@/utils';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { IoReloadSharp } from 'react-icons/io5';
import CoinCardSkeleton from '../CoinCardSkeleton';
import {
  ArrowTopRight,
  ArrowVariation,
  ButtonContainer,
  ButtonInformation,
  CardContainer,
  CardContent,
  CardContentError,
  ChartContainer,
  CoinSelector,
  CoinsSelector,
  Container,
  ContainerDesktop,
  Content,
  ContentDeskTop,
  ContentError,
  CurrencyIcon,
  Description,
  HeaderContainer,
  HeaderContent,
  HeaderGraph,
  IconContainer,
  Name,
  NameError,
  SetTimeContainer,
  SetTimeContainerLoaderWrapper,
  SpanTime,
} from './styles';

interface IDropDow {
  shortname: string;
  volume: { price: number; variation: number };
}
interface IPropsRenderCoinsCard {
  coin: ICoinInfo;
  cardRef: React.RefObject<HTMLDivElement>;
  renderKfiMarketCap: () => string;
  coinDays: React.MutableRefObject<ICoinTimes>;
}

interface ICoinTimes {
  [name: string]: number | string;
}

const RenderCoinsCard: React.FC<IPropsRenderCoinsCard> = props => {
  const { coin, renderKfiMarketCap, coinDays, cardRef } = props;
  const { shortname, name, price, variation, marketCap, prices } = coin;
  const { getCoins, assetsData } = useHomeData();
  const { t } = useTranslation('common', { keyPrefix: 'Cards' });
  const [daysSelected, setSelectedDays] = useState<string | number>(1);
  const [switchCardLoading, setSwitchCardLoading] = useState(false);
  const timeGraph = [1, 30, 180];

  const handleClick = async (time: string | number) => {
    coinDays.current = {
      ...coinDays.current,
      [shortname]: time,
    };
    setSelectedDays(time);
  };

  useEffect(() => {
    (async () => {
      setSwitchCardLoading(true);
      await getCoins(coinDays.current);
      setSwitchCardLoading(false);
    })();
  }, [daysSelected]);

  return (
    <CardContainer ref={cardRef}>
      <CardContent>
        <Link href={`/asset/${shortname}`}>
          <a>
            <HeaderContainer>
              <IconContainer
                src={`/coins/${shortname.toLowerCase()}.png`}
                width={50}
                height={50}
              />

              <HeaderContent>
                <Name>
                  <span>{shortname}</span>
                  <p>{name}</p>
                </Name>
                <ArrowTopRight />
              </HeaderContent>
            </HeaderContainer>
          </a>
        </Link>
        <HeaderGraph>
          <div>
            <span>{t('Price')}</span>
            <p>
              ${' '}
              {shortname === 'KLV'
                ? price.toLocaleString(undefined, {
                    maximumFractionDigits: 6,
                  })
                : assetsData?.kfi?.prices?.todaysPrice
                ? assetsData?.kfi?.prices?.todaysPrice.toLocaleString(
                    undefined,
                    { maximumFractionDigits: 6 },
                  )
                : '--'}
            </p>
            <Description
              positive={
                shortname === 'KLV'
                  ? getVariation(variation).includes('+')
                  : getVariation(
                      assetsData?.kfi?.prices?.variation || 0,
                    ).includes('+')
              }
            >
              <div>
                <ArrowVariation
                  positive={
                    shortname === 'KLV'
                      ? getVariation(variation).includes('+')
                      : getVariation(
                          assetsData?.kfi?.prices?.variation || 0,
                        ).includes('+')
                  }
                />
                {shortname === 'KLV'
                  ? getVariation(variation)
                  : getVariation(assetsData?.kfi?.prices?.variation || 0)}
              </div>
            </Description>
          </div>
          <div>
            <span>{t('Market Cap')}</span>
            {shortname === 'KLV' ? (
              <>
                {' '}
                <p>$ {marketCap.price?.toLocaleString()}</p>
              </>
            ) : (
              <>
                <p>$ {renderKfiMarketCap()}</p>
              </>
            )}
          </div>
        </HeaderGraph>
        <ChartContainer>
          <Chart
            data={prices}
            type={ChartType.Area}
            CustomTooltip={PriceTooltip}
            strokeWidth={1}
            yAxis={true}
            height={'130%'}
          />
        </ChartContainer>
        <SetTimeContainer>
          {switchCardLoading && (
            <SetTimeContainerLoaderWrapper>
              <Loader height={22} width={21} />
            </SetTimeContainerLoaderWrapper>
          )}
          {timeGraph.map((time, key) => (
            <SpanTime
              key={String(key)}
              onClick={() => {
                handleClick(time);
              }}
              selected={daysSelected === time}
            >
              {`${time}D`}
            </SpanTime>
          ))}
        </SetTimeContainer>
      </CardContent>
    </CardContainer>
  );
};
const CoinCard: React.FC = () => {
  const { t } = useTranslation('home');
  const coinsName = ['KLV', 'KFI'];
  const [selectedCoin, setSelectedCoin] = useState(0);
  const [loadingError, setLoadingError] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const { coins, loadingCoins, getCoins, assetsData } = useHomeData();
  const coinDays = useRef<ICoinTimes>({
    KLV: 1,
    KFI: 1,
  });
  const { isMobile, isTablet } = useMobile();
  const handleSelectCoin = useCallback(() => {
    if (carouselRef.current !== null && cardRef.current !== null)
      setSelectedCoin(
        carouselRef.current.scrollLeft / cardRef.current.offsetWidth,
      );
  }, [carouselRef, cardRef]);

  const handleSelection = (index: number) => {
    if (carouselRef.current !== null && cardRef.current !== null)
      carouselRef.current.scrollLeft = index * cardRef.current.offsetWidth;
  };

  const renderKfiMarketCap = () => {
    if (
      typeof assetsData?.kfi?.circulatingSupply == 'number' &&
      typeof assetsData?.kfi?.prices?.todaysPrice == 'number'
    ) {
      return (
        assetsData?.kfi?.circulatingSupply *
        assetsData?.kfi?.prices?.todaysPrice
      ).toLocaleString();
    }
    return '--';
  };

  const CoinsFetchFails: React.FC = () => {
    if (coins.length === 0) {
      return loadingError ? (
        <CardContainer>
          <CardContentError>
            <HeaderContainer>
              <NameError>
                <span>Error while fetching data</span>
              </NameError>
            </HeaderContainer>
            <ContentError
              onClick={async () => {
                setLoadingError(true);
                await getCoins({
                  kfi: 1,
                  klv: 1,
                });
                setLoadingError(false);
              }}
            >
              <span>Retry</span>
              <IoReloadSharp />
            </ContentError>
          </CardContentError>
        </CardContainer>
      ) : (
        <CoinCardSkeleton />
      );
    }
    return <></>;
  };

  return (
    <Container>
      {!isTablet ? (
        <ContainerDesktop>
          {!loadingCoins && (
            <div>
              {coinsName.map((coin, index) => (
                <ButtonContainer key={index}>
                  <a
                    target="_blank"
                    href={`https://bitcoin.me/en/trade/${coin}-USDT`}
                    rel="noreferrer"
                  >
                    <ButtonInformation>
                      {t('CardBuy', { asset: coin })}
                      <CurrencyIcon />
                    </ButtonInformation>
                  </a>
                </ButtonContainer>
              ))}
            </div>
          )}
          <ContentDeskTop>
            {coins.map((coin, index) => (
              <RenderCoinsCard
                renderKfiMarketCap={renderKfiMarketCap}
                coinDays={coinDays}
                cardRef={cardRef}
                coin={coin}
                key={index}
              />
            ))}
          </ContentDeskTop>
        </ContainerDesktop>
      ) : (
        <>
          <h1>Featured tokens</h1>
          <CoinsSelector>
            {coins.map((coin, index) => (
              <CoinSelector
                key={String(index)}
                isSelected={selectedCoin === index}
                onClick={() => {
                  handleSelection(index);
                }}
              >
                <IconContainer
                  src={`/coins/${coin.shortname.toLowerCase()}.png`}
                  width={20}
                  height={20}
                />
                <p>{coin.shortname}</p>
              </CoinSelector>
            ))}
          </CoinsSelector>
          {!loadingCoins ? (
            <Content ref={carouselRef} onScroll={handleSelectCoin}>
              {coins.map((coin, index) => (
                <RenderCoinsCard
                  renderKfiMarketCap={renderKfiMarketCap}
                  cardRef={cardRef}
                  coinDays={coinDays}
                  coin={coin}
                  key={index}
                />
              ))}
            </Content>
          ) : (
            <CoinCardSkeleton />
          )}
          {!loadingCoins && (
            <ButtonContainer>
              <a
                target="_blank"
                href={`https://bitcoin.me/en/trade/${
                  selectedCoin === 0 ? 'KLV' : 'KFI'
                }-USDT`}
                rel="noreferrer"
              >
                <ButtonInformation>
                  {selectedCoin === 0
                    ? t('CardBuy', { asset: 'KLV' })
                    : t('CardBuy', { asset: 'KFI' })}
                  <InfoSquare />
                </ButtonInformation>
              </a>
            </ButtonContainer>
          )}
        </>
      )}
      <CoinsFetchFails />
    </Container>
  );
};

export default CoinCard;
