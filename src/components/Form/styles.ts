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
  > span {
    font-size: 1.2rem;
    font-weight: 600;
    min-width: fit-content;
  }

  width: calc(100% - 2rem);
  display: flex;
  color: ${props => props.theme.darkText};
  position: absolute;
  top: 1rem;
  left: 1rem;
  user-select: none;
  gap: 0.5rem;
  align-items: center;
`;

export const TooltipSpace = styled.div`
  margin-left: 0.4rem;
  position: absolute;
  left: 2rem;
  bottom: 3rem;
`;

export const SectionText = styled.p`
  font-size: 1.1rem;
  font-weight: 400;
  color: ${props => props.theme.darkText};
`;

export const InputWrapper = styled.div``;

export const FormGap = styled.div<ISpaceForm>``;

export const SubmitContainer = styled.div`
  margin-top: 1.7rem;
  display: flex;
  flex-direction: column-reverse;
  gap: 2rem;

  @media screen and (min-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: row;
  }
`;

export const FeeContainer = styled.div<{ isMulticontract?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  color: ${props => props.theme.darkText};

  ${props =>
    props.isMulticontract &&
    css`
      flex-direction: column;
    `}
`;

export const FeeDetailsContainer = styled.small<{ open: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  width: 100%;
  padding: 0.5rem;
  border-radius: 0.5rem;

  opacity: 1;
  visibility: visible;
  transition: opacity 0.2s ease-in-out;

  background-color: ${props => props.theme.lightBlue};
  color: ${props => props.theme.black};

  ${props =>
    !props.open &&
    css`
      display: none;
      visibility: hidden;
      opacity: 0.5;
    `}
`;

export const DetailsArrowContainer = styled.span<{ isOpen: boolean }>`
  cursor: pointer;
  margin-left: 0.5rem;

  svg {
    transition: transform 0.2s ease-in-out;
  }

  ${props =>
    props.isOpen &&
    css`
      svg {
        transform: rotate(180deg);
      }
    `}
`;

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
  cursor: pointer;

  border: 0.2px solid ${({ theme }) => theme.input.border};
  box-shadow: 0 0 0.5rem -0.125rem ${props => (props.theme.dark ? '#000' : lighten(0.6, '#000'))};

  user-select: none;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    width: 40%;
  }

  &[type='submit'] {
    background-color: ${props => props.theme.purple};
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
