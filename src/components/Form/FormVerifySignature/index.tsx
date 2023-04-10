import { utils } from '@klever/sdk';
import { SubmitHandler, useForm } from 'react-hook-form';
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
  const {
    register,
    formState: { isValid, isDirty },
    reset,
    handleSubmit,
  } = useForm<IFormInputs>();

  const onSubmit: SubmitHandler<IFormInputs> = async ({
    message,
    signature,
    address,
  }) => {
    try {
      await utils.validateSignature(message, signature, address);
      toast.success('Success to validate signature!', {
        autoClose: 2300,
        pauseOnHover: false,
        closeOnClick: true,
        closeButton: false,
      });
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
      <FormContent onSubmit={handleSubmit(onSubmit)}>
        <ContainerItem>
          <span>Address</span>
          <InputContainer>
            <input
              placeholder="Enter the address for verification"
              {...register('address', { required: true })}
              autoComplete="off"
            />
          </InputContainer>
        </ContainerItem>
        <ContainerItem>
          <span>Message</span>
          <TextArea
            placeholder="Enter the message for verification"
            {...register('message', { required: true })}
          />
        </ContainerItem>
        <ContainerItem>
          <span>Signature</span>
          <TextArea
            placeholder="Enter the signature for verification"
            {...register('signature', { required: true })}
          />
        </ContainerItem>
        <ContainerItem>
          <Button
            type="submit"
            value="Verify Signature"
            isDisabled={!isValid || !isDirty}
            disabled={!isValid || !isDirty}
          />
        </ContainerItem>
        <ContainerItem>
          <Button
            type="button"
            value="Clear Form"
            onClick={() => reset()}
            isDisabled={!isDirty}
            disabled={!isDirty}
          />
        </ContainerItem>
      </FormContent>
    </VerifySignatureContainer>
  );
};

export default FormVerifySignature;
