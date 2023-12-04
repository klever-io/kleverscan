import Select from '@/components/Contract/Select';
import {
  BalanceContainer,
  BalanceLabel,
  FieldLabel,
  SelectContent,
} from '@/components/Contract/styles';
import { getAssetsList } from '@/components/Contract/utils';
import Tooltip from '@/components/Tooltip';
import {
  InfoIcon,
  InputLabel,
  Slider,
  StyledInput,
  Toggle,
  TooltipContainer,
} from '@/components/TransactionForms/FormInput/styles';
import { useContract } from '@/contexts/contract';
import { useMulticontract } from '@/contexts/contract/multicontract';
import { ReloadWrapper } from '@/contexts/contract/styles';
import { useExtension } from '@/contexts/extension';
import getAccount from '@/services/requests/searchBar/account';
import { IAccountResponse, IDropdownItem } from '@/types';
import { IAccPermission } from '@/types/contracts';
import { filterPoolAssets } from '@/utils/create-transaction/parseFunctions';
import { parseAddress } from '@/utils/parseValues';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { IoReloadSharp } from 'react-icons/io5';
import { useQuery } from 'react-query';
import { AdvancedOptsContainer, ArrowDownIcon, ArrowUpIcon } from '../styles';
import {
  ExtraOptionContainer,
  FieldContainer,
  FlexContainer,
  ToggleContainer,
} from './styles';

const PermID: React.FC = () => {
  const { t } = useTranslation('transactions');
  const { setPermID, permID, senderAccount } = useContract();
  const { walletAddress } = useExtension();
  const tooltipPermissionID = t('AdvanceOptions.TooltipPermissionID');
  const queryFn = () => getAccount(senderAccount);

  const { data: res, isFetching: loading } = useQuery({
    queryKey: ['account', senderAccount],
    queryFn,
    initialData: {} as IAccountResponse,
  });

  const parsedPermissions: IDropdownItem[] = [];
  if (res?.data)
    res.data.account.permissions.map((permission: IAccPermission) => {
      if (permission.signers.some(signer => signer.address === walletAddress))
        parsedPermissions.push({
          label: `#${permission.id} - ${
            permission.permissionName
          } - Threshold: ${permission.Threshold} - ${
            permission.type === 0 ? 'Owner' : 'User'
          }`,
          value: permission.id,
        });
    });

  return (
    <FlexContainer>
      <FieldContainer>
        <SelectContent>
          <InputLabel>
            <span>
              {t('AdvancedOptions.Permission ID')} (
              {parseAddress(senderAccount, 12)})
            </span>
            <TooltipContainer>
              <Tooltip msg={tooltipPermissionID}>
                <InfoIcon />
              </Tooltip>
            </TooltipContainer>
          </InputLabel>
          <Select
            options={parsedPermissions}
            key={JSON.stringify(parsedPermissions)}
            onChange={(value: any) => {
              setPermID(value.value);
            }}
            selectedValue={
              parsedPermissions.length > 0
                ? parsedPermissions.find(
                    (item: IDropdownItem) => item.value === permID,
                  )
                : undefined
            }
            loading={loading}
            zIndex={2}
          />
        </SelectContent>
      </FieldContainer>
    </FlexContainer>
  );
};

