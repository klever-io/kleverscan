import { useContract } from '@/contexts/contract';
import { contractsList } from '@/utils/contracts';
import { setCharAt } from '@/utils/convertString';
import { invertBytes } from '@/utils/formatFunctions';
import { useTranslation } from 'next-i18next';
import React, { useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { HiTrash } from 'react-icons/hi';
import { IContractProps } from '.';
import FormInput from '../FormInput';
import {
  Container,
  InfoIcon,
  InputLabel,
  TooltipContainer,
  TooltipContent,
} from '../FormInput/styles';
import {
  ButtonContainer,
  Checkbox,
  CheckboxContract,
  ContractsList,
  FormBody,
  FormSection,
  SectionTitle,
} from '../styles';

type FormData = {
  permissions: {
    type: number;
    permissionName: string;
    threshold: number;
    operations: string;
    binaryOperations?: string;
    signers: {
      address: string;
      weight: number;
    }[];
  }[];
};

const binaryDefault = '0000000000000000000000000';
const maxBinaryDefault = '1111111111111111111111111';

const parseBinaryToHex = (dataRef: FormData): FormData => {
  const data: FormData = JSON.parse(JSON.stringify(dataRef));

  data.permissions.forEach((permission, index) => {
    if (permission.type === 0) {
      permission.operations = '';
      return;
    }
    const binaryOperations =
      data.permissions[index].binaryOperations || binaryDefault;
    const hex = Number(`0b${binaryOperations}`).toString(16);
    let paddedHex = hex;
    if (paddedHex.length % 2 !== 0) {
      paddedHex = '0' + paddedHex;
    }
    const byteInvertedHex = invertBytes(paddedHex);
    data.permissions[index].operations = byteInvertedHex;
    delete permission.binaryOperations;
  });

  return data;
};

const parseUpdateAccountPermission = (data: FormData): FormData => {
  return parseBinaryToHex(data);
};

const UpdateAccountPermission: React.FC<IContractProps> = ({
  formKey,
  handleFormSubmit,
}) => {
  const { handleSubmit } = useFormContext<FormData>();
  const {} = useContract();

  const onSubmit = async (dataRef: FormData) => {
    const data = JSON.parse(JSON.stringify(dataRef));

    const parsedData = parseUpdateAccountPermission(data);
    await handleFormSubmit(parsedData);
  };

  return (
    <FormBody onSubmit={handleSubmit(onSubmit)} key={formKey}>
      <FormSection>
        <PermissionsSection />
      </FormSection>
    </FormBody>
  );
};

const PermissionsSection: React.FC = () => {
  const { t } = useTranslation('transactions');
  const { control, watch, setValue } = useFormContext();
  const [binaryOperations, setBinaryOperations] =
    useState<string>(binaryDefault);

  const {
    fields,
    append: appendPermission,
    remove: removePermission,
  } = useFieldArray({
    control,
    name: 'permissions',
  });

  return (
    <FormSection inner>
      <SectionTitle>{t('UpdateAccountPermission.Permissions')}</SectionTitle>

      {fields.map((field, permissionIndex) => {
        const binaryOperations = watch(
          `permissions[${permissionIndex}].binaryOperations`,
        );

        const type = watch(`permissions[${permissionIndex}].type`);

        return (
          <FormSection inner key={field.id}>
            <SectionTitle>
              <HiTrash onClick={() => removePermission(permissionIndex)} />
              {t('UpdateAccountPermission.Permission')} {permissionIndex + 1}
            </SectionTitle>
            <FormInput
              title={t('UpdateAccountPermission.Permission Name')}
              name={`permissions[${permissionIndex}].permissionName`}
              span={2}
              tooltip="An identifier name for the permission."
              required
            />
            <FormInput
              title={t('Threshold')}
              name={`permissions[${permissionIndex}].threshold`}
              type="number"
              span={2}
              tooltip="The minimum weight required to execute the operations."
              required
            />
            <FormInput
              title={t('Type')}
              name={`permissions[${permissionIndex}].type`}
              span={2}
              type="dropdown"
              options={[
                { value: 0, label: 'Owner (0)' },
                { value: 1, label: 'User (1)' },
              ]}
              required
            />
            {type === 1 && (
              <Container span={2}>
                <InputLabel>
                  {t('UpdateAccountPermission.Operations')}
                  <TooltipContainer>
                    <InfoIcon size={13} />
                    <TooltipContent>
                      <span>
                        {t('UpdateAccountPermission.Tooltip Permission')}
                      </span>
                    </TooltipContent>
                  </TooltipContainer>
                </InputLabel>
                <ContractsList>
                  <CheckboxContract single>
                    <Checkbox
                      type="checkbox"
                      checked={binaryOperations === maxBinaryDefault}
                      onChange={() => {
                        if (binaryOperations === maxBinaryDefault) {
                          setValue(
                            `permissions[${permissionIndex}].binaryOperations`,
                            binaryDefault,
                          );
                        } else
                          setValue(
                            `permissions[${permissionIndex}].binaryOperations`,
                            maxBinaryDefault,
                          );
                      }}
                    />

                    <span>{t('UpdateAccountPermission.All')}</span>
                  </CheckboxContract>
                  {contractsList.map((item: any, contractIndex: number) => {
                    return (
                      <CheckboxContract key={contractIndex}>
                        <Checkbox
                          type="checkbox"
                          checked={
                            binaryOperations?.charAt(
                              binaryOperations.length - (contractIndex + 1),
                            ) === '1'
                          }
                          onChange={e => {
                            let binaryOperationsAux;

                            if (
                              !binaryOperations ||
                              binaryOperations.length !== binaryDefault.length
                            ) {
                              binaryOperationsAux = binaryDefault;
                            } else {
                              binaryOperationsAux = binaryOperations;
                            }

                            const newBinaryOperations = setCharAt(
                              binaryOperationsAux,
                              binaryOperationsAux.length - (contractIndex + 1),
                              e.target.checked ? '1' : '0',
                            );

                            setValue(
                              `permissions[${permissionIndex}].binaryOperations`,
                              newBinaryOperations,
                            );
                          }}
                        />
                        <span>{item}</span>
                      </CheckboxContract>
                    );
                  })}
                </ContractsList>
              </Container>
            )}
            <SignersSection permissionIndex={permissionIndex} />
          </FormSection>
        );
      })}
      <ButtonContainer
        type="button"
        onClick={() => {
          appendPermission({});
        }}
      >
        {t('UpdateAccountPermission.Add Permission')}
      </ButtonContainer>
    </FormSection>
  );
};

interface SignersSectionProps {
  permissionIndex: number;
}

const SignersSection: React.FC<SignersSectionProps> = ({ permissionIndex }) => {
  const { t } = useTranslation('transactions');
  const { control } = useFormContext();
  const {
    fields,
    append: appendSigner,
    remove: removeSigner,
  } = useFieldArray({
    control,
    name: `permissions[${permissionIndex}].signers`,
  });

  return (
    <FormSection inner>
      <SectionTitle>
        <span>{t('UpdateAccountPermission.Tooltip Permission')}</span>
      </SectionTitle>
      {fields.map((field, index) => (
        <FormSection inner key={field.id}>
          <SectionTitle>
            <HiTrash onClick={() => removeSigner(index)} />
            {t('UpdateAccountPermission.Signer')} {index + 1}
          </SectionTitle>
          <FormInput
            title={t('Address')}
            name={`permissions[${permissionIndex}].signers[${index}].address`}
            required
          />
          <FormInput
            title={t('UpdateAccountPermission.Signature Weight')}
            name={`permissions[${permissionIndex}].signers[${index}].weight`}
            type="number"
            tooltip="How much this signer contributes towards the threshold."
            required
          />
          <ButtonContainer type="button" onClick={() => removeSigner(index)}>
            {t('UpdateAccountPermission.Remove Signer')}
          </ButtonContainer>
        </FormSection>
      ))}
      <ButtonContainer type="button" onClick={() => appendSigner({})}>
        {t('UpdateAccountPermission.Add Signer')}
      </ButtonContainer>
    </FormSection>
  );
};

export default UpdateAccountPermission;
