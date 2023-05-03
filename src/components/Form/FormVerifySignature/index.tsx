import { base64ToHex, isHex } from '@/utils/formatFunctions';
import { utils } from '@klever/sdk';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  Button,
  ContainerItem,
  FormContent,
  InputContainer,
  TextArea,
  VerifySignatureContainer,
} from './styles';

interface IFormInputs {
  message: string;
  signature: string;
  address: string;
}

const FormVerifySignature: React.FC = () => {
  const [isDirty, setIsDirty] = useState(false);
  const [formValues, setFormValues] = useState<IFormInputs>({
    message: '',
    signature: '',
    address: '',
  });

  useEffect(() => {
    const { message, signature, address } = formValues;
    if (!message && !signature && !address) {
      setIsDirty(false);
    }
  }, [formValues]);

  const handleChangeValues = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const fieldName = event.target.name;
    const fieldValue = event.target.value;
    setFormValues(current => {
      return {
        ...current,
        [fieldName]: fieldValue,
      };
    });
    setIsDirty(true);
  };

  const resetForm = () => {
    setFormValues({
      message: '',
      signature: '',
      address: '',
    });
    setIsDirty(false);
  };

  const isFormFilled = (formValues: IFormInputs): boolean => {
    return Object.values(formValues).every(value => value !== '');
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const validateSignature = base64ToHex(formValues.signature);
      const validateResponse = await utils.validateSignature(
        formValues.message,
        validateSignature,
        formValues.address,
      );
      if (!isHex(validateSignature)) {
        toast.error('Failed to validate signature!', {
          autoClose: 2300,
          pauseOnHover: false,
          closeOnClick: true,
          closeButton: false,
        });
      } else if (validateResponse) {
        toast.success('This signature is valid!', {
          autoClose: 2300,
          pauseOnHover: false,
          closeOnClick: true,
          closeButton: false,
        });
      } else {
        toast.error('Invalid signature!', {
          autoClose: 2300,
          pauseOnHover: false,
          closeOnClick: true,
          closeButton: false,
        });
      }
    } catch (error) {
      toast.error('Failed to validate signature!', {
        autoClose: 2300,
        pauseOnHover: false,
        closeOnClick: true,
        closeButton: false,
      });
    }
  };

  return (
    <VerifySignatureContainer>
      <FormContent onSubmit={onSubmit}>
        <ContainerItem>
          <span>Address</span>
          <InputContainer>
            <input
              name="address"
              value={formValues.address}
              placeholder="Enter the address for verification"
              autoComplete="off"
              onChange={handleChangeValues}
            />
          </InputContainer>
        </ContainerItem>
        <ContainerItem>
          <span>Message</span>
          <TextArea
            placeholder="Enter the message for verification"
            name="message"
            value={formValues.message}
            onChange={handleChangeValues}
          />
        </ContainerItem>
        <ContainerItem>
          <span>Signature</span>
          <TextArea
            placeholder="Enter the signature for verification"
            name="signature"
            value={formValues.signature}
            onChange={handleChangeValues}
          />
        </ContainerItem>
        <ContainerItem>
          <Button
            colorButton="error"
            type="button"
            value="Clear Form"
            onClick={() => resetForm()}
            isDisabled={!isDirty}
            disabled={!isDirty}
          />
        </ContainerItem>
        <ContainerItem>
          <Button
            colorButton="violet"
            type="submit"
            value="Verify Signature"
            isDisabled={!isFormFilled(formValues)}
            disabled={!isFormFilled(formValues)}
          />
        </ContainerItem>
      </FormContent>
    </VerifySignatureContainer>
  );
};

export default FormVerifySignature;
