import { lighten, transparentize } from 'polished';
import { BsPersonSquare } from 'react-icons/bs';
import { IoMdCloseCircle } from 'react-icons/io';
import { RiCopperCoinLine } from 'react-icons/ri';
import styled, { css, keyframes } from 'styled-components';

const defaultStyles = css`
  width: 100%;

  padding: 0.5rem 1rem;
  border: 1px solid ${({ theme }) => theme.darkText};
  border-radius: 0.5rem;

  color: ${({ theme }) => theme.darkText};

  background-color: transparent;

  box-shadow: unset;

  font-weight: 500;

  transition: all 0.1s ease-in-out;
`;

export const LoadingBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;

  width: 100vw;
  height: 100vh;
  z-index: 6;

  background-color: ${props => transparentize(0.2, props.theme.true.black)};

  display: grid;
  place-items: center;

  > div {
    width: 10rem;
    height: 10rem;

    > svg {
      width: 100%;
      height: 100%;
    }
  }
`;

export const CloseIcon = styled(IoMdCloseCircle).attrs(props => ({
  color: props.theme.form.hash,
  size: 24,
}))`
  min-width: 24px;
  cursor: pointer;
`;

export const Container = styled.div`
  margin: auto;
  margin-top: 2rem;
  width: 100%;
  max-width: 1200px;

  @media screen and (max-width: ${props => props.theme.breakpoints.tablet}) {
    width: 100%;
  }
`;

export const Header = styled.div`
  width: 100%;
  padding: 1rem;
  padding-bottom: 2rem;

  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  border-bottom: 1px solid ${props => props.theme.card.border};
`;

export const Title = styled.h1`
  width: 100%;
  font-size: 1.5rem;
  font-weight: bold;

  color: ${props => props.theme.white};
`;

export const ChooseContainer = styled.div`
  width: 100%;
  min-height: 20rem;

  display: flex;
  justify-content: space-around;

  padding: 1rem;
  border-radius: 1rem;

  margin: 1rem 0;

  background-color: ${props => props.theme.form.background};
`;

const BaseIconStyle = css`
  width: 100%;
  height: 3rem;

  transition: 0.2s ease-in-out;
`;

export const TokenIcon = styled(RiCopperCoinLine)`
  ${BaseIconStyle}
`;
export const NFTIcon = styled(BsPersonSquare)`
  ${BaseIconStyle}
`;

export const ChooseItemText = styled.span`
  transition: 0.2s ease-in-out;

  font-size: 1.2rem;
`;

export const ChooseItem = styled.button`
  width: 30%;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 1rem;

  border: none;
  border-radius: 1rem;

  background-color: ${props => props.theme.card.border};

  transition: 0.2s ease;

  &:hover {
    background-color: '#AA33B5';

    ${ChooseItemText} {
      color: ${props => props.theme.white};
    }
    svg {
      color: ${props => props.theme.white};
    }
  }
`;

export const InputContainer = styled.div`
  margin-top: 1rem;
  padding: 1.5rem;
  padding-top: 3rem;

  position: relative;

  border-radius: 1rem;

  background-color: ${props => props.theme.form.background};
`;

const ColorChangeAnimation = keyframes`
  0% {
      filter: brightness(1.5);
      box-shadow: 0 0 1rem 0 rgba(255, 255, 255, 0.1);
    }
    100% {
      filter: brightness(1);
      box-shadow: none;
    }
`;

export const ExtraOptionContainer = styled.div`
  display: flex;
  margin-top: 1rem;
  margin-bottom: 1rem;
  border-radius: 12px;
  padding-top: 1rem;

  padding: 1rem 2rem;

  animation: ${ColorChangeAnimation} 2s infinite;

  background-color: ${props => props.theme.white};
  box-shadow: 0 0 1rem 0
    ${props => (props.theme.dark ? '#000' : lighten(0.8, '#000'))};

  justify-content: flex-start;
  align-items: center;

  gap: 1rem;

  a {
    color: ${props =>
      props.theme.dark ? props.theme.darkText : props.theme.form.hash};
    font-size: 1.1rem;
    letter-spacing: 0.05rem;

    display: flex;
    gap: 0.25rem;

    text-decoration: none;
    animation: none;

    &:hover {
      color: ${props =>
        props.theme.dark ? props.theme.true.white : props.theme.form.hoverHash};
    }

    &:visited {
      color: ${props =>
        props.theme.dark ? props.theme.darkText : props.theme.form.hash};
    }

    &:active {
      color: ${props =>
        props.theme.dark ? props.theme.darkText : props.theme.form.hash};
    }

    svg {
      font-size: 1.2rem;
    }
  }

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  @media screen and (max-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: column-reverse;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 1rem;

    a {
      max-width: 100%;
      white-space: pre-wrap;
      word-break: break-all;

      display: block;
    }
  }
`;

export const IconsContainer = styled.div`
  width: 100%;

  display: flex;

  svg:last-child {
    margin-left: auto;
  }
`;

export const SelectContainer = styled.div`
  display: flex;
  align-items: flex-end;
  flex-direction: row;
  background-color: ${props => props.theme.white};
  padding: 1.37rem;
  border-radius: 1rem;
  margin-top: 1rem;
  width: 100%;
  gap: 1rem;

  border: 0.2px solid ${({ theme }) => theme.input.border};
  box-shadow: 0 0 0.5rem -0.125rem ${props => (props.theme.dark ? '#000' : lighten(0.8, '#000'))};

  @media screen and (max-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: column;
  }
`;

interface ISelect {
  size?: number;
  configITO?: boolean;
}

export const SelectContent = styled.div<ISelect>`
  position: relative;
  display: flex;
  flex-direction: column;
  width: ${props => (props.configITO ? '100%' : 'calc(50% - 0.5rem)')};

  max-width: ${props => (props.size ? `${props.size}%` : 'unset')};

  @media screen and (max-width: ${props => props.theme.breakpoints.tablet}) {
    width: 100%;
    margin-left: 0;
  }
`;

export const AssetTriggerContainer = styled.div`
  width: 100%;
  position: relative;
  margin-top: 3rem;
`;

export const FieldLabel = styled.label`
  user-select: none;
  font-size: smaller;
  color: ${({ theme }) => theme.darkText};
  margin-bottom: 0.3rem;
`;

export const BalanceLabel = styled.label`
  user-select: none;
  font-size: smaller;
  font-weight: 600;
  display: flex;
  color: ${({ theme }) => theme.darkText};
  margin-bottom: 0.3rem;
`;

export const AssetIDInput = styled.input<{ $error?: boolean }>`
  height: 3rem;

  ${defaultStyles}

  ${props =>
    props.$error &&
    css`
      border: 1px solid ${props.theme.error};
      background-color: ${transparentize(0.9, props.theme.red)};
    `}
`;

export const BalanceContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const CardContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  padding-bottom: 2rem;

  font-family: Rubik;
  font-family: Rubik;
  font-style: normal;
  font-weight: normal;
  font-size: 15px;

  div {
    span {
      color: ${props => props.theme.darkText};
    }
  }

  @media screen and (max-width: ${props => props.theme.breakpoints.tablet}) {
    width: 100%;
  }
`;

export const CreateTxContainer = styled.div<{ isMultiContract?: boolean }>`
  display: flex;
  gap: 1rem;
`;

export const SectionFormContainer = styled.div`
  width: 100%;
`;
