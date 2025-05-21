import { ReactSelectStyles } from '@/components/Contract/Select/styles';
import { transparentize } from 'polished';
import styled, { css } from 'styled-components';

export const Container = styled.div<{ isOpenParticipateModal: boolean }>`
  display: grid;
  place-items: center;
  transition: opacity 100ms linear;

  ${({ isOpenParticipateModal }) =>
    isOpenParticipateModal
      ? css`
          opacity: 1;
          pointer-events: all;
        `
      : css`
          opacity: 0;
          pointer-events: none;
        `}
`;

export const Background = styled.div`
  position: fixed;
  inset: 0;

  background-color: ${({ theme }) => transparentize(0.1, theme.true.newBlack)};

  z-index: 6;
`;

export const Content = styled.div`
  position: fixed;
  inset: 50%;
  transform: translate(-50%, -50%);
  z-index: 7;
  overflow-y: auto;
  scrollbar-width: none;

  min-width: min(540px, 90%);
  min-height: min(580px, 90%);

  background-color: ${({ theme }) => theme.true.newBlack};

  border-radius: 24px;
  padding: 40px;

  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const ArrowContainer = styled.div`
  display: grid;
  place-items: center;
  cursor: pointer;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.true.white};
`;

export const AssetVisualization = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  padding: 16px;
  border-radius: 8px;

  background-color: ${({ theme }) => theme.ito.darkGray};
`;

export const AssetName = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.true.white};
`;

export const BuyForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const InputRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${({ theme }) => theme.true.white};
`;

export const Fees = styled.div`
  padding-left: 16px;
  color: ${({ theme }) => theme.true.white};
  font-size: 0.75rem;
`;
export const Input = styled.input`
  color: ${({ theme }) => theme.true.white};

  padding: 6px 8px;

  width: 100%;

  font-size: 1rem;
  line-height: 1.25rem;

  &:disabled {
    color: ${({ theme }) => theme.gray};
  }
`;

export const InputContainer = styled.div<{ disabled?: boolean }>`
  display: flex;
  gap: 8px;
  align-items: center;

  padding: 7px;

  border: 1px solid ${({ theme }) => theme.true.white};
  border-radius: 24px;
`;

export const CurrencyTicker = styled.div`
  color: ${({ theme }) => theme.true.white};
  padding: 0 14px;

  min-width: 120px;
  max-width: 120px;
`;

export const NFTSelectContainer = styled.div`
  ${ReactSelectStyles}

  .react-select__dropdown-indicator {
    padding: 0;
  }

  .react-select__control {
    border-radius: 24px;
    border: none;
    min-height: unset;
    max-height: unset;
    height: unset;
    padding: 9px 15px;

    z-index: 2;

    background-color: ${({ theme }) => theme.true.newBlack};
    border: 1px solid ${({ theme }) => theme.true.white};

    &:hover {
      box-shadow: none;
      filter: brightness(1.1);
      border: 1px solid ${({ theme }) => theme.true.white};
    }
  }
  .react-select__control--is-focused {
    box-shadow: none;

    filter: brightness(1.1);
  }

  .react-select__placeholder {
    font-size: 1rem;
    line-height: 1.25rem;
  }
  .react-select__input-container {
    font-size: 1rem;
    line-height: 1.25rem;
  }

  .react-select__menu {
    padding: 0 4px;
    background-color: ${({ theme }) => theme.true.newBlack};
    color: ${({ theme }) => (theme.dark ? theme.darkText : theme.lightGray)};
    border-radius: 24px;
    z-index: 1;

    border: 1px solid ${({ theme }) => theme.true.white};
  }
  .react-select__option {
    border-radius: 24px;
    color: ${({ theme }) => (theme.dark ? theme.darkText : theme.lightGray)};

    &:hover:not(&:focus):not(&:disabled) {
      border: 1px solid
        ${({ theme }) => (theme.dark ? theme.darkText : theme.lightGray)};
    }
  }

  .react-select__single-value {
    color: ${({ theme }) => (theme.dark ? theme.darkText : theme.lightGray)};
  }

  .react-select__value-container {
    color: ${({ theme }) => (theme.dark ? theme.darkText : theme.lightGray)};
    caret-color: ${({ theme }) =>
      theme.dark ? theme.darkText : theme.lightGray};
  }

  .react-select__input {
    color: ${({ theme }) =>
      theme.dark ? theme.darkText : theme.lightGray} !important;
  }

  .react-select__dropdown-indicator {
    color: ${({ theme }) => (theme.dark ? theme.darkText : theme.lightGray)};
    &:hover {
      color: ${({ theme }) => (theme.dark ? theme.darkText : theme.lightGray)};
    }
  }
`;

export const SelectContainer = styled.div`
  ${ReactSelectStyles}
  min-width: 120px;
  max-width: 120px;

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
    color: ${({ theme }) => (theme.dark ? theme.darkText : theme.lightGray)};
    border-radius: 24px;
    z-index: 1;
  }
  .react-select__option {
    border-radius: 24px;
    color: ${({ theme }) => (theme.dark ? theme.darkText : theme.lightGray)};

    &:hover:not(&:focus):not(&:disabled) {
      border: 1px solid
        ${({ theme }) => (theme.dark ? theme.darkText : theme.lightGray)};
    }
  }

  .react-select__single-value {
    color: ${({ theme }) => (theme.dark ? theme.darkText : theme.lightGray)};
  }

  .react-select__value-container {
    color: ${({ theme }) => (theme.dark ? theme.darkText : theme.lightGray)};
    caret-color: ${({ theme }) =>
      theme.dark ? theme.darkText : theme.lightGray};
  }

  .react-select__input {
    color: ${({ theme }) =>
      theme.dark ? theme.darkText : theme.lightGray} !important;
  }

  .react-select__dropdown-indicator {
    color: ${({ theme }) => (theme.dark ? theme.darkText : theme.lightGray)};
    &:hover {
      color: ${({ theme }) => (theme.dark ? theme.darkText : theme.lightGray)};
    }
  }
`;

export const SubmitButton = styled.button<{
  secondary?: boolean;
  isDisabled?: boolean;
}>`
  display: grid;
  place-items: center;

  padding: 14px 0;
  border-radius: 24px;

  background-color: ${({ theme }) => theme.violet};
  color: ${({ theme }) => theme.true.white} !important;
  border: 1px solid ${({ theme }) => theme.violet};

  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.25rem;

  transition: filter 100ms linear;

  ${({ isDisabled }) =>
    isDisabled &&
    css`
      cursor: not-allowed;
      filter: grayscale(1);
    `}

  ${({ theme, secondary }) =>
    secondary &&
    css`
      background-color: transparent;
      color: ${theme.black};
    `}
`;

export const NoNFungileContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