const AccountSelect: React.FC = () => {
  const { t } = useTranslation('transactions');
  const { t: commonT } = useTranslation('common');
  const { setSenderAccount, setPermID } = useContract();
  const { walletAddress } = useExtension();
  const [loggedAccountIsSender, setLoggedAccountIsSender] = useState(true);
  const tooltipAccount = t('AdvanceOptions.TooltipAccount');
  useEffect(() => {
    if (loggedAccountIsSender) {
      setSenderAccount(walletAddress);
      setPermID(0);
    }
  }, [loggedAccountIsSender]);

  return (
    <FlexContainer>
      <FieldContainer>
        <InputLabel>
          <span>{t('AdvancedOptions.Use Current account')}</span>
        </InputLabel>
        <ToggleContainer>
          {commonT('Statements.No')}
          <Toggle>
            <StyledInput
              type="checkbox"
              defaultChecked={loggedAccountIsSender}
              value={String(loggedAccountIsSender)}
              onClick={() => {
                setLoggedAccountIsSender(!loggedAccountIsSender);
              }}
            />
            <Slider active={String(loggedAccountIsSender)} />
          </Toggle>
          {commonT('Statements.Yes')}
        </ToggleContainer>
      </FieldContainer>

      {!loggedAccountIsSender && (
        <FieldContainer>
          <InputLabel>
            <span>{t('AdvancedOptions.Sender Account Address')}</span>
            <TooltipContainer>
              <Tooltip msg={tooltipAccount}>
                <InfoIcon />
              </Tooltip>
            </TooltipContainer>
          </InputLabel>

          <StyledInput
            placeholder={t('AdvancedOptions.Sender Account Address')}
            defaultValue={''}
            onChange={e => {
              setSenderAccount(e.target.value);
              setPermID(0);
            }}
          />
        </FieldContainer>
      )}
    </FlexContainer>
  );
};

const MultiSigSelect: React.FC = () => {
  const { t } = useTranslation('transactions');
  const { t: commonT } = useTranslation('common');
  const yes = commonT('Statements.Yes');
  const no = commonT('Statements.No');
  const { isMultisig, signTxMultiSign } = useContract();

  const [multiSig, setMultiSig] = useState<boolean>(isMultisig.current);
  const [signTx, setSignTx] = useState<boolean>(isMultisig.current);

  return (
    <>
      <FlexContainer>
        <FieldContainer>
          <InputLabel>
            <span>{t('AdvancedOptions.Multiple Signatures')}</span>
          </InputLabel>
          <ToggleContainer>
            {no}
            <Toggle>
              <StyledInput
                type="checkbox"
                defaultChecked={isMultisig.current}
                value={String(isMultisig.current)}
                onClick={() => {
                  isMultisig.current = !isMultisig.current;
                  if (!!multiSig) {
                    signTxMultiSign.current = false;
                    setSignTx(false);
                  }
                  setMultiSig(isMultisig.current);
                }}
              />
              <Slider active={String(isMultisig.current)} />
            </Toggle>
            {yes}
          </ToggleContainer>
        </FieldContainer>
      </FlexContainer>
      {isMultisig.current && (
        <>
          <FlexContainer>
            <FieldContainer>
              <InputLabel>
                <span>{t('AdvancedOptions.Sign transaction')}</span>
              </InputLabel>
              <ToggleContainer>
                {no}
                <Toggle>
                  <StyledInput
                    type="checkbox"
                    defaultChecked={false}
                    value={String(signTxMultiSign.current)}
                    onClick={() => {
                      signTxMultiSign.current = !signTxMultiSign.current;
                      setSignTx(signTxMultiSign.current);
                    }}
                  />
                  <Slider active={String(signTx)} />
                </Toggle>
                {yes}
              </ToggleContainer>
            </FieldContainer>
          </FlexContainer>
        </>
      )}
      <AccountSelect />
      <PermID />
    </>
  );
};

