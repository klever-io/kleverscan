import SubmitButton from '@/components/Form/SubmitButton';
import { act } from 'react';
import { createRoot, Root } from 'react-dom/client';

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const submitForms = jest.fn();
const connectExtension = jest.fn().mockResolvedValue(undefined);

const contract = {
  txLoading: false,
  submitForms,
};

const multi = {
  isMultiContract: false,
  kdaFeePoolIsFetching: false,
  processFeesMsgs: () => ({
    totalFeesMsg: '1 KLV',
    totalKappFeesMsg: '1',
    totalBandwidthFeesMsg: '0',
  }),
};

const extension = {
  extensionInstalled: true as boolean | undefined,
  connectExtension,
  walletAddress: '',
  extensionLoading: false,
};

jest.mock('@/contexts/contract', () => ({
  useContract: () => contract,
}));

jest.mock('@/contexts/contract/multicontract', () => ({
  useMulticontract: () => multi,
}));

jest.mock('@/contexts/extension', () => ({
  useExtension: () => extension,
}));

jest.mock('@/components/Tooltip', () => () => null);

jest.mock('@/styles/common', () => ({
  FlexSpan: (props: { children?: unknown }) => props.children,
}));

jest.mock('../../styles', () => {
  const React = require('react');
  const pass = (props: { children?: unknown }) =>
    React.createElement('div', null, props.children);
  return {
    SubmitContainer: pass,
    FeeContainer: pass,
    HiddenSubmitButton: () => null,
    ButtonContainer: ({
      submit: _submit,
      ...props
    }: {
      submit?: boolean;
      children?: unknown;
    }) => React.createElement('button', props),
  };
});

describe('SubmitButton', () => {
  let container: HTMLDivElement;
  let root: Root;

  const renderButton = () => {
    act(() => {
      root.render(<SubmitButton />);
    });
  };

  beforeEach(() => {
    submitForms.mockClear();
    connectExtension.mockClear();
    extension.extensionInstalled = true;
    extension.walletAddress = '';
    extension.extensionLoading = false;
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    renderButton();
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  const clickCreate = async () => {
    const button = container.querySelector('button');
    if (!button) throw new Error('missing submit button');
    await act(async () => {
      button.click();
    });
  };

  it('submits with the address from the render after the wallet connects', async () => {
    await clickCreate();
    expect(connectExtension).toHaveBeenCalledTimes(1);
    expect(submitForms).not.toHaveBeenCalled();

    extension.extensionLoading = true;
    renderButton();
    extension.extensionLoading = false;
    extension.walletAddress = 'klv1connected';
    renderButton();

    expect(submitForms).toHaveBeenCalledTimes(1);
  });

  it('does not submit when the connection is refused, nor when a later connect lands', async () => {
    await clickCreate();

    extension.extensionLoading = true;
    renderButton();
    extension.extensionLoading = false;
    renderButton();
    expect(submitForms).not.toHaveBeenCalled();

    extension.walletAddress = 'klv1later';
    renderButton();
    expect(submitForms).not.toHaveBeenCalled();
  });
});
