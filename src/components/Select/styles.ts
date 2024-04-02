import styled from 'styled-components';
import { ReactSelectStyles } from '../Contract/Select/styles';

export const Container = styled.div<{
  $creatable?: boolean;
}>`
  ${ReactSelectStyles}
`;
