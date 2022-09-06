import styled from 'styled-components';

export const SectionTitle = styled.div`
  font-size: 1.2rem;
  width: calc(100% - 2rem);
  font-weight: 600;
  display: flex;
  color: ${props => props.theme.darkText};
  position: absolute;
  top: 1rem;
  left: 1rem;
  user-select: none;
  gap: 0.5rem;
`;
