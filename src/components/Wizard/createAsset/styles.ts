import {
  WizardCheckSquare,
  WizardFailSquare,
  WizardInfoSquare,
  WizardRightArrow,
} from '@/assets/icons';
import { transparentize } from 'polished';
import { BsClock } from 'react-icons/bs';
import styled, { css } from 'styled-components';

export const WizardModal = styled.div<{ openModal?: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  display: ${props => (props.openModal ? 'grid' : 'none')};
  place-content: end;
  width: 100%;
  height: 100%;
  z-index: 8;
  overflow-y: scroll;
  font-family: 'Manrope', sans-serif;
  /* background: rgba(255, 255, 255, 0.3); */
  backdrop-filter: brightness(0.5) blur(2px);

  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    overflow: hidden;
    place-content: center;
  }
`;

export const WizardContainer = styled.div<{ isFirstContent?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  justify-content: flex-end;
  width: 100vw;
  border-radius: 2rem 2rem 0 0;
  box-shadow: 0 -3px rgba(255, 255, 255, 0.2);
  background: ${({ theme }) => theme.wizard.background};
  overflow: hidden;
  > div {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    display: flex;
    justify-content: flex-start;
    border-radius: 1rem;
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2);
    width: 80vw;
    gap: 8rem;
    padding: 4rem 2rem;

    > div {
      width: 100%;
      justify-content: center;
      flex-direction: row;
      padding: 0 2rem;
      gap: 5rem;
      ${props =>
        props.isFirstContent &&
        css`
          justify-content: center;
        `}
    }
  }
`;

export const WizardBody = styled.div<{ isFirstContent?: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 2rem;

  height: 90vh;
  overflow-y: scroll;
  overflow-x: hidden;
  padding-top: 2rem;

  > form {
    display: flex;
    width: 100%;
    height: 100%;
  }

  &::-webkit-scrollbar {
    width: 0.3em;
    z-index: 1;
  }
  &::-webkit-scrollbar-track {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    box-shadow: inset 0 0 0.25rem rgba(0, 0, 0, 0.3);
    background: transparent;
    cursor: pointer !important;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${props => transparentize(0.2, props.theme.violet)};
    border-radius: 10px;
    cursor: pointer !important;
  }

  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    overflow: hidden;
    overflow-y: auto;

    height: 40rem;
    ${props =>
      props.isFirstContent &&
      css`
        max-width: 40rem;
      `}
  }
`;

export const WizardStepContainer = styled.div`
  display: flex;
  flex-direction: row;
  overflow: hidden;
  margin-bottom: 3rem;
  padding: 0.5rem 0;
`;

export const WizardItemContainer = styled.div<{ stepSelected: number }>`
  display: flex;
  height: 3.5rem;
  width: fit-content;
  text-align: center;
  align-items: center;
  justify-content: center;

  &:nth-last-child(-n + ${props => props.stepSelected - 2}) {
    > div {
      background: linear-gradient(
        to right,
        ${props => props.theme.lightGray} 15%,
        rgba(255, 255, 255, 0) 90%
      );

      &::after,
      &::before {
        content: '';
        border: 0;
      }
    }
  }

  &:nth-last-child(-n + ${props => props.stepSelected - 3}) {
    > div {
      opacity: 0;
      &::after,
      &::before {
        content: '';
        border: 0;
      }
    }
  }
`;

export const WizardSlider = styled.div<{ stepSelected: number }>`
  display: flex;
  position: relative;
`;

export const WizardLabel = styled.div<{ isDone?: boolean }>`
  display: flex;

  color: ${props => props.theme.white};
  padding: 0.5rem 2rem 3rem;
  position: relative;
  background: ${props => props.theme.lightGray};

  &::before {
    content: '';
    border-top: 50px solid transparent;
    border-bottom: 50px solid transparent;
    border-left: 30px solid ${props => props.theme.lightBlue};
    position: absolute;
    top: 50%;
    margin-top: -50px;
    left: 100%;
    z-index: 1;
    margin-left: 1px;
  }

  &::after {
    content: '';
    border-top: 50px solid transparent;
    border-bottom: 50px solid transparent;
    border-left: 30px solid ${props => props.theme.lightGray};
    position: absolute;
    top: 50%;
    margin-top: -50px;
    left: 100%;
    z-index: 2;
  }

  ${props =>
    props.isDone &&
    css`
      border-color: ${props => props.theme.violet} !important;
      color: ${props => props.theme.true.white};
      background: ${props => props.theme.violet} !important;
      z-index: 5;

      &::after {
        border-left: 30px solid ${props => props.theme.violet};
      }
    `}

  > span {
    margin-top: 2.5rem;
    &:not(:first-child) {
      margin-left: 1rem;
    }
  }
