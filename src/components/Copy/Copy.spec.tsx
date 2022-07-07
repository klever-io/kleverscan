import React from 'react';
import userEvent from '@testing-library/user-event';

import { renderWithTheme } from '../../test/utils';

import Copy from './';

Object.assign(navigator, {
  clipboard: {
    writeText: () => { return },
  },
});

describe('Component: Copy', () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });

  it('Should render the component and copy the text when click', async () => {
    const user = userEvent.setup();
    const { container } = renderWithTheme(<Copy info="Test" data="Hello World" />);

    const clickCopy: any = container.firstChild;
    
    const mockWriteText = jest.fn().mockResolvedValueOnce('clipText');
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: mockWriteText,
      },
    });
    await user.click(clickCopy);
    expect(mockWriteText).toBeCalledWith('Hello World');
  });
});