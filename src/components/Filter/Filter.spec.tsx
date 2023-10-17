import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import theme from '../../styles/theme';
import { renderWithTheme } from '../../test/utils';
import Filter, { IFilter } from './';

const data = ['All', 'KLV', 'KFI', 'KUSD'];

const filters: IFilter[] = [
  {
    title: 'Coin',
    data,
    onClick: jest.fn(),
    current: 'All',
  },
];

describe('Component: Filter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('Should render the title and the selector', () => {
    const container = renderWithTheme(<Filter {...filters[0]} />).container;

    const title = container.firstChild?.firstChild;
    const selector = screen.getByTestId('selector');
    expect(title).toBeInTheDocument();
    expect(selector).toBeInTheDocument();
  });

  it('Should have all the select options and init with the default value ( All )', async () => {
    const container = renderWithTheme(<Filter {...filters[0]} />).container;
    const user = userEvent.setup();

    const selector = screen.getByTestId('selector');

    await user.click(selector as HTMLElement);

    const selectorItems = await screen.findAllByTestId('selector-item');

    selectorItems.forEach((item, index) => {
      expect(item).toBeInTheDocument();
      if (index === 0) {
        expect(item).toBeInTheDocument();
      } else {
        expect(item).toHaveTextContent(filters[0].data[index - 1]);
      }
    });
  });

  it('Should correctly show the selected item after switching to another option', async () => {
    const container = renderWithTheme(<Filter {...filters[0]} />).container;

    const user = userEvent.setup();
    const selector = screen.getByTestId('selector');

    await user.click(selector as HTMLElement);

    const selectorItems = await screen.findAllByTestId('selector-item');
    if (selectorItems && selectorItems[1]) {
      await user.click(selectorItems[1] as HTMLElement);
      const itemText = screen.getByText(data[0]);
      expect(itemText).toBeInTheDocument();
    }
  });

  it('Should all the select element match the style', () => {
    const container = renderWithTheme(<Filter {...filters[0]} />).container;

    const selector = screen.getByTestId('selector');

    const contentStyle = {
      backgroundColor: theme.white,
      display: 'flex',
      'background-color': 'rgb(255, 255, 255)',
      width: '100%',
      height: '2.8rem',
      padding: '0.5rem 0px 0.5rem 1rem',
      'padding-top': '0.5rem',
      'padding-right': '0px',
      'padding-bottom': '0.5rem',
      'padding-left': '1rem',
      position: 'relative',
      'flex-direction': 'row',
      'justify-content': 'space-between',
      'align-items': 'center',
      'border-radius': '0.5rem',
      cursor: 'pointer',
      visibility: 'visible',
    };

    const selectorContainer = {
      display: 'block',
      padding: '0.5rem 1rem',
      'padding-top': '0.5rem',
      'padding-right': '1rem',
      'padding-bottom': '0.5rem',
      'padding-left': '1rem',
      'margin-top': '0px',
      visibility: 'visible',
    };
    expect(selector).toHaveStyle(contentStyle);
    expect(selector.lastChild).toHaveStyle(selectorContainer);
  });
});
