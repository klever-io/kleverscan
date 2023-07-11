import { Form } from '@unform/web';
import { lighten } from 'polished';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import styled, { css } from 'styled-components';

interface IButton {
  submit?: boolean;
}

interface ISpaceForm {
  section?: string;
}

export const FormBody = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const FormSection = styled.div<{ inner?: boolean }>`
  padding: 1.5rem;
  padding-top: 3rem;
  position: relative;

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(40%, 1fr));
  grid-auto-columns: auto;
  column-gap: 1rem;
  row-gap: 3rem;

  border-radius: 1rem;

  &:not(:first-child) {
    padding-top: 5rem;
  }

  border: 0.2px solid ${({ theme }) => theme.input.border};
  box-shadow: 0 0 0.5rem -0.125rem ${props => (props.theme.dark ? '#000' : lighten(0.8, '#000'))};

  background-color: ${props => props.theme.white};
  ${props =>
    props.inner &&
    css`
      filter: ${props.theme.dark ? 'brightness(1.1)' : 'brightness(97%)'};
      grid-column: auto / span 2;
    `}

  @media screen and (max-width: ${props => props.theme.breakpoints.mobile}) {
    display: flex;
    flex-direction: column;
    gap: 2rem;

    padding: 0.75rem;
    padding-top: 3.3rem;

    ${props =>
      props.inner &&
      css`
        margin-top: -1rem;
      `}
  }
`;

export const SectionTitle = styled.div`
  width: calc(100% - 2rem);
  display: flex;
  color: ${props => props.theme.darkText};
  position: absolute;
  top: 1rem;
  left: 1rem;
  user-select: none;
  gap: 0.5rem;
  align-items: center;

  > span {
    font-size: 1.2rem;
    font-weight: 600;
    min-width: fit-content;
  }

  > svg {
    font-size: 1.5rem;
    color: ${props => props.theme.error};

    transition: color 0.2s;

    &:hover {
      cursor: pointer;
      color: red;
    }
  }
`;

export const TooltipSpace = styled.div`
  margin-left: 0.4rem;
  position: absolute;
  left: 2rem;
  bottom: 3rem;
`;

export const InputWrapper = styled.div``;

export const FormGap = styled.div<ISpaceForm>``;

export const ButtonContainer = styled.button<IButton>`
  background-color: ${props => props.theme.violet};
  padding-top: 15px;
  padding-bottom: 15px;
  padding-left: 10px;
  padding-right: 10px;
  width: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  border-radius: 10px;
  margin-top: 1.7rem;
  cursor: pointer;

  transition: background-color 0.5s, opacity 0.4s 0.1s;

  border: 0.2px solid ${({ theme }) => theme.input.border};
  box-shadow: 0 0 0.5rem -0.125rem ${props => (props.theme.dark ? '#000' : lighten(0.6, '#000'))};

  user-select: none;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    width: 40%;
  }

  &[type='submit'] {
    background-color: ${props => props.theme.purple};
  }
  &:disabled {
    background-color: ${props => props.theme.lightGray};
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const HiddenSubmitButton = styled.button`
  display: none;
`;

export const AdvancedOptsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  margin-top: 1rem;
  span {
    color: ${({ theme }) => theme.darkText};
    margin-right: 0.5rem;
    user-select: none;
  }
`;

export const ArrowUpIcon = styled(IoIosArrowUp)`
  color: ${({ theme }) => theme.darkText};
`;

export const ArrowDownIcon = styled(IoIosArrowDown)`
  color: ${({ theme }) => theme.darkText};
`;

export const ContractsList = styled.div`
  width: 100%;

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr));

  grid-auto-columns: auto;
  row-gap: 1rem;
  column-gap: 1rem;

  margin-bottom: 1rem;
  margin-top: 1rem;
`;

export const CheckboxContract = styled.div<{ single?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10+ */
  user-select: none;

  ${({ single }) =>
    single &&
    css`
      grid-column: 1 / -1;
      margin-bottom: 1rem;
    `}

  span {
    color: ${({ theme }) => theme.darkText};
    font-weight: 600;
  }
`;

export const Checkbox = styled.input`
  height: 1rem;
  width: 1rem;
  background: none;
  -webkit-appearance: none;
  border-radius: 0.2rem;

  ::before {
    content: '';
    color: transparent;
    display: block;
    width: inherit;
    height: inherit;
    border-radius: inherit;
    border: 0;
    background-color: transparent;
    background-size: contain;
    box-shadow: inset 0 0 0 1px ${({ theme }) => theme.darkText};
  }

  :checked {
    background-color: ${({ theme }) => theme.violet};
    ::before {
      box-shadow: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E %3Cpath d='M15.88 8.29L10 14.17l-1.88-1.88a.996.996 0 1 0-1.41 1.41l2.59 2.59c.39.39 1.02.39 1.41 0L17.3 9.7a.996.996 0 0 0 0-1.41c-.39-.39-1.03-.39-1.42 0z' fill='%23fff'/%3E %3C/svg%3E");
    }
  }
`;
