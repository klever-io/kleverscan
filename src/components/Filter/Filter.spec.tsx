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
    expect(selector?.firstChild).toBeInTheDocument();

    selector?.lastChild?.childNodes.forEach((item, index) => {
      expect(item).toBeInTheDocument();
      if (index === 0) {
        expect(item).toBeInTheDocument();
      } else {
        expect(item).toHaveTextContent(filters[0].data[index - 1]);
      }
    });
  });

  it('Should correctly show the selected item after switching to another option', async () => {
    const user = userEvent.setup();
    const selector = container.firstChild?.firstChild
      ?.nextSibling as HTMLElement;
    const childNodes = selector.lastChild?.childNodes;
    if (childNodes && childNodes[1]) {
      await user.click(childNodes[1] as HTMLElement);
      expect(selector.firstChild).toHaveTextContent(data[0]);
    }
  });

  it('Should all the select element match the style', () => {
    const selector = container.firstChild?.firstChild
      ?.nextSibling as HTMLElement;
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
