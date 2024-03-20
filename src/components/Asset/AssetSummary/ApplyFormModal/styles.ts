import { ReactSelectStyles } from '@/components/Contract/Select/styles';
import { transparentize } from 'polished';
import styled, { css } from 'styled-components';

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

  min-width: min(900px, 90%);
  min-height: min(480px, 90%);

  height: fit-content;

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
`;

export const Header = styled.div`
  display: flex;
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

  display: flex;
  justify-content: space-between;
`;

export const Input = styled.textarea`
  color: ${({ theme }) => theme.true.white};
  background-color: transparent;

  border-radius: 8px;

  border: 1px solid ${({ theme }) => theme.true.white};

  padding: 6px;

  min-width: 100%;
  max-width: 100%;

  min-height: 120px;

  font-size: 1rem;
  line-height: 1.25rem;
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
