import { act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import IconTooltip from '.';
import { StyledTransfer } from '../../components/Header/ConnectWallet/styles';
import { renderWithTheme } from '../../test/utils';

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
    const { container } = renderWithTheme(
      <IconTooltip tooltip="test" Icon={StyledTransfer} data="Hello World" />,
    );
    const tooltip =
      container.firstElementChild?.firstElementChild?.firstElementChild;
    expect(tooltip?.nodeName).toBe('svg');
    const clickIconTooltip: any = container.firstChild;
    const iconContainer = tooltip?.parentElement;
    const tooltipContainer = tooltip?.parentElement?.parentElement;
    act(async () => {
      await userEvent.hover(tooltipContainer as any);
    });
    // TODO: find a way to hover trigger ::before and ::after since they load tooltip
  });
});
