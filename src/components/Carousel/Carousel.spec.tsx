import { fireEvent } from '@testing-library/react';
import React from 'react';
import Carousel from '.';
import { renderWithTheme } from '../../test/utils';

describe('test Carousel component', () => {
  it('should render the component and clicking the buttons should trigger useRef functions', () => {
    const mockedRefs = jest.fn((): React.RefObject<HTMLElement> => {
      return {
        current: null,
      };
    });
    jest.spyOn(React, 'useRef').mockReturnValue(mockedRefs());

    const { container } = renderWithTheme(<Carousel />);
    expect(mockedRefs).toBeCalled();

    const domSnapshot1 = window.document.documentElement.outerHTML;

    const leftArrow = container.firstElementChild?.firstElementChild;
    expect(leftArrow?.nodeName).toBe('svg');
    const rightArrow = leftArrow?.nextElementSibling?.nextElementSibling;
    expect(rightArrow?.nodeName).toBe('svg');
    fireEvent.click(leftArrow as Element);
    fireEvent.click(rightArrow as Element);
    // no changes in DOM/UI
    const domSnapshot2 = window.document.documentElement.outerHTML;
    expect(domSnapshot1).toEqual(domSnapshot2);
  });
});
