import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/router';
import React from 'react';
import Layout from '.';
import { Accounts as Icon } from '../../assets/title-icons';
import Title from '../../components/Layout/Title';
import { renderWithTheme } from '../../test/utils';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

describe("test Layout and it's inner components", () => {
  const mockRouter = {
    push: jest.fn(() => '/'),
    pathname: '/accounts',
  };
  (useRouter as jest.Mock).mockReturnValue(mockRouter);
  it("test layout component can have new children and its loading correctly it's default children", () => {
    const { container } = renderWithTheme(
      <Layout>
        <div>Hello world!</div>
      </Layout>,
    );

    const hello = screen.getByText(/Hello world!/i);

    const navBarItems = [
      'Assets',
      'Accounts',
      'Transactions',
      'Validators',
      'More',
      'Proposals',
      'Charts',
    ];
    navBarItems.forEach(item => {
      expect(screen.getAllByText(item)[0]).toBeInTheDocument();
    });
    expect(hello).toBeInTheDocument();

    const footerText = [
      'Klever Exchange',
      'Klever Ecosystem',
      'Klever Wallet App',
      'Privacy Policy',
      'Klever News',
      'Roadmap',
    ];
    footerText.forEach(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
    const layoutContainerStyles = {
      margin: 'auto',
      backgroundColor: 'rgb(235, 241, 248)',
      position: 'relative',
    };

    const mainStyles = {
      padding: '3rem min(5vw, 10rem) 5rem',
      display: 'block',
      margin: '0px auto',
      maxWidth: '1900px',
      backgroundColor: 'rgb(235, 241, 248)',
    };

    const layoutContainer = container.firstElementChild;
    expect(layoutContainer).toHaveStyle(layoutContainerStyles);

    const main =
      container.firstElementChild?.firstElementChild?.nextElementSibling
        ?.nextElementSibling?.nextElementSibling;
    expect(main).toHaveStyle(mainStyles);
  });
  it('tests Title component', async () => {
    const { container } = renderWithTheme(
      <Title
        title="Accounts"
        Icon={Icon}
        Component={() => <div>Hello world!</div>}
        route="/"
      />,
    );
    const user = userEvent.setup();
    const title = screen.getByText(/Accounts/i);
    expect(title).toBeInTheDocument();
    expect(title.nodeName).toBe('H1');

    const returnTo = container?.firstElementChild?.firstElementChild;
    const arrow = returnTo?.firstElementChild;
    expect(arrow?.nodeName).toBe('svg');
    await user.click(returnTo as Element);
    expect(mockRouter.push).toHaveBeenCalledTimes(1);

    const componentText = screen.getByText(/Hello world!/i);
    expect(componentText).toBeInTheDocument();
  });
  it('renders without route prop and router.push can still be called', async () => {
    const { container } = renderWithTheme(
      <Title
        title="Accounts"
        Icon={Icon}
        Component={() => <div>Hello world!</div>}
      />,
    );
    const user = userEvent.setup();

    const returnTo = container?.firstElementChild?.firstElementChild;
    await user.click(returnTo as Element);
    expect(mockRouter.push).toHaveBeenCalledTimes(1);
  });
  jest.clearAllMocks();
});
