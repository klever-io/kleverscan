import { css } from 'styled-components';

const transactions = css`
  margin-right: 1.25rem;

  &:nth-child(1) {
    min-width: 17rem;
    max-width: 20rem;
  }

  &:nth-child(2) {
    min-width: 5rem;
    max-width: 5rem;
  }

  &:nth-child(3) {
    min-width: 8rem;
    max-width: 8rem;
  }

  &:nth-child(4) {
    min-width: 10rem;
    max-width: 10rem;
  }

  &:nth-child(5) {
    min-width: 1rem;
    max-width: 1rem;
  }

  &:nth-child(6) {
    min-width: 10rem;
    max-width: 10rem;
  }

  &:nth-child(7) {
    min-width: 8rem;
    max-width: 8rem;
  }

  &:nth-child(8) {
    min-width: 12rem;
    max-width: 12rem;
  }
  &:nth-child(9) {
    min-width: 7rem;
    max-width: 7rem;
  }
  &:nth-child(10) {
    min-width: 7rem;
    max-width: 7rem;
  }
`;

const blocks = css`
  margin-right: 1.25rem;
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    margin-right: 0.4rem;
  }

  &:nth-child(1) {
    min-width: 5rem;
    max-width: 5rem;
  }

  &:nth-child(2) {
    min-width: 7rem;
    max-width: 7rem;
  }

  &:nth-child(3) {
    min-width: 14rem;
    max-width: 20rem;
  }

  &:nth-child(4) {
    min-width: 12rem;
    max-width: 20rem;
  }

  &:nth-child(5) {
    min-width: 7rem;
    max-width: 7rem;
  }

  &:nth-child(6) {
    min-width: 10rem;
    max-width: 15rem;
  }

  &:nth-child(7) {
    min-width: 10rem;
    max-width: 15rem;
  }

  &:nth-child(8) {
    min-width: 10rem;
    max-width: 15rem;
  }

  &:nth-child(9) {
    min-width: 10rem;
    max-width: 15rem;
  }
`;

const accounts = css`
  margin-right: 1.25rem;

  &:nth-child(1) {
    min-width: 39rem;
    max-width: 39rem;
  }

  &:nth-child(2) {
    min-width: 8rem;
    max-width: 8rem;
  }

  &:nth-child(3) {
    min-width: 12rem;
    max-width: 12rem;
  }

  &:nth-child(4) {
    min-width: 10rem;
    max-width: 10rem;
  }
`;

const assetsPage = css`
  padding-right: 0.5rem;

  &:nth-child(1) {
    min-width: 5rem;
    max-width: 5rem;
  }

  &:nth-child(2) {
    min-width: 6rem;
    max-width: 6rem;
  }

  &:nth-child(3) {
    min-width: 14rem;
    max-width: 14rem;
  }

  &:nth-child(4) {
    min-width: 14rem;
    max-width: 14rem;
  }

  &:nth-child(5) {
    min-width: 8rem;
    max-width: 8rem;
  }

  &:nth-child(6) {
    min-width: 12rem;
    max-width: 12rem;
  }

  &:nth-child(7) {
    min-width: 12rem;
    max-width: 12rem;
  }

  &:nth-child(8) {
    min-width: 12rem;
    max-width: 12rem;
  }
  &:nth-child(9) {
    min-width: 8rem;
    max-width: 8rem;
  }
  &:nth-child(10) {
    min-width: 8rem;
    max-width: 8rem;
  }
  &:nth-child(11) {
    min-width: 4rem;
    max-width: 4rem;
  }
`;

const assets = css`
  margin-right: 1.25rem;
  &:nth-child(1) {
    min-width: 8rem;
    max-width: 8rem;
  }
  &:nth-child(2) {
    min-width: 14rem;
    max-width: 14rem;
  }
  &:nth-child(3) {
    min-width: 10rem;
    max-width: 10rem;
  }
  &:nth-child(4) {
    min-width: 8rem;
    max-width: 8rem;
  }
  &:nth-child(5) {
    min-width: 10rem;
    max-width: 10rem;
  }
  &:nth-child(6) {
    min-width: 10rem;
    max-width: 10rem;
  }
  &:nth-child(7) {
    min-width: 10rem;
    max-width: 10rem;
  }
`;

const buckets = css`
  margin-right: 1.25rem;

  &:nth-child(1) {
    min-width: 10rem;
    max-width: 10rem;
  }
  &:nth-child(2) {
    min-width: 8rem;
    max-width: 8rem;
  }
  &:nth-child(3) {
    min-width: 5rem;
    max-width: 5rem;
  }
  &:nth-child(4) {
    min-width: 11rem;
    max-width: 11rem;
  }
  &:nth-child(5) {
    min-width: 10rem;
    max-width: 10rem;
  }
  &:nth-child(6) {
    min-width: 10rem;
    max-width: 10rem;
  }
  &:nth-child(7) {
    min-width: 10rem;
    max-width: 10rem;
  }
  &:nth-child(8) {
    min-width: 14rem;
    max-width: 14rem;
  }
`;

const holders = css`
  margin-right: 1.25rem;

  &:nth-child(1) {
    min-width: 3rem;
    max-width: 3rem;
  }

  &:nth-child(2) {
    min-width: 27rem;
    max-width: 27rem;
  }

  &:nth-child(3) {
    min-width: 6rem;
    max-width: 6rem;
  }

  &:nth-child(4) {
    min-width: 10rem;
    max-width: 10rem;
  }
  &:nth-child(5) {
    min-width: 10rem;
    max-width: 10rem;
  }
`;

