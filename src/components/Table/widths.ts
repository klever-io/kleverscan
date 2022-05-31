import { css } from 'styled-components';

const transactions = css`
  margin-right: 1.25rem;

  &:nth-child(1) {
    width: 10rem;
  }

  &:nth-child(2) {
    width: 5rem;
  }

  &:nth-child(3) {
    width: 7rem;
  }

  &:nth-child(4) {
    width: 10rem;
  }

  &:nth-child(5) {
    width: 1rem;
  }

  &:nth-child(6) {
    width: 10rem;
  }

  &:nth-child(7) {
    width: 7rem;
  }

  &:nth-child(8) {
    width: 8rem;
  }
  &:nth-child(9) {
    width: 8rem;
  }
`;

const blocks = css`
  margin-right: 1.25rem;

  &:nth-child(1) {
    width: 5rem;
  }

  &:nth-child(2) {
    width: 7rem;
  }

  &:nth-child(3) {
    width: 12rem;
  }

  &:nth-child(4) {
    width: 7rem;
  }

  &:nth-child(5) {
    width: 7rem;
  }

  &:nth-child(6) {
    width: 8rem;
  }

  &:nth-child(7) {
    width: 7rem;
  }

  &:nth-child(8) {
    width: 8rem;
  }

  &:nth-child(9) {
    width: 8rem;
  }
`;

const accounts = css`
  margin-right: 1.25rem;

  &:nth-child(1) {
    width: 45rem;
  }

  &:nth-child(2) {
    width: 8rem;
  }

  &:nth-child(3) {
    width: 12rem;
  }

  &:nth-child(4) {
    width: 10rem;
  }
`;

const assetsPage = css`
  padding-right: 0.5rem;

  &:nth-child(1) {
    width: 4rem;
  }

  &:nth-child(2) {
    width: 4rem;
  }

  &:nth-child(3) {
    width: 10rem;
  }

  &:nth-child(4) {
    width: 16rem;
  }

  &:nth-child(5) {
    width: 8rem;
  }

  &:nth-child(6) {
    width: 8rem;
  }

  &:nth-child(7) {
    width: 8rem;
  }

  &:nth-child(8) {
    width: 10rem;
  }
`;

const assets = css`
  margin-right: 1.25rem;
  &:nth-child(1) {
    width: 5rem;
  }
  &:nth-child(2) {
    width: 5rem;
  }
  &:nth-child(3) {
    width: 8rem;
  }
  &:nth-child(4) {
    width: 7rem;
  }
  &:nth-child(5) {
    width: 5rem;
  }
  &:nth-child(6) {
    width: 12rem;
  }
  &:nth-child(7) {
    width: 12rem;
  }
`;

const buckets = css`
  margin-right: 1.25rem;

  &:nth-child(1) {
    width: 10rem;
  }
  &:nth-child(2) {
    width: 5rem;
  }
  &:nth-child(3) {
    width: 5rem;
  }
  &:nth-child(4) {
    width: 20rem;
  }
  &:nth-child(5) {
    width: 10rem;
  }
  &:nth-child(6) {
    width: 10rem;
  }
  &:nth-child(7) {
    width: 16rem;
  }
`;

const holders = css`
  margin-right: 1.25rem;

  &:nth-child(1) {
    width: 3rem;
  }

  &:nth-child(2) {
    width: 30rem;
  }

  &:nth-child(3) {
    width: 7rem;
  }

  &:nth-child(4) {
    width: 10rem;
  }
`;

const validators = css`
  margin-right: 1.25rem;

  &:nth-child(1) {
    width: 3rem;
  }
  &:nth-child(2) {
    width: 10rem;
  }
  &:nth-child(3) {
    width: 6rem;
  }
  &:nth-child(4) {
    width: 6rem;
  }
  &:nth-child(5) {
    width: 10rem;
  }
  &:nth-child(6) {
    width: 12rem;
  }
  &:nth-child(7) {
    width: 8rem;
  }
  &:nth-child(8) {
    width: 16rem;
  }
  &:nth-child(9) {
    width: 1rem;
  }
`;

const nodes = validators;

const validator = css`
  margin-right: 1.25rem;
  &:nth-child(1) {
    width: 12rem;
    max-width: 7rem;

  }
  &:nth-child(2) {
    width: 60%;
    max-width: 40rem;
  }
  &:nth-child(3) {
    width: 10rem;
    max-width: 10rem;
  }

  @media (max-width: 768px) {
  :nth-child(2) {
    width: 20rem;
  }
  }
`;

const networkParams = css`
  margin-right: 1.25rem;

  &:nth-child(1) {
    width: 4rem;
  }

  &:nth-child(2) {
    width: 45rem;
  }

  &:nth-child(3) {
    width: 8rem;
  }
`;

const proposals = css`
  padding-right: 0.5rem;
  &:nth-child(1) {
    width: 4rem;
  }
  &:nth-child(2) {
    width: 18rem;
  }
  &:nth-child(3) {
    width: 10rem;
  }
  &:nth-child(4) {
    width: 12rem;
  }
  &:nth-child(5) {
    width: 10rem;
  }
  &:nth-child(6) {
    width: 5rem;
  }
`;
const votes = css`
  margin-right: 1.25rem;
  &:nth-child(1) {
    width: 38rem;
  }
  &:nth-child(2) {
    width: 38rem;
  }
  &:nth-child(3) {
    width: 14rem;
  }
`;

const delegations = css`
  margin-right: 1.25rem;
  &:nth-child(1) {
    width: 12rem;
  }
  &:nth-child(2) {
    width: 40rem;
  }
  &:nth-child(3) {
    width: 10rem;
  }
`;

const widths = {
  transactions,
  blocks,
  accounts,
  assetsPage,
  assets,
  buckets,
  holders,
  validators,
  validator,
  nodes,
  networkParams,
  proposals,
  votes,
  delegations,
};

export default widths;
