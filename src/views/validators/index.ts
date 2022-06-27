import styled from 'styled-components';

export const ProgressContainer = styled.div<{ textColor: string }>`
  display: flex;
  width: 15rem;
  @media (min-width:1600px) and (max-width: 1800px) {
    width: 12rem;
  }
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  span {
    color: ${props => `${props.textColor}`};
  }

  gap: 0.5rem;
`;

export const ProgressContent = styled.div`
  height: 1.5rem;
  width: 10rem;

  position: relative;

  background-color: ${props => props.theme.background};

  border-radius: 0.25rem;
`;

export const ProgressIndicator = styled.div<{ percent: number }>`
  height: 100%;
  width: ${props => `${props.percent}%`};

  background-color: ${props => props.theme.tab.indicator};
  border-radius: 0.25rem;

  opacity: 0.6;
`;
