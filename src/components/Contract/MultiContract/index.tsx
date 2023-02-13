import { useContract } from '@/contexts/contract';
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

interface IMultiContract {
  broadcastQueue: () => void;
  removeContractQueue: (elementIndex: number, e: any) => void;
  editContract: (elementIndex: number) => void;
}

const MultiContract: React.FC<IMultiContract> = ({
  broadcastQueue,
  editContract,
  removeContractQueue,
}) => {
  const { isTablet } = useMobile();
  const {
    queue,
    selectedIndex,
    showMultiContracts,
    addToQueue,
    setShowMultiContracts,
  } = useContract();

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
                  key={item.elementIndex}
                  selected={item.elementIndex === selectedIndex}
                  onClick={() => editContract(item.elementIndex)}
                >
                  <Title>
                    #{item.elementIndex + 1} - {item.contract}
                  </Title>

                  {queue.length > 1 && (
                    <ButtonContainer>
                      <Button
                        primary
                        onClick={() => editContract(item.elementIndex)}
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={e => removeContractQueue(item.elementIndex, e)}
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
            <Button submit onClick={broadcastQueue}>
              Broadcast Queue
            </Button>
          )}
        </ButtonsContainer>
      </ContainerQueue>
      <Background
        showMultiContractFull={isTablet && showMultiContracts}
        onClick={() => setShowMultiContracts(!showMultiContracts)}
      />
    </>
  );
};

export default MultiContract;
