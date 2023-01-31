import styled from 'styled-components';

export const IconContainer = styled.div`
  cursor: pointer;
`;

export const TooltipContainer = styled.div<{ tooltip: string }>`
  position: relative;
  font-size: 0.9rem;
  margin-top: 0.4rem;
  margin-left: 1rem;

  &:hover {
    svg {
      filter: brightness(1.5);
    }
  }

  @media screen and (min-width: ${props => props.theme.breakpoints.tablet}) {
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
        color: ${props => props.theme.card.white};
        padding: 0.5rem;
        border-radius: 5px;
        z-index: 2;
        transform: translate(-50%, 40%);
      }
    }
  }

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    margin-left: 0;
  }
`;
