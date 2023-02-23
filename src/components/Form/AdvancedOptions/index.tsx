import {
  Slider,
  StyledInput,
  Toggle,
} from '@/components/Form/FormInput/styles';
import { useContract } from '@/contexts/contract';
import {
  DataField,
  ExtraOptionContainer,
  FieldContainer,
  InputLabel,
  ToggleContainer,
} from './styles';

interface IAdvOptions {
  setMetadata: (value: string) => void;
}

const AdvancedOptions: React.FC<IAdvOptions> = ({ setMetadata }) => {
  const {
    setIsMultiContract,
    isMultiContract,
    setShowPayload,
    showPayload,
    setIsMultisig,
    isMultisig,
  } = useContract();

  return (
    <ExtraOptionContainer>
      <FieldContainer>
        <InputLabel>Data</InputLabel>
        <DataField onChange={e => setMetadata(e.target.value.toString())} />
      </FieldContainer>
      <FieldContainer>
        <InputLabel>Multiple Contract</InputLabel>
        <ToggleContainer>
          No
          <Toggle>
            <StyledInput
              type="checkbox"
              defaultChecked={isMultiContract}
              value={String(isMultiContract)}
              onClick={() => setIsMultiContract(!isMultiContract)}
            />
            <Slider />
          </Toggle>
          Yes
        </ToggleContainer>
      </FieldContainer>
      <FieldContainer>
        <InputLabel>Is Multisig?</InputLabel>
        <ToggleContainer>
          No
          <Toggle>
            <StyledInput
              type="checkbox"
              defaultChecked={isMultisig}
              value={String(isMultisig)}
              onClick={() => setIsMultisig(!isMultisig)}
            />
            <Slider />
          </Toggle>
          Yes
        </ToggleContainer>
      </FieldContainer>
      <FieldContainer>
        <InputLabel>Show payload?</InputLabel>
        <ToggleContainer>
          No
          <Toggle>
            <StyledInput
              type="checkbox"
              defaultChecked={showPayload}
              value={String(showPayload)}
              onClick={() => setShowPayload(!showPayload)}
            />
            <Slider />
          </Toggle>
          Yes
        </ToggleContainer>
      </FieldContainer>
    </ExtraOptionContainer>
  );
};

export default AdvancedOptions;
