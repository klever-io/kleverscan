import { transparentize } from 'polished';
import styled, { css, keyframes } from 'styled-components';
import { fadeInItem } from '../DateFilter/styles';
import { DefaultCardStyleWithBorder } from '@/styles/common';

const Show = keyframes`
  0% {
    transform: scaleY(0.8);
    transform-origin: 0 0;

    opacity: 0;
    visibility: hidden;
  }

   to {
    transform: scaleY(1);
    transform-origin: 0 0;

    opacity: 1;
    visibility: visible;
  }
`;

const Hide = keyframes`
  0% {
    transform: scaleY(1);
    transform-origin: 0 0;

    opacity: 1;
    visibility: visible;
  }

  to {
    transform: scaleY(0.8);
    transform-origin: 0 0;

    opacity: 0;
    visibility: hidden;
  }
`;

export const Container = styled.div<{ maxWidth?: boolean; open?: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;

  z-index: ${props => (props.open ? 2 : 1)};

  width: 100%;
  min-width: 10rem;

  span {
    padding-bottom: 0.25rem;

    font-weight: 600;
    font-size: 0.875rem;
    color: ${props =>
      props.theme.dark ? props.theme.gray700 : props.theme.darkGray};
  }

  @media screen and (min-width: ${props => props.theme.breakpoints.tablet}) {
    max-width: fit-content;
  }

  ${props =>
    props.maxWidth &&
    css`
      max-width: 100% !important;
    `}
`;

export const Content = styled.div<{ open: boolean }>`
  ${DefaultCardStyleWithBorder}
  border-radius: 24px;

  height: 32px;
  width: 100%;

  padding: 8px 16px;

  position: relative;
  display: flex;
  z-index: 1;

  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  cursor: pointer;

  span {
    margin-top: 0.25rem;

    max-width: 10rem;

    text-overflow: ellipsis;
    white-space: nowrap;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: 100%;
  }
`;

export const SelectorContainer = styled.div<{ open: boolean }>`
  padding: 0.25rem;
  padding-left: 0.5rem;

  max-height: 15rem;

  width: 100%;
  top: 40px;
  left: 0;

  position: absolute;
  display: flex;
  overflow-y: auto;
  z-index: 1;

  flex-direction: column;

  gap: 0.25rem;

  background-color: ${props =>
    props.theme.dark ? props.theme.background : props.theme.white};

  border: 1px solid ${props => props.theme.black10};
  border-radius: 16px;

  animation: ${props => (props.open ? Hide : Show)} 0.2s
    cubic-bezier(0.645, 0.045, 0.355, 1);
  animation-fill-mode: forwards;
  span {
    padding: 0.5rem 1rem;
    max-width: none;
    text-align: center;
  }

  &::-webkit-scrollbar {
    position: absolute;
    width: 0.25rem;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
    margin: 16px 0;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 15px;
  }

  &:hover {
    &::-webkit-scrollbar-thumb {
      background: ${props => transparentize(0.75, props.theme.black)};
    }
  }
`;

export const LoadContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 0.75rem;
`;

export const Item = styled.div<{ selected: boolean }>`
  padding: 0.25rem 0.5rem;

  display: flex;

  align-items: center;
  justify-content: center;
  border: 1px solid transparent;

  border-radius: 0.5rem;

  transition: 0.2s ease;

  ${props =>
    props.selected &&
    css`
      border: 1px solid ${props => props.theme.black10};
      backdrop-filter: brightness(2);
    `}

  &:hover {
    background-color: ${props => transparentize(0.75, props.theme.lightGray)};
  }

  p {
    font-weight: 400;
    text-align: center;
    color: ${props =>
      props.selected ? props.theme.filter.item.selected : props.theme.gray700};
  }
`;

export const HiddenInput = styled.input<{
  show: boolean;
  isHiddenInput: boolean;
}>`
  width: 100%;
  position: absolute;
  visibility: ${props => (props.show ? 'visible' : 'hidden')};
  caret-color: ${props => props.theme.black};
  color: ${props => props.theme.black};

  font-size: 0.875rem;

  &:hover {
    cursor: ${props => (props.isHiddenInput ? 'text' : 'pointer')};
  }
`;

export const CloseContainer = styled.div<{ empty: boolean }>`
  display: grid;
  place-items: center;

  padding: 6px;
  margin-top: 0 !important;
  margin-left: auto;

  ${props =>
    props.empty &&
    css`
      display: none;
    `}

  svg {
    animation: ${fadeInItem} 0.2s ease-in-out;
    path {
      fill: ${props => props.theme.violet};
    }
  }
`;

export const ArrowDownContainer = styled.div<{ open: boolean }>`
  display: grid;
  place-items: center;

  padding: 6px;
  margin-top: 0 !important;

  svg {
    transition: 0.2s ease;

    transform: rotate(${props => (props.open ? 0 : 180)}deg);

    path {
      fill: ${props => props.theme.black};
    }
  }
`;