`;

export const WizardButtonContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-top: 5rem;
`;

export const WizardButton = styled.button.attrs(props => ({
  type: props.type || 'button',
}))<{
  type?: 'button' | 'submit' | 'reset';
  secondary?: boolean;
  centered?: boolean;
  fullWidth?: boolean;
  infoStep?: boolean;
  isDisabled?: boolean;
}>`
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  padding: 0.9rem;
  background: ${props => (props.secondary ? '#404264' : '#aa33b5')};
  justify-content: ${props => props.centered && 'center'};
  border-radius: 0.5rem;
  width: 100%;
  color: white;
  font-weight: 700;

  > span {
    display: flex;
    width: fit-content;
    border: 1px solid white;
    border-radius: 25%;
    padding: 0.2rem;
  }

  > p {
    width: 90%;
    font-size: 0.87rem;
  }

  ${props =>
    props.isDisabled &&
    css`
      background: ${props => props.theme.lightBlue};
      cursor: not-allowed;
    `}
  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    max-width: calc(22rem - 6rem);
    ${props =>
      props?.fullWidth &&
      css`
        max-width: 100%;
      `}
    ${({ infoStep }) =>
      infoStep &&
      css`
        max-width: 100%;
        width: calc(50% - 8px);
      `}
  }
`;

export const WizardRightArrowSVG = styled(WizardRightArrow)`
  position: absolute;
  right: 2rem;
`;

export const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
  padding: 2rem 0;
  color: ${({ theme }) => theme.black};
  font-family: 'Manrope', sans-serif;

  > div:nth-child(1) {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    font-weight: 400;
    > span:nth-child(1) {
      font-size: 2.5rem;
      font-weight: 300;
    }
    > span:nth-child(2) {
      color: ${({ theme }) => theme.wizard.subTitle};
      font-size: 1.25rem;
    }
    > span:nth-child(3) {
      display: flex;
      align-items: center;
      margin-top: 3rem;
      gap: 1rem;
      text-decoration-line: underline;
      > span {
        background-color: red;
        display: flex;
        align-items: center;
        width: fit-content;
        border-radius: 20%;
        padding: 0.2rem;
        svg {
          height: 2em;
          width: 2em;
          font-size: 1.2rem;
        }
      }
    }
  }

  > div:nth-child(2) {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;

    > span a {
      text-decoration-line: underline;
    }

    > span:nth-child(3) {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.3rem;
      font-weight: 500;
      font-size: 1.1rem;
      color: ${({ theme }) => theme.wizard.subTitle};
    }
  }
  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    gap: 8rem;
    justify-content: center;
    align-items: center;
  }
`;

export const GenericCardContainer = styled.div<{
  alignCenter?: boolean;
}>`
  display: flex;
  width: 100%;
  flex-direction: column;
  flex-grow: 1;
  padding: 2rem 0;
  gap: 1rem;
  color: ${({ theme }) => theme.black};

  > div:nth-child(1) {
    display: flex;
    justify-content: space-between;

    color: #aa33b5;
    text-transform: uppercase;
    font-size: 0.72rem;
    letter-spacing: 0.2em;

    > p:last-child {
      color: ${({ theme }) => theme.black};
    }
  }

  > div:nth-child(2) {
    display: flex;

    flex-direction: column;
    ${props =>
      props.alignCenter &&
      css`
        align-items: center;
      `}
    gap: 1rem;
    color: ${({ theme }) => theme.wizard.subTitle};
    > p:first-child {
      color: ${({ theme }) => theme.black};
      font-size: 1.9rem;
    }
  }

  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: column;
    /* transform: translateX(25%) */

    justify-content: space-between;
    > div {
      display: flex;
      flex-direction: row;
      gap: 1rem;
    }

    > div:nth-child(2) {
      padding-bottom: 0;
    }
  }
