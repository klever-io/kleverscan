import Form, { IFormProps, ISection } from '@/components/Form';
import {
  InputLabel,
  Slider,
  StyledInput,
  Toggle,
  ToggleContainer,
} from '@/components/Form/FormInput/styles';
import { useContract } from '@/contexts/contract';
import { IStakingRewards } from '@/pages/account/[account]';
import { IAccountAsset, ICollectionList, IParamList } from '@/types/index';
import {
  assetTriggerTypes,
  claimTypes,
  ITOTriggerTypes,
  withdrawTypes,
} from '@/utils/contracts';
import formSection from '@/utils/formSections';
import { parseAddress } from '@/utils/parseValues';
import { web } from '@klever/sdk';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { toast } from 'react-toastify';
import ConfirmPayload from '../ConfirmPayload';
import Copy from '../Copy';
import PackInfoForm from '../CustomForm/PackInfo';
import ParametersForm from '../CustomForm/Parameters';
import PermissionsForm from '../CustomForm/Permissions';
import { Card } from '../Detail/styles';
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
  LoadingBackground,
  SelectContainer,
  SelectContent,
} from './styles';
import {
  buildTransaction,
  contractHaveBucketId,
  contractHaveKDA,
  contractsDescription,
  getAssetsList,
  getType,
  parseValues,
  precisionParse,
  showAssetIDInput,
} from './utils';

type ProposalsList = {
  label: string;
  value: number;
};
export interface IContract {
  assetsList: ICollectionList[] | null;
  proposalsList: ProposalsList[];
  paramsList: IParamList[];
  kAssets: ICollectionList[];
  getAssets: () => void;
  isModal?: boolean;
  modalContractType?: { value: string };
  assetTriggerSelected?: IAccountAsset;
  claimSelectedType?: IStakingRewards;
  openModal?: boolean;
  elementIndex?: number;
  valueContract?: any;
}
interface IContractSection extends ISection {
  index?: number;
}

let kAssetContracts = [
  'AssetTriggerContract',
  'ConfigITOContract',
  'ITOTriggerContract',
  'DepositContract',
];

const collectionContracts = [
  'ConfigITOContract',
  'ITOTriggerContract',
  'WithdrawContract',
];

const emptySectionContracts = [
  'UpdateAccountPermissionContract',
  'UnjailContract',
  'UnfreezeContract',
  'UndelegateContract',
  'SetITOPricesContract',
];

