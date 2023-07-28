import { ArrowDown } from '@/assets/icons';
import {
  DetailsArrowContainer,
  FeeContainer,
  FeeDetailsContainer,
} from '@/components/Form/styles';
import { useContract } from '@/contexts/contract';
import { IQueue, useMulticontract } from '@/contexts/contract/multicontract';
import { useMobile } from '@/contexts/mobile';
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

const sumAllRoyaltiesFees = (queue: IQueue[]) => {
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
  const {
    totalBandwidthFees: bandwidthFee,
    totalKappFees: kappFee,
    queue,
  } = useMulticontract();
  const allRoyaltiesFees = sumAllRoyaltiesFees(queue);
  return (
    <FeeDetailsContainer open={isOpen}>
      <span>{`${kappFee} KLV (KApp Fees)`}</span>
      <span>{`${bandwidthFee} KLV (Bandwidth Fees)`}</span>
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
  const { isTablet } = useMobile();
  const { submitForms } = useContract();

  const {
    queue,
    selectedId,
    addToQueue,
    totalFees,
    showMultiContracts,
    setShowMultiContracts,
    removeContractQueue,
    editContract,
  } = useMulticontract();
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);

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
          <strong>Tx Queue ({queue.length}) </strong>
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
                        Edit
                      </Button>
                      <Button
                        onClick={e => removeContractQueue(item.elementId, e)}
                      >
                        Remove
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
            New Contract
          </Button>
          {queue.length > 0 && (
            <Button submit onClick={submitForms}>
              Broadcast Queue
            </Button>
          )}
        </ButtonsContainer>
        <FeeContainer isMulticontract={true}>
          <span>Estimated Fees: </span>
          <span>
            {totalFees.toFixed(6)} KLV{' '}
            {queueHaveSomeRoyalties(queue) && '+ Royalties'}
            <DetailsArrowContainer
              isOpen={isDetailsOpen}
              onClick={() => handleArrowDownClick()}
            >
              <ArrowDown />
            </DetailsArrowContainer>
          </span>
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
