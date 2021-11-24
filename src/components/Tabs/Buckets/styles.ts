import styled from 'styled-components';

export const Status = styled.span<{ staked: boolean }>`
  font-weight: 600;
  color: ${props =>
    props.theme.table[props.staked ? 'green' : 'red']} !important;
`;
