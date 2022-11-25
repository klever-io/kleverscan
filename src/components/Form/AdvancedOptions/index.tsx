import {
  Slider,
  StyledInput,
  Toggle,
} from '@/components/Form/FormInput/styles';
import {
  DataField,
  ExtraOptionContainer,
  FieldContainer,
  InputLabel,
  ToggleContainer,
} from './styles';

interface IAdvOptions {
  setData: any;
  setIsMultisig: any;
  isMultisig: boolean;
  setShowPayload: any;
  showPayload: boolean;
}

const AdvancedOptions: React.FC<IAdvOptions> = ({
  setShowPayload,
  showPayload,
  setData,
  setIsMultisig,
  isMultisig,
}) => {
  return (
    <ExtraOptionContainer>
      <FieldContainer>
        <InputLabel>Data</InputLabel>
        <DataField onChange={e => setData(e.target.value.toString())} />
      </FieldContainer>

      <FieldContainer>
        <InputLabel>Is Multisig?</InputLabel>
        <ToggleContainer>
          No
          <Toggle>
            <StyledInput
              type="checkbox"
              defaultChecked={false}
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
              defaultChecked={false}
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