`;

export const ErrorInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  /* padding-bottom: 3rem; */
`;

export const StakingTypeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: row;
  }
`;

export const GenericInput = styled.input<{
  align?: string;
  error?: boolean | null;
  addPadding?: boolean;
  isUpperCase?: boolean;
}>`
  line-height: 2rem;
  height: 4rem;
  min-height: 2rem;
  border-bottom: 1px solid #585a92;
  padding: 1rem 0.5rem 0.5rem;
  width: 100%;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.black};
  font-family: Manrope, sans-serif;
  transition:
    border 500ms ease,
    background-color 500ms ease;
  color-scheme: ${props => (props.theme.dark ? 'dark' : 'auto')};
  /* Chrome, Safari, Edge, Opera */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type='number'] {
    -moz-appearance: textfield;
  }

  ${props =>
    props?.addPadding &&
    css`
      background: violet;
    `}
  ${props =>
    props.align &&
    css`
      text-align: ${(props: any) => props.align};
    `}
    ${props =>
    props.error &&
    css`
      border: 1px solid ${props.theme.error};
      border-radius: 10px;
      background: ${transparentize(0.8, props.theme.error)};
    `};
  ${props =>
    props.isUpperCase &&
    css`
      text-transform: uppercase;
    `}

  &:disabled {
    background: ${props => transparentize(0.8, props.theme.gray)};
    cursor: not-allowed;
  }
`;

export const ErrorMessage = styled.div`
  width: 100%;
  color: ${props => props.theme.error};
  font-weight: 600;
`;

export const GenericInfoCard = styled.div`
  padding: 1rem;
  font-size: 0.82rem;
  border-radius: 1rem;
  background: ${({ theme }) =>
    theme.dark ? theme.wizard.genericInfoCard : theme.true.white};
`;

export const AddressesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: row;
  }
`;

export const GenericAddressCard = styled.div<{
  expand?: boolean;
  selected?: boolean;
}>`
  display: flex;
  align-items: center;
  width: 100%;
  height: 7rem;
  padding: 2rem 1.2rem;
  border-radius: 1rem;
  background: ${({ theme }) => theme.wizard.cardAddress};
  font-weight: 700;
  color: ${({ theme }) => theme.black};
  flex-direction: column;

  ${props =>
    props.expand &&
    css`
      height: 10rem;
    `}
  ${props =>
    props?.selected &&
    css`
      border: 1px solid #aa33b5;
    `}
    font-size: 1.1rem;

  transition: 200ms ease;
  > div {
    display: flex;
    width: 100%;
    justify-content: space-between;

    > div {
      display: flex;
      flex-direction: column;

      span {
        font-size: 1rem;
        letter-spacing: 0.1em;

        font-weight: 400;
        color: #c6c7eb;
      }
    }
    > p {
      display: flex;
      flex-direction: column;
      color: white;

      > span {
        color: #c6c7eb;
      }
    }

    input[type='radio'] {
      display: none;
    }

    > label {
      min-width: 20px;
      height: 20px;
      border: 0.15rem solid ${({ theme }) => theme.black};
      border-radius: 50%;
    }

    > label:after {
      content: '';
      width: 100%;
      height: 100%;
      display: block;
      background: ${({ theme }) => theme.black};
      border-radius: 50%;
      transform: scale(0);
    }

    input[type='radio']:checked + label:after {
      transform: scale(0.8);
    }
  }

  > div:nth-child(2) {
    ${props =>
      props?.selected &&
      css`
        border-bottom: 1px solid #585a92;
      `}
  }

  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    height: 6rem;
    > div:nth-child(2) {
      border-bottom: 0;
    }
  }
`;

export const ChangedAddressContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0 !important;
  font-weight: 500;
  color: #646693;
  font-size: 1rem;
  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    div {
      width: 93%;
    }
    flex-direction: column !important;
  }
