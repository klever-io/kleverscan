import React from 'react';
import { renderWithTheme } from '../../test/utils';
import Skeleton from './';

describe('Componenet: Skeleton', () => {
  it('Should render the loading skeleton with the styles correctly', () => {
    const { container } = renderWithTheme(
      <Skeleton width="100%" height={100} />,
    );
    expect(container.firstChild).toBeInTheDocument();
    expect(container.firstChild).toHaveStyle('width: 100%');

    const styles = {
      width: '100%',
      height: '100%',
      display: 'inline-block',
      borderRadius: '5px',
    };
    expect(container.firstChild?.firstChild).toHaveStyle(styles);
  });

  it("Should render with the default props when don't pass props", () => {
    const { container } = renderWithTheme(<Skeleton />);
    expect(container.firstChild).toHaveStyle('width: 120px; height: 25px');
  });
});
