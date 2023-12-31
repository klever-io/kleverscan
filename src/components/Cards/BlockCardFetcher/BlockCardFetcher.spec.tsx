import * as HomeData from '@/contexts/mainPage';
import theme from '@/styles/theme';
import { screen, waitFor } from '@testing-library/react';
import React from 'react';
import BlockCardList from '.';
import { mockedBlocks } from '../../../test/mocks';
import { renderWithTheme } from '../../../test/utils';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));
jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str: string) => str,
      i18n: {
        changeLanguage: () =>
          new Promise(() => {
            'blocks';
          }),
      },
    };
  },
}));

describe('Component: BlockCardList', () => {
  let mock;

  const contextValues = {
    blocks: mockedBlocks,
  };
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mock = jest
      .spyOn(HomeData, 'useHomeData')
      .mockImplementation(() => contextValues as HomeData.IHomeData);
  });

  it('Should render the "Title" and BlockCard Componenet', async () => {
    renderWithTheme(<BlockCardList />);

    const blockTitle = screen.getByRole('heading', { name: /Blocks/i });
    const blockCard = screen.getByText(`#${mockedBlocks[0].nonce}`);
    expect(blockTitle).toBeInTheDocument();
    expect(blockCard.parentNode?.parentNode).toBeInTheDocument();
  });

  it('Should fetch blocks each 4 seconds', async () => {
    renderWithTheme(<BlockCardList />);

    await waitFor(
      () => {
        renderWithTheme(<BlockCardList />);
      },
      { timeout: 5000 },
    );

    const block = screen.getAllByText(`#${mockedBlocks[0].nonce}`);
    expect(block).toHaveLength(2);
  });

  it('Should match the style for the component', () => {
    renderWithTheme(<BlockCardList />);
    const blockTitle = screen.getByRole('heading', { name: /Recent Blocks/i });
    const section = blockTitle.parentNode;
    const blockTitleStyle = {
      display: 'block',
      'font-size': '1.5rem',
      'font-weight': '500',
      color: `${theme.darkBlue}`,
      margin: '0px',
      'margin-top': '0px',
      'margin-right': '0px',
      'margin-bottom': '0px',
      'margin-left': '0px',
      visibility: 'visible',
    };
    const sectionStyle = {
      padding: '1.5rem 0px',
    };

    expect(blockTitle).toHaveStyle(blockTitleStyle);
    expect(section).toHaveStyle(sectionStyle);
  });
});