`;

export const PrecisionContainer = styled(GenericAddressCard)`
  padding: 2rem 1.2rem;
  font-weight: 400;
  flex-direction: row;
  justify-content: space-between;
  cursor: default;
  > div:first-child {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    font-weight: 400;
    p {
      color: ${({ theme }) => theme.black};
      font-size: 1.5rem;
    }

    p:last-child {
      font-size: 1rem;
    }
  }
  span {
    font-size: 1.5rem;
    font-weight: 700;
    color: ${({ theme }) => theme.black};
  }
`;

export const PrecicionsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    gap: 0.8rem;
  }
`;

export const PrecisionCard = styled.div<{ $isSelected: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
  cursor: pointer;

  padding: 1.34rem 0.93rem;
  background-color: ${({ theme }) =>
    theme.dark ? '#181935' : theme.true.white};
  border-radius: 0.5rem;
  color: ${({ theme }) => theme.black};
  font-size: 1rem;
  font-weight: 700;
  transition: 200ms ease;
  ${props =>
    props.$isSelected &&
    css`
      border: 1px solid ${({ theme }) => theme.violet};
      color: ${({ theme }) => theme.violet};
    `}

  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    width: 4.313rem;
    height: 3.875rem;
  }
`;

export const CardSelect = styled.div`
  width: 150px;
  height: 150px;
  background: ${props => props.theme.lightPurple};
  color: ${props => props.theme.white};
  border-radius: 3%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 1rem;
  transition: 100ms ease-in-out;
  svg {
    font-size: 4rem;
  }

  &:hover {
    background: ${props => props.theme.violet};
  }
`;

export const PreConfirmOptions = styled.div<{ secondary?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  width: 100%;
  background: ${props => (props.secondary ? '#404264' : '#AA33B5')};
  border-radius: 8px;
  padding: 1.25rem;
  line-height: 1.3rem;
  cursor: pointer;

  > div {
    display: flex;
    flex-direction: column;
    width: 90%;
    gap: 0.5rem;
    font-weight: 700;
    color: #ffffff;
    font-size: 1rem;

    > span:last-child {
      font-weight: 500;
      font-size: 0.87rem;
    }
  }
`;

export const ConfirmCardContainer = styled.div`
  padding: 1.56rem;
  > span {
    color: #ffffff;
    font-weight: 500;
    font-size: 1.5rem;
  }
`;

export const ConfirmCardBasics = styled.div<{
  secondary?: boolean;
  tokenInfo?: boolean;
}>`
  display: flex;
  color: ${({ theme }) => theme.black};
  flex-direction: column;
  background: ${({ theme }) =>
    theme.dark ? theme.card.background : theme.true.white};
  border-radius: 10px;
  ${props =>
    props?.tokenInfo &&
    css`
      gap: 1rem;
      > div:nth-child(1) {
        gap: 1rem;
        padding: 1.56rem 1.56rem 0.75rem;
      }
    `}

  > div:nth-child(1) {
    display: flex;
    align-items: center;
    > div {
      display: flex;
      flex-direction: column;
      font-weight: 700;
      font-size: 1.25rem;

      > span:last-child {
        font-weight: 400;
        font-size: 0.9rem;
        > span {
          color: red;
        }
      }
    }
  }
`;

export const ConfirmCardImage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #ccc;
  color: black;
  text-transform: uppercase;
`;

export const ConfirmCardBasisInfo = styled.div<{ secondary?: boolean }>`
  display: flex;
  padding: 1.56rem;
  justify-content: space-between;

  font-size: 0.9rem;
  font-weight: 500;

  > span:first-child {
    color: ${({ theme }) => (theme.dark ? theme.lightGray : theme.navbar.text)};
  }

  > span:last-child {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1rem;
    font-weight: 700;
    color: ${({ theme }) => theme.black};
    > strong {
      font-weight: 400;
      font-family: 0.7rem;
      color: #646693;
    }
  }

  &:not(last-child) {
    border-bottom: 1px solid
      ${props => (!props.secondary ? '#d7d8dd' : '#515395')};
  }
  &:last-child {
    border: 0;
  }
