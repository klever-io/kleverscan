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
export const MultiContractToolTip: React.FC<IMultiContract> = ({
  contractType,
  contract,
}) => {
  const reduceContracts = (): ReducedContract => {
    const reducedContract: ReducedContract = {};
    contract.forEach(innerContract => {
      if (!reducedContract[innerContract.type]) {
        reducedContract[innerContract.type] = 1;
      } else {
        reducedContract[innerContract.type] += 1;
      }
    });
    return reducedContract;
  };

  const msg = Object.entries(reduceContracts())
    .map(([innerContract, number]) => {
      return `${ContractsIndex[innerContract]}: ${number}x`;
    })
    .join('\n');

  return (
    <>
      <aside style={{ width: 'fit-content' }}>
        <Tooltip
          msg={msg}
          customStyles={{ offset: { right: 54, top: 5 } }}
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
