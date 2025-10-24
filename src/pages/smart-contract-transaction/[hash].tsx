import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  CardContent,
  CardHeader,
  CardHeaderItem,
  CardTabContainer,
  CommonContainer,
  Container,
} from '@/styles/common';
import { CardRaw } from '@/views/transactions/detail';
import { getRawTxTheme } from '../transaction/[hash]';
import { useTheme } from '@/contexts/theme';
import SCTransactionDetails from '@/components/SmartContracts/SmartContractTransaction';
import { SmartContractTransactionData } from '@/types/smart-contract';
import { useQuery } from 'react-query';
import { getNetwork } from '@/utils/networkFunctions';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { smartContractTransactionDetailsCall } from '@/services/requests/smartContracts';
import dynamic from 'next/dynamic';
import { isKVMAvailable } from '@/utils/kvm';

const SmartContractTransaction: React.FC = () => {
  const router = useRouter();
  const hashUrl = router.query.hash as string;
  const ReactJson = dynamic(
    () => import('react-json-view').then(mod => mod.default),
    { ssr: false },
  );
  const { isDarkTheme } = useTheme();
  const [transactionData, setTransactionData] =
    useState<SmartContractTransactionData>();

  const requestTransactionData = async () => {
    try {
      const res = await smartContractTransactionDetailsCall(hashUrl);

      if (res) {
        setTransactionData(res.transaction);
      }
    } catch (error) {
      console.error('Error fetching transaction data:', error);
    }
  };

  useEffect(() => {
    if (!hashUrl) return;
    requestTransactionData();
  }, [hashUrl]);

  return (
    <Container>
      <SCTransactionDetails transactionData={transactionData || {}} />

      <CommonContainer>
        <CardTabContainer>
          <CardHeader>
            <CardHeaderItem selected={true}>
              <span>Raw Tx</span>
            </CardHeaderItem>
          </CardHeader>
          <CardContent>
            <CardRaw>
              <ReactJson
                src={transactionData || {}}
                name={false}
                displayObjectSize={false}
                enableClipboard={true}
                displayDataTypes={false}
                theme={getRawTxTheme(isDarkTheme)}
              />
            </CardRaw>
          </CardContent>
        </CardTabContainer>
      </CommonContainer>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'en',
}) => {
  const network = getNetwork();
  if (!isKVMAvailable(network)) {
    return {
      notFound: true,
    };
  }
  const props = await serverSideTranslations(locale, ['en']);
  return { props };
};

export default SmartContractTransaction;
