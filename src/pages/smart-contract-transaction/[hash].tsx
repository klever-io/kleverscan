import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '@/services/api';
import { CardContent, CardHeader, CardHeaderItem, CardTabContainer, CenteredRow, InvokeMethodBagde, Row, Status } from '@/styles/common';
import { capitalizeString } from '@/utils/convertString';
import { getStatusIcon } from '@/assets/status';
import { getAge } from '@/utils/timeFunctions';
import { fromUnixTime } from 'date-fns';
import { formatDate } from '@/utils/formatFunctions';

const SmartContractTransaction: React.FC = () => {
    const router = useRouter();
    const hashUrl = router.query.hash;
    const [transactionData, setTransactionData] = useState<[]>([]);

    const requestTransactionData = async () => {
        try {
            const res = await api.get({
                route: `transaction/${hash}`,
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
        if (hashUrl) {
            requestTransactionData();
        }
    }, [hashUrl]);

    console.log('Transaction Data:', transactionData);

    const {
        hash,
        blockNum,
        sender,
        nonce,
        timestamp,
        kAppFee,
        bandwidthFee,
        status,
        contract
    } = transactionData;

    const StatusIcon = getStatusIcon(status);

    return (
        <CardTabContainer>
            <CardHeader>
                <CardHeaderItem selected={true}>
                    <span>Transaction</span>
                </CardHeaderItem>
            </CardHeader>
            <CardContent>
                <Row>
                    <span>Status</span>
                    <CenteredRow>
                        <Status status={status}>
                            <StatusIcon />
                            <span>{capitalizeString(status)}</span>
                        </Status>
                    </CenteredRow>
                </Row>
                <Row>
                    <span>Age</span>
                    <CenteredRow>
                        <span>
                            {getAge(fromUnixTime(timestamp), undefined)}
                            ({formatDate(timestamp)})
                        </span>
                    </CenteredRow>
                </Row>
                <Row>
                    <span>Block</span>
                    <CenteredRow>
                        <span>{transactionData?.blockNum}</span>
                    </CenteredRow>
                </Row>
                <Row>
                    <span>From</span>
                    <CenteredRow>
                        <span></span>
                    </CenteredRow>
                </Row>
                <Row>
                    <span>To</span>
                    <CenteredRow>
                        <span></span>
                    </CenteredRow>
                </Row>
                <Row>
                    <span>Value</span>
                    <CenteredRow>
                        <span></span>
                    </CenteredRow>
                </Row>
                <Row>
                    <span>Method</span>
                    <CenteredRow>
                        {contract?.map((item, index) => (
                            <InvokeMethodBagde key={index}>
                                {item?.parameter?.type ? item.parameter.type.slice(2) : ''}
                            </InvokeMethodBagde>
                        ))}
                    </CenteredRow>
                </Row>
                <Row>
                    <span>Transaction Fee</span>
                    <CenteredRow>
                        <span></span>
                    </CenteredRow>
                </Row>
                <Row>
                    <span>KLV Price</span>
                    <CenteredRow>
                        <span></span>
                    </CenteredRow>
                </Row>
                <Row>
                    <span>KApp Fee</span>
                    <CenteredRow>
                        <span></span>
                    </CenteredRow>
                </Row>
                <Row>
                    <span>Nonce</span>
                    <CenteredRow>
                        <span>{nonce}</span>
                    </CenteredRow>
                </Row>
                <Row>
                    <span>Metadata</span>
                    <CenteredRow>
                        <span></span>
                    </CenteredRow>
                </Row>
            </CardContent>
        </CardTabContainer>
    )
}

export default SmartContractTransaction;