`;

export const CheckBoxInput = styled.input.attrs(() => ({
  type: 'checkbox',
}))`
  position: relative;
  width: 48px;
  height: 24px;
  -webkit-appearance: none;
  background: ${props => props.theme.card.darkText};
  outline: none;
  border-radius: 12px;
  transition: 0.5s;
  cursor: pointer;

  &:checked {
    background: #37dd72;
  }

  &:before {
    content: '';
    width: 20px;
    height: 20px;
    position: absolute;
    border-radius: 50%;
    top: 2px;
    bottom: 2px;
    left: 0;
    background: ${props => props.theme.true.white};
    transition: 0.5s;
    transform: translate(15%, 0);
  }

  &:checked:before {
    transform: translate(100%, 0);
    left: 5.5px;
  }
`;

export const PropertyLabel = styled.span`
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
  width: 100%;
  font-size: 2rem;
  font-weight: 500;
  color: ${props => props.theme.true.white};
`;

export const BackArrow = styled.span`
  display: flex;
  position: relative;
  top: 1rem;
  left: 1rem;
`;

export const ConnectedWalletContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  padding: 1.4rem 1.6rem;
  border-bottom: 1px solid #c6c7eb;
  > div {
    display: flex;
    flex-direction: column;
    > span {
      font-size: 0.75rem;
      &:nth-child(2) {
        color: #c6c7eb;
      }
    }
  }

  > div:nth-child(2) {
    select {
      padding: 0.85rem;
      border-radius: 10%;
      background: #181935;
      color: white;
    }
  }
  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    width: 100%;
  }
`;

export const StepsContainer = styled.div<{ advancedSteps?: boolean }>`
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 1.3rem;
  color: #646693;
  font-weight: 500;
  position: relative;
  width: 100%;
  padding-top: 1rem;

  ${props =>
    props.advancedSteps &&
    css`
      justify-content: space-between;
    `}

  &::before {
    content: '';
    position: absolute;
    top: 65%;
    width: 90%;

    height: 0.1rem;
    background: #646693;
    z-index: 1;
  }

  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    &::before {
      content: '';
      position: absolute;
      top: 1rem;
      left: 1.1rem;
      width: 0.1rem;
      height: 90%;
      background: ${({ theme }) => theme.wizard.stepsLine};
      z-index: 1;
    }

    flex-direction: column;
    align-items: flex-start;
  }
`;

export const StepsItem = styled.div<{
  isDone: boolean;
  selected: boolean;
  isUpperCase?: boolean;
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  border: 1.5px solid #646693;
  color: ${({ theme }) => (theme.dark ? theme.true.white : theme.navbar.text)};
  background: ${props => props.theme.background};
  z-index: 2;
  ${props =>
    props.isDone &&
    css`
      svg {
        path {
          fill: ${({ theme }) => theme.wizard.isDone};
        }
      }
      border: 1.5px solid ${({ theme }) => theme.wizard.isDone};
    `}
  ${props =>
    props.selected &&
    css`
      color: ${({ theme }) => theme.wizard.steps};
      border-color: ${({ theme }) => theme.wizard.steps};
    `}
  ${props =>
    props.isUpperCase &&
    css`
      text-transform: uppercase;
    `}
`;

export const StepsExpandedContainer = styled.div<{ isHidden?: boolean }>`
  ${props =>
    props.isHidden &&
    css`
      height: 0;
      overflow: hidden;
    `}
`;

export const StepsContainerDesktop = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 1.5rem 1rem;
  gap: 1rem;
  color: #aa33b5;
  font-weight: 500;
  font-size: 1rem;

  width: 20.81rem;
  height: 36rem;
  overflow: hidden;
  transform: translateX(-12%);
  position: relative;
  top: 3rem;

  background: ${({ theme }) => theme.wizard.stepsBackground};
  /* background: #06060b; */
  border-radius: 12px;
`;

export const DesktopBasicSteps = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  svg {
    color: ${({ theme }) => theme.black};
    font-size: 1.5rem;
  }
  > div:first-child {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    > span:last-child {
      font-size: 0.7rem;
      color: ${({ theme }) =>
        theme.dark ? theme.true.white : theme.navbar.text};
    }
  }
`;

export const DesktopStepsLabel = styled.div<{ isUpperCase?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  cursor: pointer;
  > span {
    font-weight: 500;
    line-height: 1rem;
  }
  > span:first-child {
    font-size: 0.95rem;
    color: #646693;
  }

  > span:last-child {
    font-size: 1.2rem;
    color: ${({ theme }) => theme.black};
    ${props =>
      props.isUpperCase &&
      css`
        text-transform: uppercase;
      `}
  }
`;

export const StepsItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  top: 20%;
  gap: 0.5rem;

  > span {
    font-size: 0.7rem;
  }
`;

export const StepsItemContainerDesktop = styled.div<{ selected: boolean }>`
  display: flex;
  flex-direction: row !important;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
  color: ${props => (props.selected ? '#fff' : '#646693')};

  > div:last-child {
    span {
      color: ${props => (props.theme.dark ? '#fff' : '#646693')};
      @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
        text-transform: uppercase;
      }
    }
  }
