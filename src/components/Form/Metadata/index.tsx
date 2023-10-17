import {
  InfoIcon,
  StyledTextArea,
  TooltipContainer,
  TooltipContent,
} from '@/components/TransactionForms/FormInput/styles';
import { useFees } from '@/contexts/contract/fees';
import { useMulticontract } from '@/contexts/contract/multicontract';
import { useState } from 'react';
import { AdvancedOptsContainer, ArrowDownIcon, ArrowUpIcon } from '../styles';
import { ExtraOptionContainer, FieldContainer, InputLabel } from './styles';

const AdvancedOptionsContent: React.FC = () => {
  const { metadata, setMetadata } = useMulticontract();
  const { bandwidthFeeMultiplier } = useFees();
  const tooltip = `You can add metadata to your transaction. This metadata will be stored on-chain and will be publicly visible. Each byte costs ${bandwidthFeeMultiplier} KLV`;

  return (
    <ExtraOptionContainer>
      <FieldContainer>
        <InputLabel>
          <span>Metadata</span>
          <TooltipContainer>
            <InfoIcon />
            <TooltipContent>
              <span>{tooltip}</span>
            </TooltipContent>
          </TooltipContainer>
        </InputLabel>
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

const MetadataOptions: React.FC = () => {
  const [showMetadata, setShowMetadata] = useState(false);

  return (
    <>
      <AdvancedOptsContainer onClick={() => setShowMetadata(!showMetadata)}>
        <span>Metadata</span>
        {showMetadata ? <ArrowUpIcon /> : <ArrowDownIcon />}
      </AdvancedOptsContainer>

      {showMetadata ? <AdvancedOptionsContent /> : null}
    </>
  );
};

export default MetadataOptions;
