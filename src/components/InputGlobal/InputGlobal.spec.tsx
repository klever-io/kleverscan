import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/router';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import Input from '.';
import theme from '../../styles/theme';

const TRANSACTION =
  'd83919b59a8309572e3ee552a9f1b39cd8f40900be14b915d3df31a49202d630';
const ADDRESS =
  'klv1mt8yw657z6nk9002pccmwql8w90k0ac6340cjqkvm9e7lu0z2wjqudt69s';
const BLOCK = '77453';
const ASSET = 'KLV';
const ASSET2 = 'KUSD';
const objectCall = { pathname: '/assets', query: 'asset=KUSD' };

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

describe.skip('Component: InputGlobal', () => {
  let container: HTMLElement;
  const mockRouter = {
    push: jest.fn(() => Promise.resolve(true)),
  };
  (useRouter as jest.Mock).mockReturnValue(mockRouter);

  beforeEach(() => {
    jest.clearAllMocks();
    container = render(
      <ThemeProvider theme={theme}>
        <Input />
      </ThemeProvider>,
    ).container;
  });

  it('Should redirect for transaction page when match the hash length of transactions', async () => {
    const user = userEvent.setup();

    const input = container.firstChild?.firstChild as HTMLInputElement;
    const search = container.firstChild?.lastChild as HTMLInputElement;

    await user.type(input, TRANSACTION);
    await user.click(search);

    expect(mockRouter.push).toHaveBeenCalled();
    expect(mockRouter.push).toHaveBeenCalledWith(`/transaction/${TRANSACTION}`);
  });

  it('Should redirect for address page when match the hash length of addresses', async () => {
    const user = userEvent.setup();

    const input = container.firstChild?.firstChild as HTMLInputElement;
    const search = container.firstChild?.lastChild as HTMLInputElement;

    await user.type(input, ADDRESS);
    await user.click(search);

    expect(mockRouter.push).toHaveBeenCalled();
    expect(mockRouter.push).toHaveBeenCalledWith(`/account/${ADDRESS}`);
  });

  it('Should redirect for block page when the value is a number', async () => {
    const user = userEvent.setup();

    const input = container.firstChild?.firstChild as HTMLInputElement;
    const search = container.firstChild?.lastChild as HTMLInputElement;

    await user.type(input, BLOCK);
    await user.click(search);

    expect(mockRouter.push).toHaveBeenCalled();
    expect(mockRouter.push).toHaveBeenCalledWith(`/block/${BLOCK}`);
  });

  it("Should redirect for assets page when don't match with the hash length of addresses, transaction or if the value is a number", async () => {
    const user = userEvent.setup();

    const input = container.firstChild?.firstChild as HTMLInputElement;
    const search = container.firstChild?.lastChild as HTMLInputElement;

    await user.type(input, ASSET);
    await user.click(search);

    expect(mockRouter.push).toHaveBeenCalled();
    expect(mockRouter.push).toHaveBeenCalledWith(`/asset/${ASSET}`);
  });

  it('Should do the search when press "ENTER" on keyboard', async () => {
    const user = userEvent.setup();

    const input = container.firstChild?.firstChild as HTMLInputElement;

    await user.type(input, `${ASSET}{enter}`);

    expect(mockRouter.push).toHaveBeenCalled();
    expect(mockRouter.push).toHaveBeenCalledWith(`/asset/${ASSET}`);
  });

  it('Should do the search when press "ENTER" on keyboard with a different asset than KLV or KFI', async () => {
    const user = userEvent.setup();

    const input = container.firstChild?.firstChild as HTMLInputElement;

    await user.type(input, `${ASSET2}{enter}`);

    expect(mockRouter.push).toHaveBeenCalled();
    expect(mockRouter.push).toHaveBeenCalledWith(objectCall);
  });

  it('Should do anything if the search is empty', async () => {
    const user = userEvent.setup();

    const search = container.firstChild?.lastChild as HTMLInputElement;

    await user.click(search);

    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it('Should match the style of the input', () => {
    const style = {
      width: '100%',
      minWidth: '5rem',
      color: theme.input.border.search,
    };
    expect(container.firstChild?.firstChild).toHaveStyle(style);
  });
});
