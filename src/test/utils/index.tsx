import React from 'react';
import { render, RenderResult} from '@testing-library/react';

import { ThemeProvider } from 'styled-components';
import theme from '../../styles/theme';


export const renderWithTheme = (children: JSX.Element): RenderResult => {
  return render(
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  )
};

export const CoinTest = {
  "name": "Klever",
  "shortname": "KLV",
  "price": 0.02012557,
  "variation": 1.04801,
  "marketCap": {
      "price": 108822166,
      "variation": 0.96403
  },
  "volume": {
      "price": 6535768,
      "variation": 0
  },
  "prices": [
      {
          "value": 0.019916836880262877
      },
      {
          "value": 0.019849745804499344
      },
  ]
}