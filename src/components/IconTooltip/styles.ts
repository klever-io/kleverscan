import styled from 'styled-components';

export const IconContainer = styled.div`
  cursor: pointer;
`;

export const TooltipContainer = styled.div<{ tooltip: string }>`
  position: relative;
  font-size: 0.9rem;
  margin-left: 0.8rem;

  &:hover {
    svg {
      filter: brightness(1.5);
    }
  }

  @media screen and (min-width: 1025px) {
    &:hover {
      &::before {
        content: '';
        position: absolute;
        top: 1.25rem;
        left: 0.25rem;
        width: 0;
        height: 0;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-bottom: 10px solid ${props => props.theme.card.background};
        transform: translate(-25%, 100%);
      }

      &::after {
        content: '${props => props.tooltip}';
        position: absolute;
        top: 1rem;
        left: 0;
        background-color: ${props => props.theme.card.background};
        color: ${props => props.theme.white};
        padding: 0.5rem;
        border-radius: 5px;
        z-index: 500;
        transform: translate(-50%, 40%);
      }
    }
  }
`;
