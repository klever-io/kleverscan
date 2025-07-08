import React, { useRef } from 'react';
import { Accounts, Transactions } from '@/assets/cards';
import { DataCardsContent, DataCardsWrapper } from './styles';
import {
  ArrowData,
  DataCard,
  DataCardContent,
  DataCardLatest,
  DataCardValue,
} from '@/views/home';
import { DefaultCards } from '@/components/Home/CardDataFetcher/HomeDataCards';
import { useSmartContractData } from '@/contexts/smartContractPage';
const SmartContractTopCard = () => {
  const dataCardsRef = useRef<HTMLDivElement>(null);

  const {
    beforeYesterdayTransactions,
    smartContractsTotalTransactions,
    smartContractTotalContracts,
  } = useSmartContractData();

  const dataCards = [
    {
      Icon: Transactions,
      title: 'Total Transactions',
      value: smartContractsTotalTransactions,
      variation: `+ ${(beforeYesterdayTransactions ?? 0).toLocaleString()}`,
    },
    {
      Icon: Accounts,
      title: 'Contracts',
      value: smartContractTotalContracts,
      variation: undefined,
      // `+ ${(
      //     100 + (20)
      // ).toLocaleString()}`,
    },
  ];
  return (
    <DataCardsWrapper>
      <DataCardsContent ref={dataCardsRef}>
        {dataCards.map(({ title, value, variation }, index) => (
          <DataCard key={String(index)}>
            <DefaultCards index={index} />
            <DataCardContent>
              <span>{title}</span>
              <DataCardValue>
                <p>{value?.toLocaleString()}</p>
              </DataCardValue>
              {variation && !variation.includes('%') && (
                <DataCardLatest positive={variation.includes('+')}>
                  <ArrowData $positive={variation.includes('+')} />
                  <p>{variation}/24h</p>
                </DataCardLatest>
              )}
            </DataCardContent>
          </DataCard>
        ))}
      </DataCardsContent>
    </DataCardsWrapper>
  );
};

export default SmartContractTopCard;