const validators = css`
  margin-right: 1.25rem;
  @media (min-width: 2432px) {
    margin-right: 0;
  }
  &:nth-child(1) {
    min-width: 2rem;
    max-width: 2rem;
  }
  &:nth-child(2) {
    min-width: 18rem;
    max-width: 20rem;
  }
  &:nth-child(3) {
    min-width: 6rem;
    max-width: 6rem;
  }
  &:nth-child(4) {
    min-width: 6rem;
    max-width: 6rem;
  }
  &:nth-child(5) {
    min-width: 7rem;
    max-width: 7rem;
  }
  &:nth-child(6) {
    min-width: 10rem;
    max-width: 10rem;
  }
  &:nth-child(7) {
    min-width: 10rem;
    max-width: 18rem;
  }
  &:nth-child(8) {
    min-width: 10rem;
    max-width: 10rem;
  }
  &:nth-child(9) {
    min-width: 15rem;
    max-width: 15rem;
  }
`;

const nodes = validators;

const validator = css`
  margin-right: 7rem;
  &:nth-child(1) {
    min-width: 15rem;
    max-width: 15rem;
  }
  &:nth-child(2) {
    min-width: 40rem;
    max-width: 40rem;
  }
  &:nth-child(3) {
    min-width: 12rem;
    max-width: 12rem;
  }
  &:nth-child(4) {
    min-width: 5rem;
    max-width: 5rem;
  }
  &:last-child {
    margin-right: 0;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    &:nth-child(1) {
      min-width: 12rem;
      max-width: 12rem;
      max-width: 7rem;
    }
    &:nth-child(2) {
      min-width: 60%;
      max-width: 60%;
      max-width: 40rem;
    }
    &:nth-child(3) {
      min-width: 10rem;
      max-width: 10rem;
      max-width: 10rem;
    }
    :nth-child(2) {
      min-width: 20rem;
      max-width: 20rem;
    }
  }
`;

const networkParams = css`
  margin-right: 1.25rem;

  &:nth-child(1) {
    min-width: 4rem;
    max-width: 4rem;
  }

  &:nth-child(2) {
    min-width: 45rem;
    max-width: 45rem;
  }

  &:nth-child(3) {
    min-width: 9rem;
    max-width: 9rem;
  }
`;

const proposals = css`
  &:nth-child(1) {
    min-width: 7rem;
    max-width: 8rem;
  }
  &:nth-child(2) {
    min-width: 15rem;
    max-width: 16rem;
  }
  &:nth-child(3) {
    min-width: 14rem;
    max-width: 15rem;
  }
  &:nth-child(4) {
    min-width: 14rem;
    max-width: 15rem;
  }
  &:nth-child(5) {
    min-width: 15rem;
    max-width: 18rem;
  }
  &:nth-child(6) {
    min-width: 14rem;
    max-width: 14rem;
  }
  &:nth-child(7) {
    min-width: 5rem;
  }
`;
const votes = css`
  margin-right: 1.25rem;
  &:nth-child(1) {
    min-width: 38rem;
    max-width: 38rem;
  }
  &:nth-child(2) {
    min-width: 10rem;
    max-width: 10rem;
  }
  &:nth-child(3) {
    min-width: 14rem;
    max-width: 14rem;
  }
`;

const delegations = css`
  margin-right: 1.25rem;
  &:nth-child(1) {
    min-width: 12rem;
    max-width: 12rem;
  }
  &:nth-child(2) {
    min-width: 40rem;
    max-width: 40rem;
  }
  &:nth-child(3) {
    min-width: 10rem;
    max-width: 10rem;
  }
`;

const nfts = css`
  margin-right: 1.25rem;

  &:nth-child(1) {
    min-width: 8rem;
    max-width: 8rem;
  }

  &:nth-child(2) {
    min-width: 12rem;
    max-width: 12rem;
  }

  &:nth-child(3) {
    min-width: 12rem;
    max-width: 12rem;
  }

  &:nth-child(4) {
    min-width: 15rem;
    max-width: 15rem;
  }
`;

const validatorsList = css`
  margin-right: 1.25rem;

  &:nth-child(1) {
    min-width: 70rem;
    max-width: 70rem;
  }
`;

const rewards = css`
  margin-right: 1.25rem;

  &:nth-child(1) {
    min-width: 12rem;
    max-width: 15rem;
  }

  &:nth-child(2) {
    min-width: 20rem;
    max-width: 30rem;
  }
`;

const marketplaces = css`
  margin-right: 1.25rem;

  &:nth-child(1) {
    min-width: 12rem;
    max-width: 14rem;
  }
  &:nth-child(2) {
    min-width: 16rem;
    max-width: 18rem;
  }
  &:nth-child(3) {
    min-width: 14rem;
    max-width: 16rem;
  }
  &:nth-child(4) {
    min-width: 14rem;
    max-width: 16rem;
  }
  &:nth-child(5) {
    min-width: 10rem;
    max-width: 12rem;
  }
`;

const launchPad = css`
  margin-right: 1.25rem;

  min-width: 8rem;
  max-width: 8rem;

  &:nth-child(1) {
    min-width: 1rem;
    max-width: 1rem;
  }
  &:nth-child(2) {
    min-width: 10rem;
    max-width: 10rem;
  }
  &:nth-child(3) {
    min-width: 10rem;
    max-width: 10rem;
  }
  &:nth-child(4) {
    min-width: 6rem;
    max-width: 6rem;
  }
  &:nth-child(5) {
    min-width: 6rem;
    max-width: 6rem;
  }
  &:nth-child(8) {
    min-width: 5rem;
    max-width: 5rem;
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
  validatorsList,
  rewards,
  marketplaces,
  launchPad,
};

export default widths;
