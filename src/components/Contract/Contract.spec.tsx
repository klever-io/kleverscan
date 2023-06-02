import { renderWithTheme } from '@/test/utils';
import Contract from './index';

describe('Contract Component', () => {
  it('should render the contract form', async () => {
    const contract = renderWithTheme(<Contract />);

    expect(contract).toBeTruthy();
  });
});
