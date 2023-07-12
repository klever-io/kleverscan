import { toLocaleFixed } from '@/utils/formatFunctions';
import { screen, waitFor } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';
import theme from '../../styles/theme';
import { klvAsset, mockedTxContractComponents } from '../../test/mocks';
import {
  claim1,
  createAsset1,
  freeze1,
  marketbuy1,
  unfreeze1,
} from '../../test/mocks/transaction-page';
import { renderWithTheme } from '../../test/utils';
import * as utilsPrecision from '../../utils/precisionFunctions';
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
  Unjail,
  ValidatorConfig,
  Vote,
  Withdraw,
} from './';

const precision = 6; // default klv precision
const mockPrecision = {
  data: {
    precisions: {
      KLV: 6,
    },
  },
  error: '',
  code: 'successful',
};
describe('Component: TransactionContractComponents', () => {
  describe('When contract is "Transfer"', () => {
    it('Should render the "Amount", "to"( who receive ) with the link and the coin with the link', async () => {
      const spy = jest.spyOn(utilsPrecision, 'getPrecision');
      spy.mockReturnValue(new Promise<number>(resolve => resolve(6)));
      await act(async () => {
        renderWithTheme(
          <Transfer
            {...mockedTxContractComponents.transferContract}
            precision={precision}
            asset={klvAsset}
            renderMetadata={() => renderMetadata(undefined, 0)}
          />,
        );
      });
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
        <Transfer
          {...mockedTxContractComponents.transferContract}
          renderMetadata={() => renderMetadata(undefined, 0)}
        />,
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
        color: theme.darkText,
      };

      const centeredRow = screen.getByText(/Amount/i).parentNode?.nextSibling;
      const centeredRowStrong = centeredRow?.firstChild;

      const centeredRowStyle = {
        display: 'flex',
        width: '100%',
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
      renderWithTheme(
        <CreateAsset
          sender={createAsset1.sender}
          parameter={createAsset1.contract[0].parameter}
          filteredReceipts={createAsset1.receipts}
          contractIndex={0}
          precision={precision}
          renderMetadata={() => renderMetadata(undefined, 0)}
        />,
      );

      const { parameter } = createAsset1.contract[0];
      const { sender } = createAsset1;

      const assetId = screen.getByText(/Asset ID/i);
      const name = screen.getByText(/Name/i);
      const owner = screen.getByText(/Owner/i);
      const ownerLink = screen.getByRole('link', { name: sender });
      const token = screen.getByText(/Ticker/i);
      const precisionAsset = screen.getByText(/Precision/i);
      const initialSupply = screen.getByText(/Initial Supply/i);
      const maxSupply = screen.getByText(/Max Supply/i);

      expect(assetId).toBeInTheDocument();
      expect(name).toBeInTheDocument();
      expect(owner).toBeInTheDocument();
      expect(ownerLink).toBeInTheDocument();
      expect(token).toBeInTheDocument();
      expect(precisionAsset).toBeInTheDocument();
      expect(initialSupply).toBeInTheDocument();
      expect(maxSupply).toBeInTheDocument();
      expect(ownerLink).toHaveAttribute('href', `/account/${sender}`);

      expect(assetId.parentNode?.nextSibling?.firstChild).toHaveTextContent(
        'BIZZZX-186R',
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
    it('Should render "Owner" with the link, "Can delegate", "Commission", "Max Delegation Amount" and "Reward" with all it\'s values', () => {
      renderWithTheme(
        <CreateValidator
          {...mockedTxContractComponents.createValidatorContract}
          renderMetadata={() => renderMetadata(undefined, 0)}
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
      const comission = screen.getByText(/Commission/i);
      const maxDelegationAmount = screen.getByText(/Max Delegation/i);
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
        '5%',
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
    it('Should render "Amount" and "Bucket ID" with all it\'s values', async () => {
      const spy = jest.spyOn(utilsPrecision, 'getPrecision');
      spy.mockReturnValue(new Promise<number>(resolve => resolve(6)));
      await act(async () => {
        renderWithTheme(
          <Freeze
            {...freeze1}
            filteredReceipts={freeze1.receipts}
            parameter={freeze1.contract[0].parameter}
            contractIndex={0}
            renderMetadata={() => renderMetadata(undefined, 0)}
          />,
        );
      });
      [
        screen.getByText('Type'),
        screen.getByText('Asset Id'),
        screen.getByText('Amount'),
        screen.getByText('Bucket Id'),
        screen.getByText('Freeze'),
        screen.getByText('KLV'),
        screen.getByText('12,820.000000'),
        screen.getByText(
          '88c6663e7cfa68412b89afea32b1695446874aaf7c7419ce9b770b96cedd23cd',
        ),
      ].forEach(value => expect(value).toBeInTheDocument());
    });
  });

  describe('When contract is "Unfreeze"', () => {
    it('Should render "Amount" and "Bucket ID" with all it\'s values', async () => {
      const spy = jest.spyOn(utilsPrecision, 'getPrecision');
      spy.mockReturnValue(
        new Promise<{
          [assetId: string]: number;
        }>(resolve =>
          resolve({
            KLV: 6,
          }),
        ),
      );
      await act(async () => {
        renderWithTheme(
          <Unfreeze
            {...unfreeze1}
            filteredReceipts={unfreeze1.receipts}
            parameter={unfreeze1.contract[0].parameter}
            contractIndex={0}
            renderMetadata={() => renderMetadata(undefined, 0)}
          />,
        );
      });
      [
        screen.getByText('Type'),
        screen.getByText('Asset Id'),
        screen.getByText('Bucket Id'),
        screen.getByText('Available Epoch'),
        screen.getByText('Amount'),
        screen.getByText('Claimed Rewards'),

        screen.getByText('Unfreeze'),
        screen.getByText('KLV'),
        screen.getByText(
          '8bf070552ae73864455cfc08b247f0f12d53743a3bf536e91785cba9e04fcc63',
        ),
        screen.getByText('729'),
        screen.getByText('5,271.203485'),
        screen.getByText('33.044706 KLV'),
      ].forEach(value => expect(value).toBeInTheDocument());
    });
  });

  describe('When contract is "Delegate"', () => {
    it('Should render "Bucket ID" and "to" ( who receive ) with all it\'s values', () => {
      renderWithTheme(
        <Delegate
          {...mockedTxContractComponents.delegateContract}
          filteredReceipts={[]}
          renderMetadata={() => renderMetadata(undefined, 0)}
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
          filteredReceipts={[]}
          renderMetadata={() => renderMetadata(undefined, 0)}
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
          filteredReceipts={[]}
          renderMetadata={() => renderMetadata(undefined, 0)}
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
    it('Should render "Claim Type" and "Id" with all it\'s values', async () => {
      const spy = jest.spyOn(utilsPrecision, 'getPrecision');
      spy.mockReturnValue(new Promise<number>(resolve => resolve(6)));
      await act(async () => {
        renderWithTheme(
          <Claim
            {...claim1}
            filteredReceipts={claim1.receipts}
            parameter={claim1.contract[0].parameter}
            renderMetadata={() => renderMetadata(undefined, 0)}
          />,
        );
      });
      const typeLabel = screen.getByText('Type');
      const claimTypeLabel = screen.getByText('Claim Type');
      const assetIdLabel = screen.getByText('Asset Id');
      const amountLabel = screen.getByText('Amount');

      const type = screen.getByText('Claim');
      const claimType = screen.getByText('StakingClaim');
      const assetId = screen.getByText('KLV');
      const amount = screen.getByText('47.573703 KLV');

      const data = [
        typeLabel,
        claimTypeLabel,
        assetIdLabel,
        amountLabel,
        type,
        claimType,
        assetId,
        amount,
      ];
      data.forEach(value => expect(value).toBeInTheDocument());
    });
  });

  describe('When contract is "Unjail"', () => {
    it('Should render "Unjail Type"', () => {
      renderWithTheme(
        <Unjail
          {...mockedTxContractComponents.unjailContract}
          filteredReceipts={[]}
          renderMetadata={() => renderMetadata(undefined, 0)}
        />,
      );
      const typeLabel = screen.getByText(/Type/i);
      const type = screen.getByText('Unjail');
      expect(typeLabel).toBeInTheDocument();
      expect(type).toBeInTheDocument();
    });
  });

  describe('When contract is "Proposal"', () => {
    it('Should render "Value" and "Epoch Duration" with all it\'s values', () => {
      renderWithTheme(
        <Proposal
          {...mockedTxContractComponents.proposalContract}
          filteredReceipts={[]}
          renderMetadata={() => renderMetadata(undefined, 0)}
        />,
      );

      const {
        proposalContract: { parameter },
      } = mockedTxContractComponents;
      const epochDuration = screen.getByText(/Epoch Duration/i);
      const proposalParam = screen.getByText(/KApp Fee for Proposal/i);
      expect(proposalParam).toBeInTheDocument();
      const proposalValue = screen.getByText('50000000000');
      expect(proposalValue).toBeInTheDocument();

      expect(epochDuration).toBeInTheDocument();
      expect(
        epochDuration.parentNode?.nextSibling?.firstChild,
      ).toHaveTextContent(`${parameter.epochsDuration}`);
    });
  });

  describe('When contract is "Vote"', () => {
    it('Should render "Proposal Id" and "Amount" with all it\'s values', () => {
      renderWithTheme(
        <Vote
          {...mockedTxContractComponents.voteContract}
          filteredReceipts={[]}
          renderMetadata={() => renderMetadata(undefined, 0)}
        />,
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
      expect(amount.parentNode?.nextSibling?.firstChild).toHaveTextContent('4');
    });
  });

  describe('When contract is "ConfigITO"', () => {
    it('Should render "Asset Id" and "Status" with all it\'s values', () => {
      renderWithTheme(
        <ConfigITO
          {...mockedTxContractComponents.configIcoContract}
          filteredReceipts={[]}
          renderMetadata={() => renderMetadata(undefined, 0)}
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
          filteredReceipts={[]}
          renderMetadata={() => renderMetadata(undefined, 0)}
        />,
      );

      const {
        setIcoPricesContract: { parameter },
      } = mockedTxContractComponents;
      const assetId = screen.getByText(/Asset Id/i);
      const packInfoKLVKey = screen.getAllByText(/KLV2/);
      expect(packInfoKLVKey.length).toEqual(4);

      expect(assetId).toBeInTheDocument();
      expect(assetId.parentNode?.nextSibling?.firstChild).toHaveTextContent(
        `${parameter.assetId}`,
      );
    });
  });

  describe('When contract is "MarketBuy"', () => {
    it('Should render "Buy Type" and "Id" with all it\'s values', async () => {
      const spy = jest.spyOn(utilsPrecision, 'getPrecision');
      spy.mockReturnValue(
        new Promise<{
          [assetId: string]: number;
        }>(resolve =>
          resolve({
            KLV: 6,
            'KPNFT-13Z0/1339': 0,
          }),
        ),
      );
      await act(async () => {
        renderWithTheme(
          <Buy
            {...marketbuy1}
            filteredReceipts={marketbuy1.receipts}
            contracts={marketbuy1.contract}
            parameter={marketbuy1.contract[0].parameter}
            contractIndex={0}
            renderMetadata={() => renderMetadata(undefined, 0)}
          />,
        );
      });

      const {
        buyContract: { parameter },
      } = mockedTxContractComponents;

      const typeLabel = screen.getByText('Type');
      const buyTypeLabel = screen.getByText('Buy Type');
      const priceLabel = screen.getByText('Price');
      const amountLabel = screen.getByText('Amount');
      const currencyIDLabel = screen.getByText('Currency Id');
      const assetIdLabel = screen.getByText('Asset Id');
      const orderIdLabel = screen.getByText('Order Id');
      const marketPlaceIdLabel = screen.getByText('Marketplace Id');

      expect(typeLabel).toBeInTheDocument();
      expect(buyTypeLabel).toBeInTheDocument();
      expect(priceLabel).toBeInTheDocument();
      expect(amountLabel).toBeInTheDocument();
      expect(currencyIDLabel).toBeInTheDocument();
      expect(assetIdLabel).toBeInTheDocument();
      expect(orderIdLabel).toBeInTheDocument();
      expect(marketPlaceIdLabel).toBeInTheDocument();

      await waitFor(() => {
        const type = screen.getByText('Buy');
        const buyType = screen.getByText('MarketBuy');
        const price = screen.getByText('320.000000 KLV');
        const amount = screen.getByText('1 KPNFT-13Z0/1339');
        const currencyID = screen.getByText('KLV');
        const assetId = screen.getByText('KPNFT-13Z0/1339');
        const orderId = screen.getByText('c357bd00d13d9270');
        const marketPlaceId = screen.getByText('d4f2bab340c55fde');
        expect(type).toBeInTheDocument();
        expect(buyType).toBeInTheDocument();
        expect(price).toBeInTheDocument();
        expect(amount).toBeInTheDocument();
        expect(currencyID).toBeInTheDocument();
        expect(assetId).toBeInTheDocument();
        expect(orderId).toBeInTheDocument();
        expect(marketPlaceId).toBeInTheDocument();
      });
      spy.mockRestore();
    });
  });

  describe('When contract is "Sell"', () => {
    it('Should render "Market Type" and "Asset Id" with all it\'s values', async () => {
      const spyPrecision = jest.spyOn(utilsPrecision, 'getPrecision');
      spyPrecision.mockReturnValue(new Promise<number>(resolve => resolve(6)));

      await act(async () => {
        renderWithTheme(
          <Sell
            {...mockedTxContractComponents.sellContract}
            filteredReceipts={[]}
            renderMetadata={() => renderMetadata(undefined, 0)}
          />,
        );
      });

      const assetId = screen.getByText('KPNFT-13Z0/9016');
      const currencyID = screen.getByText('KLV');
      const endTime = screen.getByText('01/17/2023 12:19');
      const marketType = screen.getByText('BuyItNowMarket');
      const marketplaceID = screen.getByText('d4f2bab340c55fde');
      const price = screen.getByText(/450.000000/);

      const values = [
        assetId,
        currencyID,
        endTime,
        marketType,
        marketplaceID,
        price,
      ];

      values.forEach(value => {
        expect(value).toBeInTheDocument();
      });
    });
  });

  describe('When contract is "CancelMarketOrder"', () => {
    it('Should render "Order Id" and it\'s values', () => {
      renderWithTheme(
        <CancelMarketOrder
          {...mockedTxContractComponents.cancelMarketOrderContract}
          filteredReceipts={[]}
          renderMetadata={() => renderMetadata(undefined, 0)}
        />,
      );

      const {
        cancelMarketOrderContract: { parameter },
      } = mockedTxContractComponents;

      const orderIdLabel = screen.getByText(/Order Id/i);

      expect(orderIdLabel).toBeInTheDocument();
      const orderId = screen.getByText('asdkanslkdmaisdjqpwdknajsndidj234');
      expect(orderId).toBeInTheDocument();
    });
  });

  describe('When contract is "CreateMarketplace"', () => {
    it('Should render "Name" and "Address" with all it\'s values', () => {
      renderWithTheme(
        <CreateMarketplace
          {...mockedTxContractComponents.createMarketplaceContract}
          filteredReceipts={[]}
          renderMetadata={() => renderMetadata(undefined, 0)}
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
          filteredReceipts={[]}
          renderMetadata={() => renderMetadata(undefined, 0)}
        />,
      );

      const {
        configMarketplaceContract: { parameter },
      } = mockedTxContractComponents;

      const name = screen.getByText(/Name/i);
      const marketId = screen.getByText(/Marketplace Id/i);
      const address = screen.getByText(/Address/i);
      expect(name).toBeInTheDocument();
      expect(marketId).toBeInTheDocument();
      expect(address).toBeInTheDocument();
      expect(name.parentNode?.nextSibling?.firstChild).toHaveTextContent(
        `${parameter.name}`,
      );
      expect(marketId.parentNode?.nextSibling?.firstChild).toHaveTextContent(
        `${parameter.marketplaceID}`,
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
          filteredReceipts={[]}
          renderMetadata={() => renderMetadata(undefined, 0)}
        />,
      );

      const { parameter } = mockedTxContractComponents.validatorConfigContract;
      const pubKey = screen.getByText(parameter.config.blsPublicKey);
      const name = screen.getByText(parameter.config.name);

      expect(pubKey).toBeInTheDocument();
      expect(name).toBeInTheDocument();
    });
  });

  describe('When contract is "AssetTrigger"', () => {
    it('Shoud render "Public Key" and "Name" with all it\'s values', () => {
      renderWithTheme(
        <AssetTrigger
          {...mockedTxContractComponents.assetTriggerContract}
          filteredReceipts={[]}
          renderMetadata={() => renderMetadata(undefined, 0)}
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
          filteredReceipts={[]}
          renderMetadata={() => renderMetadata(undefined, 0)}
        />,
      );

      const { parameter } = mockedTxContractComponents.setAccountNameContract;
      const name = screen.getByText('Name');

      expect(name).toBeInTheDocument();
      expect(name.parentNode?.nextSibling).toHaveTextContent(parameter.name);
    });
  });
});
function renderMetadata(data: any, index: any): JSX.Element | null {
  return null;
}
