import React, { PropsWithChildren } from 'react';
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
  Deposit,
  Freeze,
  ITOTrigger,
  Proposal,
  Sell,
  SetAccountName,
  SetITOPrices,
  SmartContract,
  Transfer,
  Undelegate,
  Unfreeze,
  Unjail,
  UpdateAccountPermission,
  ValidatorConfig,
  Vote,
  Withdraw,
} from '@/components/TransactionContractComponents';
import { Contract, IContract } from '@/types/contracts';
import { filterReceipts } from '@/utils/findKey';
import { Hr } from '@/views/transactions/detail';
import { useMetadataRenderer } from './MetadataRenderer';

interface Props {
  contracts: IContract[];
  receipts?: any[];
  sender?: string;
  data?: string[];
  logs?: any;
}

const ContractsList: React.FC<PropsWithChildren<Props>> = ({
  contracts,
  receipts = [],
  sender,
  data,
  logs,
}) => {
  const { renderMetadata } = useMetadataRenderer(data);

  return (
    <div>
      {contracts.map((contract: IContract, index: number) => {
        const filteredReceipts = filterReceipts(receipts, index);
        switch (contract.typeString) {
          case Contract.Transfer:
            return (
              <div key={`${index}`}>
                <Transfer
                  {...contract}
                  contractIndex={index}
                  filteredReceipts={filteredReceipts}
                  renderMetadata={() => renderMetadata(index)}
                />
                {index < contracts.length - 1 && <Hr />}
              </div>
            );

          case Contract.CreateAsset:
            return (
              <div key={`${index}`}>
                <CreateAsset
                  {...contract}
                  contractIndex={index}
                  filteredReceipts={filteredReceipts}
                  renderMetadata={() => renderMetadata(index)}
                />
                {index < contracts.length - 1 && <Hr />}
              </div>
            );
          case Contract.CreateValidator:
            return (
              <div key={`${index}`}>
                <CreateValidator
                  {...contract}
                  contractIndex={index}
                  filteredReceipts={filteredReceipts}
                  renderMetadata={() => renderMetadata(index)}
                />
                {index < contracts.length - 1 && <Hr />}
              </div>
            );
          case Contract.ValidatorConfig:
            return (
              <div key={`${index}`}>
                <ValidatorConfig
                  {...contract}
                  contractIndex={index}
                  filteredReceipts={filteredReceipts}
                  renderMetadata={() => renderMetadata(index)}
                />
                {index < contracts.length - 1 && <Hr />}
              </div>
            );
          case Contract.Freeze:
            return (
              <div key={`${index}`}>
                <Freeze
                  {...contract}
                  contractIndex={index}
                  filteredReceipts={filteredReceipts}
                  renderMetadata={() => renderMetadata(index)}
                />
                {index < contracts.length - 1 && <Hr />}
              </div>
            );
          case Contract.Unfreeze:
            return (
              <div key={`${index}`}>
                <Unfreeze
                  {...contract}
                  contractIndex={index}
                  filteredReceipts={filteredReceipts}
                  renderMetadata={() => renderMetadata(index)}
                />
                {index < contracts.length - 1 && <Hr />}
              </div>
            );
          case Contract.Delegate:
            return (
              <div key={`${index}`}>
                <Delegate
                  {...contract}
                  contractIndex={index}
                  filteredReceipts={filteredReceipts}
                  renderMetadata={() => renderMetadata(index)}
                />
                {index < contracts.length - 1 && <Hr />}
              </div>
            );
          case Contract.Undelegate:
            return (
              <div key={`${index}`}>
                <Undelegate
                  {...contract}
                  contractIndex={index}
                  filteredReceipts={filteredReceipts}
                  renderMetadata={() => renderMetadata(index)}
                />
                {index < contracts.length - 1 && <Hr />}
              </div>
            );
          case Contract.Withdraw:
            return (
              <div key={`${index}`}>
                <Withdraw
                  {...contract}
                  contractIndex={index}
                  filteredReceipts={filteredReceipts}
                  renderMetadata={() => renderMetadata(index)}
                />
                {index < contracts.length - 1 && <Hr />}
              </div>
            );
          case Contract.Claim:
            return (
              <div key={`${index}`}>
                <Claim
                  {...contract}
                  contractIndex={index}
                  filteredReceipts={filteredReceipts}
                  renderMetadata={() => renderMetadata(index)}
                />
                {index < contracts.length - 1 && <Hr />}
              </div>
            );
          case Contract.Unjail:
            return (
              <div key={`${index}`}>
                <Unjail
                  {...contract}
                  contractIndex={index}
                  filteredReceipts={filteredReceipts}
                  renderMetadata={() => renderMetadata(index)}
                />
                {index < contracts.length - 1 && <Hr />}
              </div>
            );
          case Contract.AssetTrigger:
            return (
              <div key={`${index}`}>
                <AssetTrigger
                  {...contract}
                  sender={sender || ''}
                  contractIndex={index}
                  filteredReceipts={filteredReceipts}
                  renderMetadata={() => renderMetadata(index)}
                />
                {index < contracts.length - 1 && <Hr />}
              </div>
            );
          case Contract.SetAccountName:
            return (
              <div key={`${index}`}>
                <SetAccountName
                  {...contract}
                  contractIndex={index}
                  filteredReceipts={filteredReceipts}
                  renderMetadata={() => renderMetadata(index)}
                />
                {index < contracts.length - 1 && <Hr />}
              </div>
            );
          case Contract.Proposal:
            return (
              <div key={`${index}`}>
                <Proposal
                  {...contract}
                  contractIndex={index}
                  filteredReceipts={filteredReceipts}
                  renderMetadata={() => renderMetadata(index)}
                />
                {index < contracts.length - 1 && <Hr />}
              </div>
            );
          case Contract.Vote:
            return (
              <div key={`${index}`}>
                <Vote
                  {...contract}
                  contractIndex={index}
                  filteredReceipts={filteredReceipts}
                  renderMetadata={() => renderMetadata(index)}
                />
                {index < contracts.length - 1 && <Hr />}
              </div>
            );
          case Contract.ConfigITO:
            return (
              <div key={`${index}`}>
                <ConfigITO
                  {...contract}
                  contractIndex={index}
                  filteredReceipts={filteredReceipts}
                  renderMetadata={() => renderMetadata(index)}
                />
                {index < contracts.length - 1 && <Hr />}
              </div>
            );
          case Contract.SetITOPrices:
            return (
              <div key={`${index}`}>
                <SetITOPrices
                  {...contract}
                  contractIndex={index}
                  filteredReceipts={filteredReceipts}
                  renderMetadata={() => renderMetadata(index)}
                />
                {index < contracts.length - 1 && <Hr />}
              </div>
            );
          case Contract.Buy:
            return (
              <div key={`${index}`}>
                <Buy
                  {...contract}
                  contractIndex={index}
                  filteredReceipts={filteredReceipts}
                  sender={sender || ''}
                  contracts={contracts as any}
                  renderMetadata={() => renderMetadata(index)}
                />
                {index < contracts.length - 1 && <Hr />}
              </div>
            );
          case Contract.Sell:
            return (
              <div key={`${index}`}>
                <Sell
                  {...contract}
                  contractIndex={index}
                  filteredReceipts={filteredReceipts}
                  renderMetadata={() => renderMetadata(index)}
                />
                {index < contracts.length - 1 && <Hr />}
              </div>
            );
          case Contract.CancelMarketOrder:
            return (
              <div key={`${index}`}>
                <CancelMarketOrder
                  {...contract}
                  contractIndex={index}
                  filteredReceipts={filteredReceipts}
                  renderMetadata={() => renderMetadata(index)}
                />
                {index < contracts.length - 1 && <Hr />}
              </div>
            );
          case Contract.CreateMarketplace:
            return (
              <div key={`${index}`}>
                <CreateMarketplace
                  {...contract}
                  contractIndex={index}
                  renderMetadata={() => renderMetadata(index)}
                  filteredReceipts={filteredReceipts}
                />
                {index < contracts.length - 1 && <Hr />}
              </div>
            );
          case Contract.ConfigMarketplace:
            return (
              <div key={`${index}`}>
                <ConfigMarketplace
                  {...contract}
                  contractIndex={index}
                  filteredReceipts={filteredReceipts}
                  renderMetadata={() => renderMetadata(index)}
                />
                {index < contracts.length - 1 && <Hr />}
              </div>
            );
          case Contract.UpdateAccountPermission:
            return (
              <div key={`${index}`}>
                <UpdateAccountPermission
                  {...contract}
                  contractIndex={index}
                  filteredReceipts={filteredReceipts}
                  renderMetadata={() => renderMetadata(index)}
                />
                {index < contracts.length - 1 && <Hr />}
              </div>
            );
          case Contract.Deposit:
            return (
              <div key={`${index}`}>
                <Deposit
                  {...contract}
                  contractIndex={index}
                  filteredReceipts={filteredReceipts}
                  renderMetadata={() => renderMetadata(index)}
                />
                {index < contracts.length - 1 && <Hr />}
              </div>
            );
          case Contract.ITOTrigger:
            return (
              <div key={`${index}`}>
                <ITOTrigger
                  {...contract}
                  contractIndex={index}
                  filteredReceipts={filteredReceipts}
                  renderMetadata={() => renderMetadata(index)}
                />
                {index < contracts.length - 1 && <Hr />}
              </div>
            );
          case Contract.SmartContract:
            return (
              <div key={`${index}`}>
                <SmartContract
                  {...contract}
                  logs={logs}
                  contractIndex={index}
                  filteredReceipts={filteredReceipts}
                  renderMetadata={() => renderMetadata(index)}
                />
              </div>
            );
          default:
            return <div />;
        }
      })}
    </div>
  );
};

export default ContractsList;
