import { css } from 'styled-components';

const transactions = css`
  margin-right: 1.25rem;

  &:nth-child(1) {
    width: 20rem;
  }

  &:nth-child(2) {
    width: 5rem;
  }

  &:nth-child(3) {
    width: 8rem;
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
    width: 7rem;
  }
  &:nth-child(10) {
    width: 7rem;
  }
`;

const blocks = css`
  margin-right: 1.25rem;
  @media (max-width: 1000px) {
    margin-right: 0.4rem;
  }

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
    width: 39rem;
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
    width: 5rem;
  }

  &:nth-child(2) {
    width: 6rem;
  }

  &:nth-child(3) {
    width: 10rem;
  }

  &:nth-child(4) {
    width: 14rem;
  }

  &:nth-child(5) {
    width: 10rem;
  }

  &:nth-child(6) {
    width: 10rem;
  }

  &:nth-child(7) {
    width: 10rem;
  }

  &:nth-child(8) {
    width: 10rem;
  }
  &:nth-child(9) {
    width: 8rem;
  }
  &:nth-child(10) {
    width: 4rem;
  }
`;

const assets = css`
  margin-right: 1.25rem;
  &:nth-child(1) {
    width: 8rem;
  }
  &:nth-child(2) {
    width: 8rem;
  }
  &:nth-child(3) {
    width: 10rem;
  }
  &:nth-child(4) {
    width: 8rem;
  }
  &:nth-child(5) {
    width: 10rem;
  }
  &:nth-child(6) {
    width: 15rem;
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
    width: 11rem;
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
    width: 27rem;
  }

  &:nth-child(3) {
    width: 6rem;
  }

  &:nth-child(4) {
    width: 10rem;
  }
  &:nth-child(5) {
    width: 10rem;
  }
`;

const validators = css`
  margin-right: 1.25rem;

  &:nth-child(1) {
    width: 2rem;
  }
  &:nth-child(2) {
    width: 15rem;
  }
  &:nth-child(3) {
    width: 6rem;
  }
  &:nth-child(4) {
    width: 6rem;
  }
  &:nth-child(5) {
    width: 7rem;
  }
  &:nth-child(6) {
    width: 10rem;
  }
  &:nth-child(7) {
    width: 6rem;
  }
  &:nth-child(8) {
    width: 10rem;
  }
`;

const nodes = validators;

const validator = css`
  margin-right: 7rem;
  &:nth-child(1) {
    width: 15rem;
  }
  &:nth-child(2) {
    width: 40rem;
  }
  &:nth-child(3) {
    width: 12rem;
  }
  &:nth-child(4) {
    width: 5rem;
  }
  &:last-child {
    margin-right: 0;
  }

  @media (max-width: 768px) {
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
    width: 9rem;
  }
`;

const proposals = css`
  &:nth-child(1) {
    width: 5rem;
  }
  &:nth-child(2) {
    width: 10rem;
  }
  &:nth-child(3) {
    width: 12rem;
  }
  &:nth-child(4) {
    width: 11rem;
  }
  &:nth-child(5) {
    width: 12rem;
  }
  &:nth-child(6) {
    width: 14rem;
  }
  &:nth-child(7) {
    width: 5rem;
    margin-left: 2rem;
  }
`;
const votes = css`
  margin-right: 1.25rem;
  &:nth-child(1) {
    width: 38rem;
  }
  &:nth-child(2) {
    width: 10rem;
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

const nfts = css`
  margin-right: 1.25rem;

  &:nth-child(1) {
    width: 8rem;
  }

  &:nth-child(2) {
    width: 12rem;
  }

  &:nth-child(3) {
    width: 12rem;
  }

  &:nth-child(4) {
    width: 15rem;
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
  nfts,
};

export default widths;
