// import { lighten } from 'polished';
import styled, { css } from 'styled-components';
import { lighten, transparentize } from 'polished';

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
  .react-select__control--is-focused {
    border: none;
    border-radius: 0.5rem;
    height: 2.5rem;
    width: 100%;
    color: ${props => props.theme.input.border.dark};
  }

  .react-select__control {
    border-radius: 0.5rem;
    border: 1px solid ${props => props.theme.input.border.dark};
    height: 2.5rem;
    width: 100%;
    padding: 0 0.625rem;
    color: ${props => props.theme.input.border.dark};

    min-height: 3rem;
    background-color: ${props => props.theme.white};

    transition: 0.2s ease-in-out;
    &:hover {
      border-color: ${({ theme }) => theme.input.border.dark};
      box-shadow: 0 0 0.5rem -0.125rem ${props => lighten(0.6, props.theme.card.background)};
    }
  }
  .react-select__control--is-focused {
    color: ${props => props.theme.input.border.dark};
    border: 1px solid ${({ theme }) => theme.input.border.dark};
    box-shadow: 0 0 0.5rem -0.125rem ${props => lighten(0.6, props.theme.card.background)};
  }
  .react-select__indicator-separator {
    display: none;
  }
  .react-select__dropdown-indicator {
    color: ${props => props.theme.input.border.dark};
    &:hover {
      color: ${props => props.theme.input.border.dark};
    }
  }
  .react-select__value-container {
    padding: 0.125rem;
    height: 2rem;
    width: 100%;
    border-radius: 0.5rem;
    border: none;
    color: ${props => props.theme.input.border.dark};
    caret-color: ${props => props.theme.input.border.dark};
  }
  .react-select__input {
    color: ${props => props.theme.input.border.dark} !important;
  }
  .react-select__menu {
    background-color: ${props => props.theme.white};
    border-radius: 0.5rem;
    border: none;
    color: ${props => props.theme.input.border.dark};
    overflow: overlay;
  }
  .react-select__option {
    background-color: unset;
    border-radius: 0.5rem;
    border: 1px solid transparent;
    color: ${props => props.theme.input.border.dark};
    &:hover:not(:focus):not(:disabled) {
      border: 1px solid ${props => props.theme.input.border.dark};
    }
  }
  .react-select__single-value {
    color: ${props => props.theme.input.border.dark};
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

  user-select: none;

  flex-direction: column;
  span {
    padding-bottom: 0.25rem;

    color: ${props => props.theme.filter.title};
    font-weight: 600;
    font-size: 0.9rem;
  }
  ${ReactSelect}
`;
