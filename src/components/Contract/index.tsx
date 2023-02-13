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
import {
  IAccountAsset,
  ICollectionList,
  IKAssets,
  IParamList,
} from '@/types/index';
import { assetTriggerTypes, claimTypes } from '@/utils/contracts';
import formSection from '@/utils/formSections';
import { parseAddress } from '@/utils/index';
import { core } from '@klever/sdk';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { toast } from 'react-toastify';
import ConfirmPayload from '../ConfirmPayload';
import Copy from '../Copy';
import PackInfoForm from '../CustomForm/PackInfo';
import ParametersForm from '../CustomForm/Parameters';
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
  kAssets: IKAssets[];
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
let assetID = 0;

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
  const [claimType, setClaimType] = useState(0);
  const [data, setData] = useState<string>('');
  const [payload, setPayload] = useState<any>({});
  const [open, setOpen] = useState(false);
  const [bucketsCollection, setBucketsCollection] = useState<any>([]);
  const [bucketsList, setBucketsList] = useState<any>([]);
  const [assetBalance, setAssetBalance] = useState<number | null>(null);
  const [typeAssetTrigger, setTypeAssetTrigger] = useState<number | null>(null);
  const [formSections, setFormSections] = useState<IContractSection[]>([]);

  const {
    contractType,
    setContractType,
    ITOBuy,
    setITOBuy,
    selectedBucket,
    setSelectedBucket,
    proposalId,
    setProposalId,
    collection,
    setCollection,
    binaryOperations,
    txLoading: loading,
    setTxLoading: setLoading,
    txHash,
    setTxHash,
    isMultisig,
    showPayload,
    ownerAddress,
  } = useContract();

  const collectionRef = useRef<any>(null);
  const contractRef = useRef<any>(null);

  const getOwnerAddress = () => {
    return sessionStorage.getItem('walletAddress') || '';
  };
  const keyElement = JSON.stringify([formSections, elementIndex]);
  useEffect(() => {
    if (valueContract) {
      const getAsset = assetsList?.filter(
        asset => asset.label === valueContract[0],
      )[0];
      if (getAsset) {
        setCollection(getAsset);
      }
      setSelectedBucket(valueContract[1]);
      setBucketsCollection([valueContract[0]]);
    }
  }, [valueContract]);

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
      setCollection(getAsset);
    }
    setClaimType(claimSelectedType?.value || 0);
  }, [assetTriggerSelected, claimSelectedType]);

  useEffect(() => {
    if (claimType === 2) {
      setFormSections([
        ...formSection({
          contract: 'ClaimContract',
          address: getOwnerAddress(),
          claimLabel: 'Order ID',
        }),
      ]);
    }
  }, [claimType]);

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
    setFormSections([
      ...formSection({
        contract: contractType,
        address: getOwnerAddress(),
        assetTriggerType: typeAssetTrigger,
      }),
    ]);
  }, [typeAssetTrigger]);

  useEffect(() => {
    setAssetBalance(null);
    if (JSON.stringify(collection) !== JSON.stringify({}))
      collectionRef.current = collection;
    setCollection({});

    if (contractType !== 'AssetTriggerContract') {
      setTypeAssetTrigger(null);
    }

    if (contractType === 'DelegateContract') {
      setBucketsCollection(['KFI', 'KLV']);
    } else if (contractType === 'UndelegateContract') {
      const buckets: ProposalsList[] = [];
      assetsList?.forEach((asset: any) => {
        asset?.buckets?.forEach((bucket: any) => {
          if (bucket?.delegation !== getOwnerAddress()) {
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
    const buckets: ProposalsList[] = [];

    bucketsCollection.forEach((collection: string) => {
      assetsList &&
        assetsList.forEach((item: any) => {
          if (item.label === collection) {
            item?.buckets?.forEach((bucket: any) => {
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
    setAssetBalance(collection?.balance);
    const getAssetID = async () => {
      if (!collection?.isNFT) {
        assetID = 0;
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

  const parsePackInfo = (values: any) => {
    const parsedValues = JSON.parse(JSON.stringify(values));

    delete parsedValues.pack;

    const packInfo: {
      [key: string]: any;
    } = {};
    values.pack.forEach((item: any) => {
      const itemContent = {
        packs: item.packItem,
      };
      if (item.packCurrencyID) {
        packInfo[item.packCurrencyID] = itemContent;
      } else {
        packInfo['KLV'] = itemContent;
      }
    });

    parsedValues.packInfo = packInfo;

    return parsedValues;
  };

  const formSend = async (parsedPayload: any) => {
    setLoading(true);
    const parsedData = Buffer.from(data, 'utf-8').toString('base64');
    try {
      const unsignedTx = await core.buildTransaction(
        [
          {
            type: getType(contractType),
            payload: parsedPayload,
          },
        ],
        [parsedData],
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
      ITOBuy,
      binaryOperations,
    );

    if (parsedValues.amount === 0) {
      toast.error('Amount cannot be 0');
      return;
    }

    const payload = {
      ...parsedValues,
    };
    let parsedPayload = await precisionParse(payload, contractType);
    if (contractType === 'ConfigITOContract' && parsedPayload?.pack) {
      parsedPayload = parsePackInfo(parsedPayload);
    }
    if (showPayload) {
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
    setData,
    typeAssetTrigger,
    showForm: showForm(),
  };

  const permissionsForm = () => (
    // <Form
    //   key={contractType}
    //   {...formProps}
    // >
    //   <PermissionsForm
    //     setBinaryOperations={setBinaryOperations}
    //     binaryOperations={binaryOperations}
    //   />
    // </Form>
    <></>
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

  const assetTriggerSelect = () => (
    <AssetTriggerContainer>
      <InputLabel>Trigger Type</InputLabel>
      <Select
        getAssets={getAssets}
        options={assetTriggerTypes}
        onChange={value => setTypeAssetTrigger(value ? value.value : 0)}
        zIndex={4}
      />
    </AssetTriggerContainer>
  );

  const claimSelect = () => (
    <SelectContainer>
      <FieldLabel>Claim Type</FieldLabel>
      <Select
        options={claimTypes}
        claimSelectedType={claimSelectedType}
        onChange={e => {
          if (!isNaN(e?.value)) {
            if (e.value === 0 || e.value === 1) {
              setFormSections([
                ...formSection({
                  contract: 'ClaimContract',
                  address: getOwnerAddress(),
                  claimLabel: 'Asset ID',
                }),
              ]);
            } else if (e.value === 2 || claimType === 2) {
              setFormSections([
                ...formSection({
                  contract: 'ClaimContract',
                  address: getOwnerAddress(),
                  claimLabel: 'Order ID',
                }),
              ]);
            }
            setClaimType(claimSelectedType?.value || e.value);
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
              Balance: {assetBalance / 10 ** collection?.precision}
            </BalanceLabel>
          )}
        </BalanceContainer>
        <Select
          key={JSON.stringify(collection)}
          collection={collection}
          options={getAssetsList(
            contractType === 'AssetTriggerContract'
              ? kAssets
              : assetsList || [],
            contractType,
            typeAssetTrigger,
            getOwnerAddress(),
          )}
          onChange={value => {
            setCollection(value);
            if (contractType === 'UnfreezeContract') {
              setBucketsCollection([value.value]);
            }
          }}
          getAssets={getAssets}
          zIndex={3}
        />
      </SelectContent>
      {collection?.isNFT &&
        contractType !== 'ConfigITOContract' &&
        showAssetIDInput(contractType, typeAssetTrigger) && (
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
    let key = '';
    switch (contractType) {
      case 'UpdateAccountPermissionContract':
        return permissionsForm();

      case 'ProposalContract':
        return proposalForm();

      case 'ConfigITOContract':
      case 'SetITOPricesContract':
        return ITOForm();
      default:
        key =
          contractType === 'CreateAssetContract' ||
          contractType === 'AssetTriggerContract' ||
          contractType === 'ClaimContract' ||
          contractType === 'BuyContract'
            ? JSON.stringify(formSections)
            : contractType;

        return <Form key={keyElement} {...formProps} />;
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
      {contractHaveKDA(contractType, typeAssetTrigger) && KDASelect()}

      {contractHaveBucketId(contractType) && bucketListSelect()}

      {renderForm()}
    </Container>
  );
};

export default Contract;
