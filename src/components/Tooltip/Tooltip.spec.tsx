import React from 'react';

import { screen } from '@testing-library/react';

import { renderWithTheme } from '../../test/utils/';

import  Tooltip  from './index';

describe('Tooltip', () => {
  test('', () => {
    const message = "Always check the address. Names can be the same across multiple addresses."
    renderWithTheme(<Tooltip msg={message} />).container;
    const tooltipMsg = screen.getByText(message);
    expect(tooltipMsg).toBeInTheDocument()
    expect(tooltipMsg?.previousElementSibling?.nodeName).toBe('svg');
  })
})