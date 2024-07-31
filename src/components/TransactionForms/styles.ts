import { DefaultCardStyleWithBorder, DefaultCardStyles } from '@/styles/common';
import { Form } from '@unform/web';
import { lighten } from 'polished';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import styled, { css } from 'styled-components';
import { ReactSelectStyles } from '../Contract/Select/styles';

interface IButton {
  submit?: boolean;
}

interface ISpaceForm {
  section?: string;
}

export const FormSection = styled.div<{ inner?: boolean; top?: number }>`
  ${DefaultCardStyleWithBorder}
  border-radius: 1rem;

  padding: 1.5rem;
  position: relative;

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(40%, 1fr));
  grid-auto-columns: auto;
  column-gap: 1rem;
  row-gap: 3rem;

  ${props =>
    props.inner &&
    css`
      grid-column: auto / span 2;
      padding-top: 5rem !important;
    `}

  ${props =>
    props.top &&
    css`
      top: ${props.top}rem;
    `}

  @media screen and (max-width: ${props => props.theme.breakpoints.mobile}) {
    display: flex;
    flex-direction: column;
    gap: 2rem;

    padding: 0.75rem;

    ${props =>
      props.inner &&
      css`
        padding-top: 5rem;
        margin-top: -1rem;
      `}
  }
`;

export const FormBody = styled(Form)<{ inner?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  > ${FormSection} {
    padding-top: 1.5rem;
    ${props =>
      props.inner &&
      css`
        padding-top: 5rem;
      `}
  }

  > ${FormSection} + ${FormSection} {
    padding-top: 5rem;
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
  background-color: ${props =>
    props.theme.dark ? props.theme.purple : props.theme.violet};

  padding: 12px 10px;
  width: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  border-radius: 10px;
  margin-top: 1.7rem;
  cursor: pointer;

  transition:
    background-color 0.5s,
    opacity 0.4s 0.1s;

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

export const SelectContainer = styled.div`
  ${ReactSelectStyles}
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

  &::before {
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

  &:checked {
    background-color: ${({ theme }) => theme.violet};
    &::before {
      box-shadow: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E %3Cpath d='M15.88 8.29L10 14.17l-1.88-1.88a.996.996 0 1 0-1.41 1.41l2.59 2.59c.39.39 1.02.39 1.41 0L17.3 9.7a.996.996 0 0 0 0-1.41c-.39-.39-1.03-.39-1.42 0z' fill='%23fff'/%3E %3C/svg%3E");
    }
  }
`;

export const SectionText = styled.p`
  font-size: 1.1rem;
  font-weight: 400;
  color: ${props => props.theme.darkText};
`;

export const RoyaltiesContainer = styled.div`
  color: ${({ theme }) => theme.darkText};
`;

export const SpanMessage = styled.span`
  position: absolute;
  color: ${({ theme }) => theme.darkText};
  font-weight: 400;
  font-size: 0.9rem;
  right: 1rem;
  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    right: 0;
    left: 10.5rem;
    top: 5rem;
  }
`;
export const PackRange = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  align-items: flex-end;
  justify-content: center;

  > span {
    color: ${({ theme }) => theme.darkText};
    font-weight: 600;
    margin-bottom: 13px;
  }
`;
