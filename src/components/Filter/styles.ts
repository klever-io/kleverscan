import { DefaultCardStyles } from '@/styles/common';
import { transparentize } from 'polished';
import styled, { css, keyframes } from 'styled-components';

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

export const Container = styled.div<{ maxWidth?: boolean }>`
  display: flex;
  flex-direction: column;

  width: 100%;
  min-width: 10rem;

  span {
    padding-bottom: 0.25rem;

    color: ${props => props.theme.darkText};
    font-weight: 600;
    font-size: 0.9rem;
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
  ${DefaultCardStyles}
  width: 100%;
  height: 2.8rem;

  padding: 0.5rem 1rem;
  padding-right: 0;

  position: relative;
  display: flex;

  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  border-radius: 0.5rem;

  cursor: pointer;

  span {
    margin-top: 0.25rem;

    max-width: 10rem;

    text-overflow: ellipsis;
    white-space: nowrap;

    color: ${props => props.theme.filter.text};
    font-weight: 600;
  }

  svg {
    transition: 0.2s ease;

    transform: rotate(${props => (props.open ? 0 : 180)}deg);
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: 100%;
  }
`;

export const SelectorContainer = styled.div<{ open: boolean }>`
  padding: 0.25rem;

  width: 100%;
  max-height: 15rem;

  top: 2.8rem;
  left: 0;

  position: absolute;
  display: flex;
  overflow-y: auto;
  z-index: 2;

  flex-direction: column;

  gap: 0.25rem;

  background-color: ${props => props.theme.white};

  border: 1px solid ${props => props.theme.lightGray};
  border-radius: 0.5rem;

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
  background-color: ${props =>
    props.selected && transparentize(0.75, props.theme.lightGray)};

  border-radius: 0.5rem;

  transition: 0.2s ease;

  &:hover {
    background-color: ${props => transparentize(0.75, props.theme.lightGray)};
  }

  p {
    font-weight: 400;
    text-align: center;
    color: ${props =>
      props.selected
        ? props.theme.filter.item.selected
        : props.theme.filter.item.text};
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
  &:hover {
    cursor: ${props => (props.isHiddenInput ? 'text' : 'pointer')};
  }
`;

export const ArrowDownContainer = styled.div`
  padding: 0.5rem 1rem;
  margin-top: 0 !important;
`;
