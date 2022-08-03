import { useEffect, useState } from 'react';

import { core, Account } from '@klever/sdk';
import Select from 'react-select';
import { toast } from 'react-toastify';

import {
  InputLabel,
  Slider,
  StyledInput,
  Toggle,
  ToggleContainer,
} from '@/components/Form/FormInput/styles';
import formSection from '@/utils/formSections';
import { assetTriggerTypes, claimTypes, contractOptions } from '@/utils/index';
import {
  AssetTriggerContainer,
  CloseIcon,
  Container,
  ExtraOptionContainer,
  FieldLabel,
  SelectContainer,
  SelectContent,
  AssetIDInput,
  BalanceLabel,
} from './styles';
import { ICollectionList } from '@/types/index';
import { getType, precisionParse } from './utils';

import Form, { ISection } from 'components/Form';
import PackInfoForm from '../CustomForm/PackInfo';
import PermissionsForm from '../CustomForm/Permissions';
import Copy from '../Copy';

interface IContract {
  assetsList: ICollectionList[];
  proposalsList: any[];
}

const Contract: React.FC<IContract> = ({ assetsList, proposalsList }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [formSections, setFormSections] = useState<ISection[]>([]);
  const [contractType, setContractType] = useState('');
  const [tokenChosen, setTokenChosen] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [ownerAddress, setOwnerAddress] = useState('');
  const [claimType, setClaimType] = useState(0);
  const [typeAssetTrigger, setTypeAssetTrigger] = useState(0);
  const [data, setData] = useState('');
  const [isMultisig, setIsMultisig] = useState(true);
  const [assetBalance, setAssetBalance] = useState<number | null>(null);
  const [collection, setCollection] = useState<any>({});
  const [assetID, setAssetID] = useState(0);
  const [proposalId, setProposalId] = useState<number | null>(null);

  useEffect(() => {
    if (sessionStorage) {
      setOwnerAddress(sessionStorage.getItem('walletAddress') || '');
    }
  }, [ownerAddress]);

  useEffect(() => {
    if (tokenChosen) {
      setFormSections([...formSection(contractType, 'Token', ownerAddress)]);
    } else {
      setFormSections([...formSection(contractType, 'NFT', ownerAddress)]);
    }
  }, [tokenChosen]);

  useEffect(() => {
    setAssetBalance(null);
  }, []);

  useEffect(() => {
    setAssetBalance(null);
    setCollection({});
  }, [contractType]);

  useEffect(() => {
    setAssetBalance(collection?.balance);
    const getAssetID = async () => {
      if (!collection.isNFT) {
        setAssetID(0);
      }
    };

    getAssetID();
  }, [collection]);

  const parseValues = (values: any) => {
    const parsedValues = JSON.parse(JSON.stringify(values));

    if (contractHaveKDA()) {
      if (contractType === 'AssetTriggerContract') {
        parsedValues.assetId =
          assetID !== 0 ? `${collection.value}/${assetID}` : collection.value;
      } else {
        parsedValues.kda =
          assetID !== 0 ? `${collection.value}/${assetID}` : collection.value;
      }
    } else if (contractType === 'CreateAssetContract') {
      parsedValues.type = tokenChosen ? 0 : 1;
    } else if (contractType === 'AssetTriggerContract') {
      parsedValues.triggerType = typeAssetTrigger;
    } else if (contractType === 'ClaimContract') {
      parsedValues.claimType = claimType;
    } else if (contractType === 'ProposalContract') {
      if (values.parameters) {
        const parameters = {};

        values.parameters.forEach((parameter: any) => {
          if (!isNaN(Number(parameter.key)) && parameter.value) {
            parameters[parameter.key] = String(parameter.value);
          }
        });

        if (Object.keys(parameters).length > 0) {
          parsedValues.parameters = parameters;
        }
      }
    } else if (contractType === 'VoteContract') {
      parsedValues.proposalId = proposalId;
    }

    if (values.uris) {
      const uris = {};

      values.uris.forEach((uri: any) => {
        if (uri.label && uri.address) {
          uris[uri.label] = uri.address;
        }
      });

      if (Object.keys(uris).length > 0) {
        parsedValues.uris = uris;
      }
    }

    Object.keys(parsedValues).forEach((item: any) => {
      if (parsedValues[item].uris) {
        const uris = {};

        parsedValues[item].uris.forEach((uri: any) => {
          if (uri.label && uri.address) {
            uris[uri.label] = uri.address;
          }
        });

        if (Object.keys(uris).length > 0) {
          parsedValues[item].uris = uris;
        }
      }
    });

    return parsedValues;
  };

  const handleOption = (selectedOption: any) => {
    setContractType(selectedOption.value);
    setFormSections([...formSection(selectedOption.value, '', ownerAddress)]);
  };

  const handleSubmit = async (contractValues: any) => {
    setLoading(true);

    const payload = {
      ...parseValues(contractValues),
    };

    const parsedPayload = await precisionParse(payload, contractType);

    try {
      const unsignedTx = await core.buildTransaction(
        [
          {
            type: getType(contractType),
            payload: parsedPayload,
          },
        ],
        [data],
      );

      const signedTx = await window.kleverWeb.signTransaction(unsignedTx);

      const response = await core.broadcastTransactions([signedTx]);
      setLoading(false);
      setTxHash(response.data.txsHashes[0]);
      toast.success('Transaction broadcast successfully');
    } catch (e: any) {
      setLoading(false);
      console.log(`%c ${e}`, 'color: red');
      toast.error(e.message ? e.message : e);
    }
  };

  const formProps = {
    sections: formSections,
    onSubmit: handleSubmit,
    loading,
    setData,
    setIsMultisig,
    isMultisig,
  };

  const renderForm = () => {
    if (contractType === 'UpdateAccountPermissionContract') {
      return (
        <Form contractName={contractType} key={contractType} {...formProps}>
          <PermissionsForm />
        </Form>
      );
    } else {
      return (
        <Form
          contractName={contractType}
          key={
            contractType === 'CreateAssetContract'
              ? formSections.toString()
              : contractType
          }
          {...formProps}
        />
      );
    }
  };

  const contractHaveKDA = () => {
    const contracts = [
      'TransferContract',
      'FreezeContract',
      'UnfreezeContract',
      'WithdrawContract',
      'ConfigITOContract',
      'SetITOPricesContract',
      'AssetTriggerContract',
    ];

    return contracts.includes(contractType);
  };

  const getAssetsList = (assets: any[]) => {
    if (contractType === 'AssetTriggerContract') {
      const bothCollectionNFT = [1, 2];
      const justCollection = [0, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13];
      const justNFT = [8];

      if (bothCollectionNFT.includes(typeAssetTrigger)) {
        return assets;
      } else if (justCollection.includes(typeAssetTrigger)) {
        return assets.filter((value: ICollectionList) => {
          return !value.isNFT;
        });
      } else if (justNFT.includes(typeAssetTrigger)) {
        return assets.filter((value: ICollectionList) => {
          return value.isNFT;
        });
      }
    } else if (contractType === 'FreezeContract') {
      return assets.filter((value: ICollectionList) => {
        return !value.isNFT;
      });
    } else if (contractType === 'UnfreezeContract') {
      return assets.filter((value: ICollectionList) => {
        return !value.isNFT && value.frozenBalance !== 0;
      });
    }

    return assets;
  };

  useEffect(() => {
    if (txHash) {
      window.scrollTo(0, 0);
    }
  }, [txHash]);

  return (
    <Container loading={loading ? loading : undefined}>
      {txHash && (
        <ExtraOptionContainer>
          <a
            href={`https://kleverscan.org/transaction/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            hash: {txHash}
          </a>
          <Copy data={txHash} />
          <CloseIcon onClick={() => setTxHash(null)} />
        </ExtraOptionContainer>
      )}

      <Select options={contractOptions} onChange={handleOption} />

      {contractType === 'VoteContract' && (
        <SelectContainer>
          <SelectContent size={30}>
            <FieldLabel>Proposal ID</FieldLabel>
            <Select
              options={proposalsList}
              onChange={(value: any) => setProposalId(value?.value)}
            />
          </SelectContent>
        </SelectContainer>
      )}

      {contractType === 'AssetTriggerContract' && (
        <AssetTriggerContainer>
          <InputLabel>Trigger Type</InputLabel>
          <Select
            options={assetTriggerTypes}
            onChange={value => setTypeAssetTrigger(value ? value.value : 0)}
          />
        </AssetTriggerContainer>
      )}

      {contractHaveKDA() && (
        <SelectContainer>
          <SelectContent size={55}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <FieldLabel>Select an asset/collection</FieldLabel>
              {!isNaN(Number(assetBalance)) && assetBalance !== null && (
                <BalanceLabel>
                  Balance: {assetBalance / 10 ** collection.precision}
                </BalanceLabel>
              )}
            </div>
            <Select
              options={getAssetsList(assetsList)}
              onChange={value => setCollection(value)}
            />
          </SelectContent>
          {collection?.isNFT && (
            <SelectContent size={13}>
              <FieldLabel>Asset ID</FieldLabel>
              <AssetIDInput
                type="number"
                onChange={e => setAssetID(Number(e.target.value))}
              />
            </SelectContent>
          )}
        </SelectContainer>
      )}

      {contractType === 'CreateAssetContract' && (
        <ExtraOptionContainer>
          <ToggleContainer>
            Token
            <Toggle>
              <StyledInput
                type="checkbox"
                defaultChecked={true}
                onClick={() => setTokenChosen(!tokenChosen)}
              />
              <Slider />
            </Toggle>
            NFT
          </ToggleContainer>
        </ExtraOptionContainer>
      )}

      {contractType === 'ClaimContract' && (
        <SelectContainer>
          <FieldLabel>Claim Type</FieldLabel>
          <Select
            options={claimTypes}
            onChange={value => setClaimType(value ? value.value : 0)}
          />
        </SelectContainer>
      )}

      {contractType === 'ConfigITOContract' ||
      contractType === 'SetITOPricesContract' ? (
        <Form contractName={contractType} key={contractType} {...formProps}>
          <PackInfoForm />
        </Form>
      ) : (
        renderForm()
      )}
    </Container>
  );
};

export default Contract;
