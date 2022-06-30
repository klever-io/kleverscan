import React from 'react';

import { fireEvent, screen, cleanup } from '@testing-library/react';

import Pagination from '.';

import theme from '../../styles/theme';

import { renderWithTheme } from '../../test/utils/';

interface IPagination {
  count: number;
  page: number;
  onPaginate(page: number): void;
}

const paginationProps: IPagination = {
  count: 1000,
  page: 1,
  onPaginate: jest.fn(page => (paginationProps.page = page)),
};

const itemStyles = {
  height: '2rem',
  width: '2rem',
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  justifyContent: 'center',
  borderRadius: '50%',
  transition: '0.2s ease',
};

const itemActiveStyles = {
  backgroundColor: theme.pagination.active,
  color: theme.white,
};

const itemDefaultStyles = {
  backgroundColor: 'transparent',
  color: theme.black,
};

const activeConfirmButtonStyles = {
  marginTop: '1rem',
  width: '100%',
  padding: '0.5rem',
  borderRadius: '0.5rem',
  backgroundColor: theme.purple,
  transition: 'all 0.1s ease-in-out',
  filter: 'opacity(0.5)',
  pointerEvents: 'none',
};

describe('Component: Pagination', () => {
  describe('Static tests', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      
    });
    afterAll(cleanup);

    it('Should change to page 2 when click on right arrow', () => {
      const { container } = renderWithTheme(
        <Pagination {...paginationProps} />,
      );
      const rightArrow: any =
        container.firstElementChild?.lastElementChild;
    
      fireEvent.click(rightArrow);
      expect(paginationProps.page).toBe(2);
    });

    it('Should change to page 4 when click on left arrow ', () => {
      const newProps = {...paginationProps};
      newProps.page = 5;
      newProps.count = 500;
      const { container } = renderWithTheme(
        <Pagination {...newProps} />,
      );
      const leftArrow: any =
      container.firstElementChild?.firstElementChild;
  
      fireEvent.click(leftArrow);
      expect(paginationProps.page).toBe(4);
    });

    it('Should open right modal when click on right ellipsis and should desapear when unblur', () => {
      renderWithTheme(
        <Pagination {...paginationProps} />,
      );
      const rightModal: any = screen.getByText('...');
      fireEvent.click(rightModal);

      const modal = screen.getByText('Choose Page');
      expect(modal).toBeInTheDocument();
      expect(modal).toBeVisible();

      const modalContainer: any = modal?.parentElement?.parentElement?.parentElement;
      fireEvent.blur(modalContainer);
      expect(modal).not.toBeVisible();

    });

    it('if pagination numbers are rendered according to the passed props', () => {
      renderWithTheme(
        <Pagination {...paginationProps} />,
      );
      let pageSpan;
      for (let index = 1; index <= 7; index++) {
        pageSpan = screen.getByText(String(index));
        expect(pageSpan).toBeVisible();
        expect(pageSpan.parentElement).toHaveStyle(itemStyles);
      }
      const lastPage = screen.getByText('1000');
      expect(lastPage).toBeVisible();
    });

    it('if ellipsis is rendered and is in the correct position', () => {
      renderWithTheme(
        <Pagination {...paginationProps} />,
      );
      const ellipsis = screen.getByText('...');
      expect(ellipsis).toBeVisible();
      const ellipsisContainer = ellipsis?.parentElement;

      expect(
        ellipsisContainer?.nextElementSibling?.firstElementChild,
      ).toHaveTextContent('1000');

      expect(
        ellipsisContainer?.previousElementSibling?.firstElementChild,
      ).toHaveTextContent('7');

      expect(ellipsisContainer?.firstElementChild).toHaveStyle(itemStyles);
    });

    it('arrow icons buttons display', () => {
      const { container } = renderWithTheme(
        <Pagination {...paginationProps} />,
      );
      const leftArrow =
        container.firstElementChild?.firstElementChild?.firstElementChild;
      const rightArrow =
        container.firstElementChild?.firstElementChild?.lastElementChild;
      expect(leftArrow?.nodeName).toBe('svg');
      expect(rightArrow?.nodeName).toBe('svg');
      expect(leftArrow).toBeVisible();
      expect(rightArrow).toBeVisible();
    });
  });
});

