import { ReactSelectStyles } from '@/components/Contract/Select/styles';
import { EditorContent } from '@tiptap/react';
import { transparentize } from 'polished';
import styled, { css } from 'styled-components';
import { RTEStyles } from '../styles';

export const Container = styled.div<{ isOpenApplyFormModal: boolean }>`
  display: grid;
  place-items: center;
  transition: opacity 100ms linear;

  ${({ isOpenApplyFormModal }) =>
    isOpenApplyFormModal
      ? css`
          opacity: 1;
          pointer-events: all;
        `
      : css`
          opacity: 0;
          pointer-events: none;

          transition-delay: 0.4s;

          @media screen and (min-width: ${props =>
              props.theme.breakpoints.mobile}) {
            transition-delay: 0s;
            transition: opacity 100ms linear;
          }
        `}
`;

export const Background = styled.div`
  position: fixed;
  inset: 0;

  background-color: ${({ theme }) => transparentize(0.1, theme.true.newBlack)};

  z-index: 6;
`;

export const Content = styled.div<{ opened: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 24px;

  padding: 20px;
  height: calc(100lvh - 32px);
  width: 100vw;

  bottom: 0;

  transform: translateY(${props => (props.opened ? 0 : '100%')});
  transition: transform 0.4s ease-out;

  position: fixed;
  z-index: 7;

  background-color: ${props => props.theme.white};

  border-radius: 24px 24px 0 0;

  @media screen and (min-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 40px;

    height: fit-content;
    min-height: min(480px, 90%);

    min-width: min(800px, 90%);
    width: fit-content;

    transform: translate(-50%, -50%);
    inset: 50%;

    border-radius: 24px;
  }
`;

export const ArrowContainer = styled.div`
  display: grid;
  place-items: center;
  cursor: pointer;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  height: fit-content;
`;

export const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.true.white};
`;

export const AssetVisualization = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  height: fit-content;

  padding: 16px;
  border-radius: 8px;

  background-color: #181818;
`;

export const AssetName = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.true.white};
`;

export const BuyForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;

  overflow: hidden;
`;

export const InputRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: fit-content;
  max-height: 50%;
`;

export const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${({ theme }) => theme.true.white};

  display: flex;
  justify-content: space-between;
`;

export const Input = styled.textarea`
  color: ${({ theme }) => theme.true.white};
  background-color: transparent;

  border-radius: 8px;

  outline: none;

  border: 1px solid ${({ theme }) => theme.true.white};

  padding: 10px;

  min-width: 100%;
  max-width: 100%;

  min-height: 120px;

  font-size: 1rem;
  line-height: 1.25rem;
`;

export const RTEArea = styled(EditorContent)`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  .tiptap {
    color: ${({ theme }) => theme.darkText};

    background-color: transparent;

    padding: 8px;

    min-width: 100%;
    max-width: 100%;

    min-height: 120px;
    height: 100%;

    font-size: 1rem;
    line-height: 1.5;

    overflow-y: auto;

    @media screen and (min-width: ${props => props.theme.breakpoints.mobile}) {
      max-height: 120px;
    }
  }

  border: 1px solid ${({ theme }) => theme.true.white};
  border-radius: 8px;
  .ProseMirror {
    ${RTEStyles}
  }
  .ProseMirror:focus {
    outline: none;
  }
`;

export const InputContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;

  padding: 7px;

  border: 1px solid ${({ theme }) => theme.true.white};
  border-radius: 24px;
`;

export const SelectContainer = styled.div`
  ${ReactSelectStyles}
  width: 140px;

  .react-select__dropdown-indicator {
    padding: 0;
  }

  .react-select__control {
    border-radius: 24px;
    border: none;
    min-height: unset;
    max-height: 36px;
    z-index: 2;

    background-color: ${({ theme }) => theme.ito.darkGray};

    &:hover {
      box-shadow: none;
      filter: brightness(1.1);
    }
  }
  .react-select__control--is-focused {
    border: none;
    box-shadow: none;

    filter: brightness(1.1);
  }

  .react-select__menu {
    margin: 0;
    margin-top: -36px;
    padding: 0 4px;
    padding-top: 36px;
    background-color: ${({ theme }) => theme.ito.darkGray};
    color: ${props => props.theme.darkText};
    border-radius: 24px;
    z-index: 1;
  }
  .react-select__option {
    border-radius: 24px;
  }
`;

export const SubmitButton = styled.button`
  display: grid;
  place-items: center;

  padding: 14px 0;
  border-radius: 24px;

  background-color: ${({ theme }) => theme.violet};
  color: ${({ theme }) => theme.true.white} !important;

  font-size: 1rem;
  font-weight: 600;
  line-height: 1.25rem;
`;
