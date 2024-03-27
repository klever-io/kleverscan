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
    contract.forEach(contrct => {
      if (!reducedContract[contrct.type]) {
        reducedContract[contrct.type] = 1;
      } else {
        reducedContract[contrct.type] += 1;
      }
    });
    return reducedContract;
  };

  const msg = Object.entries(reduceContracts())
    .map(([contrct, number]) => {
      return `${ContractsIndex[contrct]}: ${number}x`;
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
