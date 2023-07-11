import { ContractProvider } from '@/contexts/contract';
import { FeesProvider } from '@/contexts/contract/fees';
import { MulticontractProvider } from '@/contexts/contract/multicontract';
import { renderWithTheme } from '@/test/utils';
import Contract from './index';

jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: {},
      isReady: true,
    };
  },
}));
describe('Contract Component', () => {
  it('should render the contract form', async () => {
    const contract = renderWithTheme(
      <FeesProvider>
        <ContractProvider>
          <MulticontractProvider>
            <Contract />
          </MulticontractProvider>
        </ContractProvider>
      </FeesProvider>,
    );

    expect(contract).toBeTruthy();
  });
});
