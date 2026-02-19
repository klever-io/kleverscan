import { PropsWithChildren } from 'react';
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
  RTEArea,
  SubmitButton,
  Title,
} from './styles';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { Toolbar } from './Toolbar';

const SHORT_DESCRIPTION_MAX_LENGTH = 255;
const PROJECT_DESCRIPTION_MAX_LENGTH = 5000;
const PROJECT_DESCRIPTION_COUNTER_THRESHOLD = 3000;

interface ApplyFormModalProps {
  isOpenApplyFormModal: boolean;
  setOpenApplyFormModal: (state: boolean) => void;
  asset: IAsset;
  defaultValues?: {
    short_description: string;
    project_description: string;
  };
  setTxHash: (txHash: string) => void;
  setLoading: (state: boolean) => void;
  refetchAssetInfo: () => void;
}

export const ApplyFormModal: React.FC<
  PropsWithChildren<ApplyFormModalProps>
> = ({
  isOpenApplyFormModal,
  setOpenApplyFormModal,
  asset,
  defaultValues,
  setTxHash,
  setLoading,
  refetchAssetInfo,
}) => {
  const [projectDescription, setProjectDescription] = useState<string>(
    defaultValues?.project_description || '',
  );
  const [shortDescription, setShortDescription] = useState<string>(
    defaultValues?.short_description || '',
  );

  const shortDescriptionRef = useRef<HTMLTextAreaElement>(null);

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

    let receiver: string;
    let amount: number;

    try {
      const settingsRes = await fetch('/api/settings');
      if (!settingsRes.ok) {
        throw new Error('Failed to fetch settings');
      }
      const settings = await settingsRes.json();

      if (!settings.receiver_address || settings.transfer_value == null) {
        throw new Error(
          'Invalid settings response: missing receiver_address or transfer_value',
        );
      }

      receiver = settings.receiver_address;
      amount = settings.transfer_value;
    } catch (error) {
      console.error(error);
      toast.error('Failed to load transfer settings');
      setLoading(false);
      return;
    }

    const payload = {
      receiver,
      amount,
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

      const res = await api.post({
        service: Service.EXPLORER,
        route: 'api/apply',
        body: JSON.stringify(body),
        tries: 1,
      });

      setTxHash && setTxHash(res?.hash);
      refetchAssetInfo();
      closeModal();
    } catch (error) {
      console.error(error);
      toast.error(JSON.stringify(error));
    } finally {
      setLoading(false);
    }
  };

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: `${projectDescription}`,
    onUpdate({ editor }) {
      const textLength = editor.getHTML().length;
      if (textLength > PROJECT_DESCRIPTION_MAX_LENGTH) {
        editor.commands.undo();
        return;
      }
      setProjectDescription(editor.getHTML());
    },
  });

  return (
    <Container isOpenApplyFormModal={isOpenApplyFormModal}>
      <Content opened={isOpenApplyFormModal}>
        <Header>
          <ArrowContainer onClick={closeModal}>
            <StyledArrow />
          </ArrowContainer>
          <Title>Add info to your project</Title>
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
              Short Description
              <span>
                {shortDescription.length} / {SHORT_DESCRIPTION_MAX_LENGTH}
              </span>
            </Label>
            <Input
              value={shortDescription}
              onChange={e => {
                if (e.target.value.length > SHORT_DESCRIPTION_MAX_LENGTH) {
                  return;
                }
                setShortDescription(e.target.value);
              }}
              ref={shortDescriptionRef}
            />
          </InputRow>

          <InputRow>
            <Label>
              About the Project
              {(editor?.getHTML().length || 0) >=
                PROJECT_DESCRIPTION_COUNTER_THRESHOLD && (
                <span>
                  {editor?.getHTML().length || 0} /{' '}
                  {PROJECT_DESCRIPTION_MAX_LENGTH}
                </span>
              )}
            </Label>
            <RTEArea editor={editor}>
              <Toolbar editor={editor} />
            </RTEArea>
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
