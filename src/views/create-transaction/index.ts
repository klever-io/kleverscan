import { Card, CardContainer as CardsContainer } from '@/styles/common';
import { transparentize } from 'polished';
import styled from 'styled-components';

export const CardContainer = styled.div`
  width: 100%;
  padding: 2rem 0;

  font-family: Rubik;
  font-family: Rubik;
  font-style: normal;
  font-weight: normal;
  font-size: 15px;
`;

export const WarningContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 1rem;

  padding: 1rem 2rem;

  border-radius: 1rem;

  border: 1px solid ${props => transparentize(0.1, props.theme.status.warning)};
  background: ${props => transparentize(0.8, props.theme.status.warning)};
  color: ${props => props.theme.darkText};

  svg {
    min-width: 32px;
  }
`;

export const WarningText = styled.div`
  font-family: Rubik;
  font-style: normal;
  font-weight: normal;
  font-size: 15px;
  line-height: 22px;

  a {
    color: ${props => props.theme.violet};
    text-decoration: underline;
  }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const CreateTxCard = styled(Card)`
  max-width: 1200px;
`;

export const CreateTxCardContainer = styled(CardsContainer)`
  justify-content: center;
`;

export const QueueItemContainer = styled.div<{
  visible: boolean;
}>`
  width: 100%;
  display: ${props => (props.visible ? 'block' : 'none')};
`;

export const QueueOutContainer = styled.div`
  width: 100%;
`;
