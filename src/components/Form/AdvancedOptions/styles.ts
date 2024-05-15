import { DefaultCardStyleWithBorder } from '@/styles/common';
import { lighten } from 'polished';
import styled from 'styled-components';

interface IContainer {
  loading?: boolean;
}

export const Container = styled.div<IContainer>`
  margin: auto;
  width: 90%;
  max-width: 1200px;
  padding: 2rem 0;
  opacity: ${props => (props.loading ? 0.4 : 1)};
`;

export const ExtraOptionContainer = styled.div`
  ${DefaultCardStyleWithBorder}
  display: flex;
  flex-direction: column;

  gap: 1rem;

  margin-top: 1rem;
  margin-bottom: 1rem;
  border-radius: 12px;
  padding-top: 1rem;
  padding-bottom: 1rem;
  padding-left: 1rem;
  padding-right: 1.4rem;
  padding-top: 1.7rem;
  padding-bottom: 1.7rem;
`;

export const InputLabel = styled.label`
  user-select: none;
  font-size: small;
  font-weight: 600;

  width: 100%;

  display: flex;
  gap: 0.5rem;

  color: ${({ theme }) => theme.darkText};

  transition: transform 0.2s ease;
`;

export const FieldContainer = styled.div`
  width: 100%;

  position: relative;
`;

export const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: row;
  }
`;

export const DataField = styled.textarea`
  width: 100%;
  min-height: 10rem;
  color: ${({ theme }) => theme.darkText};
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.darkText};
`;

export const ToggleContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  padding: 0.75rem 2rem;
  gap: 1rem;
  color: ${props => props.theme.darkText};
  user-select: none;
`;
