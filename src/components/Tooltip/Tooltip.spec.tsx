import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { renderWithTheme } from '../../test/utils/';
import Tooltip from './index';

describe('Tooltip', () => {
  const message =
    'Always check the address. Names can be the same across multiple addresses.';
  test('Tooltip rendering before and after hover', async () => {
    const container = renderWithTheme(
      <Tooltip data-testid="tooltipId" msg={message} />,
    ).container;
    const tooltipController: any =
      container.firstElementChild?.firstElementChild?.firstElementChild;
    let tooltipMsg = screen.queryByText(message);
    expect(tooltipMsg).not.toBeInTheDocument();
    await waitFor(async () => {
      await userEvent.hover(tooltipController);
    });
    tooltipMsg = screen.getByText(message);
    expect(tooltipMsg).toBeInTheDocument();
    expect(tooltipMsg?.previousElementSibling?.nodeName).toBe('svg');

    await waitFor(async () => {
      await userEvent.unhover(tooltipController);
    });
    expect(tooltipMsg).not.toBeInTheDocument();
  });
});
