import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '@/services/api';
import { CardContent, CardHeader, CardHeaderItem, CardTabContainer } from '@/styles/common';
import { CardRaw } from '@/views/transactions/detail';
import ReactJson from 'react-json-view';
import { getRawTxTheme } from '../transaction/[hash]';
import { useTheme } from '@/contexts/theme';
import SCTransactionDetails from '@/components/SmartContracts/SmartContractTransaction';
import { SmartContractTransactionData } from '@/types/smart-contract';
import { pricesCall } from '@/services/requests/account';
import { useQuery } from 'react-query';

const SmartContractTransaction: React.FC<SmartContractTransactionData> = () => {
    const router = useRouter();
    const hashUrl = router.query.hash;
    const { isDarkTheme } = useTheme();
    const [transactionData, setTransactionData] = useState<SmartContractTransactionData | null>(null);

    const { data: priceCall } = useQuery(
        ['pricesCall'],
        pricesCall,
    );

    const requestTransactionData = async () => {
        try {
            const res = await api.get({
                route: `transaction/${hashUrl}`,
            });

            if (!res.error || res.error === '') {
                setTransactionData(res.data.transaction);
            } else {
                console.error('Error fetching transaction data:', res.error);
            }

        } catch (error) {
            console.error('Error fetching transaction data:', error);
        }
    }

    useEffect(() => {
        requestTransactionData();
    }, []);

    return (
        <>
            <SCTransactionDetails
                blockNum={transactionData?.blockNum || 0}
                sender={transactionData?.sender || ''}
                nonce={transactionData?.nonce || 0}
                timestamp={transactionData?.timestamp || 0}
                kAppFee={transactionData?.kAppFee || 0}
                bandwidthFee={transactionData?.bandwidthFee || 0}
                status={transactionData?.status || ''}
                contract={transactionData?.contract || []}
                price={priceCall || 0}
                data={transactionData?.data || []}
            />
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
        </>
    )
}

export default SmartContractTransaction;