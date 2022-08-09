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
  opacity: ${props => props.loading ? 0.4 : 1};
`;

export const ExtraOptionContainer = styled.div`
  display: flex;
  flex-direction: column;

  margin-top: 1rem;
  margin-bottom: 1rem;
  border-radius: 12px;
  padding-top: 1rem;
  padding-bottom: 1rem;
  background-color: ${props => props.theme.white};
  padding-left: 1rem;
  padding-right: 1.4rem;
  padding-top: 1.7rem;
  padding-bottom: 1.7rem;
  box-shadow: 0 0 0.5rem -0.125rem ${props => lighten(0.8, '#000')};
`;

export const InputLabel = styled.label`
  user-select: none;
  font-size: small;
  font-weight: 600;

  display: flex;
  gap: 0.5rem;

  color: ${({ theme }) => theme.input.border.dark};

  transition: transform 0.2s ease;
`;

export const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  &:not(:first-child) {
    margin-top: 1rem;
  }

  label {
    margin-bottom: 0.75rem;
  }
`;

export const DataField = styled.textarea`
  width: 100%;
  min-height: 10rem;
  color: ${({ theme }) => theme.input.border.dark};
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.input.border.dark};
`;

export const ToggleContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  padding: 0.75rem 2rem;
  gap: 1rem;
  color: ${props => props.theme.input.text};
  user-select: none;
`;