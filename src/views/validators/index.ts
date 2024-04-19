import styled from 'styled-components';

export const ProgressContainer = styled.div`
  display: flex;
  @media (min-width: 1600px) and (max-width: 1800px) {
    min-width: 10rem;
  }
  flex-direction: row;
  align-items: center;

  gap: 0.5rem;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: 100%;

    span {
      width: fit-content !important;
      min-width: 4rem !important;
    }
  }
`;

export const ProgressPercentage = styled.div<{ textColor: string }>`
  color: ${props => `${props.textColor}`};
  position: relative;
  margin-left: 0.5rem;

  min-width: fit-content;
  overflow: unset !important;
`;

export const ProgressContent = styled.div`
  height: 1.5rem;
  width: 10vw;

  position: relative;

  background-color: ${props =>
    props.theme.dark ? props.theme.darkGray : props.theme.lightGray};

  border-radius: 0.25rem;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    width: 100%;
  }
`;

export const ProgressIndicator = styled.div<{ percent: number }>`
  height: 100%;
  width: ${props => `${props.percent}%`};

  background-color: ${props => props.theme.violet};
  border-radius: 0.25rem;

  opacity: 0.6;
`;

export const CircularProgressContainer = styled.div`
  position: relative;
  display: flex;
  width: 50px;
  height: 50px;
`;
