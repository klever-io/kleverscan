// import { useSdk } from '../../../hooks';
import Form, { ISection } from 'components/Form';
import { IContractOption } from '@/types/index';

// import { useDidUpdateEffect } from 'hooks';
import formSection from '@/utils/formSections';
import { Container, Title } from './styles';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import { contractOptions } from '@/utils/index';

// import { toast } from 'react-toastify';
// import { IBroadcastResponse } from 'types';
// import { getFeedback } from 'utils';
// import sections from './formSections';
import { core, sendTransaction, TransactionType } from '@klever/sdk';
import { InputContainer, ExtraOptionContainer } from './styles';
import { toast } from 'react-toastify';
import {
  Slider,
  Toggle,
  ToggleContainer,
  StyledInput,
} from '@/components/Form/FormInput/styles';
import { FormSection } from '@/components/Form/styles';
import PackInfoForm from '../CustomForm/PackInfo';
import PermissionsForm from '../CustomForm/Permissions';
import { getNonce, getType, precisionParse } from './utils';

const Contract = () => {
  // const sdk = useSdk();

  const [open, setOpen] = useState(false);
  const [payload, setPayload] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<string>('');
  const [formSections, setFormSections] = useState<ISection[]>([]);
  const [contractType, setContractType] = useState('');
  const [tokenChosen, setTokenChosen] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  useEffect(() => {
    if (tokenChosen) {
      setFormSections([...formSection(contractType, 'Token')]);
    } else {
      setFormSections([...formSection(contractType, 'NFT')]);
    }
  }, [tokenChosen]);

  const parseValues = (values: any) => {
    const parsedValues = JSON.parse(JSON.stringify(values));

    if (contractType === 'CreateAssetContract') {
      parsedValues.type = tokenChosen ? 0 : 1;
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
    setFormSections([...formSection(selectedOption.value)]);
  };

  const renderForm = () => {
    if (contractType === 'UpdateAccountPermissionContract') {
      return (
        <Form
          sections={formSections}
          contractName={contractType}
          key={contractType}
          onSubmit={handleSubmit}
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
        />
      );
    }
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
        },
      );

      const signature = await window.klever.sign(unsignedTx[0]);

      unsignedTx[0].Signature = [signature];
      const response = await core.broadcastTransactions(
        JSON.stringify(unsignedTx),
      );
      setLoading(false);
      setTxHash(response.txHashes[0]);
      toast.success('Transaction broadcast successfully');
    } catch (e: any) {
      setLoading(false);
      toast.error(e.message);
    }
  };

  return (
    <Container>
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
      {contractType === 'ConfigITOContract' ||
      contractType === 'SetITOPricesContract' ? (
        <Form
          sections={formSections}
          contractName={contractType}
          key={contractType}
          onSubmit={handleSubmit}
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
