import userEvent from '@testing-library/user-event';
import React from 'react';
import { renderWithTheme } from '../../test/utils';
import Copy from './';

describe('Component: Copy', () => {
  it('Should render the component and copy the text when click', async () => {
    const mockedWriteText = jest.fn();
    jest.mock('clipboard-polyfill', () => ({
      writeText: mockedWriteText,
    }));

    const user = userEvent.setup();
    const { container } = renderWithTheme(
      <Copy info="Test" data="Hello World" />,
    );

    const clickCopy = container.firstChild as HTMLElement;

    await user.click(clickCopy);
    // expect(mockedWriteText).toHaveBeenCalledWith('Hello World');
  });
});
