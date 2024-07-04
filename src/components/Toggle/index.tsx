import { PropsWithChildren } from 'react';
import {
  Slider,
  StyledInput,
  Toggle,
  ToggleContainer,
} from '../TransactionForms/FormInput/styles';

interface ToggleProps {
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
  active: boolean;
  options: string[];
}

const ToggleInput: React.FC<PropsWithChildren<ToggleProps>> = ({
  inputProps,
  active,
  options,
}) => {
  return (
    <ToggleContainer>
      {options[0]}
      <Toggle>
        <StyledInput type="checkbox" {...inputProps} />
        <Slider active={String(active)} />
      </Toggle>
      {options[1]}
    </ToggleContainer>
  );
};

export default ToggleInput;
