import { useMobile } from '@/contexts/mobile';
import { ContractsIndex, IContract } from '@/types/contracts';
import { passViewportStyles } from '@/utils/viewportStyles';
import {
  MultiContractContainer,
  MultiContractCounter,
} from '@/views/transactions';
import { ReducedContract } from '../../types/contracts';
import Tooltip from '../Tooltip';
import { multiContractStyles } from '../Tooltip/configs';

interface IMultiContract {
  contractType: string;
  contract: IContract[];
}
export const MultiContractToolTip: React.FC<IMultiContract> = ({
  contractType,
  contract,
}) => {
  const { isMobile, isTablet } = useMobile();

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

  let msg = '';
  Object.entries(reduceContracts()).forEach(([contrct, number]) => {
    msg += `${ContractsIndex[contrct]}: ${number}x\n`;
  });

  return (
    <>
      <aside style={{ width: 'fit-content' }}>
        <Tooltip
          msg={msg}
          customStyles={passViewportStyles(
            isMobile,
            isTablet,
            ...multiContractStyles,
          )}
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
