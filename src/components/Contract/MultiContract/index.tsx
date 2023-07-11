import { ArrowDown } from '@/assets/icons';
import {
  DetailsArrowContainer,
  FeeContainer,
  FeeDetailsContainer,
} from '@/components/Form/styles';
import { useContract } from '@/contexts/contract';
import { useMulticontract } from '@/contexts/contract/multicontract';
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

const FeeDetails: React.FC<{
  isOpen: boolean;
}> = ({ isOpen }) => {
  const { totalBandwidthFees: bandwidthFee, totalKappFees: kappFee } =
    useMulticontract();

  return (
    <FeeDetailsContainer open={isOpen}>
      <span>{`${kappFee} KLV (KApp Fees)`}</span>+
      <span>{`${bandwidthFee} KLV (Bandwidth Fees)`}</span>
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
