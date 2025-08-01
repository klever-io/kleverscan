import React, { useRef } from 'react';
import {
  CardContainer,
  CardContractInfo,
  CardContractName,
  CardHeader,
  CardsContainerWrapper,
  CardsTitleWrapper,
  CarouselContainer,
  LogoContainer,
} from './styles';
import { useSmartContractData } from '@/contexts/smartContractPage';
import { parseAddress } from '@/utils/parseValues';
import { useTranslation } from 'next-i18next';
import { ArrowLeft, ArrowRight } from '@/assets/pagination';
import { ArrowContainer } from '@/components/Pagination/styles';
import AssetLogo from '@/components/Logo/AssetLogo';
import Link from 'next/link';
import Image from 'next/legacy/image';
import { useTheme } from '@/contexts/theme';

const MostUsedApplications = () => {
  const { t } = useTranslation('smartContracts');
  const { isDarkTheme } = useTheme();
  const { smartContractsStatistic } = useSmartContractData();

  const carouselRef = useRef<HTMLDivElement>(null);

  const goToPrevious = (event: any) => {
    event.preventDefault();
    if (carouselRef.current) {
      carouselRef.current.scrollLeft -= carouselRef.current.offsetWidth;
    }
  };

  const goToNext = (event: any) => {
    event.preventDefault();
    if (carouselRef.current) {
      carouselRef.current.scrollLeft += carouselRef.current.offsetWidth;
    }
  };

  return (
    <>
      <CardsTitleWrapper>
        <h3>{t('smartContracts:Titles.Most Used Applications')}</h3>
      </CardsTitleWrapper>

      <CarouselContainer>
        <ArrowContainer onClick={goToPrevious} active={true}>
          <ArrowLeft />
        </ArrowContainer>

        <CardsContainerWrapper ref={carouselRef}>
          {smartContractsStatistic?.map((app, index) => (
            <Link
              href={`/smart-contract/${app.address}`}
              key={app.address || index}
            >
              <CardContainer key={app.address || index}>
                <CardHeader>
                  <h4>#{index + 1}</h4>
                  <CardContractInfo>
                    <span>{t('smartContracts:Titles.Transactions')}</span>
                    <span>{app?.count}</span>
                  </CardContractInfo>
                </CardHeader>
                <CardContractName>
                  <LogoContainer>
                    <Image
                      src={
                        isDarkTheme
                          ? '/Smart-contract.svg'
                          : '/Smart-contract-black.svg'
                      }
                      alt="Logo"
                      width={16}
                      height={16}
                    />
                  </LogoContainer>
                  <span>{app.name || '- -'}</span>
                  <small>{parseAddress(app.ownerAddress, 25)}</small>
                </CardContractName>
              </CardContainer>
            </Link>
          ))}
        </CardsContainerWrapper>

        <ArrowContainer onClick={goToNext} active={true}>
          <ArrowRight />
        </ArrowContainer>
      </CarouselContainer>
    </>
  );
};

export default MostUsedApplications;
