import { ContractProvider } from '@/contexts/contract';
import { FeesProvider } from '@/contexts/contract/fees';
import { ModalsProvider } from '@/contexts/contract/modals';
import { MulticontractProvider } from '@/contexts/contract/multicontract';
import { WizardProvider } from '@/contexts/contract/wizard';
import { ContractModalProvider } from '@/contexts/contractModal';
import { ExtensionProvider } from '@/contexts/extension';
import { InputSearchProvider } from '@/contexts/inputSearch';
import { MobileProvider } from '@/contexts/mobile';
import { ParticipateProvider } from '@/contexts/participate';
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
            <ModalsProvider>
              <FeesProvider>
                <MulticontractProvider>
                  <ContractProvider>
                    <InputSearchProvider>
                      <ParticipateProvider>
                        <ContractModalProvider>
                          <WizardProvider>{children}</WizardProvider>
                        </ContractModalProvider>
                      </ParticipateProvider>
                    </InputSearchProvider>
                  </ContractProvider>
                </MulticontractProvider>
              </FeesProvider>
            </ModalsProvider>
          </ExtensionProvider>
        </MobileProvider>
      </InternalThemeProvider>
    </QueryClientProvider>
  );
};

export default ContextProviders;
