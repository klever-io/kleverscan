import { ContractProvider } from '@/contexts/contract';
import { FeesProvider } from '@/contexts/contract/fees';
import { MulticontractProvider } from '@/contexts/contract/multicontract';
import { ContractModalProvider } from '@/contexts/contractModal';
import { ExtensionProvider } from '@/contexts/extension';
import { MobileProvider } from '@/contexts/mobile';
import { InternalThemeProvider } from '@/contexts/theme';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ToastContainer } from 'react-toastify';

const ContextProviders: React.FC = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <InternalThemeProvider>
        <ToastContainer />
        <MobileProvider>
          <ExtensionProvider>
            <ContractProvider>
              <FeesProvider>
                <MulticontractProvider>
                  <ContractModalProvider>{children}</ContractModalProvider>
                </MulticontractProvider>
              </FeesProvider>
            </ContractProvider>
          </ExtensionProvider>
        </MobileProvider>
      </InternalThemeProvider>
    </QueryClientProvider>
  );
};

export default ContextProviders;
