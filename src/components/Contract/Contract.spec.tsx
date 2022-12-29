import { fireEvent, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { renderWithTheme } from '../../test/utils';
import { contractOptions } from '../../utils/contracts';
import Contract from './index';

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
  it('should render the contract input', async () => {
    await waitFor(() =>
      renderWithTheme(
        <Contract
          paramsList={paramList}
          proposalsList={proposalsList}
          kAssets={[]}
          getAssets={getAssets}
          assetsList={assetList}
        />,
      ),
    );
    const input = screen.getByText('Choose Contract');
    expect(input).toBeVisible();
  });

  it('should render the contracts options', async () => {
    let container: any;
    await waitFor(
      () =>
        ({ container } = renderWithTheme(
          <Contract
            paramsList={paramList}
            proposalsList={proposalsList}
            kAssets={[]}
            getAssets={getAssets}
            assetsList={assetList}
          />,
        )),
    );
    const button =
      container.firstChild?.firstChild?.firstChild?.lastChild?.firstChild
        ?.lastChild?.firstChild;
    fireEvent.change(button, {
      target: { value: 'a' },
    });
    contractOptions.map(option => {
      expect(screen.getByText(option.label)).toBeInTheDocument();
    });
  });

  it('should render the transfer form contract', async () => {
    const itemsTransfer = [
      'Transfer assets to a given receiver.',
      'Select an asset/collection',
      'Amount',
      'Receiver Address',
    ];
    let container: any;
    await waitFor(
      () =>
        ({ container } = renderWithTheme(
          <Contract
            paramsList={paramList}
            proposalsList={proposalsList}
            kAssets={[]}
            getAssets={getAssets}
            assetsList={assetList}
          />,
        )),
    );
    const button =
      container.firstChild?.firstChild?.firstChild?.lastChild?.firstChild
        ?.lastChild?.firstChild;
    fireEvent.change(button, {
      target: { value: 'a' },
    });
    const transferOptions = screen.getByText('Transfer');
    fireEvent.click(transferOptions);
    itemsTransfer.map(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
    const selectAsset =
      container.firstChild?.childNodes[2].firstChild?.lastChild?.firstChild
        ?.lastChild?.firstChild?.lastChild?.firstChild;
    fireEvent.change(selectAsset, {
      target: { value: 'K' },
    });
    const selectKLV = screen.getByText('KLV');
    expect(selectKLV).toBeInTheDocument();
  });

  it('should render the Advanced Options form contract', async () => {
    const advancedOptionsItems = ['Data', 'Is Multisig?', 'Show payload?'];
    let container: any;
    await waitFor(
      () =>
        ({ container } = renderWithTheme(
          <Contract
            paramsList={paramList}
            proposalsList={proposalsList}
            kAssets={[]}
            getAssets={getAssets}
            assetsList={assetList}
          />,
        )),
    );
    const button =
      container.firstChild?.firstChild?.firstChild?.lastChild?.firstChild
        ?.lastChild?.firstChild;
    fireEvent.change(button, {
      target: { value: 'a' },
    });
    const createAssetOptions = screen.getByText('Transfer');
    fireEvent.click(createAssetOptions);
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
    let container: any;
    await waitFor(
      () =>
        ({ container } = renderWithTheme(
          <Contract
            paramsList={paramList}
            proposalsList={proposalsList}
            kAssets={[]}
            getAssets={getAssets}
            assetsList={assetList}
          />,
        )),
    );
    const button =
      container.firstChild?.firstChild?.firstChild?.lastChild?.firstChild
        ?.lastChild?.firstChild;
    fireEvent.change(button, {
      target: { value: 'a' },
    });
    const transferOptions = screen.getByText('Freeze');
    fireEvent.click(transferOptions);
    itemsFreeze.map(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
    const selectAsset =
      container.firstChild?.childNodes[2].firstChild?.lastChild?.firstChild
        ?.lastChild?.firstChild?.lastChild?.firstChild;
    fireEvent.change(selectAsset, {
      target: { value: 'K' },
    });
    const selectKLV = screen.getByText('KLV');
    expect(selectKLV).toBeInTheDocument();
  });

  it('should render the Unfreeze form contract', async () => {
    const itemsFreeze = [
      'Unfreeze a bucket of an asset or collection.',
      'Select an asset/collection',
      'Select a bucket',
    ];
    let container: any;
    await waitFor(
      () =>
        ({ container } = renderWithTheme(
          <Contract
            paramsList={paramList}
            proposalsList={proposalsList}
            kAssets={[]}
            getAssets={getAssets}
            assetsList={assetList}
          />,
        )),
    );
    const button =
      container.firstChild?.firstChild?.firstChild?.lastChild?.firstChild
        ?.lastChild?.firstChild;
    fireEvent.change(button, {
      target: { value: 'a' },
    });
    const transferOptions = screen.getByText('Unfreeze');
    fireEvent.click(transferOptions);
    itemsFreeze.map(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
    const selectAsset =
      container.firstChild?.childNodes[2].firstChild?.lastChild?.firstChild
        ?.lastChild?.firstChild?.lastChild?.firstChild;
    fireEvent.change(selectAsset, {
      target: { value: 'K' },
    });
    const selectKLV = screen.getByText('KLV');
    expect(selectKLV).toBeInTheDocument();
  });

  it('should render the Delegate form contract', async () => {
    const itemsFreeze = [
      'Delegate a bucket to a validator.',
      'Receiver',
      'Select a bucket',
    ];
    let container: any;
    await waitFor(
      () =>
        ({ container } = renderWithTheme(
          <Contract
            paramsList={paramList}
            proposalsList={proposalsList}
            kAssets={[]}
            getAssets={getAssets}
            assetsList={assetList}
          />,
        )),
    );
    const button =
      container.firstChild?.firstChild?.firstChild?.lastChild?.firstChild
        ?.lastChild?.firstChild;
    fireEvent.change(button, {
      target: { value: 'a' },
    });
    const transferOptions = screen.getByText('Delegate');
    fireEvent.click(transferOptions);
    itemsFreeze.map(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
    const selectBucket =
      container.firstChild?.childNodes[2].firstChild?.lastChild?.firstChild
        ?.lastChild?.firstChild?.lastChild?.firstChild;
    fireEvent.change(selectBucket, {
      target: { value: 'a' },
    });
    const selectBucketAddress = screen.getByText('3df451f868...43de2722dc');
    expect(selectBucketAddress).toBeInTheDocument();
  });

  it('should render the Create Asset form contract', async () => {
    const itemsCreateAsset = [
      'Choose between creating a Token or an NFT.',
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
    let container: any;
    await waitFor(
      () =>
        ({ container } = renderWithTheme(
          <Contract
            paramsList={paramList}
            proposalsList={proposalsList}
            kAssets={[]}
            getAssets={getAssets}
            assetsList={assetList}
          />,
        )),
    );
    const button =
      container.firstChild?.firstChild?.firstChild?.lastChild?.firstChild
        ?.lastChild?.firstChild;
    fireEvent.change(button, {
      target: { value: 'a' },
    });
    const createAssetOptions = screen.getByText('Create Asset');
    fireEvent.click(createAssetOptions);
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
      'Comission',
      'Logo',
      'Can Delegate',
      'Max Delegation Amount',
      'Uri',
    ];
    let container: any;
    await waitFor(
      () =>
        ({ container } = renderWithTheme(
          <Contract
            paramsList={paramList}
            proposalsList={proposalsList}
            kAssets={[]}
            getAssets={getAssets}
            assetsList={assetList}
          />,
        )),
    );
    const button =
      container.firstChild?.firstChild?.firstChild?.lastChild?.firstChild
        ?.lastChild?.firstChild;
    fireEvent.change(button, {
      target: { value: 'a' },
    });
    const createValidatorOptions = screen.getByText('Create Validator');
    fireEvent.click(createValidatorOptions);
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
      'Comission',
      'Logo',
      'Can Delegate',
      'Max Delegation Amount',
      'Uri',
    ];
    let container: any;
    await waitFor(
      () =>
        ({ container } = renderWithTheme(
          <Contract
            paramsList={paramList}
            proposalsList={proposalsList}
            kAssets={[]}
            getAssets={getAssets}
            assetsList={assetList}
          />,
        )),
    );
    const button =
      container.firstChild?.firstChild?.firstChild?.lastChild?.firstChild
        ?.lastChild?.firstChild;
    fireEvent.change(button, {
      target: { value: 'a' },
    });
    const editValidatorOptions = screen.getByText('Edit Validator Settings');
    fireEvent.click(editValidatorOptions);
    items.map(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it('should render the Undelegate form contract', async () => {
    const items = ['Undelegate a bucket.', 'Select a bucket'];
    let container: any;
    await waitFor(
      () =>
        ({ container } = renderWithTheme(
          <Contract
            paramsList={paramList}
            proposalsList={proposalsList}
            kAssets={[]}
            getAssets={getAssets}
            assetsList={assetList}
          />,
        )),
    );
    const button =
      container.firstChild?.firstChild?.firstChild?.lastChild?.firstChild
        ?.lastChild?.firstChild;
    fireEvent.change(button, {
      target: { value: 'a' },
    });
    const editValidatorOptions = screen.getByText('Undelegate');
    fireEvent.click(editValidatorOptions);
    items.map(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it('should render the Withdraw form contract', async () => {
    const itemsEditValidator = [
      'Total withdraw of the chosen asset.',
      'Select an asset/collection',
    ];
    let container: any;
    await waitFor(
      () =>
        ({ container } = renderWithTheme(
          <Contract
            paramsList={paramList}
            proposalsList={proposalsList}
            kAssets={[]}
            getAssets={getAssets}
            assetsList={assetList}
          />,
        )),
    );
    const button =
      container.firstChild?.firstChild?.firstChild?.lastChild?.firstChild
        ?.lastChild?.firstChild;
    fireEvent.change(button, {
      target: { value: 'a' },
    });
    const editValidatorOptions = screen.getByText('Withdraw');
    fireEvent.click(editValidatorOptions);
    itemsEditValidator.map(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it('should render the Claim form contract', async () => {
    const items = ['Claim rewards or expired market orders.', 'Claim Type'];
    let container: any;
    await waitFor(
      () =>
        ({ container } = renderWithTheme(
          <Contract
            paramsList={paramList}
            proposalsList={proposalsList}
            kAssets={[]}
            getAssets={getAssets}
            assetsList={assetList}
          />,
        )),
    );
    const button =
      container.firstChild?.firstChild?.firstChild?.lastChild?.firstChild
        ?.lastChild?.firstChild;
    fireEvent.change(button, {
      target: { value: 'a' },
    });
    const claimOptions = screen.getByText('Claim');
    fireEvent.click(claimOptions);
    items.map(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it('should render the Unjail form contract', async () => {
    const items = ['Remove bad actors…'];
    let container: any;
    await waitFor(
      () =>
        ({ container } = renderWithTheme(
          <Contract
            paramsList={paramList}
            proposalsList={proposalsList}
            kAssets={[]}
            getAssets={getAssets}
            assetsList={assetList}
          />,
        )),
    );
    const button =
      container.firstChild?.firstChild?.firstChild?.lastChild?.firstChild
        ?.lastChild?.firstChild;
    fireEvent.change(button, {
      target: { value: 'a' },
    });
    const editValidatorOptions = screen.getByText('Unjail');
    fireEvent.click(editValidatorOptions);
    items.map(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it('should render the Asset Trigger form contract', async () => {
    const items = [
      'A contract setting operations over a collection of assets or an NFT.',
      'Trigger Type',
    ];
    let container: any;
    await waitFor(
      () =>
        ({ container } = renderWithTheme(
          <Contract
            paramsList={paramList}
            proposalsList={proposalsList}
            kAssets={[]}
            getAssets={getAssets}
            assetsList={assetList}
          />,
        )),
    );
    const button =
      container.firstChild?.firstChild?.firstChild?.lastChild?.firstChild
        ?.lastChild?.firstChild;
    fireEvent.change(button, {
      target: { value: 'a' },
    });
    const assetTriggerOptions = screen.getByText('Asset Trigger');
    fireEvent.click(assetTriggerOptions);
    items.map(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it('should render the Set Account Name form contract', async () => {
    const items = ['Set a new name for the current account.', 'Name'];
    let container: any;
    await waitFor(
      () =>
        ({ container } = renderWithTheme(
          <Contract
            paramsList={paramList}
            proposalsList={proposalsList}
            kAssets={[]}
            getAssets={getAssets}
            assetsList={assetList}
          />,
        )),
    );
    const button =
      container.firstChild?.firstChild?.firstChild?.lastChild?.firstChild
        ?.lastChild?.firstChild;
    fireEvent.change(button, {
      target: { value: 'a' },
    });
    const setAccountNameOptions = screen.getByText('Set Account Name');
    fireEvent.click(setAccountNameOptions);
    items.map(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it('should render the Proposal form contract', async () => {
    const items = [
      'Create a proposal for the current project.',
      'Description',
      'Epochs Duration',
      'Parameters',
    ];
    let container: any;
    await waitFor(
      () =>
        ({ container } = renderWithTheme(
          <Contract
            paramsList={paramList}
            proposalsList={proposalsList}
            kAssets={[]}
            getAssets={getAssets}
            assetsList={assetList}
          />,
        )),
    );
    const button =
      container.firstChild?.firstChild?.firstChild?.lastChild?.firstChild
        ?.lastChild?.firstChild;
    fireEvent.change(button, {
      target: { value: 'a' },
    });
    const proposalOptions = screen.getByText('Proposal');
    fireEvent.click(proposalOptions);
    items.map(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it('should render the Vote form contract', async () => {
    const items = ['Vote for a proposal.', 'Proposal ID', 'Amount', 'Type'];
    let container: any;
    await waitFor(
      () =>
        ({ container } = renderWithTheme(
          <Contract
            paramsList={paramList}
            proposalsList={proposalsList}
            kAssets={[]}
            getAssets={getAssets}
            assetsList={assetList}
          />,
        )),
    );
    const button =
      container.firstChild?.firstChild?.firstChild?.lastChild?.firstChild
        ?.lastChild?.firstChild;
    fireEvent.change(button, {
      target: { value: 'a' },
    });
    const proposalOptions = screen.getByText('Vote');
    fireEvent.click(proposalOptions);
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
    let container: any;
    await waitFor(
      () =>
        ({ container } = renderWithTheme(
          <Contract
            paramsList={paramList}
            proposalsList={proposalsList}
            kAssets={[]}
            getAssets={getAssets}
            assetsList={assetList}
          />,
        )),
    );
    const button =
      container.firstChild?.firstChild?.firstChild?.lastChild?.firstChild
        ?.lastChild?.firstChild;
    fireEvent.change(button, {
      target: { value: 'a' },
    });
    const proposalOptions = screen.getByText('Config ITO');
    fireEvent.click(proposalOptions);
    items.map(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it('should render the Set ITO Prices form contract', async () => {
    const items = [
      'Set the prices for the Initial Token Offering.',
      'Select an asset/collection',
      'PackInfo',
    ];
    let container: any;
    await waitFor(
      () =>
        ({ container } = renderWithTheme(
          <Contract
            paramsList={paramList}
            proposalsList={proposalsList}
            kAssets={[]}
            getAssets={getAssets}
            assetsList={assetList}
          />,
        )),
    );
    const button =
      container.firstChild?.firstChild?.firstChild?.lastChild?.firstChild
        ?.lastChild?.firstChild;
    fireEvent.change(button, {
      target: { value: 'a' },
    });
    const proposalOptions = screen.getByText('Set ITO Prices');
    fireEvent.click(proposalOptions);
    items.map(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it('should render the Buy form contract', async () => {
    const items = ['Buy tokens.', 'Order ID', 'Currency Id', 'Amount'];
    let container: any;
    await waitFor(
      () =>
        ({ container } = renderWithTheme(
          <Contract
            paramsList={paramList}
            proposalsList={proposalsList}
            kAssets={[]}
            getAssets={getAssets}
            assetsList={assetList}
          />,
        )),
    );
    const button =
      container.firstChild?.firstChild?.firstChild?.lastChild?.firstChild
        ?.lastChild?.firstChild;
    fireEvent.change(button, {
      target: { value: 'a' },
    });
    const buyOptions = screen.getByText('Buy');
    fireEvent.click(buyOptions);
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
    let container: any;
    await waitFor(
      () =>
        ({ container } = renderWithTheme(
          <Contract
            paramsList={paramList}
            proposalsList={proposalsList}
            kAssets={[]}
            getAssets={getAssets}
            assetsList={assetList}
          />,
        )),
    );
    const button =
      container.firstChild?.firstChild?.firstChild?.lastChild?.firstChild
        ?.lastChild?.firstChild;
    fireEvent.change(button, {
      target: { value: 'a' },
    });
    const buyOptions = screen.getByText('Sell');
    fireEvent.click(buyOptions);
    items.map(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it('should render the Cancel Market Order form contract', async () => {
    const items = ['Order Id'];
    let container: any;
    await waitFor(
      () =>
        ({ container } = renderWithTheme(
          <Contract
            paramsList={paramList}
            proposalsList={proposalsList}
            kAssets={[]}
            getAssets={getAssets}
            assetsList={assetList}
          />,
        )),
    );
    const button =
      container.firstChild?.firstChild?.firstChild?.lastChild?.firstChild
        ?.lastChild?.firstChild;
    fireEvent.change(button, {
      target: { value: 'a' },
    });
    const buyOptions = screen.getByText('Cancel Market Order');
    fireEvent.click(buyOptions);
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
    let container: any;
    await waitFor(
      () =>
        ({ container } = renderWithTheme(
          <Contract
            paramsList={paramList}
            proposalsList={proposalsList}
            kAssets={[]}
            getAssets={getAssets}
            assetsList={assetList}
          />,
        )),
    );
    const button =
      container.firstChild?.firstChild?.firstChild?.lastChild?.firstChild
        ?.lastChild?.firstChild;
    fireEvent.change(button, {
      target: { value: 'a' },
    });
    const buyOptions = screen.getByText('Create Marketplace');
    fireEvent.click(buyOptions);
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
    let container: any;
    await waitFor(
      () =>
        ({ container } = renderWithTheme(
          <Contract
            paramsList={paramList}
            proposalsList={proposalsList}
            kAssets={[]}
            getAssets={getAssets}
            assetsList={assetList}
          />,
        )),
    );
    const button =
      container.firstChild?.firstChild?.firstChild?.lastChild?.firstChild
        ?.lastChild?.firstChild;
    fireEvent.change(button, {
      target: { value: 'a' },
    });
    const buyOptions = screen.getByText('Configure Marketplace');
    fireEvent.click(buyOptions);
    items.map(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it('should render the Update Account Permission form contract', async () => {
    let container: any;
    await waitFor(
      () =>
        ({ container } = renderWithTheme(
          <Contract
            paramsList={paramList}
            proposalsList={proposalsList}
            kAssets={[]}
            getAssets={getAssets}
            assetsList={assetList}
          />,
        )),
    );
    const button =
      container.firstChild?.firstChild?.firstChild?.lastChild?.firstChild
        ?.lastChild?.firstChild;
    fireEvent.change(button, {
      target: { value: 'a' },
    });
    const buyOptions = screen.getByText('Update Account Permission');
    fireEvent.click(buyOptions);
    expect(screen.getByText('Update Account Permission')).toBeInTheDocument();
  });
});
