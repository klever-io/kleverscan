import { Scope } from '@unform/core';
import Button from 'components/Button';
import FormInput from 'components/Form/FormInput';
import {
  ButtonContainer,
  FormSection,
  SectionTitle,
} from 'components/Form/styles';
import { useState } from 'react';

const PermissionsForm: React.FC = () => {
  const [signerQuantities, setSignerQuantities] = useState<number[]>([1]);

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
    setSignerQuantities([...signerQuantities, 1]);
  };

  const handleRemovePack = () => {
    const newSignerQuantities = [...signerQuantities];
    newSignerQuantities.pop();
    setSignerQuantities(newSignerQuantities);
  };

  const getSigners = (outerIndex: number, itemsQuantity: number) => {
    const items = [];
    for (let innerIndex = 0; innerIndex < itemsQuantity; innerIndex++) {
      items.push(
        <Scope path={`permission[${outerIndex}].signer[${innerIndex}]`}>
          <FormSection inner>
            <SectionTitle>Signer</SectionTitle>
            <FormInput title="Address" name="address" required />
            <FormInput title="Weight" name="Weight" required type="number" />
          </FormSection>
        </Scope>,
      );
    }
    items.push(
      <>
        <ButtonContainer onClick={() => handleAddSigner(outerIndex)}>
          Add Signer
        </ButtonContainer>
        {signerQuantities[outerIndex] > 1 && (
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
            <SectionTitle>Permission</SectionTitle>
            <FormInput
              title="Permission Name"
              name={`permission[${index}].permissionName`}
              span={2}
            />
            <FormInput
              title="Threshold"
              name={`permission[${index}].threshold`}
              span={2}
            />
            <FormInput
              title="Operations"
              name={`permission[${index}].operations`}
              span={2}
            />
            <FormInput
              title="Type"
              name={`permission[${index}].type`}
              span={2}
            />
            {getSigners(index, itemsQuantity)}
          </FormSection>
        );
      })}

      <ButtonContainer onClick={handleAddPermission}>Add</ButtonContainer>

      {signerQuantities.length > 1 && (
        <ButtonContainer onClick={handleRemovePack}>Remove</ButtonContainer>
      )}
    </FormSection>
  );
};

export default PermissionsForm;
