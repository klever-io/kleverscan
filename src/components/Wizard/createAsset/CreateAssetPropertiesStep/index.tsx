import Tooltip from '@/components/Tooltip';
import React, { PropsWithChildren } from 'react';
import { useFormContext } from 'react-hook-form';
import { IAssetInformations, propertiesValues } from '..';
import { ButtonsComponent } from '../ButtonsComponent';
import {
  CheckBoxInput,
  GenericCardContainer,
  PropertiesContainer,
  PropertiesItem,
} from '../styles';

export const CreateAssetPropertiesStep: React.FC<
  PropsWithChildren<IAssetInformations>
> = ({
  informations: { title, description },
  handleStep,
  isLastStep = false,
  t,
}) => {
  const { register } = useFormContext();
  const buttonsProps = {
    handleStep,
    next: true,
    isLastStep,
  };
  return (
    <GenericCardContainer>
      <div>
        <p>{t('wizards:common.advancedOptions.allAdvancedOption')}</p>
        <p>
          {t(
            'wizards:common.advancedOptions.properties.properties',
          ).toUpperCase()}
        </p>
      </div>
      <div>
        <p>{title}</p>
        <p>{description}</p>
        <PropertiesContainer>
          {propertiesValues(t).map(property => (
            <PropertiesItem key={JSON.stringify(property)}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <CheckBoxInput
                  defaultChecked={property.isDefaultChecked}
                  {...register(`properties.${property.property}`)}
                />
                <Tooltip msg={property.tooltip} />
              </div>
              <span>{property.label}</span>
            </PropertiesItem>
          ))}
        </PropertiesContainer>
      </div>
      <ButtonsComponent buttonsProps={buttonsProps} />
    </GenericCardContainer>
  );
};
