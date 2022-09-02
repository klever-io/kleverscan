import {
  InputLabel,
  Slider,
  StyledInput,
  Toggle,
  ToggleContainer,
} from '@/components/Form/FormInput/styles';
import { ICollectionList, IKAssets, IParamList } from '@/types/index';
import formSection from '@/utils/formSections';
import {
  assetTriggerTypes,
  claimTypes,
  contractOptions,
  parseAddress,
} from '@/utils/index';
import { Card } from '@/views/blocks';
import { core } from '@klever/sdk';
import Form, { ISection } from 'components/Form';
import Link from 'next/link';
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
  CardContainer,
  CloseIcon,
  Container,
  ExtraOptionContainer,
  FieldLabel,
  SelectContainer,
  SelectContent,
} from './styles';
import {
  contractHaveBucketId,
  contractHaveKDA,
  contractsDescription,
  getAssetsList,
  getType,
  parseValues,
  precisionParse,
  showAssetIDInput,
} from './utils';

interface IContract {
  assetsList: ICollectionList[];
  proposalsList: any[];
  paramsList: IParamList[];
  kAssets: IKAssets[];
  getAssets: () => void;
}

let triggerKey = 0;
let claimKey = 0;
let buyKey = 0;
let assetID = 0;

const Contract: React.FC<IContract> = ({
  assetsList,
  proposalsList,
  paramsList,
  kAssets,
  getAssets,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [formSections, setFormSections] = useState<ISection[]>([]);
  const [contractType, setContractType] = useState('');
  const [tokenChosen, setTokenChosen] = useState(false);
  const [ITOBuy, setITOBuy] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [ownerAddress, setOwnerAddress] = useState('');
  const [claimType, setClaimType] = useState(0);
  const [typeAssetTrigger, setTypeAssetTrigger] = useState<number | null>(null);
  const [data, setData] = useState('');
  const [isMultisig, setIsMultisig] = useState(false);
  const [bucketsCollection, setBucketsCollection] = useState<any>([]);
  const [bucketsList, setBucketsList] = useState<any>([]);
  const [selectedBucket, setSelectedBucket] = useState('');
  const [assetBalance, setAssetBalance] = useState<number | null>(null);
  const [collection, setCollection] = useState<any>({});
  const [proposalId, setProposalId] = useState<number | null>(null);
  const [claimLabel, setClaimLabel] = useState('Asset ID');
  const [buyLabel, setBuyLabel] = useState('Order ID');

  useEffect(() => {
    setAssetBalance(null);
    if (typeof window !== 'undefined') {
      try {
        if (window.kleverWeb) {
          setOwnerAddress(window.kleverWeb.getWalletAddress());
        }
      } catch (error) {
        console.error(error);
      }
    }
  }, [contractType]);

  useEffect(() => {
    if (txHash) {
      window.scrollTo(0, 0);
    }
  }, [txHash]);

  useEffect(() => {
    setFormSections([
      ...formSection(
        'ClaimContract',
        '',
        ownerAddress,
        paramsList,
        typeAssetTrigger,
        claimLabel,
      ),
    ]);
  }, [claimLabel]);

  useEffect(() => {
    setFormSections([
      ...formSection(contractType, '', ownerAddress, [], typeAssetTrigger),
    ]);
  }, [typeAssetTrigger]);

  useEffect(() => {
    setAssetBalance(null);
    setCollection({});

    if (contractType !== 'AssetTriggerContract') {
      setTypeAssetTrigger(null);
    }

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
    setAssetBalance(collection?.balance);
    const getAssetID = async () => {
      if (!collection.isNFT) {
        assetID = 0;
      }
    };

    getAssetID();
  }, [collection]);

  const defineBuyContract = (label: string) => {
    buyKey += 1;
    setFormSections([
      ...formSection('BuyContract', '', ownerAddress, [], null, '', label),
    ]);
  };

  useEffect(() => {
    if (ITOBuy) {
      setBuyLabel('ITO Asset ID');
      defineBuyContract('ITO Asset ID');
    } else {
      setBuyLabel('Order ID');
      defineBuyContract('Order ID');
    }
  }, [ITOBuy]);

  const handleOption = (selectedOption: any) => {
    setContractType(selectedOption.value);

    switch (selectedOption.value) {
      case 'ProposalContract':
        setFormSections([
          ...formSection(selectedOption.value, '', ownerAddress, paramsList),
        ]);
        break;

      case 'ClaimContract':
        setFormSections([
          ...formSection(
            selectedOption.value,
            '',
            ownerAddress,
            paramsList,
            typeAssetTrigger,
            claimLabel,
          ),
        ]);
        break;

      case 'BuyContract':
        defineBuyContract(buyLabel);
        break;

      default:
        setFormSections([
          ...formSection(selectedOption.value, '', ownerAddress),
        ]);
        break;
    }
  };

  const handleSubmit = async (contractValues: any) => {
    const parsedValues: any = parseValues(
      contractValues,
      contractType,
      typeAssetTrigger,
      claimType,
      assetID,
      collection,
      selectedBucket,
      proposalId,
      tokenChosen,
      ITOBuy,
    );

    setLoading(true);

    const payload = {
      ...parsedValues,
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

  const permissionsForm = () => (
    <Form contractName={contractType} key={contractType} {...formProps}>
      <PermissionsForm />
    </Form>
  );

  const proposalForm = () => (
    <Form contractName={contractType} key={contractType} {...formProps}>
      {paramsList.length > 0 && <ParametersForm paramsList={paramsList} />}
    </Form>
  );

  const ITOForm = () => (
    <Form contractName={contractType} key={contractType} {...formProps}>
      <PackInfoForm />
    </Form>
  );

  const proposalSelect = () => (
    <SelectContainer>
      <SelectContent>
        <FieldLabel>Proposal ID</FieldLabel>
        <Select
          options={proposalsList}
          onChange={(value: any) => setProposalId(value?.value)}
        />
      </SelectContent>
    </SelectContainer>
  );

  const assetTriggerSelect = () => (
    <AssetTriggerContainer>
      <InputLabel>Trigger Type</InputLabel>
      <Select
        getAssets={getAssets}
        options={assetTriggerTypes}
        onChange={value => setTypeAssetTrigger(value ? value.value : 0)}
      />
    </AssetTriggerContainer>
  );

  const claimSelect = () => (
    <SelectContainer>
      <FieldLabel>Claim Type</FieldLabel>
      <Select
        options={claimTypes}
        onChange={value => {
          if (!isNaN(value?.value)) {
            if (value.value === 0 || value.value === 1) {
              setClaimLabel('Asset ID');
            } else if (value.value === 2) {
              setClaimLabel('Order ID');
            }
            setClaimType(value.value);
          }
        }}
      />
    </SelectContainer>
  );

  const assetTypeToggle = () => (
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
  );

  const buyTypeToggle = () => (
    <ExtraOptionContainer>
      <ToggleContainer>
        ITO Buy
        <Toggle>
          <StyledInput
            type="checkbox"
            defaultChecked={true}
            onClick={() => setITOBuy(!ITOBuy)}
          />
          <Slider />
        </Toggle>
        Market Buy
      </ToggleContainer>
    </ExtraOptionContainer>
  );

  const hashComponent = () => (
    <ExtraOptionContainer>
      <Link href={`/transaction/${txHash}`}>
        <a target="_blank" rel="noopener noreferrer">
          Hash: {txHash}
        </a>
      </Link>
      <Copy data={txHash ? txHash : ''} />
      <CloseIcon onClick={() => setTxHash(null)} />
    </ExtraOptionContainer>
  );

  const bucketListSelect = () => (
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
  );

  const KDASelect = () => (
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
          options={getAssetsList(
            contractType === 'AssetTriggerContract' ? kAssets : assetsList,
            contractType,
            typeAssetTrigger,
          )}
          onChange={value => {
            setCollection(value);
            if (contractType === 'UnfreezeContract') {
              setBucketsCollection([value.value]);
            }
          }}
        />
      </SelectContent>

      {collection?.isNFT && showAssetIDInput(contractType, typeAssetTrigger) && (
        <SelectContent>
          <FieldLabel>Asset ID</FieldLabel>
          <AssetIDInput
            type="number"
            onChange={e => (assetID = Number(e.target.value))}
          />
        </SelectContent>
      )}
    </SelectContainer>
  );

  const renderForm = () => {
    switch (contractType) {
      case 'UpdateAccountPermissionContract':
        return permissionsForm();

      case 'ProposalContract':
        return proposalForm();

      case 'ConfigITOContract':
      case 'SetITOPricesContract':
        return ITOForm();

      default:
        triggerKey += 1;
        claimKey += 1;

        const key =
          contractType === 'CreateAssetContract'
            ? String(formSections)
            : contractType === 'AssetTriggerContract'
            ? triggerKey
            : contractType === 'ClaimContract'
            ? claimKey
            : contractType === 'BuyContract'
            ? buyKey
            : contractType;

        return (
          <Form
            contractName={contractType}
            key={key}
            showForm={showForm()}
            {...formProps}
          />
        );
    }
  };

  const renderSelect = () => {
    switch (contractType) {
      case 'VoteContract':
        return proposalSelect();

      case 'AssetTriggerContract':
        return assetTriggerSelect();

      case 'CreateAssetContract':
        return assetTypeToggle();

      case 'ClaimContract':
        return claimSelect();

      case 'BuyContract':
        return buyTypeToggle();

      default:
        break;
    }
  };

  const showForm = () =>
    (contractType !== 'AssetTriggerContract' ||
      typeAssetTrigger !== 1 ||
      !collection?.isNFT) &&
    !(typeAssetTrigger === 1 && Object.keys(collection).length === 0);

  return (
    <Container loading={loading ? loading : undefined}>
      {txHash && hashComponent()}

      <Select
        options={contractOptions}
        onChange={handleOption}
        getAssets={getAssets}
        title={'Contract'}
      />

      {contractsDescription[contractType] && (
        <CardContainer>
          <Card>
            <div>
              <span>{contractsDescription[contractType]}</span>
            </div>
          </Card>
        </CardContainer>
      )}

      {renderSelect()}

      {contractHaveKDA(contractType, typeAssetTrigger) && KDASelect()}

      {contractHaveBucketId(contractType) && bucketListSelect()}

      {renderForm()}
    </Container>
  );
};

export default Contract;
