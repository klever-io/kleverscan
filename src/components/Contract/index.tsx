import {
  InputLabel,
  Slider,
  StyledInput,
  Toggle,
  ToggleContainer,
} from '@/components/Form/FormInput/styles';
import { ICollectionList, IParamList } from '@/types/index';
import formSection from '@/utils/formSections';
import {
  assetTriggerTypes,
  claimTypes,
  contractOptions,
  parseAddress,
} from '@/utils/index';
import { core } from '@klever/sdk';
import Form, { ISection } from 'components/Form';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Copy from '../Copy';
import PackInfoForm from '../CustomForm/PackInfo';
import ParametersForm from '../CustomForm/Parameters';
import PermissionsForm from '../CustomForm/Permissions';
import Select from './Select';
import {
  AssetIDInput,
  AssetTriggerContainer,
  BalanceContainer,
  BalanceLabel,
  CloseIcon,
  Container,
  ExtraOptionContainer,
  FieldLabel,
  SelectContainer,
  SelectContent,
} from './styles';
import { getType, precisionParse } from './utils';

interface IContract {
  assetsList: ICollectionList[];
  proposalsList: any[];
  paramsList: IParamList[];
}

const Contract: React.FC<IContract> = ({
  assetsList,
  proposalsList,
  paramsList,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [formSections, setFormSections] = useState<ISection[]>([]);
  const [contractType, setContractType] = useState('');
  const [tokenChosen, setTokenChosen] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [ownerAddress, setOwnerAddress] = useState('');
  const [claimType, setClaimType] = useState(0);
  const [typeAssetTrigger, setTypeAssetTrigger] = useState(0);
  const [data, setData] = useState('');
  const [isMultisig, setIsMultisig] = useState(false);
  const [bucketsCollection, setBucketsCollection] = useState<any>([]);
  const [bucketsList, setBucketsList] = useState<any>([]);
  const [selectedBucket, setSelectedBucket] = useState('');
  const [assetBalance, setAssetBalance] = useState<number | null>(null);

  const [collection, setCollection] = useState<any>({});
  const [assetID, setAssetID] = useState(0);
  const [proposalId, setProposalId] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        if (window.kleverWeb) {
          setOwnerAddress(window.kleverWeb.getWalletAddress());
        }
      } catch (error) {
        router.push('/');
      }
    }
  }, []);

  useEffect(() => {
    if (contractType === 'DelegateContract') {
      setBucketsCollection(['KFI', 'KLV']);
    } else if (contractType === 'UndelegateContract') {
      const buckets: any = [];
      assetsList.forEach((asset: any) => {
        asset?.buckets.forEach((bucket: any) => {
          if (bucket.delegation !== ownerAddress) {
            buckets.push({
              label: parseAddress(bucket.id, 20),
              value: bucket.id,
            });
          }
        });
      });

      setBucketsList([...buckets]);
    }
  }, [contractType]);

  useEffect(() => {
    const buckets: any = [];

    bucketsCollection.forEach((collection: string) => {
      assetsList.forEach((item: any) => {
        if (item.label === collection) {
          item.buckets.forEach((bucket: any) => {
            buckets.push({
              label: parseAddress(bucket.id, 20),
              value: bucket.id,
            });
          });
        }
      });
    });

    setBucketsList([...buckets]);
  }, [bucketsCollection]);

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
          if (
            !isNaN(Number(parameter.parameterKey)) &&
            !isNaN(Number(parameter.parameterValue))
          ) {
            parameters[parameter.parameterKey] = String(
              parameter.parameterValue,
            );
          }
        });

        if (Object.keys(parameters).length > 0) {
          parsedValues.parameters = parameters;
        }
      }
    } else if (contractType === 'VoteContract') {
      parsedValues.proposalId = proposalId;
    }

    if (contractHaveBucketId()) {
      parsedValues.bucketId = selectedBucket;
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
      if (parsedValues[item] && parsedValues[item].uris) {
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
    if (selectedOption.value === 'ProposalContract') {
      setFormSections([
        ...formSection(selectedOption.value, '', ownerAddress, paramsList),
      ]);
    } else {
      setFormSections([...formSection(selectedOption.value, '', ownerAddress)]);
    }
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
      if (isMultisig) {
        const blob = new Blob([JSON.stringify(signedTx)], {
          type: 'application/json',
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${contractType} - Nonce: ${signedTx.RawData.Nonce}.json`;
        link.click();
        window.URL.revokeObjectURL(url);
        setLoading(false);
        toast.success(
          'Transaction built and signed, send the file to the co-owner(s)',
        );
      } else {
        const response = await core.broadcastTransactions([signedTx]);
        setLoading(false);
        setTxHash(response.data.txsHashes[0]);
        toast.success('Transaction broadcast successfully');
      }
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
    } else if (contractType === 'ProposalContract') {
      return (
        <Form contractName={contractType} key={contractType} {...formProps}>
          {paramsList.length > 0 && <ParametersForm paramsList={paramsList} />}
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

  const contractHaveKDA = (): boolean => {
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

  const contractHaveBucketId = (): boolean => {
    const contracts = [
      'UnfreezeContract',
      'DelegateContract',
      'UndelegateContract',
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

      <Select
        options={contractOptions}
        onChange={handleOption}
        title={'Contract'}
      />

      {contractType === 'VoteContract' && (
        <SelectContainer>
          <SelectContent>
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
          <SelectContent>
            <BalanceContainer>
              <FieldLabel>Select an asset/collection</FieldLabel>
              {!isNaN(Number(assetBalance)) && assetBalance !== null && (
                <BalanceLabel>
                  Balance: {assetBalance / 10 ** collection.precision}
                </BalanceLabel>
              )}
            </BalanceContainer>

            <Select
              options={getAssetsList(assetsList)}
              onChange={value => {
                setCollection(value);
                if (contractType === 'UnfreezeContract') {
                  setBucketsCollection([value.value]);
                }
              }}
            />
          </SelectContent>
          {collection?.isNFT && (
            <SelectContent>
              <FieldLabel>Asset ID</FieldLabel>
              <AssetIDInput
                type="number"
                onChange={e => setAssetID(Number(e.target.value))}
              />
            </SelectContent>
          )}
        </SelectContainer>
      )}

      {contractHaveBucketId() && (
        <SelectContainer>
          <SelectContent>
            <FieldLabel>Select a bucket</FieldLabel>
            <Select
              options={bucketsList}
              onChange={(value: any) => {
                setSelectedBucket(value.value);
              }}
            />
          </SelectContent>
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