describe('User interaction tests', () => {
  describe('User pagination through the last page', () => {
    it('First render: click in the "1000" page element', () => {
      renderWithTheme(
        <Pagination {...paginationProps} />,
      );
      let pageSpan;
      for (let index = 1; index <= 7; index++) {
        pageSpan = screen.getByText(String(index));
        expect(pageSpan).toBeVisible();
      }
      const lastPage = screen.getByText('1000');
      expect(lastPage).toBeVisible();

      fireEvent.click(lastPage);
    });

    it('Second render: expect correct elements rendering', () => {
      const { container } = renderWithTheme(
        <Pagination {...paginationProps} />,
      );
      // nested selectors use more code, but this guarantee all pagination elements are in the exact correct order
      const page1 =
        container.firstElementChild?.firstElementChild?.nextElementSibling
          ?.firstElementChild;

      const leftEllipsis: any =
        container.firstElementChild?.firstElementChild?.nextElementSibling
          ?.nextElementSibling?.firstElementChild;

      const page994 =
        container.firstElementChild?.firstElementChild?.nextElementSibling
          ?.nextElementSibling?.nextElementSibling?.firstElementChild;

      const page995 =
        container.firstElementChild?.firstElementChild?.nextElementSibling
          ?.nextElementSibling?.nextElementSibling?.nextElementSibling
          ?.firstElementChild;

      const page996 =
        container.firstElementChild?.firstElementChild?.nextElementSibling
          ?.nextElementSibling?.nextElementSibling?.nextElementSibling
          ?.nextElementSibling?.firstElementChild;

      const page997 =
        container.firstElementChild?.firstElementChild?.nextElementSibling
          ?.nextElementSibling?.nextElementSibling?.nextElementSibling
          ?.nextElementSibling?.nextElementSibling?.firstElementChild;

      const page998 =
        container.firstElementChild?.firstElementChild?.nextElementSibling
          ?.nextElementSibling?.nextElementSibling?.nextElementSibling
          ?.nextElementSibling?.nextElementSibling?.nextElementSibling
          ?.firstElementChild;

      const page999 =
        container.firstElementChild?.firstElementChild?.nextElementSibling
          ?.nextElementSibling?.nextElementSibling?.nextElementSibling
          ?.nextElementSibling?.nextElementSibling?.nextElementSibling
          ?.nextElementSibling?.firstElementChild;

      const page1000 =
        container.firstElementChild?.firstElementChild?.nextElementSibling
          ?.nextElementSibling?.nextElementSibling?.nextElementSibling
          ?.nextElementSibling?.nextElementSibling?.nextElementSibling
          ?.nextElementSibling?.nextElementSibling?.firstElementChild;

      expect(page1?.textContent).toBe('1');
      expect(page1?.parentElement).toHaveStyle(
        Object.assign(itemStyles, itemDefaultStyles),
      );

      expect(leftEllipsis?.textContent).toBe('...');
      expect(leftEllipsis).toHaveStyle(
        Object.assign(itemStyles, itemDefaultStyles),
      );

      expect(page994?.textContent).toBe('994');
      expect(page994?.parentElement).toHaveStyle(
        Object.assign(itemStyles, itemDefaultStyles),
      );

      expect(page995?.textContent).toBe('995');
      expect(page995?.parentElement).toHaveStyle(
        Object.assign(itemStyles, itemDefaultStyles),
      );

      expect(page996?.textContent).toBe('996');
      expect(page996?.parentElement).toHaveStyle(
        Object.assign(itemStyles, itemDefaultStyles),
      );

      expect(page997?.textContent).toBe('997');
      expect(page997?.parentElement).toHaveStyle(
        Object.assign(itemStyles, itemDefaultStyles),
      );

      expect(page998?.textContent).toBe('998');
      expect(page998?.parentElement).toHaveStyle(
        Object.assign(itemStyles, itemDefaultStyles),
      );

      expect(page999?.textContent).toBe('999');
      expect(page999?.parentElement).toHaveStyle(
        Object.assign(itemStyles, itemDefaultStyles),
      );

      expect(page1000?.textContent).toBe('1000');
      expect(page1000?.parentElement).toHaveStyle(
        Object.assign(itemStyles, itemActiveStyles),
      );

      fireEvent.click(leftEllipsis);
    });

    it('Third render: open modal and use it', () => {
      const { container } = renderWithTheme(
        <Pagination {...paginationProps} />,
      );

      const leftEllipsis: any =
        container.firstElementChild?.firstElementChild?.nextElementSibling
          ?.nextElementSibling?.firstElementChild;
      const page994 =
        container.firstElementChild?.firstElementChild?.nextElementSibling
          ?.nextElementSibling?.nextElementSibling?.firstElementChild;

      expect(leftEllipsis?.textContent).toBe('...');
      expect(leftEllipsis).toHaveStyle(
        Object.assign(itemStyles, itemDefaultStyles),
      );
      expect(page994?.textContent).toBe('994');
      expect(page994?.parentElement).toHaveStyle(
        Object.assign(itemStyles, itemDefaultStyles),
      );

      fireEvent.click(leftEllipsis);

      const choosePage = screen.getByText('Choose Page');
      const modalInput: any =
        choosePage?.parentElement?.parentElement?.nextElementSibling
          ?.firstElementChild;

      const confirmButton = screen.getByText('Confirm');
      expect(confirmButton).toHaveStyle(activeConfirmButtonStyles);

      fireEvent.change(modalInput, { target: { value: '500' } });
      fireEvent.click(confirmButton);
    });
    it('Fourth render: Pagination elements are in the correct order after using modal', () => {
      const { container } = renderWithTheme(
        <Pagination {...paginationProps} />,
      );

      const page1 =
        container.firstElementChild?.firstElementChild?.nextElementSibling
          ?.firstElementChild;

      const leftEllipsis =
        container.firstElementChild?.firstElementChild?.nextElementSibling
          ?.nextElementSibling?.firstElementChild;

      const page498 =
        container.firstElementChild?.firstElementChild?.nextElementSibling
          ?.nextElementSibling?.nextElementSibling?.firstElementChild;

      const page499 =
        container.firstElementChild?.firstElementChild?.nextElementSibling
          ?.nextElementSibling?.nextElementSibling?.nextElementSibling
          ?.firstElementChild;

      const page500 =
        container.firstElementChild?.firstElementChild?.nextElementSibling
          ?.nextElementSibling?.nextElementSibling?.nextElementSibling
          ?.nextElementSibling?.firstElementChild;

      const page501 =
        container.firstElementChild?.firstElementChild?.nextElementSibling
          ?.nextElementSibling?.nextElementSibling?.nextElementSibling
          ?.nextElementSibling?.nextElementSibling?.firstElementChild;

      const page502 =
        container.firstElementChild?.firstElementChild?.nextElementSibling
          ?.nextElementSibling?.nextElementSibling?.nextElementSibling
          ?.nextElementSibling?.nextElementSibling?.nextElementSibling
          ?.firstElementChild;

      const rightEllipsis =
        container.firstElementChild?.firstElementChild?.nextElementSibling
          ?.nextElementSibling?.nextElementSibling?.nextElementSibling
          ?.nextElementSibling?.nextElementSibling?.nextElementSibling
          ?.nextElementSibling?.firstElementChild;

      const page1000 =
        container.firstElementChild?.firstElementChild?.nextElementSibling
          ?.nextElementSibling?.nextElementSibling?.nextElementSibling
          ?.nextElementSibling?.nextElementSibling?.nextElementSibling
          ?.nextElementSibling?.nextElementSibling?.firstElementChild;

      expect(page1?.textContent).toBe('1');
      expect(page1?.parentElement).toHaveStyle(
        Object.assign(itemStyles, itemDefaultStyles),
      );

      expect(leftEllipsis?.textContent).toBe('...');
      expect(leftEllipsis).toHaveStyle(
        Object.assign(itemStyles, itemDefaultStyles),
      );

      expect(page498?.textContent).toBe('498');
      expect(page498?.parentElement).toHaveStyle(
        Object.assign(itemStyles, itemDefaultStyles),
      );

      expect(page499?.textContent).toBe('499');
      expect(page499?.parentElement).toHaveStyle(
        Object.assign(itemStyles, itemDefaultStyles),
      );

      expect(page500?.textContent).toBe('500');
      expect(page500?.parentElement).toHaveStyle(
        Object.assign(itemStyles, itemActiveStyles),
      );

      expect(page501?.textContent).toBe('501');
      expect(page501?.parentElement).toHaveStyle(
        Object.assign(itemStyles, itemDefaultStyles),
      );

      expect(page502?.textContent).toBe('502');
      expect(page502?.parentElement).toHaveStyle(
        Object.assign(itemStyles, itemDefaultStyles),
      );

      expect(rightEllipsis?.textContent).toBe('...');
      expect(rightEllipsis).toHaveStyle(
        Object.assign(itemStyles, itemDefaultStyles),
      );

      expect(page1000?.textContent).toBe('1000');
      expect(page1000?.parentElement).toHaveStyle(
        Object.assign(itemStyles, itemDefaultStyles),
      );
    });
  });
});
