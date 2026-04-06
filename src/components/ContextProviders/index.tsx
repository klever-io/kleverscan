import { PropsWithChildren } from 'react';
import { ContractProvider } from '@/contexts/contract';
import { FeesProvider } from '@/contexts/contract/fees';
import { ModalsProvider } from '@/contexts/contract/modals';
import { MulticontractProvider } from '@/contexts/contract/multicontract';
import { WizardProvider } from '@/contexts/contract/wizard';
import { ContractModalProvider } from '@/contexts/contractModal';
import { ExtensionProvider } from '@/contexts/extension';
import { KleverProvider } from '@klever/connect-react';
import { InputSearchProvider } from '@/contexts/inputSearch';
import { MobileProvider } from '@/contexts/mobile';
import { ParticipateProvider } from '@/contexts/participate';
import { InternalThemeProvider } from '@/contexts/theme';
import { GetServerSideProps } from 'next';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import { NetworkParamsProvider } from '@/contexts/contract/networkParams';

const ContextProviders: React.FC<PropsWithChildren> = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer />
      <MobileProvider>
        <KleverProvider
          config={{
            network: process.env.DEFAULT_API_HOST?.includes('mainnet')
              ? 'mainnet'
              : process.env.DEFAULT_API_HOST?.includes('devnet')
                ? 'devnet'
                : 'testnet',
          }}
        >
          <ExtensionProvider>
            <ModalsProvider>
              <NetworkParamsProvider>
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
              </NetworkParamsProvider>
            </ModalsProvider>
          </ExtensionProvider>
        </KleverProvider>
      </MobileProvider>
    </QueryClientProvider>
  );
};

export default ContextProviders;
