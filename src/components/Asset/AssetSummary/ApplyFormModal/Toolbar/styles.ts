import styled from 'styled-components';

interface ToolbarButtonProps {
  active: boolean;
}

export const ToolbarStyle = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
  color: ${({ theme }) => theme.true.white};
  background-color: transparent;

  border-radius: 8px;

  min-width: 100%;
  max-width: 100%;
  line-height: 1.25rem;
`;

export const ToolbarButton = styled.button<ToolbarButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 1px solid #f9fafb;
  padding: 6px;
  color: ${props => (props.active ? 'black' : 'white')};
  background-color: ${props => (props.active ? 'white' : 'transparent')};
`;
