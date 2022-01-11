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
    width: 7rem;
  }

  &:nth-child(5) {
    width: 1rem;
  }

  &:nth-child(6) {
    width: 7rem;
  }

  &:nth-child(7) {
    width: 6rem;
  }

  &:nth-child(8) {
    width: 5rem;
  }

  &:nth-child(9) {
    width: 7rem;
  }

  &:nth-child(10) {
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
    width: 7rem;
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
    width: 30rem;
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
  margin-right: 1.25rem;

  &:nth-child(1) {
    width: 3rem;
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
    width: 8rem;
  }

  &:nth-child(6) {
    width: 8rem;
  }

  &:nth-child(7) {
    width: 10rem;
  }

  &:nth-child(8) {
    width: 8rem;
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
    width: 12rem;
  }
  &:nth-child(4) {
    width: 12rem;
  }
  &:nth-child(5) {
    width: 10rem;
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

  width: 100%;
`;

const nodes = validators;

const widths = {
  transactions,
  blocks,
  accounts,
  assetsPage,
  assets,
  buckets,
  holders,
  validators,
  nodes,
};

export default widths;
