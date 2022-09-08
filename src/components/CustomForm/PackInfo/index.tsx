import { InfoIcon, TooltipContainer } from '@/components/Form/FormInput/styles';
import { Scope } from '@unform/core';
import FormInput from 'components/Form/FormInput';
import {
  ButtonContainer,
  FormSection,
  SectionTitle,
} from 'components/Form/styles';
import { useState } from 'react';

const PackInfoForm: React.FC = () => {
  const [packItemQuantities, setPackItemQuantities] = useState<number[]>([]);

  const handleAddItem = (index: number) => {
    const newPackItemQuantities = [...packItemQuantities];
    newPackItemQuantities[index] += 1;
    setPackItemQuantities(newPackItemQuantities);
  };

  const handleRemoveItem = (index: number) => {
    const newPackItemQuantities = [...packItemQuantities];
    newPackItemQuantities[index] -= 1;
    setPackItemQuantities(newPackItemQuantities);
  };

  const handleAddPack = () => {
    setPackItemQuantities([...packItemQuantities, 0]);
  };

  const handleRemovePack = () => {
    const newPackItemQuantities = [...packItemQuantities];
    newPackItemQuantities.pop();
    setPackItemQuantities(newPackItemQuantities);
  };

  const getPackItems = (outerIndex: number, itemsQuantity: number) => {
    const items = [];
    for (let innerIndex = 0; innerIndex < itemsQuantity; innerIndex++) {
      items.push(
        <Scope path={`pack[${outerIndex}].packItem[${innerIndex}]`}>
          <FormSection inner>
            <SectionTitle>Pack Item</SectionTitle>
            <FormInput
              title="Amount"
              name="amount"
              required
              tooltip={tooltipsMessages['Amount']}
            />
            <FormInput
              title="Price"
              name="price"
              required
              tooltip={tooltipsMessages['Price']}
            />
          </FormSection>
        </Scope>,
      );
    }
    items.push(
      <>
        <ButtonContainer
          type="button"
          onClick={() => handleAddItem(outerIndex)}
        >
          Add Item
        </ButtonContainer>
        {packItemQuantities[outerIndex] > 0 && (
          <ButtonContainer
            type="button"
            onClick={() => handleRemoveItem(outerIndex)}
          >
            Remove Item
          </ButtonContainer>
        )}
      </>,
    );
    return items;
  };

  const tooltipsMessages = {
    Amount:
      'For NFTs: Amount sold; For token: Min amount for that price to be applied',
    Price: 'For NFTs: Price for that amount; For Tokens: Price of each token',
  };

  return (
    <FormSection>
      <SectionTitle>
        PackInfo{' '}
        <TooltipContainer tooltip={'Add new packs and their items'}>
          <InfoIcon />
        </TooltipContainer>
      </SectionTitle>

      {packItemQuantities.map((itemsQuantity, index) => {
        return (
          <FormSection inner key={String(index)}>
            <SectionTitle>Pack</SectionTitle>
            <FormInput
              title="Pack Currency ID"
              name={`pack[${index}].packCurrencyID`}
              span={2}
              tooltip={'Defines the currency in which the packs will be sold.'}
            />
            {getPackItems(index, itemsQuantity)}
          </FormSection>
        );
      })}

      <ButtonContainer type="button" onClick={handleAddPack}>
        Add Pack
      </ButtonContainer>

      {packItemQuantities.length > 0 && (
        <ButtonContainer type="button" onClick={handleRemovePack}>
          Remove Pack
        </ButtonContainer>
      )}
    </FormSection>
  );
};

export default PackInfoForm;
