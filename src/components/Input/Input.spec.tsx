import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';
import theme from '../../styles/theme';
import Input from '.';

const mockedProps = {
  type: 'text',
  value: '',
  onChange: jest.fn(),
  handleConfirmClick: jest.fn(),
  onBlur: jest.fn(),
};

describe('Component: Input', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = render(
      <ThemeProvider theme={theme}>
        <Input {...mockedProps} />
      </ThemeProvider>,
    ).container;
  });

  it("should render the component with it's input field value empty and focused", () => {
    const input = container.firstElementChild?.firstElementChild;
    expect(input?.innerHTML).toBe('');
    expect(document.activeElement).toBe(input);
  });

  it('should call handleConfirmClick function when pressing enter', () => {
    const user = userEvent.setup();
    user.keyboard('{Enter}');
    expect(mockedProps.handleConfirmClick).toHaveBeenCalled();
  });

  it("input and it's container should match styles", () => {
    const containerStyles = {
      padding: '0.8rem 1rem',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      border: `1px solid ${theme.input.border.default}`,
      borderRadius: '0.5rem',
      cursor: 'text',
      transition: '0.2s ease',
    };

    const inputStyles = {
      width: '100%',
      minWidth: '5rem',
      fontSize: '0.85rem',
      color: theme.input.text,
    };

    const input = container.firstElementChild?.firstElementChild;
    const containerInput = container.firstElementChild;
    expect(containerInput).toHaveStyle(containerStyles);
    expect(input).toHaveStyle(inputStyles);
  });
});
