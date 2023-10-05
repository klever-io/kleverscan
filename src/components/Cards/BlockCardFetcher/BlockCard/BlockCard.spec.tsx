import { renderWithTheme } from '@/test/utils';
import '@testing-library/jest-dom/extend-expect';
import { screen } from '@testing-library/react';
import React from 'react';
import BlockCard from '.';

describe('Component: BlockCard', () => {
  const textBlockCard: string[] = ['Transactions', 'Miner', 'Burned', 'Reward'];
  const timestamp = 1652813596000;
  const hash =
    '110f313d0abe5a559c12e7c695037d930d5d5a05389fe17901ed03058d36b79a';
  const txBurnedFees = 1500000;
  const precision = 6;
  const nonce = 262522;
  const txCount = 146;
  const blockRewards = 15000000;
  const producerLogo = '';
  const producerOwnerAddress =
    'klv16sd7crk4jlc8csrv7lwskqrpjgjklvcsmlhexuesa9p6a3dm57rs5vh0hq';
  const producerName = '';

  it('Should render the BlockCard with the correct text', () => {
    renderWithTheme(
      <BlockCard
        hash={hash}
        nonce={nonce}
        timestamp={timestamp}
        txCount={txCount}
        blockRewards={blockRewards}
        txBurnedFees={txBurnedFees}
        blockIndex={0}
        producerLogo={producerLogo}
        producerOwnerAddress={producerOwnerAddress}
        producerName={producerName}
      />,
    );

    // expect(
    //   screen.getByText(getAge(fromUnixTime(timestamp / 1000)) + ' ago'),
    // ).toBeInTheDocument();
    expect(screen.getByText(producerOwnerAddress)).toBeInTheDocument();
    expect(screen.getByText(`#${nonce}`)).toBeInTheDocument();

    // textBlockCard.forEach((item: string) => {
    //   expect(screen.getByText(item)).toBeInTheDocument();
    // });
  });

  it('Should have the correct styles for background-color, border-radius, cursor and padding', () => {
    const { container } = renderWithTheme(
      <BlockCard
        hash={hash}
        nonce={nonce}
        timestamp={timestamp}
        txCount={txCount}
        blockRewards={blockRewards}
        txBurnedFees={txBurnedFees}
        blockIndex={0}
        producerLogo={producerLogo}
        producerOwnerAddress={producerOwnerAddress}
        producerName={producerName}
      />,
    );

    const style = {
      gap: '1rem',
      display: 'grid',
      padding: '1rem',
    };

    expect(container.firstChild).toHaveStyle(style);
  });

  it('Should render the fallback for "Reward" and "Burned" when don\'t pass the params "blockRewards" and "txBurnedFees"', () => {
    renderWithTheme(
      <BlockCard
        hash={hash}
        nonce={nonce}
        timestamp={timestamp}
        txCount={txCount}
        blockRewards={blockRewards}
        txBurnedFees={txBurnedFees}
        blockIndex={0}
        producerLogo={producerLogo}
        producerOwnerAddress={producerOwnerAddress}
        producerName={producerName}
      />,
    );

    const burned = screen.getByText(/Burned/i).nextSibling;
    const reward = screen.getByText(/Reward/i).nextSibling;
    expect(burned).toHaveTextContent('1.5 KLV');
    expect(reward).toHaveTextContent('15 KLV');
  });
});