const AdvancedOptionsContent: React.FC = () => {
  const { t } = useTranslation('transactions');
  const { t: commonT } = useTranslation('common');
  const { showPayload, isMultisig, kdaFee, getAssets } = useContract();
  const { walletAddress } = useExtension();
  const yes = commonT('Statements.Yes');
  const showPayloadTooltip = t('AdvancedOptions.ShowPayloadTooltip');
  const no = commonT('Statements.No');
  const [loading, setLoading] = useState(false);

  const {
    setIsMultiContract,
    isMultiContract,
    kdaFeeAsset,
    setKdaFeeAsset,
    isModal,
  } = useMulticontract();

  const { data: assets, isFetching: assetsFetching } = useQuery({
    queryKey: ['userAssets'],
    queryFn: getAssets,
    initialData: [],
  });

  const getAvailablePoolAssets = async () =>
    filterPoolAssets(
      getAssetsList(assets || [], 'FreezeContract', null, null, walletAddress),
    );

  const { data: assetsPool, isFetching: assetsPoolFetching } = useQuery({
    queryKey: ['assetsPool'],
    queryFn: getAvailablePoolAssets,
    initialData: [],
    enabled: !!assets?.length,
  });

  const refetch = async () => {
    setLoading(true);
    await getAssets();
    await getAvailablePoolAssets();
    setLoading(false);
  };

  const assetBalance = kdaFee?.current.balance || null;

  const kdaSelect = () => {
    return (
      <FieldContainer>
        <SelectContent>
          <BalanceContainer key={kdaFeeAsset?.assetId}>
            <FieldLabel>{t('AdvancedOptions.KDA to pay fees')}</FieldLabel>
            <ReloadWrapper
              onClick={refetch}
              $loading={assetsPoolFetching || assetsFetching || loading}
            >
              <IoReloadSharp />
            </ReloadWrapper>
            {!isNaN(Number(assetBalance)) && assetBalance !== null && (
              <BalanceLabel>
                {t('AdvancedOptions.Balance')}{' '}
                {assetBalance / 10 ** (kdaFee.current?.precision || 0)}
              </BalanceLabel>
            )}
          </BalanceContainer>
          <Select
            key={JSON.stringify(kdaFee.current)}
            collection={kdaFee.current}
            options={assetsPool}
            onChange={(value: any) => {
              kdaFee.current = value;
              setKdaFeeAsset(value || null);
            }}
            zIndex={2}
            loading={assetsPoolFetching || assetsFetching || loading}
          />
        </SelectContent>
      </FieldContainer>
    );
  };

  const [localShowPayload, setLocalShowPayload] = useState<boolean>(
    showPayload.current,
  );

  return (
    <ExtraOptionContainer>
      {kdaSelect()}
      {!isModal && (
        <FieldContainer>
          <InputLabel>
            <span>{t('AdvancedOptions.Multiple Contract')}</span>
          </InputLabel>
          <ToggleContainer>
            {no}
            <Toggle>
              <StyledInput
                type="checkbox"
                defaultChecked={isMultiContract}
                value={String(isMultiContract)}
                onClick={() => setIsMultiContract(!isMultiContract)}
              />
              <Slider active={String(isMultiContract)} />
            </Toggle>
            {yes}
          </ToggleContainer>
        </FieldContainer>
      )}
      <MultiSigSelect />
      <FieldContainer>
        <InputLabel>
          <span>{t('AdvancedOptions.Show payload')}</span>
          <TooltipContainer>
            <Tooltip msg={showPayloadTooltip}>
              <InfoIcon />
            </Tooltip>
          </TooltipContainer>
        </InputLabel>
        <ToggleContainer>
          {no}
          <Toggle>
            <StyledInput
              type="checkbox"
              defaultChecked={showPayload.current}
              value={String(showPayload.current)}
              onClick={() => {
                showPayload.current = !showPayload.current;
                setLocalShowPayload(showPayload.current);
              }}
            />
            <Slider active={String(localShowPayload)} />
          </Toggle>
          {yes}
        </ToggleContainer>
      </FieldContainer>
    </ExtraOptionContainer>
  );
};

const AdvancedOptions: React.FC = () => {
  const { t } = useTranslation('transactions');
  const [showAdvancedOpts, setShowAdvancedOpts] = useState(false);

  return (
    <>
      <AdvancedOptsContainer
        onClick={() => setShowAdvancedOpts(!showAdvancedOpts)}
      >
        <span>{t('AdvancedOptions.Advanced Options')}</span>
        {showAdvancedOpts ? <ArrowUpIcon /> : <ArrowDownIcon />}
      </AdvancedOptsContainer>

      {showAdvancedOpts ? <AdvancedOptionsContent /> : null}
    </>
  );
};

export default AdvancedOptions;
