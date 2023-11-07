import { PlusSquare } from '@/assets/icons';
import { useHomeData } from '@/contexts/mainPage';
import { getContractType } from '@/utils';
import { getPrecision } from '@/utils/precisionFunctions';
import {
  ArrowUpSquareHideMenu,
  ContainerHide,
  SectionCards,
  TransactionContainer,
  TransactionEmpty,
  ViewMoreContainer,
} from '@/views/home';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { ITransaction } from '../../types';
import TransactionItem, {
  IContract,
  TransactionItemLoading,
} from '../TransactionItem';

const HomeTransactions: React.FC = () => {
  const { t: commonT } = useTranslation('common');
  const { t } = useTranslation('transactions');
  const { transactions: homeTransactions } = useHomeData();
  const [transactions, setTransactions] =
    useState<ITransaction[]>(homeTransactions);
  const [hideMenu, setHideMenu] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const assetsIds = homeTransactions.map(({ contract }) => {
      let contractFilter = {} as IContract;
      contractFilter = contract[0] as IContract;
      const assetId = contractFilter?.parameter?.assetId;
      if (assetId) {
        return assetId.split('/')[0];
      }
      return 'KLV';
    });

    const addPrecisions = async () => {
      setLoading(true);
      const precisions = await getPrecision(assetsIds);
      const assetsPrecision = assetsIds.map(item => {
        return precisions[item];
      });
      const newTxs = homeTransactions.map((obj, index) => {
        const contractType = obj.contract[0].typeString;
        const checkContract = getContractType(contractType);

        if (checkContract) {
          obj.contract[0] = {
            ...obj.contract[0],
            precision: assetsPrecision[index],
          };
        }

        return obj;
      });
      setTransactions(newTxs);
      setLoading(false);
    };
    addPrecisions();
  }, [homeTransactions]);

  return (
    <SectionCards>
      <ContainerHide>
        <h1>{t('Last Transactions')}</h1>
        <div onClick={() => setHideMenu(!hideMenu)}>
          <p>{hideMenu ? 'Show' : 'Hide'}</p>
          <ArrowUpSquareHideMenu $hide={hideMenu} />
        </div>
      </ContainerHide>
      <TransactionContainer>
        {!hideMenu && (
          <>
            {loading &&
              Array.from(Array(10).keys()).map(key => (
                <TransactionItemLoading key={key} />
              ))}

            {!loading &&
              transactions?.map(transaction => (
                <TransactionItem key={transaction.hash} {...transaction} />
              ))}

            {!loading && transactions.length === 0 && (
              <TransactionEmpty>
                <span>{commonT('EmptyData')}</span>
              </TransactionEmpty>
            )}
            <Link href={'/transactions'}>
              <a>
                <ViewMoreContainer>
                  <PlusSquare />
                  <p>
                    {commonT('Cards.ViewAll', { type: 'as' }) +
                      ' ' +
                      commonT('Titles.Transactions')}
                  </p>
                </ViewMoreContainer>
              </a>
            </Link>
          </>
        )}
      </TransactionContainer>
    </SectionCards>
  );
};

export default HomeTransactions;
