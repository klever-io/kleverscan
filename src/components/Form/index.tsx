import { IFormsData, useContract } from '@/contexts/contract';
import { ICollectionList } from '@/types';
import { parseData } from '@/utils/index';
import { FormHandles, Scope, SubmitHandler } from '@unform/core';
import React, { useCallback, useRef, useState } from 'react';
import AdvancedOptions from './AdvancedOptions';
import FormInput from './FormInput';
import { InfoIcon, TooltipContainer, TooltipContent } from './FormInput/styles';
import {
  AdvancedOptsContainer,
  ArrowDownIcon,
  ArrowUpIcon,
  ButtonContainer,
  FormBody,
  FormGap,
  FormSection,
  HiddenSubmitButton,
  SectionTitle,
} from './styles';

interface IInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  span?: number;
  type?: string;

  array?: boolean;
  length?: number;
  options?: {
    label: string;
    value: any;
  }[];
  toggleOptions?: [string, string];
  bool?: boolean;
  required?: boolean;
  innerSection?: ISection;
  selectPlaceholder?: string;
  tooltip?: string;
  maxDecimals?: number;
}

export interface IFormField {
  label: string;
  objectName?: string; // when the label is not the same as the object field name
  props?: IInputProps;
}

export interface ISection {
  title?: string;
  objectName?: string; // when the title is not the same as the object field name
  inner?: boolean;
  innerPath?: string;
  tooltip?: string;
  fields: IFormField[];
}

export interface IFormProps {
  sections: ISection[];
  onSubmit: (values: any) => void;
  buttonLabel?: string;
  cancelOnly?: boolean;
  children?: React.ReactNode;
  loading: boolean;
  setMetadata: (value: string) => void;
  showForm: boolean;
  typeAssetTrigger: number | null;
  collection: ICollectionList | undefined;
  assetID: number;
  itoTriggerType: number | null;
  isNFT: boolean | undefined;
  metadata: string;
}

