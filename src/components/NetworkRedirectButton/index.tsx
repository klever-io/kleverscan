import { ArrowDropdown } from '@/assets/icons';
import { getNetwork } from '@/utils/networkFunctions';
import React from 'react';
import {
  ButtonContainer,
  ButtonDropdownItem,
  ButtonDropdownMenu,
  ButtonItem,
  NetworkDropdown,
} from './styles';

const NetworkRedirectButton: React.FC = () => {
  const currentNetwork = getNetwork().toLowerCase();
  const availableNetworks = ['mainnet', 'testnet'];

  const sanitizedNetworknames = {
    ['mainnet']: 'MainNet',
    ['testnet']: 'TestNet',
    ['devnet']: 'DevNet',
  };

  const sanitizeNetworkName = (network: string) => {
    const lowerCaseNetwork = network.toLowerCase();
    return sanitizedNetworknames[lowerCaseNetwork];
  };

  const getNetworkPath = (network: string) => {
    if (network === 'mainnet') {
      return 'https://kleverscan.org/';
    } else if (network === 'testnet') {
      return 'https://testnet.kleverscan.org/';
    } else if (network === 'devnet') {
      return 'https://devnet.kleverscan.org/';
    }
  };
  return (
    <ButtonContainer>
      <ButtonItem selected={false}>
        {sanitizeNetworkName(currentNetwork)}
        <NetworkDropdown>
          <ButtonDropdownMenu>
            {availableNetworks.map(item => {
              return (
                <React.Fragment key={item}>
                  <a
                    href={getNetworkPath(item)}
                    data-testid="network-navbar-item"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ButtonDropdownItem>
                      {sanitizeNetworkName(item)}
                    </ButtonDropdownItem>
                  </a>
                </React.Fragment>
              );
            })}
          </ButtonDropdownMenu>
        </NetworkDropdown>
        <ArrowDropdown />
      </ButtonItem>
    </ButtonContainer>
  );
};

export default NetworkRedirectButton;
