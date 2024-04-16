import { StyledArrow } from '@/components/Layout/Title/styles';
import AssetLogo from '@/components/Logo/AssetLogo';
import api from '@/services/api';
import { IAsset, Service } from '@/types';
import { web } from '@klever/sdk-web';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
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
  defaultValues?: {
    short_description: string;
    project_description_copy: string;
  };
  setTxHash: (txHash: string) => void;
  setLoading: (state: boolean) => void;
  refetchAssetInfo: () => void;
}

export const ApplyFormModal: React.FC<ApplyFormModalProps> = ({
  isOpenApplyFormModal,
  setOpenApplyFormModal,
  asset,
  defaultValues,
  setTxHash,
  setLoading,
  refetchAssetInfo,
}) => {
  const [projectDescription, setProjectDescription] = useState<string>(
    defaultValues?.project_description_copy || '',
  );
  const [shortDescription, setShortDescription] = useState<string>(
    defaultValues?.short_description || '',
  );

  const shortDescriptionRef = useRef<HTMLTextAreaElement>(null);

  const isEdit = !!defaultValues?.short_description;

  const { t } = useTranslation('assets');

  const closeModal = () => {
    setOpenApplyFormModal(false);
  };

  useEffect(() => {
    if (isOpenApplyFormModal) {
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = 'unset';
    }

    return () => {
      document.documentElement.style.overflow = 'unset';
    };
  }, [isOpenApplyFormModal]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTxHash('');

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
        project_description_copy: projectDescription,
        signedTransaction: JSON.stringify(signedTransaction),
      };

      const res = await api.post({
        service: Service.EXPLORER,
        route: isEdit ? 'api/edit-info' : 'api/apply',
        body: JSON.stringify(body),
        tries: 1,
      });

      setTxHash && setTxHash(res?.hash);
      refetchAssetInfo();
      closeModal();
    } catch (error) {
      console.error(error);
      toast.error(error);
    } finally {
      setLoading(false);
    }
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
            <Label>
              Short Description (max 255 characters)
              <span>{shortDescription.length} / 255</span>
            </Label>
            <Input
              value={shortDescription}
              onChange={e => {
                if (e.target.value.length > 255) {
                  return;
                }
                setShortDescription(e.target.value);
              }}
              ref={shortDescriptionRef}
            />
          </InputRow>

          <InputRow>
            <Label>About the Project</Label>
            <Input
              value={projectDescription}
              onChange={e => {
                setProjectDescription(e.target.value);
              }}
            />
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
