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
} from '@/components/TransactionForms/FormInput/styles';
import { useContract } from '@/contexts/contract';
import { ICollectionList } from '@/types';
import { useEffect, useState } from 'react';
import { AdvancedOptsContainer, ArrowDownIcon, ArrowUpIcon } from '../styles';
import {
  ExtraOptionContainer,
  FieldContainer,
  FlexContainer,
  InputLabel,
  ToggleContainer,
} from './styles';

const AdvancedOptionsContent: React.FC = () => {
  const {
    setIsMultiContract,
    isMultiContract,
    showPayload,
    isMultisig,
    kdaFee,
    getAssets,
    getOwnerAddress,
  } = useContract();

  const [assetsList, setAssetsList] = useState<ICollectionList[]>([]);
  const [kdaFeeAsset, setKdaFeeAsset] = useState<ICollectionList | null>(null);

  useEffect(() => {
    (async () => {
      const newAssetsList = (await getAssets()) || [];
      setAssetsList(newAssetsList);
    })();
  }, []);

  const assetBalance = kdaFee?.current.balance || null;

  const kdaSelect = () => {
    return (
      <FieldContainer>
        <SelectContent>
          <BalanceContainer key={kdaFeeAsset?.value}>
            <FieldLabel>KDA to pay fees:</FieldLabel>
            {!isNaN(Number(assetBalance)) && assetBalance !== null && (
              <BalanceLabel>
                Balance: {assetBalance / 10 ** (kdaFee.current?.precision || 0)}
              </BalanceLabel>
            )}
          </BalanceContainer>
          <Select
            key={JSON.stringify(kdaFee.current)}
            collection={kdaFee.current}
            options={getAssetsList(
              assetsList || [],
              'FreezeContract',
              null,
              null,
              getOwnerAddress(),
            )}
            onChange={(value: any) => {
              kdaFee.current = value;
              setKdaFeeAsset(value);
            }}
            zIndex={2}
          />
        </SelectContent>
      </FieldContainer>
    );
  };

  const PermID: React.FC = () => {
    const { permID } = useContract();

    return (
      <FieldContainer>
        <InputLabel>Permission ID</InputLabel>
        <StyledInput
          type="number"
          placeholder="Permission ID"
          defaultValue={permID.current}
          onChange={e => {
            permID.current = Number(e.target.value);
          }}
        />
      </FieldContainer>
    );
  };

  const [multiSig, setMultiSig] = useState<boolean>(isMultisig.current);

  return (
    <ExtraOptionContainer>
      {kdaSelect()}
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
      <FlexContainer key={String(isMultisig.current)}>
        <FieldContainer>
          <InputLabel>Does Your Account Needs Multiple Signatures?</InputLabel>
          <ToggleContainer>
            No
            <Toggle>
              <StyledInput
                type="checkbox"
                defaultChecked={isMultisig.current}
                value={String(isMultisig.current)}
                onClick={() => {
                  isMultisig.current = !isMultisig.current;
                  setMultiSig(isMultisig.current);
                }}
              />
              <Slider />
            </Toggle>
            Yes
          </ToggleContainer>
        </FieldContainer>
        {multiSig && <PermID />}
      </FlexContainer>
      <FieldContainer>
        <InputLabel>Show payload?</InputLabel>
        <ToggleContainer>
          No
          <Toggle>
            <StyledInput
              type="checkbox"
              defaultChecked={showPayload.current}
              value={String(showPayload.current)}
              onClick={() => (showPayload.current = !showPayload.current)}
            />
            <Slider />
          </Toggle>
          Yes
        </ToggleContainer>
      </FieldContainer>
    </ExtraOptionContainer>
  );
};

const AdvancedOptions: React.FC = () => {
  const [showAdvancedOpts, setShowAdvancedOpts] = useState(false);

  return (
    <>
      <AdvancedOptsContainer
        onClick={() => setShowAdvancedOpts(!showAdvancedOpts)}
      >
        <span>Advanced Options</span>
        {showAdvancedOpts ? <ArrowUpIcon /> : <ArrowDownIcon />}
      </AdvancedOptsContainer>

      {showAdvancedOpts ? <AdvancedOptionsContent /> : null}
    </>
  );
};

export default AdvancedOptions;
