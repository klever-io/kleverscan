import { parseData } from '@/utils/index';
import { FormHandles, Scope, SubmitHandler } from '@unform/core';
import React, { useCallback, useRef, useState } from 'react';
import AdvancedOptions from './AdvancedOptions';
import FormInput from './FormInput';
import {
  AdvancedOptsContainer,
  ArrowDownIcon,
  ArrowUpIcon,
  ButtonContainer,
  FormBody,
  FormGap,
  FormSection,
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
}

export interface IFormField {
  label: string;
  props?: IInputProps;
}

export interface ISection {
  title?: string;
  inner?: boolean;
  innerPath?: string;
  fields: IFormField[];
}

interface IFormProps {
  sections: ISection[];
  onSubmit: (values: any) => void;
  buttonLabel?: string;
  cancelOnly?: boolean;
  children?: React.ReactNode;
}

const Form: React.FC<any> = ({
  sections: defaultSections,
  buttonLabel,
  contractName,
  onSubmit,
  children,
  cancelOnly,
  loading,
  setData,
  setIsMultisig,
  isMultisig,
}) => {
  const formRef = useRef<FormHandles>(null);
  const [sections, setSections] = useState(defaultSections);
  const [showAdvancedOpts, setShowAdvancedOpts] = useState(false);

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
        <Scope path={`${section.title}[${i}]`} key={String(i)}>
          <FormInput
            title={field.label}
            name={field.label.replace(/\s/g, '')}
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
          <Scope path={unCapitalize(section.title.replace(/\s/g, ''))}>
            <FormInput
              title={field.label}
              name={`${unCapitalize(field.label.replace(/\s/g, ''))}`}
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
            <SectionTitle>{field.label}</SectionTitle>
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
    ];

    return contracts.includes(contract);
  };

  return (
    <FormBody {...formProps}>
      {sections.map((section: any, index: number) => {
        return (
          <>
            {sections.length === 1 && section.title && <FormGap />}
            <FormSection key={String(index)}>
              <SectionTitle>{section.title}</SectionTitle>
              {getSectionInputs(section, index)}
            </FormSection>
          </>
        );
      })}

      {children}

      {sections.length > 0 || isEmptyContract(contractName) ? (
        <>
          <AdvancedOptsContainer
            onClick={() => setShowAdvancedOpts(!showAdvancedOpts)}
          >
            <span>Advanced Options</span>
            {showAdvancedOpts ? <ArrowUpIcon /> : <ArrowDownIcon />}
          </AdvancedOptsContainer>

          {showAdvancedOpts ? (
            <AdvancedOptions
              setData={setData}
              setIsMultisig={setIsMultisig}
              isMultisig={isMultisig}
            />
          ) : null}
          <ButtonContainer submit={!loading} type="submit" disabled={loading}>
            Create Transaction
          </ButtonContainer>
        </>
      ) : null}
    </FormBody>
  );
};

export default Form;
