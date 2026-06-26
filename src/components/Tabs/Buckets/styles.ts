import styled from 'styled-components';

export const Status = styled.span<{ staked: boolean }>`
  font-weight: 600;
  color: ${props =>
    props.theme.table[
      (props.staked ? 'green' : 'red') as keyof typeof props.theme.table
    ]} !important;
`;

export const ContractContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const ValidatorStatusBadge = styled.span<{ status: string }>`
  font-size: 0.7rem;
  font-weight: 600;
  padding: 1px 5px;
  border-radius: 4px;
  width: fit-content;

  ${props =>
    props.status === 'jailed' &&
    `
    color: ${props.theme.table.fail};
    background-color: ${props.theme.table.fail}22;
  `}

  ${props =>
    props.status === 'inactive' &&
    `
    color: ${props.theme.table.icon};
    background-color: ${props.theme.table.icon}22;
  `}
`;