`;

export const AdvancedStepsDesktop = styled.div<{ darkText?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  padding: 1rem 0;
  border-top: 1px solid #18193580;

  > div {
    display: flex;
    flex-direction: column;
  }
  > div:first-child {
    font-weight: 500;
    color: #aa33b5;
    font-size: 1rem;
    gap: 0.5rem;
    > span:last-child {
      color: ${({ theme }) =>
        theme.dark ? theme.true.white : theme.navbar.text};
      font-size: 0.7rem;
    }
  }
`;

export const DefaultSettingsContainer = styled.div<{ showAdvanced: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 4rem;
  z-index: 5;
  border: 1px solid #646693;
  border-radius: ${props =>
    props.showAdvanced ? '0.62rem 0.62rem 0 0' : '0.62rem'};

  transition: 600ms;
  padding: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.black};

  svg {
    font-size: 1.5rem;
  }
`;

export const DefaultSettingsOptions = styled.div<{ showAdvanced: boolean }>`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 0;
  visibility: hidden;
  margin-top: -1.5rem;
  overflow: hidden;

  border: 0 solid #646693;

  transition: 300ms;

  padding: 2rem;
  ${props =>
    props.showAdvanced &&
    css`
      border: 1px solid #646693;

      height: 28rem;
      border-radius: 0 0 0.62rem 0.62rem;
      border-top: none;
      visibility: visible;
    `}

  > div {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    font-size: 1rem;
    color: ${({ theme }) => theme.black};
    font-weight: 700;
  }
  > div:first-child {
    color: ${({ theme }) => theme.wizard.subTitle};
  }
`;

export const InfoCard = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 2rem 0;

  svg {
    font-size: 1.2rem;
  }
`;

export const BorderedButton = styled.button<{
  fullWidth?: boolean;
  alignEnd?: boolean;
  isHidden?: boolean;
  alignSelf?: boolean;
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 0.8rem;
  border: 1px solid ${({ theme }) => theme.black};
  border-radius: 8px;
  color: ${({ theme }) => theme.black};
  visibility: ${props => (props.isHidden ? 'hidden' : 'visible')} !important;

  svg {
    path {
      fill: ${({ theme }) => theme.black};
    }
    margin-left: ${props => (props.alignEnd ? 'auto' : '')};
    font-size: 1.34rem;
  }

  min-width: 10rem;
  max-width: 20rem;
  width: 100%;

  ${props =>
    props.fullWidth &&
    css`
      max-width: 100% !important;
    `}
  ${props =>
    props.alignSelf &&
    css`
      align-self: center;
    `}

  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    justify-content: center;
    max-width: calc(22rem - 6rem) !important;
    align-self: end;
  }
`;

export const UriButtonsContainer = styled.div`
  display: flex;
  flex-direction: column !important;
  gap: 1rem;
  width: 100%;

  > div {
    display: flex;
    justify-content: space-between;
    overflow: hidden;

    gap: 1rem;
  }

  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    margin-top: 0;
  }
`;

export const ReviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
  > span {
    font-size: 0.82rem;
    font-weight: 500;
  }
`;

export const PropertiesContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 1rem;
  gap: 1rem;
  flex-wrap: wrap;

  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
  }
`;

export const PropertiesItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  svg {
    path {
      fill: ${({ theme }) => theme.black};
    }
  }
  ${({ theme }) =>
    theme.dark
      ? css`
          border: 1px solid #404264;
        `
      : css`
          background-color: ${({ theme }) => theme.true.white};
        `}
  max-width: 15rem;
  width: 45%;
  height: 8rem;
  padding: 1.5rem;
  border-radius: 15px;
  > div > svg {
    font-size: 1.5rem;
  }

  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    max-width: 100%;
  }
`;

