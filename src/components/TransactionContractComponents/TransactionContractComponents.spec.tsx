import { screen } from '@testing-library/react';
import React from 'react';
import theme from '../../styles/theme';
import { klvAsset, mockedTxContractComponents } from '../../test/mocks';
import { renderWithTheme } from '../../test/utils';
import { toLocaleFixed } from '../../utils';
import {
  AssetTrigger,
  Buy,
  CancelMarketOrder,
  Claim,
  ConfigITO,
  ConfigMarketplace,
  CreateAsset,
  CreateMarketplace,
  CreateValidator,
  Delegate,
  Freeze,
  Proposal,
  Sell,
  SetAccountName,
  SetITOPrices,
  Transfer,
  Undelegate,
  Unfreeze,
  ValidatorConfig,
  Vote,
  Withdraw,
} from './';

const precision = 6; // defaulf klv precision

describe('Component: TransactionContractComponents', () => {
  describe('When contract is "Transfer"', () => {
    it('Should render the "Amount", "to"( who receive ) with the link and the coin with the link', () => {
      renderWithTheme(
        <Transfer
          {...mockedTxContractComponents.transferContract}
          precision={precision}
          asset={klvAsset}
        />,
      );
      const {
        transferContract: { parameter },
      } = mockedTxContractComponents;
      const amount = screen.getByText(/Amount/i);
      const amountValue = amount.parentNode?.nextSibling?.firstChild;
      const coinLink = screen.getByRole('link', { name: 'KLV' });
      const toAddressLink = screen.getByRole('link', {
        name: 'klv1hun5jj78k8563wc7e45as57dw78dfe7509rw0z29mfvy95waf9jquca668',
      });

      expect(amount).toBeInTheDocument();
      expect(amountValue).toHaveTextContent(
        toLocaleFixed(parameter.amount / 10 ** 6, precision),
      );
      expect(coinLink).toBeInTheDocument();
      expect(coinLink).toHaveAttribute('href', `/asset/${klvAsset.ticker}`);
      expect(toAddressLink).toBeInTheDocument();
      expect(toAddressLink).toHaveAttribute(
        'href',
        `/account/${parameter.toAddress}`,
      );
    });

    it('Should match the styles of the rows', () => {
      renderWithTheme(
        <Transfer {...mockedTxContractComponents.transferContract} />,
      );
      const row = screen.getByText(/Amount/i).parentNode?.parentNode;
      const rowSpan = row?.firstChild;
      const rowStrong = rowSpan?.firstChild;

      const rowStyle = {
        width: '100%',
        padding: '1.5rem 2rem',
      };
      const rowSpanStyle = {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      };
      const rowStrongStyle = {
        fontWeight: '600',
        fontSize: '0.95rem',
        color: theme.darkText,
      };

      const centeredRow = screen.getByText(/Amount/i).parentNode?.nextSibling;
      const centeredRowStrong = centeredRow?.firstChild;

      const centeredRowStyle = {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '0.5rem',
      };
      const centeredRowStrongStyle = {
        fontSize: '1rem',
        fontWeight: '600',
      };
      expect(row).toHaveStyle(rowStyle);
      expect(rowSpan).toHaveStyle(rowSpanStyle);
      expect(rowStrong).toHaveStyle(rowStrongStyle);
      expect(centeredRow).toHaveStyle(centeredRowStyle);
      expect(centeredRowStrong).toHaveStyle(centeredRowStrongStyle);
    });
  });

  describe('When contract is "CreateAsset"', () => {
    it('Should render the "Amount", "to"( who receive ) with the link and the coin with the link', () => {
      const createAssetContract = {
        ...mockedTxContractComponents.createAssetContract,
      };
      createAssetContract.parameter.ownerAddress = '';
      renderWithTheme(
        <CreateAsset
          {...mockedTxContractComponents.createAssetContract}
          precision={precision}
          receipts={[klvAsset]}
        />,
      );

      const { sender, parameter } = createAssetContract;

      const assetId = screen.getByText(/Asset Id/i);
      const name = screen.getByText(/Name/i);
      const owner = screen.getByText(/Owner/i);
      const ownerLink = screen.getByRole('link', { name: sender });
      const token = screen.getByText(/Token/i);
      const precisionAsset = screen.getByText(/Precision/i);
      const circulatingSupply = screen.getByText(/Circulating Supply/i);
      const initialSupply = screen.getByText(/Initial Supply/i);
      const maxSupply = screen.getByText(/Max Supply/i);

      expect(assetId).toBeInTheDocument();
      expect(name).toBeInTheDocument();
      expect(owner).toBeInTheDocument();
      expect(ownerLink).toBeInTheDocument();
      expect(token).toBeInTheDocument();
      expect(precisionAsset).toBeInTheDocument();
      expect(circulatingSupply).toBeInTheDocument();
      expect(initialSupply).toBeInTheDocument();
      expect(maxSupply).toBeInTheDocument();
      expect(ownerLink).toHaveAttribute('href', `/account/${sender}`);

      expect(assetId.parentNode?.nextSibling?.firstChild).toHaveTextContent(
        klvAsset.assetId,
      );
      expect(name.parentNode?.nextSibling?.firstChild).toHaveTextContent(
        parameter.name,
      );
      expect(token.parentNode?.nextSibling?.firstChild).toHaveTextContent(
        parameter.ticker,
      );
      expect(
        precisionAsset.parentNode?.nextSibling?.firstChild,
      ).toHaveTextContent(String(parameter.precision));
      expect(
        circulatingSupply.parentNode?.nextSibling?.firstChild,
      ).toHaveTextContent(
        toLocaleFixed(
          parameter.circulatingSupply / 10 ** parameter.precision,
          parameter.precision,
        ),
      );
      expect(
        initialSupply.parentNode?.nextSibling?.firstChild,
      ).toHaveTextContent(
        toLocaleFixed(
          parameter.initialSupply / 10 ** parameter.precision,
          parameter.precision,
        ),
      );
      expect(maxSupply.parentNode?.nextSibling?.firstChild).toHaveTextContent(
        toLocaleFixed(
          parameter.maxSupply / 10 ** parameter.precision,
          parameter.precision,
        ),
      );
    });
  });

  describe('When contract is "CreateValidator"', () => {
    it('Should render "Owner" with the link, "Can delegate", "Comission", "Max Delegation Amount" and "Reward" with all it\'s values', () => {
      renderWithTheme(
        <CreateValidator
          {...mockedTxContractComponents.createValidatorContract}
        />,
      );
      const {
        createValidatorContract: { parameter },
      } = mockedTxContractComponents;

      const owner = screen.getByText(/Owner/i);
      const ownerLink = screen.getAllByRole('link', {
        name: parameter.ownerAddress,
      })[0];
      const canDelegate = screen.getByText(/Can Delegate/i);
      const comission = screen.getByText(/Comission/i);
      const maxDelegationAmount = screen.getByText(/Max Delegation Amount/i);
      const reward = screen.getByText(/Reward/i);
      const rewardLink = screen.getAllByRole('link', {
        name: parameter.config.rewardAddress,
      })[1];

      expect(owner).toBeInTheDocument();
      expect(ownerLink).toBeInTheDocument();
      expect(ownerLink).toHaveAttribute(
        'href',
        `/account/${parameter.ownerAddress}`,
      );
      expect(canDelegate).toBeInTheDocument();
      expect(canDelegate.parentNode?.nextSibling?.firstChild).toHaveTextContent(
        'True',
      );
      expect(comission).toBeInTheDocument();
      expect(comission.parentNode?.nextSibling?.firstChild).toHaveTextContent(
        String(parameter.config.commission),
      );
      expect(maxDelegationAmount).toBeInTheDocument();
      expect(
        maxDelegationAmount.parentNode?.nextSibling?.firstChild,
      ).toHaveTextContent(
        toLocaleFixed(
          parameter.config.maxDelegationAmount / 10 ** precision,
          precision,
        ),
      );
      expect(reward).toBeInTheDocument();
      expect(rewardLink).toBeInTheDocument();
      expect(rewardLink).toHaveAttribute(
        'href',
        `/account/${parameter.config.rewardAddress}`,
      );
    });
  });

  describe('When contract is "Freeze"', () => {
    it('Should render "Owner" with link, "Amount" and "Bucket ID" with all it\'s values', () => {
      renderWithTheme(
        <Freeze {...mockedTxContractComponents.freezeContract} receipts={[]} />,
      );

      const {
        freezeContract: { sender, parameter },
      } = mockedTxContractComponents;

      const owner = screen.getByText(/Owner/i);
      const ownerLink = screen.getByRole('link', { name: sender });
      const amount = screen.getByText(/Amount/i);
      const bucketId = screen.getByText(/Bucket ID/i);

      expect(owner).toBeInTheDocument();
      expect(ownerLink).toBeInTheDocument();
      expect(ownerLink).toHaveTextContent(sender);
      expect(ownerLink).toHaveAttribute('href', `/account/${sender}`);
      expect(amount).toBeInTheDocument();
      expect(amount.parentNode?.nextSibling?.firstChild).toHaveTextContent(
        parameter.amount.toLocaleString(),
      );
      expect(bucketId).toBeInTheDocument();
      expect(bucketId.parentNode?.nextSibling?.firstChild).toBeNull();
    });
  });

  describe('When contract is "Unfreeze"', () => {
    it('Should render "Owner" with link, "Amount" and "Bucket ID" with all it\'s values', () => {
      renderWithTheme(
        <Unfreeze
          {...mockedTxContractComponents.unfreezeContract}
          receipts={mockedTxContractComponents.unfreezeContract.receipts}
        />,
      );

      const {
        unfreezeContract: { sender, parameter },
      } = mockedTxContractComponents;

      const owner = screen.getByText(/Owner/i);
      const ownerLink = screen.getByRole('link', { name: sender });
      const assetId = screen.getByText(/Asset ID/i);
      const bucketId = screen.getByText(/Bucket ID/i);

      expect(owner).toBeInTheDocument();
      expect(ownerLink).toBeInTheDocument();
      expect(ownerLink).toHaveTextContent(sender);
      expect(ownerLink).toHaveAttribute('href', `/account/${sender}`);
      expect(assetId).toBeInTheDocument();
      expect(assetId.parentNode?.nextSibling?.firstChild).toHaveTextContent(
        parameter.assetId,
      );
      expect(bucketId).toBeInTheDocument();
      expect(bucketId.parentNode?.nextSibling?.firstChild).toHaveTextContent(
        `${parameter.bucketID}`,
      );
    });

    it('Should render "--" when "Available Epoch" don\'t has any values', () => {
      const unfreezeMock = { ...mockedTxContractComponents.unfreezeContract };
      unfreezeMock.receipts[0].availableEpoch = 0;
      renderWithTheme(
        <Unfreeze {...unfreezeMock} receipts={unfreezeMock.receipts} />,
      );

      const availableEpoch = screen.getByText(/Available Epoch/i);
      expect(availableEpoch).toBeInTheDocument();
      expect(availableEpoch.parentElement?.nextSibling).toHaveTextContent('--');
    });
  });

  describe('When contract is "Delegate"', () => {
    it('Should render "Bucket ID" and "to" ( who receive ) with all it\'s values', () => {
      renderWithTheme(
        <Delegate
          {...mockedTxContractComponents.delegateContract}
          receipts={[]}
        />,
      );

      const {
        delegateContract: { parameter },
      } = mockedTxContractComponents;

      const bucketId = screen.getByText(/Bucket ID/i);
      const toAddress = screen.getByText(parameter.toAddress);

      expect(bucketId).toBeInTheDocument();
      expect(bucketId.parentNode?.nextSibling?.firstChild).toHaveTextContent(
        `${parameter.bucketID}`,
      );
      expect(toAddress).toBeInTheDocument();
    });
  });

  describe('When contract is "Undelegate"', () => {
    it('Should render "Bucket ID" and it\'s value', () => {
      renderWithTheme(
        <Undelegate
          {...mockedTxContractComponents.undelegateContract}
          receipts={[]}
        />,
      );

      const {
        undelegateContract: { parameter },
      } = mockedTxContractComponents;

      const bucketId = screen.getByText(/Bucket ID/i);

      expect(bucketId).toBeInTheDocument();
      expect(bucketId.parentNode?.nextSibling?.firstChild).toHaveTextContent(
        `${parameter.bucketID}`,
      );
    });
  });

  describe('When contract is "Withdraw"', () => {
    it('Should render "Asset ID" and it\'s value', () => {
      renderWithTheme(
        <Withdraw
          {...mockedTxContractComponents.widthdrawContract}
          receipts={[]}
        />,
      );

      const {
        widthdrawContract: { parameter },
      } = mockedTxContractComponents;

      const assetId = screen.getByText(/Asset ID/i);

      expect(assetId).toBeInTheDocument();
      expect(assetId.parentNode?.nextSibling?.firstChild).toHaveTextContent(
        `${parameter.assetId}`,
      );
    });
  });

  describe('When contract is "Claim"', () => {
    it('Should render "Claim Type" and "Id" with all it\'s values', () => {
      renderWithTheme(
        <Claim {...mockedTxContractComponents.claimContract} receipts={[]} />,
      );

      const {
        claimContract: { parameter },
      } = mockedTxContractComponents;

      const claimType = screen.getByText(/Claim Type/i);
      const id = screen.getByText(/Id/i);

      expect(claimType).toBeInTheDocument();
      expect(claimType.parentNode?.nextSibling?.firstChild).toHaveTextContent(
        `${parameter.claimType}`,
      );
      expect(id.parentNode?.nextSibling?.firstChild).toHaveTextContent(
        `${parameter.id}`,
      );
    });
  });

  describe('When contract is "Proposal"', () => {
    it('Should render "Value" and "Epoch Duration" with all it\'s values', () => {
      renderWithTheme(
        <Proposal
          {...mockedTxContractComponents.proposalContract}
          receipts={[]}
        />,
      );

      const {
        proposalContract: { parameter },
      } = mockedTxContractComponents;

      const value = screen.getByText(/Value/i);
      const epochDuration = screen.getByText(/Epoch Duration/i);

      expect(value).toBeInTheDocument();
      expect(epochDuration).toBeInTheDocument();
      expect(value.parentNode?.nextSibling?.firstChild).toHaveTextContent(
        `${parameter.value}`,
      );
      expect(
        epochDuration.parentNode?.nextSibling?.firstChild,
      ).toHaveTextContent(`${parameter.epochsDuration}`);
    });
  });

  describe('When contract is "Vote"', () => {
    it('Should render "Proposal Id" and "Amount" with all it\'s values', () => {
      renderWithTheme(
        <Vote {...mockedTxContractComponents.voteContract} receipts={[]} />,
      );

      const {
        voteContract: { parameter },
      } = mockedTxContractComponents;

      const proposalId = screen.getByText(/Proposal Id/i);
      const amount = screen.getByText(/Amount/i);

      expect(proposalId).toBeInTheDocument();
      expect(amount).toBeInTheDocument();
      expect(proposalId.parentNode?.nextSibling?.firstChild).toHaveTextContent(
        `${parameter.proposalId}`,
      );
      expect(amount.parentNode?.nextSibling?.firstChild).toHaveTextContent(
        `${parameter.amount}`,
      );
    });
  });

  describe('When contract is "ConfigITO"', () => {
    it('Should render "Asset Id" and "Status" with all it\'s values', () => {
      renderWithTheme(
        <ConfigITO
          {...mockedTxContractComponents.configIcoContract}
          receipts={[]}
        />,
      );

      const {
        configIcoContract: { parameter },
      } = mockedTxContractComponents;

      const assetId = screen.getByText(/Asset Id/i);
      const status = screen.getByText(/Status/i);

      expect(assetId).toBeInTheDocument();
      expect(status).toBeInTheDocument();
      expect(assetId.parentNode?.nextSibling?.firstChild).toHaveTextContent(
        `${parameter.assetId}`,
      );
      expect(status.parentNode?.nextSibling?.firstChild).toHaveTextContent(
        `${parameter.status}`,
      );
    });
  });

  describe('When contract is "SetITOPrices"', () => {
    it('Should render "Asset Id" and "Price" with all it\'s values', () => {
      renderWithTheme(
        <SetITOPrices
          {...mockedTxContractComponents.setIcoPricesContract}
          receipts={[]}
        />,
      );

      const {
        setIcoPricesContract: { parameter },
      } = mockedTxContractComponents;

      const assetId = screen.getByText(/Asset Id/i);
      const price = screen.getByText(/Price/i);

      expect(assetId).toBeInTheDocument();
      expect(price).toBeInTheDocument();
      expect(assetId.parentNode?.nextSibling?.firstChild).toHaveTextContent(
        `${parameter.assetId}`,
      );
      expect(price.parentNode?.nextSibling?.firstChild).toHaveTextContent(
        `${parameter.packInfo.price}`,
      );
    });
  });

  describe('When contract is "Buy"', () => {
    it('Should render "Buy Type" and "Id" with all it\'s values', () => {
      renderWithTheme(
        <Buy {...mockedTxContractComponents.buyContract} receipts={[]} />,
      );

      const {
        buyContract: { parameter },
      } = mockedTxContractComponents;

      const buyType = screen.getByText(/Buy Type/i);
      const id = screen.getByText(/Id/i);

      expect(buyType).toBeInTheDocument();
      expect(id).toBeInTheDocument();
      expect(buyType.parentNode?.nextSibling?.firstChild).toHaveTextContent(
        `${parameter.buyType}`,
      );
      expect(id.parentNode?.nextSibling?.firstChild).toHaveTextContent(
        `${parameter.id}`,
      );
    });
  });

  describe('When contract is "Sell"', () => {
    it('Should render "Market Type" and "Asset Id" with all it\'s values', () => {
      renderWithTheme(
        <Sell {...mockedTxContractComponents.sellContract} receipts={[]} />,
      );

      const {
        sellContract: { parameter },
      } = mockedTxContractComponents;

      const marketType = screen.getByText(/Market Type/i);
      const assetId = screen.getByText(/Asset Id/i);

      expect(marketType).toBeInTheDocument();
      expect(assetId).toBeInTheDocument();
      expect(marketType.parentNode?.nextSibling?.firstChild).toHaveTextContent(
        `${parameter.marketType}`,
      );
      expect(assetId.parentNode?.nextSibling?.firstChild).toHaveTextContent(
        `${parameter.assetId}`,
      );
    });
  });

  describe('When contract is "CancelMarketOrder"', () => {
    it('Should render "Order Id" and it\'s values', () => {
      renderWithTheme(
        <CancelMarketOrder
          {...mockedTxContractComponents.cancelMarketOrderContract}
          receipts={[]}
        />,
      );

      const {
        cancelMarketOrderContract: { parameter },
      } = mockedTxContractComponents;

      const orderId = screen.getByText(/Order Id/i);

      expect(orderId).toBeInTheDocument();
      expect(orderId.parentNode?.nextSibling?.firstChild).toHaveTextContent(
        `${parameter.orderId}`,
      );
    });
  });

  describe('When contract is "CreateMarketplace"', () => {
    it('Should render "Name" and "Address" with all it\'s values', () => {
      renderWithTheme(
        <CreateMarketplace
          {...mockedTxContractComponents.createMarketplaceContract}
          receipts={[]}
        />,
      );

      const {
        createMarketplaceContract: { parameter },
      } = mockedTxContractComponents;

      const name = screen.getByText(/Name/i);
      const address = screen.getByText(/Address/i);

      expect(name).toBeInTheDocument();
      expect(address).toBeInTheDocument();
      expect(name.parentNode?.nextSibling?.firstChild).toHaveTextContent(
        `${parameter.name}`,
      );
      expect(address.parentNode?.nextSibling?.firstChild).toHaveTextContent(
        `${parameter.referralAddress}`,
      );
    });
  });

  describe('When contract is "ConfigMarketplace"', () => {
    it('Should render "Name", "Market Id" and "Address" with all it\'s values', () => {
      renderWithTheme(
        <ConfigMarketplace
          {...mockedTxContractComponents.configMarketplaceContract}
          receipts={[]}
        />,
      );

      const {
        configMarketplaceContract: { parameter },
      } = mockedTxContractComponents;

      const name = screen.getByText(/Name/i);
      const marketId = screen.getByText(/Market Id/i);
      const address = screen.getByText(/Address/i);

      expect(name).toBeInTheDocument();
      expect(marketId).toBeInTheDocument();
      expect(address).toBeInTheDocument();
      expect(name.parentNode?.nextSibling?.firstChild).toHaveTextContent(
        `${parameter.name}`,
      );
      expect(marketId.parentNode?.nextSibling?.firstChild).toHaveTextContent(
        `${parameter.marketplaceId}`,
      );
      expect(address.parentNode?.nextSibling?.firstChild).toHaveTextContent(
        `${parameter.referralAddress}`,
      );
    });
  });

  describe('When contract is "ValidatorConfig"', () => {
    it('Shoud render "Public Key" and "Name" with all it\'s values', () => {
      renderWithTheme(
        <ValidatorConfig
          {...mockedTxContractComponents.validatorConfigContract}
          receipts={[]}
        />,
      );

      const { parameter } = mockedTxContractComponents.validatorConfigContract;
      const pubKey = screen.getByText(parameter.blsPublicKey);
      const name = screen.getByText(parameter.name);

      expect(pubKey).toBeInTheDocument();
      expect(name).toBeInTheDocument();
    });
  });

  describe('When contract is "AssetTrigger"', () => {
    it('Shoud render "Public Key" and "Name" with all it\'s values', () => {
      renderWithTheme(
        <AssetTrigger
          {...mockedTxContractComponents.assetTriggerContract}
          receipts={[]}
        />,
      );

      const { parameter } = mockedTxContractComponents.assetTriggerContract;
      const triggerType = screen.getByText(/Trigger Type/i);

      expect(triggerType).toBeInTheDocument();
      expect(triggerType.parentNode?.nextSibling).toHaveTextContent('0');
    });
  });

  describe('When contract is "SetAccountName"', () => {
    it('Shoud render "Public Key" and "Name" with all it\'s values', () => {
      renderWithTheme(
        <SetAccountName
          {...mockedTxContractComponents.setAccountNameContract}
          receipts={[]}
        />,
      );

      const { parameter } = mockedTxContractComponents.setAccountNameContract;
      const name = screen.getByText(/Name/i);

      expect(name).toBeInTheDocument();
      expect(name.parentNode?.nextSibling).toHaveTextContent(parameter.name);
    });
  });
});
