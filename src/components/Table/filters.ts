import { css } from 'styled-components';

import { Contract } from '@/types/index';

const defaultChild = 8;

const transfer = css`
  &:nth-child(${defaultChild}) {
    width: 5rem;
  }

  &:nth-child(${defaultChild + 1}) {
    width: 5rem;
  }

  &:nth-child(${defaultChild + 2}) {
    width: 5rem;
  }
`;

const filterWidths = {
  [Contract.Transfer]: transfer,
};

export default filterWidths;
