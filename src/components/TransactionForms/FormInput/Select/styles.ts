// import { lighten } from 'polished';
import { transparentize } from 'polished';
import styled, { css } from 'styled-components';

export const Container = styled.div<{ $error?: boolean; isOpenMenu?: boolean }>`
  position: relative;

  height: 100%;
  width: 100%;
  display: flex;

  flex-direction: column;
  z-index: ${({ isOpenMenu }) => (isOpenMenu ? 10 : 1)};
  span {
    padding-bottom: 0.25rem;

    color: ${props => props.theme.darkText};
    font-weight: 600;
    font-size: 0.9rem;
  }

  ${({ $error }) =>
    $error &&
    css`
      .react-select__control {
        border-color: ${props => props.theme.red};
        background-color: ${props => transparentize(0.9, props.theme.red)};
      }
    `}
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
