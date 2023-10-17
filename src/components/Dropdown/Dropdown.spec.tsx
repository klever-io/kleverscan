import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { renderWithTheme } from '../../test/utils';
import Dropdown from './';

describe('Component: Dropdown URI', () => {
  it('Should render the uris when pass only 1 URI', () => {
    const uris = [{ value: 'github.com/klever-io', key: 'github' }];
    renderWithTheme(<Dropdown uris={uris} />);

    const github = screen.getByRole('link', { name: uris[0].value });
    expect(github).toBeInTheDocument();
    expect(github).toHaveAttribute('href', `https://${uris[0].value}`);
  });

  it('Should render the uris ( initialy 3 ) and when click to on icon should show all when pass more 4 or more uris', async () => {
    const user = userEvent.setup();
    const uris = [
      {
        value: 'github.com/klever-io',
        key: 'github',
      },
      {
        value: 'klever.io',
        key: 'website',
      },
      {
        value: 'twitter.com/klever_io',
        key: 'twitter',
      },
      {
        value: 'linkedin.com/company/klever-app/',
        key: 'linkedin',
      },
      {
        value: 'test.medium.com',
        key: 'medium',
      },
    ];

    const { container } = renderWithTheme(<Dropdown uris={uris} />);

    const github = screen.getByRole('link', { name: uris[0].value });
    const website = screen.getByRole('link', { name: uris[1].value });
    const twitter = screen.getByRole('link', { name: uris[2].value });

    expect(github).toBeInTheDocument();
    expect(website).toBeInTheDocument();
    expect(twitter).toBeInTheDocument();
    expect(github).toHaveAttribute('href', `https://${uris[0].value}`);
    expect(website).toHaveAttribute('href', `https://${uris[1].value}`);
    expect(twitter).toHaveAttribute('href', `https://${uris[2].value}`);

    const showMore = container.firstChild?.lastChild as HTMLElement;
    await user.click(showMore);
    const linkedin = screen.getByRole('link', { name: uris[3].value });
    expect(linkedin).toBeInTheDocument();
    expect(linkedin).toHaveAttribute('href', `https://${uris[3].value}`);
  });
});
