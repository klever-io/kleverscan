import { StyledArrow } from '@/components/Layout/Title/styles';
import AssetLogo from '@/components/Logo/AssetLogo';
import api from '@/services/api';
import { IAsset, Service } from '@/types';
import { web } from '@klever/sdk-web';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { toast } from 'react-toastify';
import {
  ArrowContainer,
  AssetName,
  AssetVisualization,
  Background,
  BuyForm,
  Container,
  Content,
  Header,
  Input,
  InputContainer,
  InputRow,
  Label,
  SubmitButton,
  Title,
} from './styles';

const ReactSelect = dynamic(() => import('react-select'), {
  ssr: false,
  loading: () => null,
});

interface ApplyFormModalProps {
  isOpenApplyFormModal: boolean;
  setOpenApplyFormModal: (state: boolean) => void;
  asset: IAsset;
}

export const ApplyFormModal: React.FC<ApplyFormModalProps> = ({
  isOpenApplyFormModal,
  setOpenApplyFormModal,
  asset,
}) => {
  const [projectDescription, setProjectDescription] = useState<string>('');
  const [shortDescription, setShortDescription] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const { t } = useTranslation('assets');

  const closeModal = () => {
    setOpenApplyFormModal(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      receiver: process.env.NEXT_PUBLIC_TRANSFER_ADDRESS,
      amount: Number(process.env.NEXT_PUBLIC_ADD_ASSET_INFO_VALUE),
    };

    try {
      const unsignedTransaction = await web.buildTransaction([
        {
          payload,
          type: 0,
        },
      ]);

      const signedTransaction = await web.signTransaction(unsignedTransaction);

      const body = {
        id: asset.assetId,
        short_description: shortDescription,
        project_description: projectDescription,
        signedTransaction: JSON.stringify(signedTransaction),
      };

      api.post({
        service: Service.EXPLORER,
        route: 'api/apply',
        body: JSON.stringify(body),
        tries: 1,
      });
    } catch (error) {
      console.error(error);
      toast.error(error);
    }

    setLoading(false);
  };

  return (
    <Container isOpenApplyFormModal={isOpenApplyFormModal}>
      <Content>
        <Header>
          <ArrowContainer onClick={closeModal}>
            <StyledArrow />
          </ArrowContainer>
          <Title>Add info your project</Title>
        </Header>

        <AssetVisualization>
          <AssetLogo
            logo={asset?.logo || ''}
            ticker={asset?.ticker || ''}
            name={asset?.name || ''}
            verified={asset?.verified}
            size={40}
          />
          <AssetName>
            {asset?.name} ({asset?.ticker})
          </AssetName>
        </AssetVisualization>

        <BuyForm id="buyForm" onSubmit={handleSubmit}>
          <InputRow>
            <Label>Short Description (max 255 characters)</Label>
            <InputContainer>
              <Input
                value={shortDescription}
                onChange={e => {
                  setShortDescription(e.target.value);
                }}
              />
            </InputContainer>
          </InputRow>

          <InputRow>
            <Label>About the Project</Label>
            <InputContainer>
              <Input
                value={projectDescription}
                onChange={e => {
                  setProjectDescription(e.target.value);
                }}
              />
            </InputContainer>
          </InputRow>
        </BuyForm>
        <SubmitButton type="submit" form="buyForm">
          Submit
        </SubmitButton>
      </Content>
      <Background onClick={closeModal} />
    </Container>
  );
};
