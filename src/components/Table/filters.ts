import { Contract } from '@/types/contracts';
import { css } from 'styled-components';

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

const createAsset = css`
  &:nth-child(${defaultChild}) {
    width: 10rem;
  }

  &:nth-child(${defaultChild + 1}) {
    width: 10rem;
  }

  &:nth-child(${defaultChild + 2}) {
    width: 5rem;
  }
`;

const createValidator = css`
  &:nth-child(${defaultChild}) {
    width: 12rem;
  }

  &:nth-child(${defaultChild + 1}) {
    width: 7rem;
  }

  &:nth-child(${defaultChild + 2}) {
    width: 5rem;
  }
`;

const freeze = css`
  &:nth-child(${defaultChild}) {
    width: 10rem;
  }

  &:nth-child(${defaultChild + 1}) {
    width: 7rem;
  }
`;

const unfreeze = css`
  &:nth-child(${defaultChild}) {
    width: 10rem;
  }

  &:nth-child(${defaultChild + 1}) {
    width: 10rem;
  }
`;

const withdraw = css`
  &:nth-child(${defaultChild}) {
    width: 10rem;
  }

  &:nth-child(${defaultChild + 1}) {
    width: 10rem;
  }
`;

const filterWidths = {
  [Contract.Transfer]: transfer,
  [Contract.CreateAsset]: createAsset,
  [Contract.CreateValidator]: createValidator,
  [Contract.ValidatorConfig]: createValidator,
  [Contract.Freeze]: freeze,
  [Contract.Unfreeze]: unfreeze,
  [Contract.Delegate]: unfreeze,
  [Contract.Undelegate]: unfreeze,
  [Contract.Withdraw]: withdraw,
};

export default filterWidths;
