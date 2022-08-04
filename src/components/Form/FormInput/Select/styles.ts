// import { lighten } from 'polished';
import styled, { css } from 'styled-components';
import { lighten } from 'polished';

const ReactSelect = css`
  .react-select {
    margin: 0.25rem 0;
    width: 100%;
  }
  .react-select-empty {
    margin: 0.25rem 0;
    width: 100%;
    .react-select__control {
      border: 1px dashed ${props => props.theme.card.border};
      filter: opacity(0.7);
      &:hover:not(:focus):not(:disabled) {
        filter: opacity(1) brightness(1.2);
      }
    }
  }
  .react-select__control {
    background-color: ${props => props.theme.card.background};
    border-radius: 0.5rem;
    border: 1px solid ${props => props.theme.card.border};
    height: 2.5rem;
    width: 100%;
    padding: 0 1.5rem;
    color: ${props => props.theme.white};
  }
  .react-select__control--is-focused {
    border: none;
    border-radius: 0.5rem;
    height: 2.5rem;
    width: 100%;
    color: ${props => props.theme.white};
  }
  .react-select__indicator-separator {
    display: none;
  }
  .react-select__value-container {
    padding: 0.125rem;
    height: 2rem;
    width: 100%;
    border-radius: 0.5rem;
    border: none;
    color: ${props => props.theme.white};
    caret-color: ${props => props.theme.white};
  }
  .react-select__input {
    color: ${props => props.theme.white} !important;
  }
  .react-select__menu {
    background-color: ${props => props.theme.card.background};
    border-radius: 0.5rem;
    border: none;
    color: ${props => props.theme.white};
    overflow: overlay;
  }
  .react-select__option {
    background-color: ${props => props.theme.card.background};
    border-radius: 0.5rem;
    border: none;
    color: ${props => props.theme.white};
    &:hover:not(:focus):not(:disabled) {
      filter: brightness(1.2);
    }
  }
  .react-select__single-value {
    color: ${props => props.theme.white};
  }
  .react-select--is-disabled {
    filter: opacity(0.5) grayscale(0.75) brightness(1.1);
  }
`;

export const Container = styled.div`
  position: relative;

  height: 100%;
  width: 100%;
  display: flex;

  flex-direction: column;
  span {
    padding-bottom: 0.25rem;

    color: ${props => props.theme.filter.title};
    font-weight: 600;
    font-size: 0.9rem;
  }
  ${ReactSelect}
  .react-select__control {
    min-height: 3rem;
    background-color: unset;
    border-color: ${({ theme }) => theme.card.background};

    transition: 0.2s ease-in-out;
    &:hover {
      border-color: ${({ theme }) => theme.input.border.dark};
      box-shadow: 0 0 0.5rem -0.125rem ${props => lighten(0.1, props.theme.card.background)};
    }
  }
  .react-select__control--is-focused {
    color: ${props => props.theme.white};
    border: 1px solid ${({ theme }) => theme.input.border.dark};
    box-shadow: 0 0 0.5rem -0.125rem ${props => lighten(0.1, props.theme.card.background)};
  }
`;

export const HiddenInput = styled.input`
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: -1;
  pointer-events: none;
  color: transparent;
  border: none;
  outline: none;
`;
