import { BsMoonFill, BsSunFill } from 'react-icons/bs';
import styled from 'styled-components';

export const MoonIcon = styled(BsMoonFill)`
  height: 100%;
  color: ${props => props.theme.navbar.text};
`;

export const SunIcon = styled(BsSunFill)`
  height: 100%;
  color: ${props => props.theme.navbar.text};
`;

export const Container = styled.div<{ isConnected: boolean | null }>`
  display: flex;
  flex-direction: row;
  align-items: center;

  gap: 0.5rem;

  user-select: none;
  margin-top: ${props => (props.isConnected === true ? 0 : '0.41rem')};
`;

export const IconContainer = styled.div`
  height: 1.25rem;

  border-left: 1px solid ${props => props.theme.navbar.text};
  padding-left: 0.5rem;

  cursor: pointer;
`;

export const LanguageContainer = styled.div`
  height: 1rem;

  font-weight: 400;

  color: ${props => props.theme.navbar.text};

  cursor: pointer;
`;
