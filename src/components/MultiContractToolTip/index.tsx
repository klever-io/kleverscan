import { PropsWithChildren } from 'react';
import { ContractsIndex, IContract } from '@/types/contracts';
import {
  MultiContractContainer,
  MultiContractCounter,
} from '@/views/transactions';
import { ReducedContract } from '../../types/contracts';
import Tooltip from '../Tooltip';

interface IMultiContract {
  contractType: string;
  contract: IContract[];
}
export const MultiContractToolTip: React.FC<
  PropsWithChildren<IMultiContract>
> = ({ contractType, contract }) => {
  const reduceContracts = (): ReducedContract => {
    const reducedContract: ReducedContract = {};
    contract.forEach(innerContract => {
      if (!reducedContract[innerContract.type as keyof ReducedContract]) {
        reducedContract[innerContract.type as keyof ReducedContract] = 1;
      } else if (reducedContract[innerContract.type as keyof ReducedContract]) {
        (reducedContract[
          innerContract.type as keyof ReducedContract
        ] as number) += 1;
      }
    });
    return reducedContract;
  };

  const msg = Object.entries(reduceContracts())
    .map(([innerContract, number]) => {
      return `${ContractsIndex[innerContract as keyof typeof ContractsIndex]}: ${number}x`;
    })
    .join('\n');

  return (
    <>
      <aside style={{ width: 'fit-content' }}>
        <Tooltip
          msg={msg}
          customStyles={{ offset: 5 }}
          Component={() => (
            <MultiContractContainer>
              {contractType}
              <MultiContractCounter>{contract.length}</MultiContractCounter>
            </MultiContractContainer>
          )}
        ></Tooltip>
      </aside>
    </>
  );
};
