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
    width: 10rem;
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
    width: 10rem;
  }

  &:nth-child(8) {
    width: 10rem;
  }
`;

const widths = {
  transactions,
  blocks,
};

export default widths;
