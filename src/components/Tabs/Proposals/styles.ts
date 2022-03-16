import filterWidths from '@/components/Table/filters';
import { ITableType } from '@/components/Table/styles';
import widths from '@/components/Table/widths';
import styled from 'styled-components';

export const Row = styled.div<ITableType>`
  padding: 1rem 1.5rem;
  font-family: Rubik;
  height: 198px;   
  display: flex;

  flex-direction: row;
  align-items: center;

  background-color: ${props => props.theme.white};

  border-radius: 0.5rem;

  span,
  a {
    /* flex: 1; */
    overflow: hidden;
    white-space: nowrap;
    


    font-size: 0.95rem;
    color: ${props => props.theme.black};

    ${props => widths[props.type]};
    ${props =>
      props.filter &&
      props.filter.value !== 'all' &&
      filterWidths[props.filter.name]}
      

      a {
        color: ${props => props.theme.purple};
        font-weight: 600;
        font-size: 0.7rem;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 24px;
      }
    

    small {
      color: ${props => props.theme.table.text};
      font-size: 11px;
      display: flex;
      
    }

    strong {
      font-weight: 400;
      font-size: 0.95rem;
      color: ${props => props.theme.table.text};
    }

    p {
      font-weight: 600;
      color: ${props => props.theme.black};
      font-family: Rubik;
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      line-height: 24px;
    }
  }
  .endTime {
      color: #F43942;
    }
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
const getStakedTextColor = (props: any, percent: number) => {
  if (percent < 60) {
    return props.theme.black;
  } else {
    return props.theme.white;
  }
};

export const Proposer = styled.p`
  color: ${props => props.theme.table.text} !important;
  font-weight: 600;
  font-size: 0.85rem;
`;

export const ProposalStatus = styled.span`
  width: 18rem !important;
`;

export const ProposerDescAndLink = styled.span`
  width: 23rem !important;
`;

export const UpVotes = styled.span`
  width: 11.5rem !important;
`;