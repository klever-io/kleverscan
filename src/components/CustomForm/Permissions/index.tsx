import { contractsList } from '@/utils/contracts';
import { setCharAt } from '@/utils/index';
import { Scope } from '@unform/core';
import FormInput from 'components/Form/FormInput';
import { Container, InputLabel } from 'components/Form/FormInput/styles';
import {
  ButtonContainer,
  FormSection,
  SectionTitle,
} from 'components/Form/styles';
import { useState } from 'react';
import { Checkbox, CheckboxContract, ContractsList } from './styles';

interface IPermissionsForm {
  setBinaryOperations: any;
  binaryOperations: string[];
}

const binaryDefault = '00000000000000000000000';

const PermissionsForm: React.FC<IPermissionsForm> = ({
  setBinaryOperations,
  binaryOperations,
}) => {
  const [signerQuantities, setSignerQuantities] = useState<number[]>([]);

  const handleAddSigner = (index: number) => {
    const newSignerQuantities = [...signerQuantities];
    newSignerQuantities[index] += 1;
    setSignerQuantities(newSignerQuantities);
  };

  const handleRemoveSigner = (index: number) => {
    const newSignerQuantities = [...signerQuantities];
    newSignerQuantities[index] -= 1;
    setSignerQuantities(newSignerQuantities);
  };

  const handleAddPermission = () => {
    const binaryOp = [...binaryOperations];
    binaryOp.push(binaryDefault);
    setBinaryOperations([...binaryOp]);
    setSignerQuantities([...signerQuantities, 1]);
  };

  const handleRemovePack = () => {
    const newSignerQuantities = [...signerQuantities];
    const binaryOp = [...binaryOperations];

    binaryOp.pop();
    newSignerQuantities.pop();

    setBinaryOperations([...binaryOp]);
    setSignerQuantities(newSignerQuantities);
  };

  const getSigners = (outerIndex: number, itemsQuantity: number) => {
    const items = [];
    for (let innerIndex = 0; innerIndex < itemsQuantity; innerIndex++) {
      items.push(
        <Scope path={`permissions[${outerIndex}].signers[${innerIndex}]`}>
          <FormSection inner>
            <SectionTitle>Signers</SectionTitle>
            <FormInput title="Address" name="address" />
            <FormInput title="Weight" name="weight" type="number" />
          </FormSection>
        </Scope>,
      );
    }
    items.push(
      <>
        <ButtonContainer onClick={() => handleAddSigner(outerIndex)}>
          Add Signer
        </ButtonContainer>
        {signerQuantities[outerIndex] > 0 && (
          <ButtonContainer onClick={() => handleRemoveSigner(outerIndex)}>
            Remove Signer
          </ButtonContainer>
        )}
      </>,
    );
    return items;
  };

  return (
    <FormSection>
      <SectionTitle>Permissions</SectionTitle>

      {signerQuantities.map((itemsQuantity, index) => {
        return (
          <FormSection inner key={String(index)}>
            <SectionTitle>Permissions</SectionTitle>
            <FormInput
              title="Permission Name"
              name={`permissions[${index}].permissionName`}
              span={2}
            />
            <FormInput
              title="Threshold"
              name={`permissions[${index}].threshold`}
              span={2}
            />
            <Container>
              <InputLabel>Operations</InputLabel>
              <ContractsList>
                {contractsList.map((item: any, key: number) => {
                  return (
                    <CheckboxContract key={key}>
                      <Checkbox
                        type="checkbox"
                        onChange={e => {
                          const binaryOp = [...binaryOperations];
                          const binary = binaryOp[index];
                          if (e.target.checked) {
                            binaryOp[index] = setCharAt(
                              binary,
                              binary.length - (key + 1),
                              '1',
                            );
                          } else {
                            binaryOp[index] = setCharAt(
                              binary,
                              binary.length - (key + 1),
                              '0',
                            );
                          }

                          setBinaryOperations([...binaryOp]);
                        }}
                        key={key}
                      />
                      <span>{item}</span>
                    </CheckboxContract>
                  );
                })}
              </ContractsList>
            </Container>
            <FormInput
              title="Type"
              name={`permissions[${index}].type`}
              span={2}
              type="dropdown"
              options={[
                { value: 0, label: 'Owner (0)' },
                { value: 1, label: 'User (1)' },
              ]}
            />
            {getSigners(index, itemsQuantity)}
          </FormSection>
        );
      })}

      <ButtonContainer type="button" onClick={handleAddPermission}>
        Add
      </ButtonContainer>

      {signerQuantities.length > 0 && (
        <ButtonContainer type="button" onClick={handleRemovePack}>
          Remove
        </ButtonContainer>
      )}
    </FormSection>
  );
};

export default PermissionsForm;
