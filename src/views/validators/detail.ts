import styled from 'styled-components';

interface IRatingProps {
  rate: string;
}

export const TitleContent = styled.div`
  display: flex;

  flex-direction: row;

  align-items: center;

  gap: 0.5rem;
`;

export const TitleInformation = styled.div`
  display: flex;

  flex-direction: column;

  gap: 0.25rem;
`;

export const ValidatorTitle = styled.div`
  display: flex;

  flex-direction: row;
  align-items: center;

  gap: 1rem;

  div {
    padding: 0.5rem 1rem;

    display: flex;

    align-items: center;
    justify-content: center;

    background-color: ${props => props.theme.table.success};

    color: ${props => props.theme.white};
    font-weight: 400;
    font-size: 0.85rem;

    border-radius: 1rem;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const ValidatorDescription = styled.span`
  font-weight: 400;

  opacity: 0.6;
`;

export const CardContainer = styled.div`
  margin-top: 2rem;

  display: flex;

  flex-direction: column;
`;

export const CardContent = styled.div`
  margin: 1.25rem 0;

  background-color: ${props => props.theme.white};

  border-radius: 0.75rem;
`;

export const Row = styled.div`
  width: 100%;

  padding: 1.5rem 2rem;

  display: flex;

  flex-direction: row;
  align-items: center;

  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.card.border};

    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
  }

  span {
    text-transform: capitalize;
    &:first-child {
      width: 10rem;
    }

    @media (max-width: ${props => props.theme.breakpoints.mobile}) {
      max-width: 100%;
    }

    overflow: hidden;

    text-overflow: ellipsis;
    white-space: nowrap;

    strong {
      font-weight: 600;
      font-size: 0.95rem;
      color: ${props => props.theme.darkText};
    }

    small {
      font-weight: 400;
      font-size: 0.95rem;
      color: ${props => props.theme.darkText};
    }

    a {
      text-transform: none;
      color: ${props => props.theme.black};
      font-size: 0.95rem;
      font-weight: 600;
    }

    p {
      color: ${props => props.theme.darkText};
      font-weight: 400;
    }
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const CenteredRow = styled.div`
  display: flex;

  flex-direction: row;
  align-items: center;

  gap: 0.5rem;

  strong {
    font-size: 1rem;
    font-weight: 600;
  }

  p {
    font-weight: 600;
    font-size: 0.85rem;
  }

  span {
    width: 33rem !important;

    @media (max-width: ${props => props.theme.breakpoints.mobile}) {
      max-width: 80% !important;
    }
  }

  svg {
    cursor: pointer;
  }

  a {
    color: ${props => props.theme.black};
    font-size: 0.95rem;
    font-weight: 600;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: 100%;
  }
`;

export const Rating = styled.p.attrs<IRatingProps>(props => ({
  rate: props.rate,
}))<IRatingProps>`
  padding: 0.5rem 1rem;

  display: flex;

  align-items: center;
  justify-content: center;

  background-color: ${props =>
    props.rate === 'green'
      ? props.theme.table.success
      : props.rate === 'yellow'
        ? props.theme.table.pending
        : props.theme.red};

  color: ${props => props.theme.white} !important;
  font-weight: 400;

  border-radius: 1rem;
`;

const getStakedBGColor = (props: any, percent: number) => {
  if (percent < 30) {
    return props.theme.rose;
  } else if (percent < 60) {
    return props.theme.violet;
  } else if (percent < 90) {
    return props.theme.purple;
  } else {
    return props.theme.input.activeShadow;
  }
};

const getStakedTextColor = (props: any, percent: number) => {
  if (percent < 60) {
    return props.theme.black;
  } else {
    return props.theme.white;
  }
};

export const StakedIndicator = styled.div<{ percent: number }>`
  height: 100%;
  width: ${props => `${props.percent}%`};

  background-color: ${props => getStakedBGColor(props, props.percent)};
  border-radius: 0.25rem;

  opacity: 0.6;
`;

export const PercentIndicator = styled.div<{ percent: number }>`
  margin: 0 auto;

  position: absolute;

  top: 0.25rem;
  left: 30%;

  color: ${props => getStakedTextColor(props, props.percent)};

  font-size: 0.85rem;
`;

export const TableContainer = styled.section`
  display: flex;

  flex-direction: column;

  gap: 1.5rem;

  color: ${props => props.theme.black};
  h3 {
    margin-top: 2rem;
  }
`;

export const AddressContainer = styled.div`
  display: flex;
  gap: 0.4rem;
  align-items: center;
  > div {
    width: 24px;
    height: 24px;
  }
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    justify-content: flex-end;
  }
`;
