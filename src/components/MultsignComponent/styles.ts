import { default as DefaultInput } from '@/components/InputGlobal';
import { DefaultScrollBar } from '@/styles/common';
import { darken, lighten, transparentize } from 'polished';
import { BsInfoCircle } from 'react-icons/bs';
import { GrRotateRight } from 'react-icons/gr';
import styled, { css } from 'styled-components';

export const Logo = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
`;

export const Title = styled.h1`
  width: fit-content;
  font-size: 1.5rem;
  font-weight: 400;
  color: ${props => props.theme.white};
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  margin: auto;
  padding: 2rem 0;
  width: 90%;

  @media (max-width: 768px) {
    width: 100%;
  }

  height: 100%;
`;

export const Content = styled.div<{ $loading: boolean; isJSONFile?: boolean }>`
  height: 60%;
  min-height: 50vh;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2rem;

  overflow: auto;

  z-index: 5;

  width: 100%;

  ${DefaultScrollBar}
  &::-webkit-scrollbar {
    height: 0.3em;
  }

  ${props =>
    props.isJSONFile &&
    css`
      padding: 2rem 0;
      border: 1px solid
        ${props =>
          props.theme.dark ? props.theme.footer.border : props.theme.lightGray};
      background: ${props =>
        props.theme.dark ? props.theme.navbar.background : props.theme.white};
    `}
`;

export const MultiSigList = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: center;
  align-items: center;

  padding: 1rem;
  border-bottom: 1px solid
    ${props =>
      props.theme.dark ? props.theme.footer.border : props.theme.lightGray};
  width: 100%;
  height: 7rem;
  > div {
    width: 100%;
    > div {
      min-width: 50%;
    }
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    padding: 6rem 2rem;
  }
`;

export const ContentTitle = styled.section`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.black};

  h1 {
    font-weight: 500;
  }

  h3 {
    font-weight: 400;
  }

  a {
    color: ${props => props.theme.gray};
    text-decoration: none;
    transition: 0.2s ease-in-out;

    width: 100%;
    text-align: right;

    font-weight: 400;
    font-size: 0.8rem;

    &:visited {
      color: ${({ theme }) => theme.gray};
    }
    &:hover {
      color: ${props => lighten(0.2, props.theme.purple)};
      text-decoration: dotted 1px underline;
    }
  }
`;

export const InfoIcon = styled(BsInfoCircle)`
  height: 0.75rem;
`;

export const ContentBody = styled.section`
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;

  button {
    width: 80%;
  }
`;

export const InputFile = styled.div<{ isDragging: boolean }>`
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 30rem;

  border: 1px dashed ${props => props.theme.card.border};
  border-radius: 0.5rem;
  background-color: ${props =>
    props.theme.dark ? props.theme.text.twilight : props.theme.true.white};

  ${props =>
    props.isDragging &&
    css`
      background-color: ${props =>
        props.theme.dark
          ? darken(0.025, props.theme.card.background)
          : lighten(0.125, props.theme.lightGray)} !important;
      color: ${props => props.theme.black} !important;
      border-color: ${props => darken(0.01, props.theme.card.border)};
    `}

  color: ${props => props.theme.black};
  font-weight: 400;
  font-size: 0.9rem;

  transition: 0.2s ease;

  &:hover {
    color: ${props => props.theme.black};
    border-color: ${props => darken(0.05, props.theme.card.border)};
    background-color: ${props =>
      props.theme.dark
        ? lighten(0.1, props.theme.background)
        : lighten(0.125, props.theme.lightGray)};
  }

  input {
    display: none;
  }

  label {
    cursor: pointer;

    color: #f372ff;
    font-weight: 500;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    max-width: 100%;
  }
`;

export const ErrorContainer = styled.div`
  height: 1rem;
  width: 100%;

  margin: -0.5rem 0 1.25rem;
  padding: 1.25rem;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 0.5rem;

  background-color: ${props => props.theme.background};

  color: ${props => props.theme.black};
`;

export const DragContainer = styled.div<{ isHidden?: boolean }>`
  width: 100%;
  ${props =>
    props.isHidden &&
    css`
      display: none;
    `}
`;

export const ButtonsContainerApi = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 2rem;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: column;
    width: 100%;
  }
`;

const DefaultButtonStyles = css`
  display: flex;
  justify-content: center;
  min-width: 10rem;
  padding: 1rem;
  color: ${props => props.theme.true.white} !important;
  background: ${props => props.theme.violet};
  border-radius: 4px;
  &:disabled {
    background: ${props => props.theme.kappsDemo.dark};
    user-select: none;
    cursor: not-allowed;

    &:hover {
      opacity: 1;
    }
  }

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    width: 100%;
  }
