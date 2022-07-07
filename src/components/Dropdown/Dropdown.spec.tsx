import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithTheme } from '../../test/utils';

import Dropdown from './';

describe('Component: Dropdown URI', () => {
  it('Should render the uris when pass only 1 URI', () => {
    const uris = { github: 'github.com/klever-io'};
    renderWithTheme(<Dropdown uris={uris} />);

    const github = screen.getByRole('link',
      { name: uris.github });
    expect(github).toBeInTheDocument();
    expect(github).toHaveAttribute('href', `https://${uris.github}`);
  });

  it('Should render the uris ( initialy 3 ) and when click to on icon should show all when pass more 4 or more uris', async () => {
    const user = userEvent.setup();
    const uris = {
      github: 'github.com/klever-io',
      website: 'klever.io',
      twitter: 'twitter.com/klever_io',
      linkedin: 'linkedin.com/company/klever-app/',
      medium: 'test.medium.com',
    };
    const { container } = renderWithTheme(<Dropdown uris={uris} />);

    const github = screen.getByRole('link',
      { name: uris.github });
    const website = screen.getByRole('link',
    { name: uris.website });
    const twitter = screen.getByRole('link',
    { name: uris.twitter });
    
    expect(github).toBeInTheDocument();
    expect(website).toBeInTheDocument();
    expect(twitter).toBeInTheDocument();
    expect(github).toHaveAttribute('href', `https://${uris.github}`);
    expect(website).toHaveAttribute('href', `https://${uris.website}`);
    expect(twitter).toHaveAttribute('href', `https://${uris.twitter}`);

    const showMore: any = container.firstChild?.lastChild;
    await user.click(showMore);
    const linkedin = screen.getByRole('link',
    { name: uris.linkedin });
    expect(linkedin).toBeInTheDocument();
    expect(linkedin).toHaveAttribute('href', `https://${uris.linkedin}`);

  });

  
});