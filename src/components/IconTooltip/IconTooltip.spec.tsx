import React from 'react';
import userEvent from '@testing-library/user-event';

import { renderWithTheme } from '../../test/utils';

import IconTooltip from '.';

Object.assign(navigator, {
  clipboard: {
    writeText: () => {
      return;
    },
  },
});

describe('Component: IconTooltip', () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });

  it('Should render the component and IconTooltip the text when click', async () => {
    const user = userEvent.setup();
    const { container } = renderWithTheme(
      <IconTooltip info="Test" data="Hello World" />,
    );

    const clickIconTooltip: any = container.firstChild;

    const mockWriteText = jest.fn().mockResolvedValueOnce('clipText');
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: mockWriteText,
      },
    });
    await user.click(clickIconTooltip);
    expect(mockWriteText).toBeCalledWith('Hello World');
  });
});
