import { StyledTextArea } from '@/components/TransactionForms/FormInput/styles';
import { useContract } from '@/contexts/contract';
import { useState } from 'react';
import {
  AdvancedOptsContainer,
  ArrowDownIcon,
  ArrowUpIcon,
  ButtonContainer,
  HiddenSubmitButton,
} from '../styles';
import { ExtraOptionContainer, FieldContainer, InputLabel } from './styles';

export interface IMetadataOptions {
  metadata: string;
  setMetadata: React.Dispatch<React.SetStateAction<string>>;
}

const AdvancedOptionsContent: React.FC<IMetadataOptions> = ({
  metadata,
  setMetadata,
}) => {
  return (
    <ExtraOptionContainer>
      <FieldContainer>
        <InputLabel>Metadata</InputLabel>
        <StyledTextArea
          value={metadata}
          onChange={e => {
            e.preventDefault();
            setMetadata(e.target.value);
            return;
          }}
        />
      </FieldContainer>
    </ExtraOptionContainer>
  );
};

const MetadataOptions: React.FC<IMetadataOptions> = ({
  metadata,
  setMetadata,
}) => {
  const [showMetadata, setShowMetadata] = useState(false);

  const { isMultiContract, txLoading, submitForms } = useContract();

  const advancedOptionsProps = {
    metadata,
    setMetadata,
  };

  return (
    <>
      <AdvancedOptsContainer onClick={() => setShowMetadata(!showMetadata)}>
        <span>Metadata</span>
        {showMetadata ? <ArrowUpIcon /> : <ArrowDownIcon />}
      </AdvancedOptsContainer>

      {showMetadata ? (
        <AdvancedOptionsContent {...advancedOptionsProps} />
      ) : null}

      {!isMultiContract ? (
        <ButtonContainer
          submit={!txLoading}
          type="submit"
          disabled={txLoading}
          onClick={submitForms}
        >
          Create Transaction
        </ButtonContainer>
      ) : (
        <HiddenSubmitButton type="submit" disabled={false} />
      )}
    </>
  );
};

export default MetadataOptions;
