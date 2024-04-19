import { PurpleArrowRight } from '@/assets/icons';
import AssetLogo from '@/components/Logo/AssetLogo';
import { HomeData } from '@/contexts/mainPage';
import { getAge } from '@/utils/timeFunctions';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import {
  ArrowIconContainer,
  CardHeader,
  CardTitle,
  InnerCardContainer,
  ProposalCardsSection,
  ProposalCardTitle,
  Timestamp,
} from '../../style';

export const LastBlock: React.FC = () => {
  const { blocks } = useContext(HomeData);

  const lastBlock = blocks?.[0];

  const [age, setAge] = useState(getAge(new Date()));

  useEffect(() => {
    const interval = setInterval(() => {
      const newAge = getAge(new Date(lastBlock?.timestamp || new Date()));

      setAge(newAge);
    }, 1 * 1000); // 1 sec

    return () => {
      clearInterval(interval);
    };
  }, [lastBlock]);

  return (
    <ProposalCardsSection>
      <ProposalCardTitle>Last Confirmed Block</ProposalCardTitle>

      <InnerCardContainer>
        {lastBlock && (
          <CardHeader>
            {lastBlock && (
              <Link href={`/validator/${lastBlock.producerOwnerAddress}`}>
                <a>
                  <AssetLogo
                    logo={lastBlock.producerLogo}
                    ticker={lastBlock.producerName}
                    name={lastBlock.producerName}
                    size={36}
                  />
                </a>
              </Link>
            )}
            <CardTitle href={`/validator/${lastBlock.producerOwnerAddress}`}>
              {lastBlock.producerName}
            </CardTitle>
            <ArrowIconContainer
              href={`/validator/${lastBlock.producerOwnerAddress}`}
            >
              <PurpleArrowRight />
            </ArrowIconContainer>
            <Timestamp>{age} ago</Timestamp>
          </CardHeader>
        )}
      </InnerCardContainer>
    </ProposalCardsSection>
  );
};
