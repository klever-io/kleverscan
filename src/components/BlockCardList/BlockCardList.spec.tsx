import { screen, waitFor } from '@testing-library/react';
import React from 'react';
import api from '../../services/api';
import { mockedBlocks, mockedFetchBlocks } from '../../test/mocks';
import { renderWithTheme } from '../../test/utils';
import BlockCardList from './';

jest.mock('@/services/api', () => {
  const mockedResult = [
    {
      nonce: 5055,
      timestamp: Date.now() / 1000,
      hash: '456s2d4895be5a559c12e7c695037d930d5d5a05389fe17901ed03365s42589s',
      blockRewards: 98,
      blockIndex: 55,
      txCount: 0,
      txBurnedFees: 0,
    },
    {
      nonce: 98562,
      timestamp: Date.now() / 1000 - 500,
      hash: '456s2d4895be5a559c12e7c695037d930d5d5a05389fe17901ed03365s42589s',
      blockRewards: 55,
      blockIndex: 74,
      txCount: 0,
      txBurnedFees: 0,
    },
  ];
  return {
    get: jest.fn(() => Promise.resolve({ data: { blocks: mockedResult } })),
  };
});

describe('Component: BlockCardList', () => {
  (api.get as jest.Mock).mockReturnValueOnce(mockedFetchBlocks);

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  it('Should render the "Title" and BlockCard Componenet', async () => {
    renderWithTheme(<BlockCardList blocks={mockedBlocks} precision={6} />);

    const blockTitle = screen.getByRole('heading', { name: /Blocks/i });
    const blockCard = screen.getByText(`#${mockedBlocks[0].nonce}`);
    expect(blockTitle).toBeInTheDocument();
    expect(blockCard.parentNode?.parentNode).toBeInTheDocument();
  });

  it('Should fetch blocks each 4 seconds', async () => {
    renderWithTheme(<BlockCardList blocks={mockedBlocks} precision={6} />);

    await waitFor(
      () => {
        expect(api.get).toHaveBeenCalled();
        expect(api.get).toReturnWith(mockedFetchBlocks);
      },
      { timeout: 5000 },
    );

    const {
      data: { blocks },
    } = mockedFetchBlocks;
    const block = screen.getByText(`#${blocks[0].nonce}`);
    expect(block).toBeInTheDocument();
  });

  it('Should match the style for the component', () => {
    renderWithTheme(<BlockCardList blocks={mockedBlocks} precision={6} />);
    const blockTitle = screen.getByRole('heading', { name: /Blocks/i });
    const section = blockTitle.parentNode;
    const blockTitleStyle = {
      marginBottom: '1rem',
      cursor: 'pointer',
      width: 'fit-content',
    };
    const sectionStyle = {
      padding: '5rem 10rem 10rem 10rem',
    };
    expect(blockTitle).toHaveStyle(blockTitleStyle);
    expect(section).toHaveStyle(sectionStyle);
  });
});
