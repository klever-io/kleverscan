import { IoReloadSharpWrapper } from '@/components/Header/ConnectWallet/styles';
import styled from 'styled-components';

export const ReloadWrapper = styled(IoReloadSharpWrapper)`
  margin-left: auto;

  :not(:last-child) {
    margin-right: 1rem;
  }

  svg {
    margin-top: 0;
  }
`;
