import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { renderWithTheme } from '../../test/utils/';
import Tooltip from './index';

describe('Tooltip', () => {
  test('Tooltip rendering before and after hover with IconHelp svg', async () => {
    const message =
      'Always check the address. Names can be the same across multiple addresses.';
    const container = renderWithTheme(<Tooltip msg={message} />).container;
    const tooltipMsg = screen.queryByText(message);
    expect(tooltipMsg).toBeInTheDocument(); // tooltip msg should always be in dom

    let tooltip = screen.getByText(message).parentElement;
    let tooltipClass = tooltip?.getAttribute('class');
    expect(tooltipClass).not.toMatch(/show/i); // tooltip has a "class" attribute, if tooltip has not been hovered, the "class" attribute must not contain the word "show"

    const tooltipController: any =
      container.firstElementChild?.firstElementChild;
    expect(tooltipController.nodeName).toBe('svg');
    await waitFor(async () => {
      await userEvent.hover(tooltipController); // now word "show" should be present in "class" attribute
    });
    tooltip = screen.getByText(message).parentElement;
    expect(tooltip).toHaveAttribute('class');
    tooltipClass = tooltip?.getAttribute('class');
    expect(tooltipClass).toMatch(/show/i);

    await waitFor(async () => {
      await userEvent.unhover(tooltipController);
    });
    tooltip = screen.getByText(message).parentElement;
    expect(tooltip).toHaveAttribute('class');
    tooltipClass = tooltip?.getAttribute('class');
    expect(tooltipClass).not.toMatch(/show/i);
  });

  test('Tooltip rendering before and after hover with custom component', async () => {
    const message = 'message 1\n message 2\n message 3\n message 4';
    const container = renderWithTheme(
      <Tooltip
        msg={message}
        Component={() => <div>Hello!</div>}
        customStyles={{ offset: { left: 55 }, place: 'top' }}
      />,
    ).container;
    const msg1 = screen.queryByText('message 1');
    const msg2 = screen.queryByText('message 2');
    const msg3 = screen.queryByText('message 3');
    const msg4 = screen.queryByText('message 4');
    const msgs = [msg1, msg2, msg3, msg4];
    msgs.forEach(msg => expect(msg).toBeInTheDocument());

    let tooltip = msg1?.parentElement;
    let tooltipClass = tooltip?.getAttribute('class');
    expect(tooltipClass).not.toMatch(/show/i);

    const tooltipController: any =
      container.firstElementChild?.firstElementChild;
    await waitFor(async () => {
      await userEvent.hover(tooltipController);
    });
    tooltip = screen.queryByText('message 1')?.parentElement;
    expect(tooltip).toHaveAttribute('class');
    tooltipClass = tooltip?.getAttribute('class');
    expect(tooltipClass).toMatch(/show/i);

    await waitFor(async () => {
      await userEvent.unhover(tooltipController);
    });
    tooltip = screen.queryByText('message 1')?.parentElement;
    expect(tooltip).toHaveAttribute('class');
    tooltipClass = tooltip?.getAttribute('class');
    expect(tooltipClass).not.toMatch(/show/i);
  });
});
