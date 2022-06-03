import styled from 'styled-components';

import { default as DefaultInput } from '@/components/Inputt';

interface CardVoteProps {
  color: string;
}

interface OptionValidatorProps {
  selected: boolean;
}

interface ProgressBarProps {
  widthPercentage: string;
  background: string;
}

export const Container = styled.div`
  padding: 3rem 10rem 5rem 10rem;

  background-color: ${props => props.theme.background};

  @media (max-width: 768px) {
    padding: 3rem 3rem 5rem 3rem;
  }
`;

export const Header = styled.div`
  display: flex;

  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const Title = styled.div`
  display: flex;

  flex-direction: row;
  align-items: center;

  gap: 0.75rem;

  div {
    cursor: pointer;

    svg {
      height: auto;
      width: auto;
    }
  }
`;

export const Input = styled(DefaultInput)`
  margin-top: 1.1rem;

  padding: 0.75rem 1rem;

  background-color: ${props => props.theme.white};

  border-color: ${props => props.theme.filter.border};
`;

const getStakedBGColor = (props: any, percent: number) => {
  if (percent < 30) {
    return props.theme.rose;
  } else if (percent < 60) {
    return props.theme.chart.lightBg;
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
  margin-left: 75%;

  position: absolute;

  top: 0.25rem;
  left: 30%;

  color: ${props => getStakedTextColor(props, props.percent)};

  font-size: 0.85rem;
`;

export const ProgressContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  align: right;
  margin-left: 2rem;
`;

export const ProgressBar = styled.div`
  width: 100%;
  background-color: #ebf1f7;
  height: 3rem;
  border-radius: 4;
  display: flex;
  flex-direction: row;
`;

export const ProgressBarContent = styled.div<ProgressBarProps>`
  height: 3rem;
  width: ${props => props.widthPercentage}%;
  background-color: ${props => props.background};
`;

export const PassThresholdText = styled.p`
  color: #b039bf;
  font-size: 11px;
  margin-bottom: 5px;
  font-weight: bold;
`;

export const VerticalLine = styled.div`
  border-left: 1.5px solid #b039bf;
  height: 20px;
`;

export const PassThresholdContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

export const StatusContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const ProgressContent = styled.div`
  height: 1.5rem;
  width: 8rem;
  margin-left: 0.2rem;

  position: relative;

  background-color: ${props => props.theme.card.text}!important;
  background-opacity: 0.5;

  border-radius: 0.25rem;
`;

export const VotesContainer = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 30px;
  margin-bottom: 1.5rem;
`;

export const VotesHeader = styled.div`
  flex-direction: column;
  display: flex;
  margin-top: 1rem;

  strong {
    opacity: 0.4;
    font-size: 0.9rem;
  }
`;

export const ProgressBarVotes = styled.div`
  margin-top: 2rem;
  margin-bottom: 2rem;

  span {
    opacity: 0.6;
    font-size: 0.8rem;
  }
`;

export const ValidatorsContainer = styled.div`
  margin-bottom: 10px;
`;

export const FiltersValidators = styled.div`
  display: flex;
  margin-top: 20px;
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

export const CardVoteContainer = styled.div`
  display: flex;
  flexdirection: row;
`;

export const CardVote = styled.div<CardVoteProps>`
  width: 13rem;
  padding: 30px 25px 30px 25px;
  border: 1px solid ${props => props.color};
  border-radius: 10px;

  &:not(:first-child) {
    margin-left: 1rem;
  }

  span {
    color: ${props => props.color};
    font-weight: bold;
  }
`;

export const PercentageText = styled.p`
  font-size: 1.4rem;
  margin-top: 0.2rem;
`;

export const QtyVotesText = styled.p`
  opacity: 0.6;
  font-size: 0.8rem;
`;

export const OptionValidator = styled.div<OptionValidatorProps>`
  background-color: ${props =>
    props.selected ? '#B039BF' : 'rgb(0, 0, 0, 0.4)'};
  padding: 6px 11px 6px 11px;
  border-radius: 13px;
  cursor: pointer;

  strong {
    font-size: 0.8rem;
    color: white;
  }

  &:not(:first-child) {
    margin-left: 0.7rem;
  }
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
  &:nth-child(3) {
    span {
      &:nth-child(2) {
        width: 80%;
      }
    }
  }

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    &:first-child {
      width: 12rem;
    }
    &:nth-child(2) {
      margin-right: 4rem;
    }
    &:nth-child(3) {
      width: 10rem;
    }

    .iconHelp:hover {
    }
    @media (max-width: 768px) {
      max-width: 100%;
    }

    strong {
      font-weight: 600;
      font-size: 0.95rem;
      color: ${props => props.theme.card.darkText};
    }

    small {
      font-weight: 400;
      font-size: 0.95rem;
    }

    a {
      color: ${props => props.theme.black};
      font-size: 0.95rem;
      font-weight: 600;
      text-decoration: none;
      div {
        background-color: ${props => props.theme.rose};
      }
    }

    p {
      color: ${props => props.theme.card.darkText};
      font-weight: 400;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const HashText = styled.span`
  color: #aa33b5;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

export const EndedDate = styled.small`
  color: red;
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: center;
  gap: 0.5rem;
`;

export const DateContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: center;
  gap: 0.5rem;
`;