`;

export const MultisignButton = styled.button<{
  disabled?: boolean;
  isJsonButton?: boolean;
}>`
  ${DefaultButtonStyles}

  ${props =>
    props.isJsonButton &&
    css`
      background-color: ${props => props.theme.purple};
    `}
`;

export const TextAreaJson = styled.textarea`
  width: 100%;
  height: 30rem;
  background-color: ${props =>
    props.theme.dark ? props.theme.text.twilight : props.theme.true.white};
  cursor: unset;
  color: ${props =>
    props.theme.dark ? props.theme.true.white : props.theme.text.gray};
  border-radius: 0.2rem;
  box-sizing: border-box;
  border-width: 2px;
  border-style: dotted;
  resize: none;
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  ${DefaultScrollBar}
`;

export const ContentContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  margin-bottom: 2rem;
  gap: 0.5rem;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;

export const LeftContentContainer = styled.div`
  width: max-content;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  width: 45%;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: 95%;
  }
`;

export const RightContentContainer = styled.div`
  width: max-content;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  width: 45%;

  h3 {
    color: ${props => props.theme.violet};
    margin: 0.5rem;
  }

  pre {
    &::-webkit-scrollbar {
      width: 0.3rem;
      height: 0.5rem;
      z-index: 1;
    }
    &::-webkit-scrollbar-track {
      margin-top: 0.5rem;
      margin-bottom: 0.5rem;
      box-shadow: inset 0 0 0.25rem rgba(0, 0, 0, 0.3);
      background: transparent;
      cursor: pointer;
    }

    &::-webkit-scrollbar-thumb {
      background-color: ${props => transparentize(0.2, props.theme.violet)};
      border-radius: 10px;
      cursor: pointer;
    }
    &::-webkit-scrollbar-corner {
      background-color: transparent;
    }
    height: 30rem;
    border-radius: 0.2rem;
    width: 100%;
    max-width: 40vw;
    overflow: auto;
    @media (max-width: ${props => props.theme.breakpoints.mobile}) {
      max-width: 95%;
    }
  }
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: 95%;
  }
`;

export const ContentContainerHeader = styled.div`
  height: 7rem;
  display: flex;
  text-align: center;
  flex-direction: column;
  justify-content: flex-end;
`;

export const LoaderContainer = styled.div`
  margin-top: 5rem;
  height: 25rem;
`;

export const HeaderContainer = styled.div<{ border?: string }>`
  width: 100%;

  margin-top: 2rem;

  padding: 1rem;
  padding-bottom: 2rem;

  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;

  gap: 1rem;

  border-bottom: 1px solid ${props => props.theme.card.border};

  ${props => props.border === 'none' && `border: none;`}
`;

export const ReloadIcon = styled(GrRotateRight)<{ animate: boolean }>`
  min-width: 1.5rem;
  min-height: 1.5rem;
  color: ${props => props.theme.secondaryText};
  cursor: pointer;
  animation: ${props => (props.animate ? 'rotate 0.5s linear' : 'none')};
  transition: 0.2s ease;

  &:hover {
    color: ${props => props.theme.black};
  }
`;

export const Header = styled.section`
  display: flex;

  flex-direction: row;
  align-items: center;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const ResetContainer = styled.div`
  gap: 0.2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${props => props.theme.black};
  cursor: pointer;

  transition: 0.2s ease;

  &:hover {
    color: ${props => props.theme.darkText};
  }
`;

export const TitleH3 = styled.h3`
  font-weight: 400;
  font: Montserrat;
  margin: 0.5rem;
  color: ${props => props.theme.black};
`;

export const Input = styled(DefaultInput)`
  margin-top: 1.1rem;

  padding: 0.75rem 1rem;

  background-color: ${props => props.theme.white};

  border-color: ${props => props.theme.lightGray};

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: 100%;
  }
`;

export const EmptyMultisign = styled.div`
  display: flex;
  font-weight: 600;
  font-size: 1.2rem;
  justify-content: center;
  width: 100%;
  padding: 2rem 0;
  /* border: 1px solid red; */
  box-shadow: 0 0px 5px 4px
    ${props =>
      props.theme.dark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.1)'};
  color: ${props => props.theme.black};
`;

export const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;

  &:not(:first-child) {
    justify-content: flex-end;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;

export const ImportJsonButton = styled.label`
  ${DefaultButtonStyles};
  cursor: pointer;

  background-color: ${props => props.theme.purple};
`;
