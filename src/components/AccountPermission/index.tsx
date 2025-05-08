import { PropsWithChildren, useState } from 'react';
import {
  ButtonExpand,
  CheckboxOperations,
  OperationsContainer,
  OperationsContent,
  ValidOperation,
} from './styles';
import { useTranslation } from 'next-i18next';
import {
  filterOperations,
  hexToBinary,
  invertBytes,
} from '@/utils/formatFunctions';
import { contractsList } from '@/utils/contracts';

interface IPermissionOperations {
  id: number;
  operations: string;
  type: number;
}

export const PermissionOperations: React.FC<
  PropsWithChildren<IPermissionOperations>
> = ({ operations, type }) => {
  const [expanded, setExpanded] = useState(false);
  const { t } = useTranslation('common');
  const toggleExpand = () => {
    setExpanded(!expanded);
  };
  const displayOperations = expanded
    ? contractsList
    : contractsList.slice(0, 6);

  return (
    <OperationsContainer>
      {operations ? (
        displayOperations.map((item: string, key: number) => {
          const filterResults = filterOperations(
            hexToBinary(invertBytes(operations)),
          );
          const isChecked = filterResults[key];
          return (
            <OperationsContent key={contractsList[key]} isChecked={isChecked}>
              {isChecked ? (
                <ValidOperation />
              ) : (
                <CheckboxOperations
                  checked={isChecked}
                  type="checkbox"
                  disabled
                />
              )}
              <p>{item}</p>
            </OperationsContent>
          );
        })
      ) : (
        <>
          {type === 0 &&
            displayOperations.map((item, key) => (
              <OperationsContent key={contractsList[key]}>
                <ValidOperation />
                <p>{item}</p>
              </OperationsContent>
            ))}
        </>
      )}
      <ButtonExpand onClick={toggleExpand}>
        {expanded ? t('common:Buttons.Hide') : t('common:Buttons.Expand')}
      </ButtonExpand>
    </OperationsContainer>
  );
};
