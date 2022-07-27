import {
  Slider,
  Toggle,
  StyledInput,
} from '@/components/Form/FormInput/styles';

import {
  ExtraOptionContainer,
  InputLabel,
  FieldContainer,
  DataField,
  ToggleContainer,
} from './styles';

interface IAdvOptions {
  setData: any;
  setIsMultisig: any;
  isMultisig: boolean;
}

const AdvancedOptions: React.FC<IAdvOptions> = ({
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
              defaultChecked={true}
              onClick={() => setIsMultisig(!isMultisig)}
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
