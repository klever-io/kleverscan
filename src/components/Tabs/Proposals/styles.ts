import { lighten } from 'polished';
import styled, { css } from 'styled-components';

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
  color: ${props => props.theme.darkText} !important;
  font-weight: 600;
  font-size: 0.85rem;
`;

export const ProposalStatus = styled.span`
  width: fit-content;
`;

export const ProposerDescAndLink = styled.span`
  &:hover {
    text-decoration: underline;
  }
`;

export const ProposalTime = styled.span`
  display: flex;
  flex-direction: column;
`;

const DescriptionBorder = css`
  border-bottom: 1px solid ${props => lighten(0.33, props.theme.table.text)};
`;

export const Description = styled.p<{ description: boolean }>`
  overflow: auto;
  white-space: normal !important;
  padding-bottom: 0.25rem;
  border-bottom: ${props => (props.description ? DescriptionBorder : null)};
`;

export const UpVotes = styled.span``;

export const TooltipText = styled.span`
  visibility: hidden;
  opacity: 0;
  width: fit-content !important;
  color: ${props => props.theme.white} !important;
  background-color: rgb(123, 125, 178);

  padding: 7px 7px;
  border-radius: 6px;

  position: fixed;
  z-index: 1;
  transform: translateX(-12.5%);
  transition: 0.3s ease opacity;
  pointer-events: none;
`;

export const Tooltip = styled.span`
  position: relative;

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  &:hover ${TooltipText} {
    visibility: visible;
    opacity: 1;
  }
`;

export const ProposalsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const FilterContainer = styled.div`
  display: flex;

  flex-direction: row;

  gap: 0.75rem;

  > div:last-child {
    min-width: 15rem;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: 100%;

    flex-direction: column;
  }
`;
