import { ArrowDown } from '@/assets/icons';
import {
  DetailsArrowContainer,
  FeeContainer,
  FeeDetailsContainer,
} from '@/components/Form/styles';
import { useContract } from '@/contexts/contract';
import { IQueue, useMulticontract } from '@/contexts/contract/multicontract';
import { useMobile } from '@/contexts/mobile';
import { useTranslation } from 'next-i18next';
import React from 'react';
import { FiPlus } from 'react-icons/fi';
import {
  Background,
  Button,
  ButtonContainer,
  ButtonsContainer,
  ContainerQueue,
  ContractItem,
  ContractsContainer,
  Title,
} from './styles';

const queueHaveSomeRoyalties = (queue: IQueue[]) =>
  queue.some(item => item.royaltiesFeeAmount);

export const sumAllRoyaltiesFees = (
  queue: IQueue[],
): {
  [key: string]: {
    totalFee: string;
    precision: number;
  };
} => {
  const result = {};
  queue.forEach(item => {
    if (item.royaltiesFeeAmount && item.collection && !item.collection.isNFT) {
      if (result[item?.collection?.value]) {
        result[item.collection.value]['totalFee'] += item.royaltiesFeeAmount;
      } else {
        result[item.collection.value] = {};
        result[item.collection.value]['precision'] = item.collection.precision;
        result[item.collection.value]['totalFee'] = item.royaltiesFeeAmount;
      }
    } else if (item.royaltiesFeeAmount) {
      if (result['KLV']) {
        result['KLV']['totalFee'] += item.royaltiesFeeAmount;
      } else {
        result['KLV'] = {};
        result['KLV']['totalFee'] = item.royaltiesFeeAmount;
        result['KLV']['precision'] = 6;
      }
    }
  });
  Object.keys(result).forEach(key => {
    result[key]['totalFee'] = result[key]['totalFee'].toFixed(
      result[key]['precision'],
    );
  });
  return result;
};

const FeeDetails: React.FC<{
  isOpen: boolean;
}> = ({ isOpen }) => {
  const { processFeesMsgs, queue, kdaFeePoolIsFetching } = useMulticontract();
  const { totalKappFeesMsg, totalBandwidthFeesMsg } = processFeesMsgs();
  const allRoyaltiesFees = sumAllRoyaltiesFees(queue);
  return (
    <FeeDetailsContainer open={isOpen}>
      {kdaFeePoolIsFetching ? (
        'Calculating conversion...'
      ) : (
        <>
          <span>{`${totalKappFeesMsg} (KApp Fee)`}</span>
          <span>{`${totalBandwidthFeesMsg} (Bandwidth Fee)`}</span>{' '}
        </>
      )}

      {queueHaveSomeRoyalties(queue) &&
        Object.keys(allRoyaltiesFees).map(item => {
          return (
            <span
              key={item}
            >{`${allRoyaltiesFees[item]['totalFee']} ${item} (Royalty Fees)`}</span>
          );
        })}
    </FeeDetailsContainer>
  );
};

const MultiContract: React.FC = () => {
  const { t } = useTranslation('transactions');
  const { isTablet } = useMobile();
  const { submitForms } = useContract();

  const {
    queue,
    selectedId,
    addToQueue,
    showMultiContracts,
    setShowMultiContracts,
    removeContractQueue,
    editContract,
    processFeesMsgs,
    kdaFeePoolIsFetching,
  } = useMulticontract();
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);
  const { totalFeesMsg } = processFeesMsgs();
  const handleArrowDownClick = () => {
    setIsDetailsOpen(!isDetailsOpen);
  };

  return (
    <>
      <ContainerQueue
        isTablet={isTablet}
        showMultiContractFull={showMultiContracts}
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <ContractsContainer>
          <strong>
            {t('MultiContract.Tx Queue')} ({queue.length}){' '}
          </strong>
          {queue.map((item: any, index: number) => {
            if (index < queue.length) {
              return (
                <ContractItem
                  key={item.elementId}
                  selected={item.elementId === selectedId}
                  onClick={() => editContract(item.elementId)}
                >
                  <Title>
                    #{item.elementId + 1} - {item.contractName}
                  </Title>

                  {queue.length > 1 && (
                    <ButtonContainer>
                      <Button
                        primary
                        onClick={() => editContract(item.elementId)}
                      >
                        {t('MultiContract.Edit')}
                      </Button>
                      <Button
                        onClick={e => removeContractQueue(item.elementId, e)}
                      >
                        {t('MultiContract.Remove')}
                      </Button>
                    </ButtonContainer>
                  )}
                </ContractItem>
              );
            }
          })}
        </ContractsContainer>
        <ButtonsContainer>
          <Button addToQueue onClick={addToQueue}>
            <FiPlus />
            {t('MultiContract.New Contract')}
          </Button>
          {queue.length > 0 && (
            <Button submit onClick={submitForms}>
              {t('MultiContract.Broadcast Queue')}
            </Button>
          )}
        </ButtonsContainer>
        <FeeContainer isMulticontract={true}>
          <div>
            <span>{t('MultiContract.Estimated Fees')} </span>
            {kdaFeePoolIsFetching ? (
              `${t('MultiContract.Calculating conversion')}`
            ) : (
              <span>{totalFeesMsg}</span>
            )}
          </div>

          {queueHaveSomeRoyalties(queue) && '+ Royalties'}
          <DetailsArrowContainer
            isOpen={isDetailsOpen}
            onClick={() => handleArrowDownClick()}
          >
            <ArrowDown />
          </DetailsArrowContainer>
          <FeeDetails isOpen={isDetailsOpen} />
        </FeeContainer>
      </ContainerQueue>
      <Background
        showMultiContractFull={isTablet && showMultiContracts}
        onClick={() => setShowMultiContracts(!showMultiContracts)}
      />
    </>
  );
};

export default MultiContract;
