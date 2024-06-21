import { InputFile } from '@/components/MultsignComponent/styles';
import { StyledTextArea } from '@/components/TransactionForms/FormInput/styles';
import styled, { css } from 'styled-components';

export const FormEncodingContainer = styled.form`
  display: flex;
  width: 100%;
  padding: 1.5rem;
  span {
    color: ${({ theme }) => theme.black};
  }
`;

export const ContainerItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  width: 50%;
  div {
    height: 100%;
  }
`;

export const ContainerButtons = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 2rem 1rem 0;
  gap: 1rem;
  min-height: 200px;
`;

export const ContentButton = styled.div<{ selected?: boolean }>`
  display: flex;
  border: 1px solid ${({ theme }) => theme.black};
  border-radius: 0.3rem;
  align-items: center;
  justify-content: center;
  width: 6.5rem;

  height: 2rem;
  gap: 0.4rem;
  cursor: pointer;
  svg {
    color: ${({ theme }) => theme.black};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 8rem;
    height: 2.5rem;
  }

  ${({ selected }) =>
    selected &&
    css`
      background-color: ${({ theme }) => theme.black};
      input,
      svg {
        color: ${({ theme }) =>
          theme.dark ? theme.true.black : theme.true.white};
      }
    `}

  :active {
    box-shadow: 0 0 10px 5px ${({ theme }) => theme.border};
  }
`;
export const Button = styled.input`
  color: ${({ theme }) => theme.black};
  cursor: pointer;
  font-size: 0.8rem;
  line-height: 12px;
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 0.9rem;
  }
`;

export const EncodingTextArea = styled(StyledTextArea)`
  min-height: 8rem;
  resize: none;
  color: ${props => props.theme.darkText};
  &::placeholder {
    color: ${props => props.theme.darkText};
  }
  min-width: 6rem;
  font-size: 0.85rem;
  &:focus {
    box-shadow: unset;
    border: 1px solid ${({ theme }) => theme.violet};
    outline: 0;
  }
  height: 15rem;
`;

export const Input = styled(InputFile)`
  max-width: 100%;
  height: 100%;
`;
