import { contractOptions } from '@/utils/contracts';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { Contract as ContractProvider } from '../../contexts/contract';
import { renderWithTheme } from '../../test/utils';
import Contract from './index';

const mockContract = {
  contractType: contractOptions.find(item => item.value === 'TransferContract')
    ?.value as string,
  setContractType: jest.fn(),
  ITOBuy: '',
  setITOBuy: jest.fn(),
  isMultiContract: '',
  setIsMultiContract: jest.fn(),
  queue: '',
  selectedBucket: '',
  setSelectedBucket: jest.fn(),
  proposalId: '',
  setProposalId: jest.fn(),
  collection: '',
  setCollection: jest.fn(),
  binaryOperations: '',
  assetID: '',
  setAssetID: jest.fn(),
  txLoading: '',
  setTxLoading: jest.fn(),
  txHash: '',
  setTxHash: jest.fn(),
  addToQueue: '',
  isMultisig: '',
  setIsMultisig: jest.fn(),
  showPayload: '',
  setShowPayload: jest.fn(),
  ownerAddress: '',
};

jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: {},
    };
  },
}));

const paramList = [
  { value: 0, label: 'Fee Per Data Byte: 4000', currentValue: '4000' },
  {
    value: 1,
    label: 'KApp Fee for Validator Creation: 50000000000',
    currentValue: '50000000000',
  },
];
const proposalsList = [
  {
    label: '14: FAIR VALIDATING STANDARDS ACT-- APPLAUDI...',
    value: 14,
  },
];
const getAssets = () => {
  return 'KLV';
};
const assetList = [
  {
    label: 'KLV',
    value: 'KLV',
    isNFT: false,
    balance: 262105830,
    frozenBalance: 1000000000,
    precision: 6,
    buckets: [
      {
        id: '3df451f86831a800ea67bab67ba6718af86857ba11bb240aa5c59e43de2722dc',
        stakeAt: 1658844512,
        stakedEpoch: 100,
        unstakedEpoch: 4294967295,
        balance: 1000000000,
        delegation: '',
        validatorName: '',
      },
    ],
    minEpochsToWithdraw: 2,
    ownerAddress: '',
  },
];
describe('Contract Component', () => {
  it('should render the transfer form contract', async () => {
    const itemsTransfer = [
      'Transfer assets to another wallet.',
      'Select an asset/collection',
      'Amount',
      'Receiver Address',
    ];
    await waitFor(() =>
      renderWithTheme(
        <ContractProvider.Provider value={mockContract as any}>
          <Contract
            paramsList={paramList}
            proposalsList={proposalsList}
            kAssets={[]}
            getAssets={getAssets}
            assetsList={assetList}
          />
        </ContractProvider.Provider>,
      ),
    );

    itemsTransfer.map(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
    const selectAsset = screen.getByText('Choose').nextSibling?.firstChild;
    if (selectAsset) {
      fireEvent.change(selectAsset, {
        target: { value: 'K' },
      });
      const selectKLV = screen.getByText('KLV');
      expect(selectKLV).toBeInTheDocument();
    }
  });

  it('should render the Advanced Options form contract', async () => {
    const advancedOptionsItems = ['Data', 'Is Multisig?', 'Show payload?'];
    await waitFor(() =>
      renderWithTheme(
        <ContractProvider.Provider value={mockContract as any}>
          <Contract
            paramsList={paramList}
            proposalsList={proposalsList}
            kAssets={[]}
            getAssets={getAssets}
            assetsList={assetList}
          />
        </ContractProvider.Provider>,
      ),
    );

    const buttonAdvancedOptions = screen.getByText('Advanced Options');
    fireEvent.click(buttonAdvancedOptions);
    advancedOptionsItems.map(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it('should render the freeze form contract', async () => {
    const itemsFreeze = [
      'Freeze a chosen amount of an asset or collection.',
      'Select an asset/collection',
      'Amount',
    ];
    mockContract.contractType = contractOptions.find(
      item => item.value === 'FreezeContract',
    )?.value as string;
    await waitFor(() =>
      renderWithTheme(
        <ContractProvider.Provider value={mockContract as any}>
          <Contract
            paramsList={paramList}
            proposalsList={proposalsList}
            kAssets={[]}
            getAssets={getAssets}
            assetsList={assetList}
          />
        </ContractProvider.Provider>,
      ),
    );

    itemsFreeze.map(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });

    const selectAsset = screen.getByText('Choose').nextSibling?.firstChild;

    if (selectAsset) {
      fireEvent.change(selectAsset, {
        target: { value: 'K' },
      });
      const selectKLV = screen.getByText('KLV');
      expect(selectKLV).toBeInTheDocument();
    }
  });

  it('should render the Unfreeze form contract', async () => {
    const itemsFreeze = [
      'Unfreeze a bucket of an asset or collection.',
      'Select an asset/collection',
      'Select a bucket',
    ];
    mockContract.contractType = contractOptions.find(
      item => item.value === 'UnfreezeContract',
    )?.value as string;
    await waitFor(() =>
      renderWithTheme(
        <ContractProvider.Provider value={mockContract as any}>
          <Contract
            paramsList={paramList}
            proposalsList={proposalsList}
            kAssets={[]}
            getAssets={getAssets}
            assetsList={assetList}
          />
        </ContractProvider.Provider>,
      ),
    );

    itemsFreeze.map(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
    const getInputs = screen.getAllByText('Choose');

    const selectAsset = getInputs[0].nextSibling?.firstChild;

    if (selectAsset) {
      fireEvent.change(selectAsset, {
        target: { value: 'K' },
      });
      const selectKLV = screen.getByText('KLV');
      await waitFor(() => expect(selectKLV).toBeInTheDocument());
    }
  });

  it('should render the Delegate form contract', async () => {
    const itemsFreeze = [
      'Delegate a bucket to a validator.',
      'Validator Address',
      'Select a bucket',
    ];
    mockContract.contractType = contractOptions.find(
      item => item.value === 'DelegateContract',
    )?.value as string;
    await waitFor(() =>
      renderWithTheme(
        <ContractProvider.Provider value={mockContract as any}>
          <Contract
            paramsList={paramList}
            proposalsList={proposalsList}
            kAssets={[]}
            getAssets={getAssets}
            assetsList={assetList}
          />
        </ContractProvider.Provider>,
      ),
    );
    itemsFreeze.map(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
    const selectBucket = screen.getByText('Choose').nextSibling?.firstChild;

    if (selectBucket) {
      fireEvent.change(selectBucket, {
        target: { value: 'a' },
      });
      const selectBucketAddress = screen.getByText('3df451f868...43de2722dc');
      expect(selectBucketAddress).toBeInTheDocument();
    }
  });

  it('should render the Create Asset form contract', async () => {
    const itemsCreateAsset = [
      'Create a new Coin(Fungible Token) or an NFT Collection.',
      'Name',
      'Ticker',
      'Owner Address',
      'Max Supply',
      'Logo',
      'Uris',
      'Uri',
      'Royalties',
      'Address',
      'Market Fixed',
      'Market Percentage',
      'Transfer Fixed',
      'Properties',
    ];
    mockContract.contractType = contractOptions.find(
      item => item.value === 'CreateAssetContract',
    )?.value as string;

    await waitFor(() =>
      renderWithTheme(
        <ContractProvider.Provider value={mockContract as any}>
          <Contract
            paramsList={paramList}
            proposalsList={proposalsList}
            kAssets={[]}
            getAssets={getAssets}
            assetsList={assetList}
          />
        </ContractProvider.Provider>,
      ),
    );

    itemsCreateAsset.map(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it('should render the Create Validator form contract', async () => {
    const itemsCreateValidator = [
      'Generate a new validator.',
      'Name',
      'Owner Address',
      'BLS Public Key',
      'Reward Address',
      'Commission',
      'Logo',
      'Can Delegate',
      'Max Delegation Amount',
      'Uri',
    ];
    mockContract.contractType = contractOptions.find(
      item => item.value === 'CreateValidatorContract',
    )?.value as string;

    await waitFor(() =>
      renderWithTheme(
        <ContractProvider.Provider value={mockContract as any}>
          <Contract
            paramsList={paramList}
            proposalsList={proposalsList}
            kAssets={[]}
            getAssets={getAssets}
            assetsList={assetList}
          />
        </ContractProvider.Provider>,
      ),
    );

    itemsCreateValidator.map(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it('should render the Edit Validator Settings form contract', async () => {
    const items = [
      'Edit the current settings for a validator.',
      'Name',
      'BLS Public Key',
      'Reward Address',
      'Commission',
      'Logo',
      'Can Delegate',
      'Max Delegation Amount',
      'Uri',
    ];
    mockContract.contractType = contractOptions.find(
      item => item.value === 'ValidatorConfigContract',
    )?.value as string;

    await waitFor(() =>
      renderWithTheme(
        <ContractProvider.Provider value={mockContract as any}>
          <Contract
            paramsList={paramList}
            proposalsList={proposalsList}
            kAssets={[]}
            getAssets={getAssets}
            assetsList={assetList}
          />
        </ContractProvider.Provider>,
      ),
    );

    items.map(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it('should render the Undelegate form contract', async () => {
    const items = ['Undelegate a bucket.', 'Select a bucket'];
    mockContract.contractType = contractOptions.find(
      item => item.value === 'UndelegateContract',
    )?.value as string;

    await waitFor(() =>
      renderWithTheme(
        <ContractProvider.Provider value={mockContract as any}>
          <Contract
            paramsList={paramList}
            proposalsList={proposalsList}
            kAssets={[]}
            getAssets={getAssets}
            assetsList={assetList}
          />
        </ContractProvider.Provider>,
      ),
    );

    items.map(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it('should render the Withdraw form contract', async () => {
    const itemsEditValidator = [
      'Total withdraw of the chosen asset.',
      'Select an asset/collection',
    ];
    mockContract.contractType = contractOptions.find(
      item => item.value === 'WithdrawContract',
    )?.value as string;

    await waitFor(() =>
      renderWithTheme(
        <ContractProvider.Provider value={mockContract as any}>
          <Contract
            paramsList={paramList}
            proposalsList={proposalsList}
            kAssets={[]}
            getAssets={getAssets}
            assetsList={assetList}
          />
        </ContractProvider.Provider>,
      ),
    );

    itemsEditValidator.map(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it('should render the Claim form contract', async () => {
    const items = ['Claim rewards or expired market orders.', 'Claim Type'];
    mockContract.contractType = contractOptions.find(
      item => item.value === 'ClaimContract',
    )?.value as string;

    await waitFor(() =>
      renderWithTheme(
        <ContractProvider.Provider value={mockContract as any}>
          <Contract
            paramsList={paramList}
            proposalsList={proposalsList}
            kAssets={[]}
            getAssets={getAssets}
            assetsList={assetList}
          />
        </ContractProvider.Provider>,
      ),
    );

    items.map(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it('should render the Unjail form contract', async () => {
    const items = [
      'Unjails your validator, be sure to use only if the cause of the jail is already fixed.',
    ];
    mockContract.contractType = contractOptions.find(
      item => item.value === 'UnjailContract',
    )?.value as string;

    await waitFor(() =>
      renderWithTheme(
        <ContractProvider.Provider value={mockContract as any}>
          <Contract
            paramsList={paramList}
            proposalsList={proposalsList}
            kAssets={[]}
            getAssets={getAssets}
            assetsList={assetList}
          />
        </ContractProvider.Provider>,
      ),
    );
    items.map(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it('should render the Asset Trigger form contract', async () => {
    const items = [
      'A contract setting operations over a collection of assets or an NFT.',
      'Trigger Type',
    ];
    mockContract.contractType = contractOptions.find(
      item => item.value === 'AssetTriggerContract',
    )?.value as string;

    await waitFor(() =>
      renderWithTheme(
        <ContractProvider.Provider value={mockContract as any}>
          <Contract
            paramsList={paramList}
            proposalsList={proposalsList}
            kAssets={[]}
            getAssets={getAssets}
            assetsList={assetList}
          />
        </ContractProvider.Provider>,
      ),
    );
    items.map(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it('should render the Set Account Name form contract', async () => {
    const items = ['Set a new name for the current account.', 'Name'];
    mockContract.contractType = contractOptions.find(
      item => item.value === 'SetAccountNameContract',
    )?.value as string;

    await waitFor(() =>
      renderWithTheme(
        <ContractProvider.Provider value={mockContract as any}>
          <Contract
            paramsList={paramList}
            proposalsList={proposalsList}
            kAssets={[]}
            getAssets={getAssets}
            assetsList={assetList}
          />
        </ContractProvider.Provider>,
      ),
    );
    items.map(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it('should render the Proposal form contract', async () => {
    const items = [
      'Create a proposal to change the blockchain parameters.',
      'Description',
      'Epochs Duration',
      'Parameters',
    ];
    mockContract.contractType = contractOptions.find(
      item => item.value === 'ProposalContract',
    )?.value as string;

    await waitFor(() =>
      renderWithTheme(
        <ContractProvider.Provider value={mockContract as any}>
          <Contract
            paramsList={paramList}
            proposalsList={proposalsList}
            kAssets={[]}
            getAssets={getAssets}
            assetsList={assetList}
          />
        </ContractProvider.Provider>,
      ),
    );
    items.map(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it('should render the Vote form contract', async () => {
    const items = ['Vote in a proposal.', 'Proposal ID', 'Amount', 'Type'];
    mockContract.contractType = contractOptions.find(
      item => item.value === 'VoteContract',
    )?.value as string;

    await waitFor(() =>
      renderWithTheme(
        <ContractProvider.Provider value={mockContract as any}>
          <Contract
            paramsList={paramList}
            proposalsList={proposalsList}
            kAssets={[]}
            getAssets={getAssets}
            assetsList={assetList}
          />
        </ContractProvider.Provider>,
      ),
    );
    items.map(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it('should render the Buy form contract', async () => {
    const items = ['Buy tokens.', 'Id', 'Currency Id', 'Amount'];
    mockContract.contractType = contractOptions.find(
      item => item.value === 'BuyContract',
    )?.value as string;

    await waitFor(() =>
      renderWithTheme(
        <ContractProvider.Provider value={mockContract as any}>
          <Contract
            paramsList={paramList}
            proposalsList={proposalsList}
            kAssets={[]}
            getAssets={getAssets}
            assetsList={assetList}
          />
        </ContractProvider.Provider>,
      ),
    );
    items.map(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it('should render the Sell form contract', async () => {
    const items = [
      'Sell tokens.',
      'Market Type',
      'Price',
      'End Time',
      'Reserve Price',
    ];
    mockContract.contractType = contractOptions.find(
      item => item.value === 'SellContract',
    )?.value as string;

    await waitFor(() =>
      renderWithTheme(
        <ContractProvider.Provider value={mockContract as any}>
          <Contract
            paramsList={paramList}
            proposalsList={proposalsList}
            kAssets={[]}
            getAssets={getAssets}
            assetsList={assetList}
          />
        </ContractProvider.Provider>,
      ),
    );
    items.map(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it('should render the Cancel Market Order form contract', async () => {
    const items = ['Order Id'];
    mockContract.contractType = contractOptions.find(
      item => item.value === 'CancelMarketOrderContract',
    )?.value as string;

    await waitFor(() =>
      renderWithTheme(
        <ContractProvider.Provider value={mockContract as any}>
          <Contract
            paramsList={paramList}
            proposalsList={proposalsList}
            kAssets={[]}
            getAssets={getAssets}
            assetsList={assetList}
          />
        </ContractProvider.Provider>,
      ),
    );
    items.map(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it('should render the Create Marketplace form contract', async () => {
    const items = [
      'Create a new Marketplace.',
      'Name',
      'Referral Address',
      'Referral Percentage',
    ];
    mockContract.contractType = contractOptions.find(
      item => item.value === 'CreateMarketplaceContract',
    )?.value as string;

    await waitFor(() =>
      renderWithTheme(
        <ContractProvider.Provider value={mockContract as any}>
          <Contract
            paramsList={paramList}
            proposalsList={proposalsList}
            kAssets={[]}
            getAssets={getAssets}
            assetsList={assetList}
          />
        </ContractProvider.Provider>,
      ),
    );
    items.map(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it('should render the Configure Marketplace form contract', async () => {
    const items = [
      'Set up a Marketplace.',
      'Marketplace Id',
      'Referral Address',
      'Referral Percentage',
      'Name',
    ];
    mockContract.contractType = contractOptions.find(
      item => item.value === 'ConfigMarketplaceContract',
    )?.value as string;

    await waitFor(() =>
      renderWithTheme(
        <ContractProvider.Provider value={mockContract as any}>
          <Contract
            paramsList={paramList}
            proposalsList={proposalsList}
            kAssets={[]}
            getAssets={getAssets}
            assetsList={assetList}
          />
        </ContractProvider.Provider>,
      ),
    );
    items.map(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it('should render the Config ITO form contract', async () => {
    const items = [
      'Set up an Initial Token Offering.',
      'Select an asset/collection',
      'Receiver Address',
      'Status',
      'Max Amount',
      'PackInfo',
    ];
    mockContract.contractType = contractOptions.find(
      item => item.value === 'ConfigITOContract',
    )?.value as string;

    await waitFor(() =>
      renderWithTheme(
        <ContractProvider.Provider value={mockContract as any}>
          <Contract
            paramsList={paramList}
            proposalsList={proposalsList}
            kAssets={[]}
            getAssets={getAssets}
            assetsList={assetList}
          />
        </ContractProvider.Provider>,
      ),
    );

    const selectAsset = screen.getByText('Choose').nextSibling?.firstChild;

    if (selectAsset) {
      fireEvent.change(selectAsset, {
        target: { value: 'K' },
      });
    }

    items.map(async item => {
      expect(await screen.findByText(item)).toBeInTheDocument();
    });
  });

  // TODO - Update Account Permission not implemented yet
  // it('should render the Update Account Permission form contract', async () => {
  //   mockContract.contractType = contractOptions.find(
  //   item => item.value === "UpdateAccountPermissionContract"
  // )?.value as string;
  //   await waitFor(() =>
  //     renderWithTheme(
  //       <ContractProvider.Provider value={mockContract as any}>
  //         <Contract
  //           paramsList={paramList}
  //           proposalsList={proposalsList}
  //           kAssets={[]}
  //           getAssets={getAssets}
  //           assetsList={assetList}
  //         />
  //       </ContractProvider.Provider>,
  //     ),
  //   );
  //   expect(screen.getByText('Update Account Permission')).toBeInTheDocument();
  // });
});
