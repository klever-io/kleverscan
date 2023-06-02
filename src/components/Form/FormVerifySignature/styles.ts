import { Container } from '@/components/Input/styles';
import { StyledTextArea } from '@/components/TransactionForms/FormInput/styles';
import styled, { keyframes } from 'styled-components';

export const CardHeader = styled.div`
  display: flex;

  flex-direction: row;
`;

export const CardHeaderItem = styled.div<{ selected: boolean }>`
  padding: 1rem;

  background-color: ${props =>
    props.selected ? props.theme.white : 'transparent'};

  border-radius: 0.75rem 0.75rem 0 0;

  cursor: pointer;

  transition: 0.2s ease;

  span {
    font-weight: 600;
    font-size: 0.95rem;
    color: ${props => props.theme.black};

    opacity: ${props => (props.selected ? 1 : 0.33)};

    transition: 0.2s ease;
  }
`;

export const CardContent = styled.div`
  background-color: ${props => props.theme.white};

  border-radius: 0 0.75rem 0.75rem 0.75rem;
`;

export const FormContent = styled.form`
  display: flex;
  width: 100%;
  flex-direction: column;
  padding: 1rem;
  gap: 1rem;
  color: ${props => props.theme.black};
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 40%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    div:first-child {
      grid-column-start: 1;
      grid-column-end: 3;
    }
    > div:nth-child(2) {
      grid-column-start: 1;
      grid-column-end: 3;
    }
    > div:nth-child(3) {
      grid-column-start: 1;
      grid-column-end: 3;
    }
    > div:nth-child(4) {
      grid-column-start: 1;
      grid-column-end: 2;
    }

    > div:nth-child(5) {
      grid-column-start: 2;
      grid-column-end: 3;
    }
  }
`;

export const TextArea = styled(StyledTextArea)`
  min-height: 8rem;
  resize: none;
  width: 10px;
  color: ${props => props.theme.darkText};
  &::placeholder {
    color: ${props => props.theme.darkText};
  }
  font-size: 0.85rem;
  :focus {
    box-shadow: unset;
    border: 1px solid ${({ theme }) => theme.violet};
    outline: 0;
  }
`;

export const InputContainer = styled(Container)`
  border: 1px solid ${({ theme }) => theme.darkText};
  :focus-within {
    box-shadow: unset;
    border: 1px solid ${({ theme }) => theme.violet};
    outline: 0;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 100%;
  }
`;

const activateAnimation = keyframes`
  0% {
  transform: translateY(0);
  }

  30% {
    transform: translateY(2px);    
  }
  50% {
    transform: translateY(4px);      
  }
  100% {
    transform: translateY(0);
  } 
`;

export const Button = styled.input<{
  isDisabled: boolean;
  colorButton: string;
}>`
  background-color: ${({ theme, colorButton }) => theme[colorButton]};
  width: 100%;
  height: 3rem;
  border-radius: 0.6rem;
  color: ${({ theme }) => theme.true.white};
  opacity: ${props => (props.isDisabled ? 0.4 : 1)};
  cursor: ${props => (props.isDisabled ? 'normal' : 'pointer')};
  &:active {
    animation: ${props => !props.isDisabled && activateAnimation} 0.4s ease;
  }

  &:hover {
    filter: ${props => !props.isDisabled && 'brightness(1.1)'};
  }
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 100%;
  }
`;

export const VerifySignatureContainer = styled.div`
  display: flex;
  width: 100%;
`;

export const ContainerItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  width: 100%;
`;