const Form: React.FC<IFormProps> = ({
  sections: defaultSections,
  buttonLabel,
  onSubmit,
  children,
  cancelOnly,
  loading,
  setMetadata,
  showForm,
  typeAssetTrigger,
  collection,
  assetID,
  itoTriggerType,
  isNFT,
  metadata,
}) => {
  const formRef = useRef<FormHandles>(null);
  const [sections, setSections] = useState(defaultSections);
  const [showAdvancedOpts, setShowAdvancedOpts] = useState(false);
  const { setFormsData, isMultiContract, contractType } = useContract();

  const addArrayItem = useCallback(
    (field: IFormField, sectionIndex: number, fieldIndex: number) => {
      if (
        (sectionIndex && fieldIndex) ||
        (!isNaN(sectionIndex) && !isNaN(fieldIndex))
      ) {
        let length = sections[sectionIndex]?.fields[fieldIndex]?.props?.length;

        if (length) {
          length += 1;
        } else {
          length = 1;
        }

        if (length) {
          const newSections = [...sections];

          newSections[sectionIndex].fields[fieldIndex].props = {
            ...newSections[sectionIndex].fields[fieldIndex].props,
            length,
          };

          setSections(newSections);
        }
      }
    },
    [sections],
  );

  const removeArrayItem = useCallback(
    (field: IFormField, sectionIndex: number, fieldIndex: number) => {
      let length = sections[sectionIndex].fields[fieldIndex].props?.length;

      if (length && length > 0) {
        length -= 1;
      }

      const newSections = [...sections];

      newSections[sectionIndex].fields[fieldIndex].props = {
        ...newSections[sectionIndex].fields[fieldIndex].props,
        length,
      };

      setSections(newSections);
    },
    [sections],
  );

  const addFieldButton = useCallback(
    (field: IFormField, sectionIndex: number, fieldIndex: number) => {
      return (
        field.props?.array && (
          <ButtonContainer
            onClick={() => addArrayItem(field, sectionIndex, fieldIndex)}
            type="button"
          >
            Add
          </ButtonContainer>
        )
      );
    },
    [addArrayItem],
  );

  const removeFieldButton = useCallback(
    (field: IFormField, sectionIndex: number, fieldIndex: number) => {
      const length = sections[sectionIndex]?.fields[fieldIndex]?.props?.length;

      return field.props?.array && length && length > 0 ? (
        <ButtonContainer
          onClick={() => removeArrayItem(field, sectionIndex, fieldIndex)}
          type="button"
        >
          Remove
        </ButtonContainer>
      ) : null;
    },
    [removeArrayItem],
  );

  const getScopePath = useCallback((field: IFormField, index?: number) => {
    if (field.props?.innerSection) {
      const path =
        field.props.innerSection.innerPath &&
        field.props?.innerSection.innerPath;
      return path;
    }
  }, []);

  const getSectionArrayInputs = useCallback(
    (field: IFormField, sectionIndex?: number) => {
      const fields = [];

      if (field.props?.length) {
        for (let i = 0; i < field.props.length; i++) {
          fields.push(
            <Scope path={`${getScopePath(field)}[${i}]`} key={String(i)}>
              {getSectionInputs(field.props.innerSection, sectionIndex)}
            </Scope>,
          );
        }
      }

      return fields;
    },
    [],
  );

  const getArrayInputs = (field: IFormField, section: ISection) => {
    const fields = [];
    const len = field.props?.length ? field.props.length : 1;
    for (let i = 0; i < len; i++) {
      fields.push(
        <Scope
          path={`${section.objectName || section.title}[${i}]`}
          key={String(i)}
        >
          <FormInput
            title={field.label}
            name={field.objectName || field.label.replace(/\s/g, '')}
            {...field.props}
          />
        </Scope>,
      );
    }

    return fields;
  };

  const unCapitalize = useCallback((string: string) => {
    if (string === 'BLSPublicKey') {
      return 'blsPublicKey';
    }

    if (string === string.toUpperCase()) {
      return string.toLowerCase();
    }

    return string.charAt(0).toLowerCase() + string.slice(1);
  }, []);

  const getInputField = (field: IFormField, section: ISection) => {
    if (field.props?.array && field.props?.length) {
      return getArrayInputs(field, section);
    } else {
      if (section.title && !section.inner) {
        return (
          <Scope
            path={
              section.objectName ||
              unCapitalize(section.title.replace(/\s/g, ''))
            }
          >
            <FormInput
              title={field.label}
              name={
                field.objectName ||
                `${unCapitalize(field.label.replace(/\s/g, ''))}`
              }
              {...field.props}
            />
          </Scope>
        );
      } else {
        return (
          <FormInput
            title={field.label}
            name={`${unCapitalize(field.label.replace(/\s/g, ''))}`}
            {...field.props}
          />
        );
      }
    }
  };

  const getSectionInputs: any = (section: ISection, sectionIndex: number) => {
    return section.fields.map((field, index) => {
      if (field.props?.innerSection && !field.props?.array) {
        return (
          <FormSection inner key={String(index)}>
            <SectionTitle>{field.label}</SectionTitle>
            <Scope path={String(getScopePath(field, index))}>
              {getSectionInputs(field.props?.innerSection)}
            </Scope>
          </FormSection>
        );
      } else if (field.props?.innerSection && field.props.array) {
        return (
          <FormSection inner key={String(index)}>
            <SectionTitle>
              {field.label}
              {field.props?.tooltip && (
                <TooltipContainer>
                  <InfoIcon size={13} />
                  <TooltipContent>
                    <span>{field.props.tooltip}</span>
                  </TooltipContent>
                </TooltipContainer>
              )}
            </SectionTitle>
            {getSectionArrayInputs(field, sectionIndex)}
            {addFieldButton(field, sectionIndex, index)}
            {removeFieldButton(field, sectionIndex, index)}
          </FormSection>
        );
      } else {
        return (
          <React.Fragment key={String(index)}>
            {getInputField(field, section)}
          </React.Fragment>
        );
      }
    });
  };

  const handleSubmit: SubmitHandler<FormData> = (data: any) => {
    parseData(data);
    if (isMultiContract) {
      setFormsData((prevFormsData: IFormsData[]) => [
        ...prevFormsData,
        {
          data,
          contractType,
          typeAssetTrigger,
          collection,
          assetID,
          itoTriggerType,
          isNFT,
          metadata,
        },
      ]);
      return;
    }
    onSubmit(data);
  };

  const formProps = {
    onSubmit: handleSubmit,
    ref: formRef,
  };

  const isEmptyContract = (contract: string) => {
    const contracts = [
      'UnjailContract',
      'WithdrawContract',
      'UnfreezeContract',
      'UndelegateContract',
      'UpdateAccountPermissionContract',
      'SetITOPricesContract',
      'SetITOPricesContract',
      'AssetTriggerContract',
      'ITOTriggerContract',
    ];

    return contracts.includes(contract);
  };

  const advancedOptionsProps = {
    setMetadata,
  };

  return (
    <FormBody {...formProps}>
      {showForm &&
        sections.map((section: any, index: number) => {
          return (
            <React.Fragment key={String(index)}>
              {sections.length === 1 && section.title && <FormGap />}
              <FormSection key={String(index)}>
                <SectionTitle>
                  <p>{section.title}</p>
                  {section.tooltip && (
                    <TooltipContainer>
                      <InfoIcon size={13} />
                      <TooltipContent>
                        <span>{section.tooltip}</span>
                      </TooltipContent>
                    </TooltipContainer>
                  )}
                </SectionTitle>
                {getSectionInputs(section, index)}
              </FormSection>
            </React.Fragment>
          );
        })}

      {showForm && children}

      {sections.length > 0 || isEmptyContract(contractType) ? (
        <>
          <AdvancedOptsContainer
            onClick={() => setShowAdvancedOpts(!showAdvancedOpts)}
          >
            <span>Advanced Options</span>
            {showAdvancedOpts ? <ArrowUpIcon /> : <ArrowDownIcon />}
          </AdvancedOptsContainer>

          {showAdvancedOpts ? (
            <AdvancedOptions {...advancedOptionsProps} />
          ) : null}

          {!isMultiContract ? (
            <ButtonContainer submit={!loading} type="submit" disabled={loading}>
              Create Transaction
            </ButtonContainer>
          ) : (
            <HiddenSubmitButton type="submit" disabled={loading} />
          )}
        </>
      ) : null}
    </FormBody>
  );
};

export default Form;
