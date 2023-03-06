import Select from '@/components/Contract/Select';
import {
  BalanceContainer,
  BalanceLabel,
  FieldLabel,
  SelectContent,
} from '@/components/Contract/styles';
import { getAssetsList } from '@/components/Contract/utils';
import {
  Slider,
  StyledInput,
  Toggle,
} from '@/components/Form/FormInput/styles';
import { useContract } from '@/contexts/contract';
import { useMobile } from '@/contexts/mobile';
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
    kdaFee,
    setKdaFee,
    assetsList,
    getOwnerAddress,
    getAssets,
  } = useContract();

  const { isMobile } = useMobile();

  const assetBalance = kdaFee?.balance || null;

  const kdaSelect = () => {
    return (
      <FieldContainer>
        <SelectContent>
          <BalanceContainer>
            <FieldLabel>KDA to pay fees:</FieldLabel>
            {!isNaN(Number(assetBalance)) && assetBalance !== null && (
              <BalanceLabel>
                Balance: {assetBalance / 10 ** (kdaFee?.precision || 0)}
              </BalanceLabel>
            )}
          </BalanceContainer>
          <Select
            key={JSON.stringify(kdaFee)}
            collection={kdaFee}
            options={getAssetsList(
              assetsList || [],
              'FreezeContract',
              null,
              null,
              getOwnerAddress(),
            )}
            onChange={(value: any) => {
              setKdaFee(value);
            }}
            getAssets={getAssets}
            zIndex={3}
          />
        </SelectContent>
      </FieldContainer>
    );
  };

  return (
    <ExtraOptionContainer>
      <FieldContainer>
        <InputLabel>Data</InputLabel>
        <DataField onChange={e => setMetadata(e.target.value.toString())} />
      </FieldContainer>
      {
        !isMobile &&
          kdaSelect() /* Remove this check when K5 is updated for kda Fee */
      }
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
