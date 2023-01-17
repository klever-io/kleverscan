import { IBlock } from '@/types/blocks';
import { screen, waitFor } from '@testing-library/react';
import React, { Dispatch, SetStateAction } from 'react';
import BlockCardList from '.';
import api from '../../../services/api';
import { mockedBlocks, mockedFetchBlocks } from '../../../test/mocks';
import { renderWithTheme } from '../../../test/utils';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));
jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str: any) => str,
      i18n: {
        changeLanguage: () =>
          new Promise(() => {
            'blocks';
          }),
      },
    };
  },
}));

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
    getCached: jest.fn(() =>
      Promise.resolve({ data: { blocks: mockedResult } }),
    ),
  };
});

describe('Component: BlockCardList', () => {
  (api.getCached as jest.Mock).mockReturnValueOnce(mockedFetchBlocks);

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  const getBlocks = jest.fn((setBlocks: Dispatch<SetStateAction<IBlock[]>>) => {
    return api.getCached;
  });
  it('Should render the "Title" and BlockCard Componenet', async () => {
    renderWithTheme(
      <BlockCardList blocks={mockedBlocks} getBlocks={getBlocks} />,
    );

    const blockTitle = screen.getByRole('heading', { name: /Blocks/i });
    const blockCard = screen.getByText(`#${mockedBlocks[0].nonce}`);
    expect(blockTitle).toBeInTheDocument();
    expect(blockCard.parentNode?.parentNode).toBeInTheDocument();
  });

  it('Should fetch blocks each 4 seconds', async () => {
    let blockCards = renderWithTheme(
      <BlockCardList blocks={mockedBlocks} getBlocks={getBlocks} />,
    );

    await waitFor(
      () => {
        expect(getBlocks).toHaveBeenCalled();
        blockCards = renderWithTheme(
          <BlockCardList
            blocks={mockedFetchBlocks.data.blocks}
            getBlocks={getBlocks}
          />,
        );
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
    renderWithTheme(
      <BlockCardList blocks={mockedBlocks} getBlocks={getBlocks} />,
    );
    const blockTitle = screen.getByRole('heading', { name: /Blocks/i });
    const section = blockTitle.parentNode;
    const blockTitleStyle = {
      marginBottom: '1rem',
      cursor: 'pointer',
      width: 'fit-content',
    };
    const sectionStyle = {
      padding: '0 min(3%, 10rem) 10rem',
    };

    expect(blockTitle).toHaveStyle(blockTitleStyle);
    expect(section).toHaveStyle(sectionStyle);
  });
});
