import React, { KeyboardEvent, useEffect, useRef } from 'react';
import { Container } from './styles';

interface Input extends React.InputHTMLAttributes<any> {
  type: string;
  value: string | number;
  onBlur: () => void;
  onChange: (e: any) => void;
  handleConfirmClick: () => void;
}

const Input: React.FC<Input> = ({ onChange, handleConfirmClick, ...rest }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef?.current?.focus();
  }, []);

  const keyDownHandle = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleConfirmClick();
    }
  };

  const inputProps = {
    onKeyDown: keyDownHandle,
    ...rest,
    ref: inputRef,
    onChange,
  };

  return (
    <Container>
      <input {...inputProps} />
    </Container>
  );
};

export default Input;
