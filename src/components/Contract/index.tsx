import { useEffect, useState } from 'react';

import { core, sendTransaction } from '@klever/sdk';
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
} from './styles';
import { getNonce, getType, precisionParse } from './utils';

import Form, { ISection } from 'components/Form';
import PackInfoForm from '../CustomForm/PackInfo';
import PermissionsForm from '../CustomForm/Permissions';

const Contract: React.FC = () => {
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

  const parseValues = (values: any) => {
    const parsedValues = JSON.parse(JSON.stringify(values));

    if (contractType === 'CreateAssetContract') {
      parsedValues.type = tokenChosen ? 0 : 1;
    } else if (contractType === 'AssetTriggerContract') {
      parsedValues.triggerType = typeAssetTrigger;
    } else if (contractType === 'ClaimContract') {
      parsedValues.claimType = claimType;
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
    const walletAddress = sessionStorage.getItem('walletAddress');
    const nonce = await getNonce(walletAddress || '');
    const payload = {
      sender: walletAddress,
      nonce,
      ...parseValues(contractValues),
    };

    const parsedPayload = await precisionParse(payload, contractType);

    setLoading(true);
    try {
      const unsignedTx = await sendTransaction(
        getType(contractType),
        parsedPayload,
        {
          autobroadcast: false,
          metadata: data,
        },
      );

      const signedTx = await window.kleverWeb.signTransaction(unsignedTx);

      const response = await core.broadcastTransactions([signedTx]);
      setLoading(false);
      setTxHash(response.data.txsHashes[0]);
      toast.success('Transaction broadcast successfully');
    } catch (e: any) {
      setLoading(false);
      toast.error(e.message);
    }
  };

  const renderForm = () => {
    if (contractType === 'UpdateAccountPermissionContract') {
      return (
        <Form
          sections={formSections}
          contractName={contractType}
          key={contractType}
          onSubmit={handleSubmit}
          setData={setData}
          setIsMultisig={setIsMultisig}
          isMultisig={isMultisig}
        >
          <PermissionsForm />
        </Form>
      );
    } else {
      return (
        <Form
          sections={formSections}
          contractName={contractType}
          key={
            contractType === 'CreateAssetContract'
              ? formSections.toString()
              : contractType
          }
          onSubmit={handleSubmit}
          setData={setData}
          setIsMultisig={setIsMultisig}
          isMultisig={isMultisig}
        />
      );
    }
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
            Transaction visible at https://kleverscan.org/transaction/{txHash}
          </a>
          <CloseIcon onClick={() => setTxHash(null)} />
        </ExtraOptionContainer>
      )}

      <Select options={contractOptions} onChange={handleOption} />

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

      {contractType === 'AssetTriggerContract' && (
        <AssetTriggerContainer>
          <InputLabel>Trigger Type</InputLabel>
          <Select
            options={assetTriggerTypes}
            onChange={value => setTypeAssetTrigger(value ? value.value : 0)}
          />
        </AssetTriggerContainer>
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
        <Form
          sections={formSections}
          contractName={contractType}
          key={contractType}
          onSubmit={handleSubmit}
          setData={setData}
          setIsMultisig={setIsMultisig}
          isMultisig={isMultisig}
        >
          <PackInfoForm />
        </Form>
      ) : (
        renderForm()
      )}
    </Container>
  );
};
export default Contract;
