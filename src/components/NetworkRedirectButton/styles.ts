import styled from 'styled-components';
import { DropdownContainer, DropdownMenu, Item } from '../Header/styles';

export const ButtonContainer = styled.button`
  background-color: ${props =>
    props.theme.dark ? props.theme.blue : props.theme.lightGray};
  padding: 0.6rem;
  border-radius: 8px;
  font-family: Manrope;
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  margin-left: 2rem;

  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    margin-left: initial;
  }

  svg {
    path {
      fill: ${props =>
        props.theme.dark ? props.theme.true.white : props.theme.true.black};
    }
  }
`;

export const ButtonDropdownItem = styled.div`
  padding: 0.5rem;
  display: flex;
  margin-left: 1rem;
  min-width: 8rem;
  width: 100%;
`;

export const ButtonItem = styled(Item)`
  color: ${props =>
    props.theme.dark ? props.theme.true.white : props.theme.true.black};
  z-index: 2;
`;

export const NetworkDropdown = styled(DropdownContainer)`
  animation: none;
`;

export const ButtonDropdownMenu = styled(DropdownMenu)`
  padding: 0.8rem 0;
  font-size: 0.9rem;
  border: ${props =>
    props.theme.dark ? 'none' : `1px solid ${props.theme.shadow}`};
  a {
    &:hover {
      filter: brightness(4);
      color: ${props => props.theme.blue};
    }
  }
  transform: translate(-45%, 15%);
  @media (min-width: ${props => props.theme.breakpoints.mobile}) {
    transform: translate(-50%, 15%);
  }
  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    transform: translate(10%, 15%);
  }

  &::before {
    content: '';
    position: absolute;
    background-color: ${props =>
      props.theme.dark ? props.theme.blue : props.theme.true.white};
    z-index: 15;
    border-left: 1px solid
      ${props => (props.theme.dark ? 'none' : props.theme.shadow)};
    border-top: 1px solid
      ${props => (props.theme.dark ? 'none' : props.theme.shadow)};
    width: 0.7rem;
    height: 0.7rem;
    transform: rotate(45deg);
    border-top-left-radius: 3px;
    bottom: 5.7rem;
    right: 0.5rem;
  }
`;
