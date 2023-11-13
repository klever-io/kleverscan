import { MultiContractModalInfo } from '@/components/Contract/MultiContract/styles';
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
  ModalCreateTxLink,
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
import Link from 'next/link';
import { useRouter } from 'next/router';
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

const tooltipPermissionID = `The permission ID is set by the account owner and is used to make other accounts able to sign transactions on behalf of the owner.
You can find more information about permissions in your account page. If they are not set,
you need to send an "Update Account Permission" contract`;

const tooltipAccount = `The sender account address is the account that will be the
sender of the transaction. It needs to be a multi-sign account. Your connected address will be the one used to sign the transaction.
Be sure that your account has the permission to sign transactions on behalf of the sender account, otherwise the transaction will fail.
`;
const PermID: React.FC = () => {
  const { setPermID, permID, senderAccount } = useContract();
  const { walletAddress } = useExtension();

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
            <span>Permission ID ({parseAddress(senderAccount, 12)})</span>
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
  const { setSenderAccount, setPermID } = useContract();
  const { walletAddress } = useExtension();
  const [loggedAccountIsSender, setLoggedAccountIsSender] = useState(true);

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
          <span>Do you want to use the current account as sender?</span>
        </InputLabel>
        <ToggleContainer>
          No
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
          Yes
        </ToggleContainer>
      </FieldContainer>

      {!loggedAccountIsSender && (
        <FieldContainer>
          <InputLabel>
            <span>Sender Account Address</span>
            <TooltipContainer>
              <Tooltip msg={tooltipAccount}>
                <InfoIcon />
              </Tooltip>
            </TooltipContainer>
          </InputLabel>

          <StyledInput
            placeholder="Sender Account Address"
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
  const { isMultisig, signTxMultiSign } = useContract();

  const [_, setMultiSig] = useState<boolean>(isMultisig.current);
  const [signTx, setSignTx] = useState<boolean>(isMultisig.current);

  return (
    <>
      <FlexContainer>
        <FieldContainer>
          <InputLabel>
            <span>Does your account needs multiple signatures?</span>
          </InputLabel>
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
              <Slider active={String(isMultisig.current)} />
            </Toggle>
            Yes
          </ToggleContainer>
        </FieldContainer>
      </FlexContainer>
      {isMultisig.current && (
        <>
          <FlexContainer>
            <FieldContainer>
              <InputLabel>
                <span>Do you want to sign transaction now ?</span>
              </InputLabel>
              <ToggleContainer>
                No
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
                  <Slider active={String(signTxMultiSign.current)} />
                </Toggle>
                Yes
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
  const { showPayload, isMultisig, kdaFee, getAssets } = useContract();
  const { walletAddress } = useExtension();

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
            <FieldLabel>KDA to pay fees:</FieldLabel>
            <ReloadWrapper
              onClick={refetch}
              $loading={assetsPoolFetching || assetsFetching || loading}
            >
              <IoReloadSharp />
            </ReloadWrapper>
            {!isNaN(Number(assetBalance)) && assetBalance !== null && (
              <BalanceLabel>
                Balance: {assetBalance / 10 ** (kdaFee.current?.precision || 0)}
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

  const router = useRouter();

  return (
    <ExtraOptionContainer>
      {kdaSelect()}
      <FieldContainer>
        <InputLabel>
          <span>Multiple Contract</span>
        </InputLabel>
        <ToggleContainer>
          No
          <Toggle>
            <StyledInput
              type="checkbox"
              defaultChecked={isMultiContract}
              value={String(isMultiContract)}
              onClick={() => setIsMultiContract(!isMultiContract)}
              disabled={isModal}
            />
            <Slider active={String(isMultiContract)} disabled={isModal} />
          </Toggle>
          Yes
          {isModal && (
            <MultiContractModalInfo>
              <Tooltip msg="You cannot create a multiple contract using the modal. Go to the `Create Transaction` to create one" />
              <Link
                href={{ pathname: '/create-transaction', query: router.query }}
              >
                <ModalCreateTxLink>Create Transaction</ModalCreateTxLink>
              </Link>
            </MultiContractModalInfo>
          )}
        </ToggleContainer>
      </FieldContainer>
      <MultiSigSelect />
      <FieldContainer>
        <InputLabel>
          <span>Show payload?</span>
        </InputLabel>
        <ToggleContainer>
          No
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