const Contract: React.FC<IContract> = ({
  assetsList,
  proposalsList,
  paramsList,
  kAssets,
  getAssets,
  isModal,
  modalContractType,
  assetTriggerSelected,
  claimSelectedType,
  openModal,
  elementIndex = 0,
  valueContract,
}) => {
  const [tokenChosen, setTokenChosen] = useState(false);
  const [claimType, setClaimType] = useState<any>();
  const [withdrawType, setWithdrawType] = useState<number | null>(null);
  const [depositValue, setDepositValue] = useState<number | null>(null);
  const [itoTriggerType, setItoTriggerType] = useState<number | null>(null);
  const [metadata, setMetadata] = useState<string>('');
  const [payload, setPayload] = useState<any>({});
  const [open, setOpen] = useState(false);
  const [bucketsList, setBucketsList] = useState<any>([]);
  const [assetBalance, setAssetBalance] = useState<number | null>(null);
  const [collection, setCollection] = useState<ICollectionList | undefined>(
    {} as ICollectionList,
  );

  const [proposalId, setProposalId] = useState<number | null>(null);
  const [depositType, setDepositType] = useState<string | null>(null);
  const [binaryOperations, setBinaryOperations] = useState([]);
  const [typeAssetTrigger, setTypeAssetTrigger] = useState<number | null>(null);
  const [formSections, setFormSections] = useState<IContractSection[]>([]);
  const [assetID, setAssetID] = useState<number>(0);
  const [selectedBucket, setSelectedBucket] = useState<string>('');
  const [buyType, setBuyType] = useState(true);

  const {
    contractType,
    setContractType,
    txLoading: loading,
    setTxLoading: setLoading,
    txHash,
    setTxHash,
    isMultisig,
    showPayload,
    ownerAddress,
    getOwnerAddress,
    kdaFee,
  } = useContract();

  const collectionRef = useRef<any>(null);
  const contractRef = useRef<any>(null);

  const keyElement = JSON.stringify([
    formSections,
    elementIndex,
    contractType,
    typeAssetTrigger,
    claimType,
    assetID,
    collection,
    selectedBucket,
    proposalId,
    tokenChosen,
    binaryOperations,
    depositType,
    withdrawType,
    itoTriggerType,
  ]);

  useEffect(() => {
    if (valueContract) {
      const getAsset = assetsList?.filter(
        asset => asset.label === valueContract[0],
      )[0];
      if (getAsset) {
        setCollection(getAsset);
      }
      setSelectedBucket(valueContract[1]);
    }
  }, [valueContract]);

  useEffect(() => {
    if (contractType === 'BuyContract') {
      setFormSections([
        ...formSection({
          contract: 'BuyContract',
          address: ownerAddress,
          buyType,
        }),
      ]);
    }
  }, [buyType, contractType]);

  useEffect(() => {
    if (loading) {
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = 'unset';
    }
  }, [loading]);

  useEffect(() => {
    const getAsset = kAssets.filter(
      asset => asset.label === assetTriggerSelected?.assetId,
    )[0];
    if (getAsset) {
      setCollection({ ...getAsset, frozenBalance: 0, balance: 0 });
    }
    setClaimType(claimSelectedType?.value);
  }, [assetTriggerSelected, claimSelectedType]);

  useEffect(() => {
    if (!openModal) {
      setTxHash(null);
      setCollection(undefined);
    }
  }, [openModal]);

  useEffect(() => {
    setAssetBalance(null);
    if (typeof window !== 'undefined') {
      try {
        if (window.kleverWeb) {
          (async () => {
            try {
            } catch (error) {
              console.error(error);
            }
          })();
        }
      } catch (error) {
        console.error(error);
      }
    }
  }, [contractType]);

  useEffect(() => {
    if (typeAssetTrigger !== null) setTypeAssetTrigger(null);
    if (itoTriggerType !== null) setItoTriggerType(null);
    if (claimType !== 0) setClaimType(undefined);
    if (withdrawType !== null) setWithdrawType(null);
    if (depositType !== null) setDepositType(null);
    if (emptySectionContracts.includes(contractType)) {
      setFormSections([]);
    }
  }, [contractType]);

  useEffect(() => {
    if (claimType === 0 || claimType === 1) {
      setFormSections([
        ...formSection({
          contract: 'ClaimContract',
          address: getOwnerAddress(),
          claimLabel: 'Asset ID',
          inputValue: claimSelectedType?.inputValue || '',
        }),
      ]);
    }
  }, [claimType]);

  useEffect(() => {
    if (typeAssetTrigger === null) return;

    setFormSections([
      ...formSection({
        contract: contractType,
        address: getOwnerAddress(),
        assetTriggerType: typeAssetTrigger,
        collection,
      }),
    ]);
  }, [typeAssetTrigger, collection]);

  useEffect(() => {
    if (withdrawType === null) return;

    setFormSections([
      ...formSection({
        contract: contractType,
        address: getOwnerAddress(),
        withdrawType,
      }),
    ]);
  }, [withdrawType, collection]);

  useEffect(() => {
    if (itoTriggerType === null) return;
    setFormSections([
      ...formSection({
        contract: contractType,
        address: getOwnerAddress(),
        itoTriggerType,
        collection,
      }),
    ]);
  }, [itoTriggerType, collection]);

  useEffect(() => {
    if (contractType === 'UnfreezeContract') {
      const buckets: ProposalsList[] = [];
      assetsList?.forEach((item: any) => {
        if (item.label === collection?.label) {
          item?.buckets?.forEach((bucket: any) => {
            buckets.push({
              label: parseAddress(bucket.id, 20),
              value: bucket.id,
            });
          });
        }
      });
      setBucketsList(buckets);
    }

    if (contractType !== 'TransferContract') return;
    setFormSections([
      ...formSection({
        contract: contractType,
        address: ownerAddress,
        collection,
      }),
    ]);
  }, [collection]);

  useEffect(() => {
    setFormSections([
      ...formSection({
        contract: contractType,
        address: ownerAddress,
      }),
    ]);
  }, [depositValue]);

  useEffect(() => {
    setAssetBalance(null);
    if (JSON.stringify(collection) !== JSON.stringify({}))
      collectionRef.current = collection;
    setCollection({} as ICollectionList);

    if (contractType !== 'AssetTriggerContract') {
      setTypeAssetTrigger(null);
    }
    if (contractType !== 'WithdrawContract') {
      setWithdrawType(null);
    }

    if (contractType === 'DelegateContract') {
      const buckets: ProposalsList[] = [];
      assetsList?.forEach((item: any) => {
        if (item.label === 'KLV' || item.label === 'KFI') {
          item?.buckets?.forEach((bucket: any) => {
            buckets.push({
              label: parseAddress(bucket.id, 20),
              value: bucket.id,
            });
          });
        }
      });
      setBucketsList(buckets);
    } else if (contractType === 'UndelegateContract') {
      const buckets: ProposalsList[] = [];
      assetsList?.forEach((asset: any) => {
        asset?.buckets?.forEach((bucket: any) => {
          if (bucket?.delegation !== getOwnerAddress() && bucket.delegation) {
            buckets.push({
              label: parseAddress(bucket.id, 20),
              value: bucket.id,
            });
          }
        });
      });

      setBucketsList(buckets);
    }
  }, [contractType]);

  useEffect(() => {
    if (
      JSON.stringify(collectionRef.current) !== JSON.stringify({}) &&
      collectionRef.current !== null &&
      contractType !== contractRef.current
    ) {
      setCollection(collectionRef.current);
      contractRef.current = contractType;
    }
  }, [collection]);

  useEffect(() => {
    if (tokenChosen) {
      setFormSections([
        ...formSection({
          contract: contractType,
          type: 'Token',
          address: getOwnerAddress(),
        }),
      ]);
    } else {
      setFormSections([
        ...formSection({
          contract: contractType,
          type: 'NFT',
          address: getOwnerAddress(),
        }),
      ]);
    }
  }, [tokenChosen]);

  useEffect(() => {
    setAssetBalance(collection?.balance || null);
    const getAssetID = async () => {
      if (!collection?.isNFT) {
        setAssetID(0);
      }
    };

    getAssetID();
  }, [collection]);

  useEffect(() => {
    if (isModal && modalContractType) {
      setContractType(modalContractType.value);
      setFormSections([
        ...formSection({
          contract: modalContractType.value,
          address: ownerAddress,
        }),
      ]);
    }
  }, [modalContractType?.value]);

  useEffect(() => {
    if (
      withdrawType === 0 &&
      kAssetContracts.find(value => value == 'WithdrawContract')
    ) {
      kAssetContracts = kAssetContracts.filter(
        value => value !== 'WithdrawContract',
      );
    } else if (
      withdrawType === 1 &&
      !kAssetContracts.find(value => value == 'WithdrawContract')
    ) {
      kAssetContracts.push('WithdrawContract');
    }
  }, [withdrawType]);

  const formSend = async (parsedPayload: any) => {
    setLoading(true);
    const parsedData = Buffer.from(metadata, 'utf-8').toString('base64');
    try {
      const unsignedTx = await buildTransaction(
        [
          {
            type: getType(contractType),
            payload: parsedPayload,
          },
        ],
        [parsedData],
        {
          kdaFee: kdaFee.value,
        },
      );

      const signedTx = await window.kleverWeb.signTransaction(unsignedTx);

      if (isMultisig.current) {
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
        const response = await web.broadcastTransactions([signedTx]);
        setLoading(false);
        setTxHash(response.data.txsHashes[0]);
        toast.success('Transaction broadcast successfully');
      }
    } catch (e: any) {
      setLoading(false);
      console.warn(`%c ${e}`, 'color: red');
      toast.error(e.message ? e.message : e);
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
      buyType,
      binaryOperations,
      depositType,
      withdrawType,
      itoTriggerType,
    );

    if (parsedValues.amount === 0) {
      toast.error('Amount cannot be 0');
      return;
    }

    const payload = {
      ...parsedValues,
    };

    const parsedPayload = await precisionParse(payload, contractType);

    if (showPayload.current) {
      setOpen(true);
      setPayload({
        type: contractType,
        payload: parsedPayload,
      });
    } else {
      formSend(parsedPayload);
    }
  };

  const handleSend = async () => {
    await formSend(payload.payload);
    setOpen(false);
  };

  const showForm = () =>
    (contractType !== 'AssetTriggerContract' ||
      typeAssetTrigger !== 1 ||
      !collection?.isNFT) &&
    !(
      typeAssetTrigger === 1 &&
      collection &&
      Object.keys(collection).length === 0
    );

  const formProps: IFormProps = {
    sections: formSections,
    onSubmit: handleSubmit,
    loading,
    setMetadata,
    typeAssetTrigger,
    showForm: showForm(),
    collection: collection,
    assetID,
    itoTriggerType,
    metadata,
    selectedBucket,
    depositType,
  };

  const permissionsForm = () => (
    <Form key={contractType} {...formProps}>
      <PermissionsForm
        setBinaryOperations={setBinaryOperations}
        binaryOperations={binaryOperations}
      />
    </Form>
  );

  const proposalForm = () => (
    <Form key={keyElement} {...formProps}>
      {paramsList.length > 0 && <ParametersForm paramsList={paramsList} />}
    </Form>
  );

  const ITOForm = () => (
    <Form key={keyElement} {...formProps}>
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

  const depositToggle = () => {
    const depositOptions = [
      {
        label: 'FPR Deposit',
        value: 0,
      },
      {
        label: 'KDA Pool',
        value: 1,
      },
    ];

    return (
      <SelectContainer>
        <SelectContent>
          <FieldLabel>Deposit Type</FieldLabel>
          <Select
            options={depositOptions}
            onChange={(value: any) => setDepositType(value?.value)}
            zIndex={4}
          />
        </SelectContent>
      </SelectContainer>
    );
  };

  const handleSelect = (title: any, data: any, handleState: any) => (
    <AssetTriggerContainer>
      <InputLabel>
        <span>{title}</span>
      </InputLabel>
      <Select
        getAssets={getAssets}
        options={data}
        onChange={value => handleState(value ? value.value : 0)}
        zIndex={4}
        key={contractType}
      />
    </AssetTriggerContainer>
  );

  const claimSelect = () => (
    <SelectContainer>
      <SelectContent>
        <FieldLabel>Claim Type</FieldLabel>
        <Select
          zIndex={2}
          options={claimTypes}
          claimSelectedType={claimSelectedType}
          onChange={e => {
            if (!isNaN(e?.value)) {
              setClaimType(e.value);
              if (e.value === 0 || e.value === 1) {
                setFormSections([
                  ...formSection({
                    contract: 'ClaimContract',
                    address: getOwnerAddress(),
                    claimLabel: 'Asset ID',
                  }),
                ]);
              } else if (e.value === 2) {
                setFormSections([
                  ...formSection({
                    contract: 'ClaimContract',
                    address: getOwnerAddress(),
                    claimLabel: 'Order ID',
                  }),
                ]);
              }
            }
          }}
        />
      </SelectContent>
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
            onClick={() => setBuyType(!buyType)}
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
          selectedBucket={selectedBucket}
          options={bucketsList}
          onChange={({ value }: { value: string }) => {
            setSelectedBucket(value);
          }}
          zIndex={2}
        />
      </SelectContent>
    </SelectContainer>
  );

  const KDASelect = () => (
    <SelectContainer>
      <SelectContent configITO={contractType === 'ConfigITOContract'}>
        <BalanceContainer>
          <FieldLabel>Select an asset/collection</FieldLabel>
          {!isNaN(Number(assetBalance)) && assetBalance !== null && (
            <BalanceLabel>
              Balance: {assetBalance / 10 ** (collection?.precision || 0)}
            </BalanceLabel>
          )}
        </BalanceContainer>
        <Select
          key={JSON.stringify(collection)}
          collection={collection}
          options={getAssetsList(
            kAssetContracts.includes(contractType) ? kAssets : assetsList || [],
            contractType,
            typeAssetTrigger,
            withdrawType,
            getOwnerAddress(),
          )}
          onChange={value => {
            setCollection(value);
          }}
          getAssets={getAssets}
          zIndex={3}
        />
      </SelectContent>
      {collection?.isNFT &&
        !collectionContracts.includes(contractType) &&
        showAssetIDInput(contractType, typeAssetTrigger) && (
          <SelectContent>
            <FieldLabel>Asset ID</FieldLabel>
            <AssetIDInput
              type="number"
              onChange={e => setAssetID(Number(e.target.value))}
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
      case 'ITOTriggerContract':
        if (
          collection === undefined ||
          JSON.stringify(collection) === JSON.stringify({})
        )
          return;
        if (contractType === 'ITOTriggerContract' && itoTriggerType !== 0)
          return <Form key={keyElement} {...formProps} />;
        return ITOForm();
      default:
        return <Form key={keyElement} {...formProps} />;
    }
  };

  const renderSelect = () => {
    switch (contractType) {
      case 'VoteContract':
        return proposalSelect();

      case 'AssetTriggerContract':
        return handleSelect(
          'Trigger Type',
          assetTriggerTypes,
          setTypeAssetTrigger,
        );

      case 'WithdrawContract':
        return handleSelect('Withdraw Type', withdrawTypes, setWithdrawType);

      case 'CreateAssetContract':
        return assetTypeToggle();

      case 'ClaimContract':
        return claimSelect();

      case 'BuyContract':
        return buyTypeToggle();

      case 'DepositContract':
        return depositToggle();
      case 'ITOTriggerContract':
        return handleSelect('Trigger Type', ITOTriggerTypes, setItoTriggerType);

      default:
        break;
    }
  };

  return (
    <Container>
      {loading &&
        ReactDOM.createPortal(<LoadingBackground />, window.document.body)}
      {open && (
        <ConfirmPayload
          payload={payload}
          closeModal={() => setOpen(false)}
          handleConfirm={handleSend}
        />
      )}
      {txHash && hashComponent()}

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
      {contractHaveKDA(contractType, typeAssetTrigger, itoTriggerType) &&
        KDASelect()}

      {contractHaveBucketId(contractType) && bucketListSelect()}

      {renderForm()}
    </Container>
  );
};

export default Contract;
