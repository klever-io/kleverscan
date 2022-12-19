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
  let container: HTMLElement;

  beforeEach(() => {
    jest.clearAllMocks();
    container = renderWithTheme(<Filter {...filters[0]} />).container;
  });

  it('Should render the title and the selector', () => {
    const title = container.firstChild?.firstChild;
    const selector = container.firstChild?.firstChild?.nextSibling;
    expect(title).toBeInTheDocument();
    expect(selector).toBeInTheDocument();
  });

  it('Should have all the select options and init with the default value ( All )', () => {
    const selector = container.firstChild?.firstChild?.nextSibling;
    expect(selector?.firstChild).toHaveTextContent('All');

    selector?.lastChild?.childNodes.forEach((item, index) => {
      expect(item).toBeInTheDocument();
      if (index === 0) {
        expect(item).toHaveTextContent('All');
      } else {
        expect(item).toHaveTextContent(filters[0].data[index - 1]);
      }
    });
  });

  it('Should correctly show the selected item after switching to another option', async () => {
    const user = userEvent.setup();
    const selector: any = container.firstChild?.firstChild?.nextSibling;

    await user.click(selector.lastChild?.childNodes[1]);
    expect(selector.firstChild).toHaveTextContent(data[0]);
  });

  it('Should all the select element match the style', () => {
    const selector: any = container.firstChild?.firstChild?.nextSibling;
    const contentStyle = {
      position: 'relative',
      backgroundColor: theme.white,
      border: `1px solid ${theme.lightGray}`,
      cursor: 'pointer',
    };
    const selectorContainer = {
      width: '100%',
      position: 'absolute',
      gap: '0.25rem',
    };
    expect(selector).toHaveStyle(contentStyle);
    expect(selector.lastChild).toHaveStyle(selectorContainer);
  });
});
