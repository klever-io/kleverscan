import Select from '@/components/Contract/Select';
import { IParamList } from '@/types/index';
import FormInput from 'components/Form/FormInput';
import { ButtonContainer, FormSection } from 'components/Form/styles';
import { useState } from 'react';
import { SectionTitle } from './styles';

interface IParamForm {
  paramsList: IParamList[];
}

const ParametersForm: React.FC<IParamForm> = ({ paramsList }) => {
  const [parametersQuantities, setparametersQuantities] = useState<number[]>(
    [],
  );
  const [keysValues, setKeysValues] = useState<number[]>([]);

  const handleAddParam = () => {
    setparametersQuantities([...parametersQuantities, 0]);
  };

  const handleRemoveParam = () => {
    const newparametersQuantities = [...parametersQuantities];
    newparametersQuantities.pop();
    setparametersQuantities(newparametersQuantities);
  };

  return (
    <FormSection>
      <SectionTitle>Parameters</SectionTitle>

      {parametersQuantities.map((itemsQuantity, index) => {
        return (
          <>
            <FormInput
              title="Parameter Key"
              name={`parameters[${index}].parameterKey`}
              span={2}
              type="hidden"
              value={keysValues[index]}
            />
            <Select
              options={paramsList}
              label={'Parameter Key'}
              title={'a parameter'}
              onChange={e => {
                const keysList = [...keysValues];
                keysList[index] = e.value;
                setKeysValues([...keysList]);
              }}
            />
            <FormInput
              title="Parameter Value"
              name={`parameters[${index}].parameterValue`}
              span={1}
              type="number"
            />
          </>
        );
      })}
      <ButtonContainer type="button" onClick={handleAddParam}>
        Add
      </ButtonContainer>

      {parametersQuantities.length > 0 && (
        <ButtonContainer type="button" onClick={handleRemoveParam}>
          Remove
        </ButtonContainer>
      )}
    </FormSection>
  );
};

export default ParametersForm;