export const ButtonsContainer = styled.div<{
  columnDirection?: boolean;
  isRow?: boolean;
}>`
  display: flex;
  flex-direction: column;

  ${props =>
    props?.isRow &&
    css`
      flex-direction: row;
    `}

  margin-top: auto;

  gap: 1rem;
  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: row;

    position: relative;
    max-width: 100%;
    justify-content: space-between;
  }
`;

export const BackArrowSpan = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #404264;
  width: 3.5rem;
  height: 3rem;
  border-radius: 0.5rem;
  padding: 0.84rem;
  cursor: pointer;
`;

export const ConfirmTxButtons = styled.div`
  display: flex;
  justify-content: center;
  /* align */
  position: fixed;
`;

export const RolesContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5rem;
  justify-content: center;
`;

export const RolesCheckboxContainer = styled.div`
  max-width: 10rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  text-align: center;
  justify-content: center;
  align-items: center;
`;

export const TransactionHashContainer = styled.div`
  position: absolute;
  padding: 1rem;
  background: #585a92;
  border-radius: 10px;
  top: 5%;
  color: #fff;
`;

export const WizardAddressCheck = styled(WizardCheckSquare)`
  position: relative;
  top: 40%;

  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    top: -37%;
    left: 95%;
  }
`;

export const WizardFailAddressCheck = styled(WizardFailSquare)`
  position: relative;
  top: 40%;
  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    top: -37%;
    left: 95%;
  }
`;

export const WizardTxSuccessComponent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  height: 100%;
  padding-top: 40%;
  > span {
    color: ${({ theme }) => theme.black};
    font-weight: 500;
  }
  > span:nth-child(2) {
    font-size: 1rem;
    line-height: 1.125rem;
    letter-spacing: 0.125rem;
    text-transform: uppercase;
  }
  > span:nth-child(3) {
    text-align: center;
    font-size: 1.8rem;
    line-height: 2rem;
  }
  > span:nth-child(4) {
    color: ${({ theme }) => theme.wizard.subTitle};
    text-align: center;
    font-size: 0.95rem;
    line-height: 1rem;
  }

  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    padding-top: 0;
  }
`;

export const HashContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 1rem 1.25rem;
  gap: 2rem;
  border-radius: 8px;
  margin-top: auto;

  word-break: break-all;
  word-wrap: break-word;
  flex-wrap: wrap;
  background: ${({ theme }) => (theme.dark ? '#404264' : '#fff')};
  cursor: pointer;

  > div {
    display: flex;
    flex-direction: column;
    max-width: 70%;
    color: ${({ theme }) => (theme.dark ? '#fff' : '#646693')};
    gap: 1rem;
    > span:nth-child(1) {
      font-size: 1rem;
      font-weight: 700;
      line-height: normal;
    }
    > span:nth-child(2) {
      color: ${({ theme }) => (theme.dark ? '#c6c7eb' : theme.black)};
      font-size: 0.9rem;
      font-weight: 700;
      line-height: 1.2rem;
    }
  }
`;

export const CloseModal = styled.div`
  width: 100px !important;
  color: ${({ theme }) => theme.black};
  /* height: 100px; */
  position: absolute;
  top: 0.7rem;
  right: -1rem;
  margin-bottom: 2rem;
  font-size: 1rem;
  cursor: pointer;

  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    top: 1rem;
  }
`;

export const IconWizardInfoSquare = styled(WizardInfoSquare)`
  > path {
    fill: ${({ theme }) => theme.black};
  }
  > g {
    path {
      fill: ${({ theme }) => theme.black};
    }
  }
`;

export const IconWizardClock = styled(BsClock)`
  > path {
    fill: ${({ theme }) => theme.black};
  }
`;

export const UnderscoreConnect = styled.u`
  cursor: pointer;
`;

export const ConfigITOStartTime = styled.p`
  display: flex;
  justify-content: space-between;

  > span {
    display: flex;
    gap: 1rem;
  }
`;
